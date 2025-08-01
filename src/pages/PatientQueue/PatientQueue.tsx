import React, { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ChevronsLeft,
  ChevronsRight,
  Filter,
  ArrowUp,
  ArrowDown,
  XCircle,
  Download,
  Eye,
} from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  getPaginationRowModel,
} from "@tanstack/react-table";
import LoadingOverlay from "@/components/ui/CustomComponents/loadingOverlay";
import {
  DicomFiles,
  Remarks,
  TechnicianPatientQueue,
  technicianService,
} from "@/services/technicianServices"; // Import technicianService
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Checkbox2 } from "@/components/ui/CustomComponents/checkbox2";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { reportService } from "@/services/reportService";
import { useAuth, UserRole } from "../Routes/AuthContext";
import { downloadAllDicom, handleAllDownloadDicom } from "@/lib/commonUtlis";
import { appointmentService } from "@/services/patientInTakeFormService";
import PatientReport from "./PatientReport";
import { Calendar } from "@/components/calendar";
import PatientInformation from "../Dashboard/PatientBrouchure/PatientInformation";
import ConsentForm from "../Dashboard/ConsentForm/ConsentForm";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import PatientConsentDialog from "./PatientConsentDialog";

interface staffData {
  refUserCustId: string;
  refUserFirstName: string;
  refUserId: number;
  refSCId: number;
}

interface StatusInfo {
  text: string;
  report: boolean;
  color?: string;
  editAccess: UserRole[];
  readOnlyAccess: UserRole[];
}

const PatientQueue: React.FC = () => {
  const { user, role } = useAuth();
  const [patientQueue, setPatientQueue] = useState<TechnicianPatientQueue[]>(
    []
  );
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [staffData, setStaffData] = useState<staffData[]>([]);
  const [selectedRowIds, setSelectedRowIds] = React.useState<number[]>([]);

  const [consentDialogOpen, setConsentDialogOpen] = useState(false);
  const [selectedAppointmentIds, setSelectedAppointmentIds] = useState<number[]>([]);

  const currentUserRole = useAuth().role?.type;
  const currentUser = useAuth().user?.refUserId;

  const navigate = useNavigate();

  // Helper function to map refCategoryId to Patient Form names
  // This is taken directly from your MedicalHistory component
  const getPatientFormName = (categoryId: number): string => {
    switch (categoryId) {
      case 1:
        return "S";
      case 2:
        return "Da";
      case 3:
        return "Db";
      case 4:
        return "Dc";
      default:
        return "Not Yet Started";
    }
  };

  const getFormStatus = (appointmentStatus: string) => {
    switch (appointmentStatus?.toLowerCase()) {
      case "fillform":
        return {
          patientForm: false,
          technicianForm: false,
        };
      case "technologistformfill":
        return {
          patientForm: true,
          technicianForm: false,
        };
      default:
        return {
          patientForm: true,
          technicianForm: true,
        };
    }
  };

  const getStatus = (appointmentStatus: string): StatusInfo => {
    const status = appointmentStatus?.toLowerCase();

    const role: UserRole | undefined = currentUserRole;

    if (role) {
      if (status === "fillform" || status === "technologistformfill") {
        return {
          text: "-",
          report: false,
          color: "grey",
          editAccess: [],
          readOnlyAccess: [],
        };
      }

      if (status === "reportformfill") {
        return {
          text: "Yet to Report",
          report: true,
          color: "grey",
          editAccess: ["scribe", "admin", "radiologist", "wgdoctor"],
          readOnlyAccess: [],
        };
      }

      if (status === "predraft") {
        return {
          text: "Predraft",
          report: true,
          color: "#8e7cc3",
          editAccess: ["radiologist", "admin", "scribe", "wgdoctor"],
          readOnlyAccess: ["scribe", "radiologist", "admin", "wgdoctor"],
        };
      }

      if (status === "draft") {
        return {
          text: "Draft",
          report: true,
          color: "#3c78d8",
          editAccess: ["admin", "scribe", "radiologist", "wgdoctor"],
          readOnlyAccess: ["scribe", "radiologist", "admin", "wgdoctor"],
        };
      }

      if (status === "reviewed 1") {
        return {
          text: "Reviewed 1",
          report: true,
          color: "#e69138",
          editAccess: ["scribe", "admin", "codoctor", "wgdoctor"],
          readOnlyAccess: ["scribe", "admin", "wgdoctor"],
        };
      }

      if (status === "reviewed 2") {
        return {
          text: "Reviewed 2",
          report: true,
          color: "#bf9000",
          editAccess: ["scribe", "admin", "doctor", "wgdoctor"],
          readOnlyAccess: [
            "scribe",
            "admin",
            "technician",
            "codoctor",
            "wgdoctor",
          ],
        };
      }

      if (status === "signed off") {
        return {
          text: "Signed Off",
          report: true,
          color: "#38761d",
          editAccess: [],
          readOnlyAccess: [
            "scribe",
            "admin",
            "doctor",
            "scadmin",
            "technician",
            "codoctor",
            "radiologist",
            "wgdoctor",
            "patient",
            "manager",
          ],
        };
      }
    }

    // ✅ Default fallback for when role is undefined or status is unknown
    return {
      text: "-",
      report: false,
      color: "grey",
      editAccess: [],
      readOnlyAccess: [],
    };
  };

  const listAllRemarks = async (appointmentId: number) => {
    setLoading(true);
    try {
      const res = await technicianService.listAllRemarks(appointmentId);
      console.log(res);
      if (res.status) {
        return res.message;
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientQueue = async () => {
    setLoading(true);
    try {
      if (role?.type == "patient") {
        const res = await appointmentService.listPatientMedicalHistory();
        console.log("Fetching medical history...", res);
        if (res.status) {
          setPatientQueue(res.data);
        } else {
          // Handle error or empty data scenario from API response
          console.warn("API response status is false, or no data:", res);
          setPatientQueue([]); // Ensure patientQueue is empty if API indicates failure
        }
      } else {
        const res = await technicianService.listPatientQueue();
        console.log("Fetching patient queue...", res);
        if (res.status) {
          const filteredData = res.data.filter(
            (item: TechnicianPatientQueue) => {
              const { refAppointmentComplete, dicomFiles } = item;

              // Always filter out 'fillform'
              if (
                refAppointmentComplete === "fillform" &&
                role?.type !== "admin"
              )
                return false;

              // Filter out 'technologistformfill' if role is not technician
              if (
                refAppointmentComplete === "technologistformfill" &&
                role?.type !== "technician" &&
                role?.type !== "admin"
              )
                return false;

              // Filter out 'reportformfill' with no DICOMs if not technician
              if (
                refAppointmentComplete === "reportformfill" &&
                !dicomFiles &&
                role?.type !== "technician" &&
                role?.type !== "admin"
              )
                return false;

              // 🔴 NEW: For doctor or codoctor, only allow if status is 'Reviewed 1' or 'Reviewed 2'
              if (
                (role?.type === "doctor" || role?.type === "codoctor") &&
                refAppointmentComplete !== "Reviewed 1" &&
                refAppointmentComplete !== "Reviewed 2" &&
                refAppointmentComplete !== "Signed Off"
              )
                return false;

              // ✅ Keep the item
              return true;
            }
          );

          setStaffData(res.staffData);
          setPatientQueue(filteredData);
          console.log(res.staffData);
        } else {
          // Handle error or empty data scenario from API response
          console.warn("API response status is false, or no data:", res);
          setPatientQueue([]); // Ensure patientQueue is empty if API indicates failure
        }
      }
    } catch (error) {
      console.error("Failed to fetch patient queue:", error);
      setPatientQueue([]);
    } finally {
      setLoading(false);
    }
  };

  const UpdateRemarks = async (
    appointmentId: number,
    patientId: number,
    remark: string
  ) => {
    // setLoading(true);
    try {
      const res = await technicianService.UpdateRemark(
        appointmentId,
        patientId,
        remark
      );
      if (res.status) {
        // setPatientQueue(res.data);
        console.log(res.data);
      } else {
        // Handle error or empty data scenario from API response
        console.warn("API response status is false, or no data:", res);
        setPatientQueue([]); // Ensure patientQueue is empty if API indicates failure
      }
    } catch (error) {
      console.error("Failed to fetch patient queue:", error);
      setPatientQueue([]);
    } finally {
      setLoading(false);
    }
  };

  const AssignUser = async (
    appointmentId: number,
    patientId: number,
    AssignUserId: number,
    AssignCustId: string
  ) => {
    try {
      const res = await technicianService.AssignUser(
        appointmentId,
        patientId,
        AssignUserId,
        AssignCustId
      );

      if (res.status) {
        fetchPatientQueue();
        // setPatientQueue(res.data);
        console.log(res);
      } else {
        // Handle error or empty data scenario from API response
        console.warn("API response status is false, or no data:", res);
        setPatientQueue([]); // Ensure patientQueue is empty if API indicates failure
      }
    } catch (error) {
      console.error("Failed to fetch patient queue:", error);
      setPatientQueue([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientQueue();
  }, []);

  const handleCheckAccess = async (appointmentId: number) => {
    setLoading(true);
    try {
      const response = await reportService.checkAccess(appointmentId);

      return {
        status: response.status,
        accessId: response.accessId,
        custId: response.custId,
      };
    } catch (error) {
      console.log(error);
      return { status: false, accessId: null, custId: null };
    } finally {
      setLoading(false);
    }
  };

  console.log(selectedRowIds)

  const columns = useMemo<ColumnDef<TechnicianPatientQueue>[]>(
    () => [
      {
        accessorKey: "select",
        id: "select",
        enableHiding: true,
        header: ({ table }) => {
          return (
            <>
              <div className="w-full flex justify-center items-center">
                <Checkbox2
                  className="border-[#f1d4d4] bg-[#fff] data-[state=checked]:bg-[#f1d4d4] data-[state=checked]:text-[#b1b8aa] data-[state=checked]:border-[#a4b2a1]"
                  checked={
                    table.getRowModel().rows.length > 0 &&
                    table
                      .getRowModel()
                      .rows.every((row) =>
                        selectedRowIds.includes(row.original.refAppointmentId)
                      )
                  }
                  onCheckedChange={(e) => {
                    if (e) {
                      console.log(
                        table
                          .getRowModel()
                          .rows.map((row) => row.original.refAppointmentId)
                      );
                      // Select all - add all appointment IDs
                      setSelectedRowIds(
                        table
                          .getRowModel()
                          .rows.map((row) => row.original.refAppointmentId)
                      );
                    } else {
                      // Deselect all - clear the array
                      setSelectedRowIds([]);
                    }
                  }}
                />
              </div>
            </>
          );
        },
        cell: ({ row }) => {
          return (
            <>
              <Checkbox2
                checked={
                  selectedRowIds.includes(row.original.refAppointmentId) == true
                    ? true
                    : false
                }
                onCheckedChange={(e) => {
                  const appointmentId = row.original.refAppointmentId;
                  if (e === true) {
                    setSelectedRowIds((prev) =>
                      prev.includes(appointmentId)
                        ? prev
                        : [...prev, appointmentId]
                    );
                  } else {
                    setSelectedRowIds((prev) =>
                      prev.filter((id) => id !== appointmentId)
                    );
                  }
                }}
              />
            </>
          );
        },
      },
      {
        accessorKey: "refAppointmentDate",
        id: "dateOfAppointment",
        enableHiding: true,
        header: ({ column }) => (
          <div className="flex items-center justify-center gap-1">
            <span
              className="cursor-pointer font-semibold "
              onClick={column.getToggleSortingHandler()}
            >
              Date
            </span>
            <Button
              variant="ghost"
              onClick={column.getToggleSortingHandler()}
              className="!p-0 h-auto hover:bg-transparent hover:text-gray-200"
              aria-label={
                column.getIsSorted() === "asc"
                  ? "Sorted ascending"
                  : column.getIsSorted() === "desc"
                  ? "Sorted descending"
                  : "Not sorted"
              }
            >
              {column.getIsSorted() === "asc" ? (
                <ArrowUp className="h-4 w-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDown className="h-4 w-4" />
              ) : (
                <ArrowUp className="h-4 w-4 opacity-50" />
              )}
            </Button>
            {column.getCanFilter() && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="!p-0 hover:bg-transparent hover:text-gray-200"
                  >
                    <Filter />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-fit">
                  <Calendar
                    mode="range"
                    selected={
                      column.getFilterValue() as { from: Date; to?: Date }
                    }
                    onSelect={(range) => column.setFilterValue(range)}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>
        ),
        cell: ({ row }) => {
          const date = new Date(row.original.refAppointmentDate);
          return date.toLocaleDateString(); // Format date for display
        },
        enableColumnFilter: true,
        filterFn: (row, columnId, filterValue) => {
          const value = row.getValue(columnId);

          // Convert the row value to a Date if it's valid
          const rowDate =
            value instanceof Date
              ? value
              : typeof value === "string" || typeof value === "number"
              ? new Date(value)
              : null;

          if (!rowDate || isNaN(rowDate.getTime())) return true; // Don't filter invalid dates

          // Extract and validate filter range
          const { from, to } = filterValue || {};
          if (!(from instanceof Date) || !(to instanceof Date)) return true;

          // Normalize all dates to 00:00:00 for comparison
          const rowTime = new Date(rowDate).setHours(0, 0, 0, 0);
          const fromTime = new Date(from).setHours(0, 0, 0, 0);
          const toTime = new Date(to).setHours(0, 0, 0, 0);

          return rowTime >= fromTime && rowTime <= toTime;
        },
      },
      {
        accessorKey: "refSCCustId",
        id: "refSCCustId",
        header: ({ column }) => (
          <div className="flex items-center justify-center gap-1">
            <span
              className="cursor-pointer text-grey font-semibold"
              onClick={column.getToggleSortingHandler()}
            >
              Scan Centre
            </span>
            {column.getCanFilter() && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="!p-0 hover:bg-transparent hover:text-gray-200"
                  >
                    <Filter />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2">
                  <Input
                    placeholder={`Filter Scan Centre ID...`}
                    value={(column.getFilterValue() ?? "") as string}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      column.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                  />
                  <Button
                    variant="ghost"
                    onClick={() => column.setFilterValue(undefined)}
                    className="p-0 mt-2 text-red-500 hover:text-red-700"
                    title="Clear filter"
                  >
                    <XCircle className="h-4 w-4" /> <span>Clear</span>
                  </Button>
                </PopoverContent>
              </Popover>
            )}
          </div>
        ),
        // cell: ({ row }) => <span>{`${row.original.refSCCustId}`}</span>,
        enableColumnFilter: true,
      },
      {
        accessorKey: "refUserFirstName",
        id: "refUserFirstName",
        header: ({ column }) => (
          <div className="flex items-center justify-center gap-1">
            <span
              className="cursor-pointer font-semibold "
              onClick={column.getToggleSortingHandler()}
            >
              Patient Name
            </span>
            {column.getCanFilter() && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="!p-0 hover:bg-transparent hover:text-gray-200"
                  >
                    <Filter />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2">
                  <Input
                    placeholder={`Filter Patient Name...`}
                    value={(column.getFilterValue() ?? "") as string}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      column.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                  />
                  <Button
                    variant="ghost"
                    onClick={() => column.setFilterValue(undefined)}
                    className="p-0 mt-2 text-red-500 hover:text-red-700"
                    title="Clear filter"
                  >
                    <XCircle className="h-4 w-4" /> <span>Clear</span>
                  </Button>
                </PopoverContent>
              </Popover>
            )}
          </div>
        ),
        enableColumnFilter: true,
      },
      {
        accessorKey: "consentView",
        id: "consentView",
        header: ({ column }) => (
          <div className="flex items-center justify-center gap-1">
            <span
              className="cursor-pointer font-semibold "
              onClick={column.getToggleSortingHandler()}
            >
              Consent
            </span>
          </div>
        ),
        cell: ({ row }) => {
    const appointmentId = row.original.refAppointmentId;

    return (
      <div
        className="hover:underline cursor-pointer font-bold text-center"
        onClick={() => {
          setSelectedAppointmentIds([appointmentId]); // ✅ set appointmentId as array
          setConsentDialogOpen(true);                // ✅ open dialog
        }}
      >
        View
      </div>
    );
  }, 
        enableColumnFilter: true,
      },
      {
        // Changed from refSCId to refUserCustId for PatientQueue
        accessorKey: "refUserCustId",
        id: "refUserCustId", // Renamed ID to reflect content
        header: ({ column }) => (
          <div className="flex items-center justify-center gap-1">
            <span
              className="cursor-pointer font-semibold "
              onClick={column.getToggleSortingHandler()}
            >
              Patient ID
            </span>
            {column.getCanFilter() && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="hover:bg-transparent hover:text-gray-200 !p-0"
                  >
                    <Filter className="" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2">
                  <Input
                    placeholder={`Filter Patient ID...`}
                    value={(column.getFilterValue() ?? "") as string}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      column.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                  />
                  <Button
                    variant="ghost"
                    onClick={() => column.setFilterValue(undefined)}
                    className="p-0 mt-2 text-red-500 hover:text-red-700"
                    title="Clear filter"
                  >
                    <XCircle className="h-4 w-4" /> <span>Clear</span>
                  </Button>
                </PopoverContent>
              </Popover>
            )}
          </div>
        ),
        cell: ({ row }) => <span>{`${row.original.refUserCustId}`}</span>,
        enableColumnFilter: true,
      },
      {
        accessorFn: (row) => getPatientFormName(row.refCategoryId),
        id: "patientFormAndStatus",
        header: ({ column }) => {
          return (
            <div className="flex justify-center items-center gap-1 font-semibold">
              <span
                className="cursor-pointer"
                onClick={column.getToggleSortingHandler()}
              >
                Form
              </span>

              {column.getCanFilter() && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className="!p-0 hover:bg-transparent hover:text-gray-200"
                    >
                      <Filter />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-2">
                    <Command>
                      <CommandGroup className="max-h-60 overflow-auto">
                        {["S", "Da", "Db", "Dc", "Not Yet Started"].map(
                          (formName) => {
                            const current =
                              (column.getFilterValue() as string[]) ?? [];
                            const isSelected = current.includes(formName);

                            return (
                              <CommandItem
                                key={formName}
                                className="flex items-center gap-2 cursor-pointer"
                                onSelect={() => {
                                  const updated = isSelected
                                    ? current.filter((f) => f !== formName)
                                    : [...current, formName];
                                  column.setFilterValue(
                                    updated.length ? updated : undefined
                                  );
                                }}
                              >
                                <Checkbox2
                                  checked={isSelected}
                                  onCheckedChange={() => {}}
                                />
                                <span>{formName}</span>
                              </CommandItem>
                            );
                          }
                        )}
                      </CommandGroup>
                    </Command>

                    <Button
                      variant="ghost"
                      onClick={() => column.setFilterValue(undefined)}
                      className="mt-2 text-red-500 hover:text-red-700 flex items-center gap-1"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>Clear</span>
                    </Button>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          );
        },
        cell: ({ row }) => {
          const formName = getPatientFormName(row.original.refCategoryId);
          const appointmentComplete = row.original.refAppointmentComplete;
          const tempStatus = getFormStatus(appointmentComplete);
          const formStatus = tempStatus?.patientForm;
          const userId = row.original.refUserId || user?.refUserId;
          const [isEditDialogBroucherOpen, setIsEditDialogBroucherOpen] =
            useState<boolean>(false);
          const [isEditDialogOpen, setIsEditDialogOpen] =
            useState<boolean>(false);

          let statusContent: React.ReactNode = (
            <span className="text-muted-foreground">Not Filled</span>
          );

          if (formStatus) {
            statusContent = (
              <button
                className="hover:underline cursor-pointer font-bold"
                onClick={() =>
                  navigate("/patientInTakeForm", {
                    state: {
                      fetchFormData: true,
                      appointmentId: row.original.refAppointmentId,
                      userId,
                      readOnly: true,
                      name: row.original.refUserFirstName ?? user?.refUserFirstName,
                      custId: row.original.refUserCustId ?? user?.refUserCustId,
                      scancenterCustId: row.original.refSCCustId,
                    },
                  })
                }
              >
                View
              </button>
            );
          } else if (
            currentUserRole === "patient" &&
            appointmentComplete === "fillform"
          ) {
            statusContent = (
              <button
                className="hover:underline cursor-pointer font-bold"
                onClick={() => {
                  setIsEditDialogBroucherOpen(true);
                }}
              >
                Start
              </button>
            );
          }

          return (
            <div className="text-center">
              {(formName !== "Not Yet Started" || role?.type === "patient") && (
                <span className="font-medium">{formName} - </span>
              )}
              {statusContent}
              {isEditDialogBroucherOpen && (
                <Dialog
                  open={isEditDialogBroucherOpen}
                  onOpenChange={setIsEditDialogBroucherOpen}
                >
                  <PatientInformation
                    onNext={() => {
                      setIsEditDialogBroucherOpen(false);
                      setIsEditDialogOpen(true);
                    }}
                    scId={row.original.refSCId}
                  />
                </Dialog>
              )}

              {isEditDialogOpen && (
              <Dialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
              >
                <ConsentForm
                  onSubmit={(consent) =>
                    navigate("/patientInTakeForm", {
                      state: {
                        fetchFormData: false,
                        appointmentId: row.original.refAppointmentId,
                        userId,
                        name: row.original.refUserFirstName ?? user?.refUserFirstName,
                      custId: row.original.refUserCustId ?? user?.refUserCustId,
                        scancenterCustId: row.original.refSCCustId,
                        consent: consent,
                      },
                    })
                  }
                  scId={row.original.refSCId}
                />
                {/* <UserConsentWrapper
                  setEditingDialogOpen={setIsEditDialogOpen}
                  onSubmit={() =>
                    navigate("/patientInTakeForm", {
                      state: {
                        fetchFormData: false,
                        appointmentId: row.original.refAppointmentId,
                        userId,
                        name: row.original.refUserFirstName,
                        custId: row.original.refUserCustId,
                        scancenterCustId: row.original.refSCCustId,
                      },
                    })
                  }
                /> */}
              </Dialog>
              )}
            </div>
          );
        },
        enableColumnFilter: true,
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue || !Array.isArray(filterValue)) return true;
          const formName = row.getValue(columnId); // Already the label like "Da"
          return filterValue.includes(formName);
        },
      },
      {
        id: "technicianForm",
        header: ({ column }) => (
          <div className="flex items-center justify-center gap-1">
            Technician Form
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="hover:bg-transparent hover:text-gray-200 !p-0"
                >
                  <Filter />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-40 p-2">
                {["Filled", "Not Filled"].map((option) => {
                  const value = option === "Filled" ? "filled" : "notFilled";
                  return (
                    <div
                      key={value}
                      className="flex items-center gap-2 cursor-pointer py-1"
                      onClick={() =>
                        column.setFilterValue(
                          column.getFilterValue() === value ? undefined : value
                        )
                      }
                    >
                      <Checkbox2 checked={column.getFilterValue() === value} />
                      <span>{option}</span>
                    </div>
                  );
                })}
                <Button
                  variant="ghost"
                  className="mt-2 text-red-500 hover:text-red-700 flex items-center gap-1"
                  onClick={() => column.setFilterValue(undefined)}
                >
                  <XCircle className="h-4 w-4" />
                  <span>Clear</span>
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        ),
        cell: ({ row }) => {
          const tempStatus = getFormStatus(row.original.refAppointmentComplete);
          const formStatus = tempStatus?.technicianForm;
          const appointmentComplete = row.original.refAppointmentComplete;

          if (formStatus) {
            // Form is already filled — show 'View' for all
            return (
              <span>
                <button
                  className="hover:underline cursor-pointer font-bold"
                  onClick={() =>
                    navigate("/technicianpatientintakeform", {
                      state: {
                        fetchTechnicianForm: true,
                        fetchFormData: true,
                        appointmentId: row.original.refAppointmentId,
                        userId: row.original.refUserId,
                        readOnly: true,
                        name: row.original.refUserFirstName,
                        custId: row.original.refUserCustId,
                        scancenterCustId: row.original.refSCCustId,
                      },
                    })
                  }
                >
                  View
                </button>
              </span>
            );
          } else if (
            (currentUserRole === "technician" || currentUserRole === "admin") &&
            appointmentComplete === "fillform"
          ) {
            // Form not started but technician has access and status is 'fillform'
            return <div className="text-muted-foreground">Not Yet Started</div>;
          } else if (
            currentUserRole === "technician" ||
            currentUserRole === "admin"
          ) {
            // Not filled yet and technician has access
            return (
              <span>
                <button
                  className="hover:underline cursor-pointer font-bold"
                  onClick={() =>
                    navigate("/technicianpatientintakeform", {
                      state: {
                        fetchFormData: true,
                        appointmentId: row.original.refAppointmentId,
                        userId: row.original.refUserId,
                        name: row.original.refUserFirstName,
                        custId: row.original.refUserCustId,
                        scancenterCustId: row.original.refSCCustId,
                      },
                    })
                  }
                >
                  Start
                </button>
              </span>
            );
          } else {
            // Not filled and no write access
            return <div className="text-muted-foreground">Not Filled</div>;
          }
        },
        enableColumnFilter: true,
        filterFn: (row, _columnId, value) => {
          const tempStatus = getFormStatus(row.original.refAppointmentComplete);
          const filled = tempStatus?.technicianForm === true;
          return value === "filled" ? filled : !filled;
        },
      },

      {
        id: "dicom",
        header: () => (
          <div className="flex flex-col items-center w-full">
            <div className="font-medium text-center border-b border-gray-500 w-full">
              DICOM
            </div>
            <div className="flex items-center justify-center text-xs font-medium w-full">
              <span className="px-4 border-r border-gray-500">L</span>
              <span className="px-4">R</span>
            </div>
          </div>
        ),
        cell: ({ row }) => {
          const dicomFiles = row.original.dicomFiles as DicomFiles[];
          const appointmentId = row.original.refAppointmentId;
          const userId = row.original.refUserId;
          const isTechnician = currentUserRole === "technician" || "admin";

          const leftDicom = dicomFiles?.find((f) => f.refDFSide === "Left");
          const rightDicom = dicomFiles?.find((f) => f.refDFSide === "Right");

          const hasDicom = leftDicom || rightDicom;

          if (hasDicom) {
            let leftCount = 0;
            let rightCount = 0;
            for (let i = 0; i < dicomFiles.length; i++) {
              if (dicomFiles[i].refDFSide === "Left") {
                leftCount++;
              }
              if (dicomFiles[i].refDFSide === "Right") {
                rightCount++;
              }
            }
            return (
              <div className="flex justify-center gap-4 items-center text-sm text-center">
                {/* Left DICOM */}
                {leftDicom ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Download Left DICOM"
                    onClick={() =>
                      downloadAllDicom(
                        userId,
                        appointmentId,
                        "Left",
                        leftDicom.refDFFilename
                          .split("_")
                          .slice(0, -2)
                          .join("_") + "_L.zip"
                      )
                    }
                  >
                    ({leftCount})<Download />
                    <span className="sr-only">Left DICOM</span>
                  </Button>
                ) : (
                  <span className="w-10 text-muted-foreground">-</span>
                )}

                <div className="h-5 w-px bg-gray-400" />

                {/* Right DICOM */}
                {rightDicom ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Download Right DICOM"
                    onClick={() =>
                      downloadAllDicom(
                        userId,
                        appointmentId,
                        "Right",
                        rightDicom.refDFFilename
                          .split("_")
                          .slice(0, -2)
                          .join("_") + "_R.zip"
                      )
                    }
                  >
                    ({rightCount})<Download />
                    <span className="sr-only">Right DICOM</span>
                  </Button>
                ) : (
                  <span className="w-10 text-muted-foreground">-</span>
                )}
              </div>
            );
          }
          if (
            isTechnician &&
            !hasDicom &&
            row.original.refAppointmentComplete === "reportformfill"
          ) {
            return (
              <div className="text-center w-full">
                <button
                  className="hover:underline cursor-pointer font-bold"
                  onClick={() =>
                    navigate("../uploadDicoms", {
                      state: {
                        appointmentId,
                        userId,
                        name: row.original.refUserFirstName,
                        custId: row.original.refUserCustId,
                        scancenterCustId: row.original.refSCCustId,
                      },
                    })
                  }
                >
                  Upload DICOM
                </button>
              </div>
            );
          }

          if (!hasDicom) {
            return (
              <div className="text-muted-foreground text-center w-full">
                Not Uploaded
              </div>
            );
          }

          return <div className="text-center w-full">-</div>;
        },
      },
      {
        id: "report",
        header: ({ column }) => (
          <div className="flex items-center justify-center gap-1">
            Report
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="hover:bg-transparent hover:text-gray-200 !p-0"
                >
                  <Filter />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-40 p-2">
                {["Filled", "Not Filled"].map((option) => {
                  const value = option === "Filled" ? "filled" : "notFilled";
                  return (
                    <div
                      key={value}
                      className="flex items-center gap-2 cursor-pointer py-1"
                      onClick={() =>
                        column.setFilterValue(
                          column.getFilterValue() === value ? undefined : value
                        )
                      }
                    >
                      <Checkbox2 checked={column.getFilterValue() === value} />
                      <span>{option}</span>
                    </div>
                  );
                })}
                <Button
                  variant="ghost"
                  className="mt-2 text-red-500 hover:text-red-700 flex items-center gap-1"
                  onClick={() => column.setFilterValue(undefined)}
                >
                  <XCircle className="h-4 w-4" />
                  <span>Clear</span>
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        ),
        cell: ({ row }) => {
          const [dialogOpen, setDialogOpen] = useState(false);
          const [selectedRow, setSelectedRow] = useState<any>(null);
          const [accessModeDialog, setAccessModeDialog] = useState(false);
          const navigate = useNavigate();
          const [patientReportDialog, setPatientReportDialog] =
            useState<boolean>(false);
          const [currentAccess, setCurrentAccess] = useState("");

          const status = getStatus(row.original.refAppointmentComplete);
          const role = currentUserRole as UserRole;
          const hasEditAccess = status?.editAccess?.includes(role);
          const hasReadOnlyAccess = status?.readOnlyAccess?.includes(role);

          if (!status?.report || (!hasEditAccess && !hasReadOnlyAccess)) {
            return <div className="text-center text-gray-400">-</div>;
          }

          const handleViewClick = async () => {
            const currentUserId = currentUser;
            if (hasEditAccess) {
              const { status, accessId, custId } = await handleCheckAccess(
                row.original.refAppointmentId
              );
              setCurrentAccess(custId);
              console.log("ss", status);
              if (status && accessId === currentUserId) {
                // Direct edit access
                navigate("/report", {
                  state: {
                    appointmentId: row.original.refAppointmentId,
                    userId: row.original.refUserId,
                    readOnly: false,
                  },
                });
              } else if (status && accessId == 0) {
                // Someone else editing — show read-only prompt
                setSelectedRow(row.original);
                setAccessModeDialog(true);
              } else {
                // Fallback: no access
                setSelectedRow(row.original);
                setDialogOpen(true);
              }
            } else if (hasReadOnlyAccess) {
              if (status.text == "Signed Off") {
                setPatientReportDialog(true);
              } else {
                navigate("/report", {
                  state: {
                    appointmentId: row.original.refAppointmentId,
                    userId: row.original.refUserId,
                    readOnly: true,
                  },
                });
              }
            }
          };

          return (
            <div className="text-center w-full">
              {!row.original.dicomFiles ||
              row.original.dicomFiles.length === 0 ? (
                <span>-</span>
              ) : row.original.refAppointmentComplete === "reportformfill" ? (
                <span
                  onClick={handleViewClick}
                  className="hover:underline cursor-pointer font-bold"
                >
                  Start
                </span>
              ) : (
                <span
                  onClick={handleViewClick}
                  className="hover:underline cursor-pointer font-bold"
                >
                  View
                </span>
              )}

              {/* ❌ Someone else editing dialog */}
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[400px]">
                  <DialogHeader>
                    <DialogTitle>Someone is accessing this report</DialogTitle>
                  </DialogHeader>
                  <div className="text-sm text-muted-foreground">
                    This report is being accessed by{" "}
                    <span className="font-bold text-base">{currentAccess}</span>
                    .
                    <br />
                    You can only continue in <strong>read-only</strong> mode.
                  </div>
                  <DialogFooter className="mt-4">
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                      variant="greenTheme"
                      onClick={() => {
                        if (selectedRow) {
                          navigate("/report", {
                            state: {
                              appointmentId: selectedRow.refAppointmentId,
                              userId: selectedRow.refUserId,
                              readOnly: true,
                            },
                          });
                          setDialogOpen(false);
                        }
                      }}
                    >
                      Continue
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* ✅ Choose Access Mode Dialog */}
              <Dialog
                open={accessModeDialog}
                onOpenChange={setAccessModeDialog}
              >
                <DialogContent className="sm:max-w-[400px]">
                  <DialogHeader>
                    <DialogTitle>Select Access Mode</DialogTitle>
                  </DialogHeader>
                  <div className="text-sm text-muted-foreground">
                    You have edit access for this report. How would you like to
                    proceed?
                  </div>
                  <DialogFooter className="mt-4 flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (selectedRow) {
                          navigate("/report", {
                            state: {
                              appointmentId: selectedRow.refAppointmentId,
                              userId: selectedRow.refUserId,
                              readOnly: true,
                            },
                          });
                          setAccessModeDialog(false);
                        }
                      }}
                    >
                      Read-Only
                    </Button>
                    <Button
                      variant="greenTheme"
                      onClick={() => {
                        if (selectedRow) {
                          navigate("/report", {
                            state: {
                              appointmentId: selectedRow.refAppointmentId,
                              userId: selectedRow.refUserId,
                              readOnly: false,
                            },
                          });
                          setAccessModeDialog(false);
                        }
                      }}
                    >
                      Edit
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {user && (
                <Dialog
                  open={patientReportDialog}
                  onOpenChange={setPatientReportDialog}
                >
                  <PatientReport
                    userId={row.original.refUserId ?? user?.refUserId}
                    appointmentId={row.original.refAppointmentId}
                    patientReportDialog={patientReportDialog}
                  />
                </Dialog>
              )}
            </div>
          );
        },
        enableColumnFilter: true,
        filterFn: (row, _columnId, value) => {
          const tempStatus = getFormStatus(row.original.refAppointmentComplete);
          const filled = tempStatus?.technicianForm === true;
          return value === "filled" ? filled : !filled;
        },
      },

      {
        id: "refAppointmentComplete",
        header: () => (
          <div className="text-center w-full font-medium">Report Status</div>
        ),
        cell: ({ row }) => {
          const status = getStatus(row.original.refAppointmentComplete);
          return (
            <div
              className="text-center w-full uppercase text-xs font-semibold"
              style={{ color: status?.color }}
            >
              {status?.text}
            </div>
          );
        },
      },
      {
        id: "assigned",
        header: () => <div className="text-center w-full">Assigned</div>,
        cell: ({ row }) => {
          return (
            <div className="flex justify-center">
              <Select
                value={
                  row.original.refAppointmentAssignedUserId === 0
                    ? ""
                    : String(row.original.refAppointmentAssignedUserId)
                }
                onValueChange={(value) => {
                  const selectedUser = staffData.find(
                    (tech) => String(tech.refUserId) === value
                  );

                  if (selectedUser) {
                    AssignUser(
                      row.original.refAppointmentId,
                      row.original.refUserId,
                      selectedUser.refUserId,
                      selectedUser.refUserCustId
                    );
                  }
                }}
              >
                <SelectTrigger className="bg-white m-0 text-xs max-w-25">
                  <SelectValue placeholder="Assign" />
                </SelectTrigger>

                <SelectContent>
                  {staffData?.length > 0 ? (
                    staffData.map((tech) => (
                      <>
                        {(tech.refSCId === 0 ||
                          tech.refSCId.toString() ===
                            row.original.refSCId.toString()) && (
                          <SelectItem
                            key={tech.refUserId}
                            value={String(tech.refUserId)}
                          >
                            {tech.refUserCustId}
                          </SelectItem>
                        )}
                      </>
                    ))
                  ) : (
                    <div className="text-xs text-gray-400 px-4 py-2">
                      No staff found
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
          );
        },
      },
      // {
      //   id: "changes",
      //   header: () => (
      //     <div className="text-center w-full font-medium m-0 p-0">Review</div>
      //   ),
      //   cell: ({ row }) => (
      //     <div className="text-center w-full">
      //       {!row.original.GetCorrectEditModel.isHandleCorrect &&
      //       !row.original.GetCorrectEditModel.isHandleEdited
      //         ? "-"
      //         : `${
      //             row.original.GetCorrectEditModel.isHandleCorrect ? "C" : ""
      //           }${row.original.GetCorrectEditModel.isHandleEdited ? "E" : ""}`}
      //     </div>
      //   ),
      // },

      {
        id: "pendingRemarks",
        header: () => (
          <div className="text-center w-full font-medium">Pending Remarks</div>
        ),
        cell: ({ row }) => {
          const latestRemark = row.original.refAppointmentRemarks?.trim() || "";

          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild disabled={!latestRemark}>
                  <Input
                    className={`text-xs 2xl:text-sm text-start bg-white border mx-2 w-35 truncate ${
                      !latestRemark ? "italic text-gray-500 text-[5px]" : ""
                    }`}
                    readOnly
                    value={latestRemark || "No remarks yet"}
                  />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs" side="bottom">
                  {latestRemark || "No remarks yet"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        },
      },
      {
        id: "totalRemarks",
        header: () => (
          <div className="text-center w-full font-medium">Remarks</div>
        ),
        cell: ({ row }) => {
          const [openAdd, setOpenAdd] = React.useState(false);
          const [openView, setOpenView] = React.useState(false);
          const [remark, setRemark] = React.useState("");
          const [remarksList, setRemarksList] = React.useState<Remarks[]>([]);

          const loadRemarks = async () => {
            const res = await listAllRemarks(row.original.refAppointmentId);
            setRemarksList(res || []);
          };

          return (
            <div className="flex flex-col items-center px-2 gap-1">
              <div className="flex gap-1">
                <Button
                  variant="pinkTheme"
                  size="icon"
                  className="w-8 h-8"
                  title="Add Remark"
                  onClick={() => {
                    setRemark("");
                    setOpenAdd(true);
                  }}
                >
                  +
                </Button>

                <Button
                  variant="greenTheme"
                  size="icon"
                  className="w-8 h-8"
                  title="View Remarks"
                  disabled={row.original.refAppointmentRemarks.length === 0}
                  onClick={() => {
                    loadRemarks();
                    setOpenView(true);
                  }}
                >
                  <Eye />
                </Button>
              </div>

              {/* Add Dialog */}
              <Dialog open={openAdd} onOpenChange={setOpenAdd}>
                <DialogContent className="sm:max-w-[400px]">
                  <DialogHeader>
                    <DialogTitle>Add Remark</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4 space-y-4">
                    <Textarea
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                      placeholder="Enter new remark..."
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => setOpenAdd(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="pinkTheme"
                        onClick={async () => {
                          await UpdateRemarks(
                            row.original.refAppointmentId,
                            row.original.refUserId,
                            remark
                          );
                          await fetchPatientQueue();
                          setOpenAdd(false);
                        }}
                        disabled={!remark.trim()}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* View Dialog */}
              <Dialog open={openView} onOpenChange={setOpenView}>
                <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>All Remarks</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-2 mt-4">
                    {remarksList.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        No remarks available.
                      </p>
                    ) : (
                      remarksList
                        .sort(
                          (a, b) =>
                            new Date(b.refRCreatedAt).getTime() -
                            new Date(a.refRCreatedAt).getTime()
                        )
                        .map((r) => (
                          <div
                            key={r.refRId}
                            className="p-2 border rounded bg-gray-100 text-sm"
                          >
                            <div className="text-gray-600 mb-1">
                              {r.refUserCustId +
                                " - " +
                                new Date(r.refRCreatedAt).toLocaleString()}
                            </div>
                            <div className="text-black">
                              {r.refRemarksMessage}
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          );
        },
      },
    ],
    [navigate, staffData, selectedRowIds] // Add navigate to useMemo dependencies
  );

  const permissionsMap: Record<UserRole, string[]> = {
    admin: [
      "select",
      "dateOfAppointment",
      "refUserFirstName",
      "patientId",
      "refSCCustId",
      "consentView",
      "patientFormAndStatus",
      "technicianForm",
      "dicom",
      "report",
      "refAppointmentComplete",
      "assigned",
      "changes",
      "pendingRemarks",
      "totalRemarks",
    ],
    technician: [
      "select",
      "dateOfAppointment",
      "refUserFirstName",
      "patientId",
      "refSCCustId",
      "patientFormAndStatus",
      "technicianForm", // Start/View logic handled in cell
      "dicom",
      "report",
      "refAppointmentComplete",
      "pendingRemarks",
      "totalRemarks"
    ],
    scribe: [
      "select",
      "dateOfAppointment",
      "refUserFirstName",
      "patientId",
      "refSCCustId",
      "patientFormAndStatus",
      "technicianForm", // only "View" if filled
      "dicom",
      "report",
      "refAppointmentComplete",
      "assigned",
      "changes",
      "pendingRemarks",
      "totalRemarks"
    ],
    scadmin: [
      "select",
      "dateOfAppointment",
      "refUserFirstName",
      "patientId",
      "refSCCustId",
      "patientFormAndStatus",
      "technicianForm", // only "View" if filled
      "dicom",
      "report",
      "refAppointmentComplete",
      "assigned",
      "changes",
      "pendingRemarks",
      "totalRemarks"
    ],
    patient: [
      "dateOfAppointment",
      "refSCCustId",
      "patientFormAndStatus",
      "report",
    ],
    doctor: [
      "select",
      "dateOfAppointment",
      "refUserFirstName",
      "patientId",
      "refSCCustId",
      "patientFormAndStatus",
      "technicianForm", // only "View" if filled
      "dicom",
      "report",
      "refAppointmentComplete",
      "assigned",
      "changes",
      "pendingRemarks",
      "totalRemarks"
    ],
    radiologist: [
      "select",
      "dateOfAppointment",
      "refUserFirstName",
      "patientId",
      "refSCCustId",
      "patientFormAndStatus",
      "technicianForm", // only "View" if filled
      "dicom",
      "report",
      "refAppointmentComplete",
      "assigned",
      "changes",
      "pendingRemarks",
      "totalRemarks"
    ],
    codoctor: [
      "select",
      "dateOfAppointment",
      "refUserFirstName",
      "patientId",
      "refSCCustId",
      "patientFormAndStatus",
      "technicianForm", // only "View" if filled
      "dicom",
      "report",
      "refAppointmentComplete",
      "assigned",
      "changes",
      "pendingRemarks",
      "totalRemarks"
    ],
    manager: [
      "select",
      "dateOfAppointment",
      "refUserFirstName",
      "patientId",
      "refSCCustId",
      "consentView",
      "patientFormAndStatus",
      "technicianForm", // only "View" if filled
      "dicom",
      "report",
      "refAppointmentComplete",
      "assigned",
      "changes",
      "pendingRemarks",
      "totalRemarks"
    ],
    wgdoctor: [
      "select",
      "dateOfAppointment",
      "refUserFirstName",
      "patientId",
      "refSCCustId",
      "patientFormAndStatus",
      "technicianForm",
      "dicom",
      "report",
      "refAppointmentComplete",
      "assigned",
      "changes",
      "pendingRemarks",
      "totalRemarks"
    ],
  };

  const allowedColumnIds = permissionsMap[currentUserRole as UserRole] ?? [];

  const filteredColumns = columns.filter(
    (column) => column.id && allowedColumnIds.includes(column.id)
  );

  const table = useReactTable<TechnicianPatientQueue>({
    data: patientQueue,
    columns: filteredColumns,
    state: {
      sorting,
      globalFilter,
      columnFilters,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 50,
      },
    },
    globalFilterFn: (row, columnId, filterValue) => {
      const value = String(row.getValue(columnId) ?? "").toLowerCase();
      return value.includes(filterValue.toLowerCase());
    },
  });

  const clearAllFilters = () => {
    setGlobalFilter("");
    setColumnFilters([]);
    setSorting([]);
  };

  return (
    <div className="w-full mx-auto">
      {loading && <LoadingOverlay />}
      <div className="w-11/12 h-[80vh] overflow-y-scroll bg-radial-greeting-02 mx-auto my-5 space-y-3 p-2 lg:p-6 rounded-lg">
        {/* Global Filter and Clear Filters Button */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
          <Button
            onClick={async () => {
              setLoading(true);
              await handleAllDownloadDicom(selectedRowIds);
              setLoading(false);
            }}
            className="flex items-center bg-[#b1b8aa] gap-1 text-white hover:bg-[#b1b8aa]"
            disabled={selectedRowIds.length === 0}
            hidden={role?.type == "patient"}
          >
            <Download className="h-4 w-4" />
            Download Dicom
          </Button>
           <Button
            variant="outline"
            onClick={clearAllFilters}
            className="flex items-center gap-1 border border-red-300 text-red-500 hover:bg-red-100 hover:text-red-600"
          >
            <XCircle className="h-4 w-4" /> Clear All Filters
          </Button>
          <Input
            placeholder="Search all columns..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="w-full"
          />
         
          
        </div>

        {/* Table Container */}
        <div
          className="grid w-full border rounded-lg overflow-auto"
          style={{
            background:
              "radial-gradient(100.97% 186.01% at 50.94% 50%, #F9F4EC 25.14%, #EED8D6 100%)",
          }}
        >
          <Table className="divide-y divide-gray-200">
            <TableHeader className="bg-[#a4b2a1] sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="py-1 text-left tracking-wider border text-[11px] 2xl:text-sm p-0"
                      style={{
                        width: header.getSize(),
                        minWidth:
                          (
                            header.column
                              .columnDef as ColumnDef<TechnicianPatientQueue>
                          ).minSize || "auto",
                        maxWidth:
                          (
                            header.column
                              .columnDef as ColumnDef<TechnicianPatientQueue>
                          ).maxSize || "auto",
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="divide-y divide-gray-100">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="bg-[#f7f0e9] p-0">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="py-2 px-0 text-center whitespace-nowrap text-sm text-gray-700 border"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-start lg:text-center text-gray-500"
                  >
                    No Patient Queue Found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* ShadCN Pagination Controls */}
        <div className="flex flex-col items-center py-4">
          <div className="flex md:hidden items-center justify-center w-full space-x-4 mb-4">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value: string) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 20, 30, 40, 50].map((pageSize: number) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center md:justify-between w-full md:space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value: string) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 20, 30, 40, 50].map((pageSize: number) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-6 lg:space-x-8 relative">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => table.setPageIndex(0)}
                      disabled={!table.getCanPreviousPage()}
                      aria-label="Go to first page"
                    >
                      <span className="sr-only">Go to first page</span>
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        table.getCanPreviousPage() && table.previousPage()
                      }
                      className={
                        !table.getCanPreviousPage()
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }
                      aria-label="Go to previous page"
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink isActive>
                      {table.getState().pagination.pageIndex + 1}
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => table.getCanNextPage() && table.nextPage()}
                      className={
                        !table.getCanNextPage()
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }
                      aria-label="Go to next page"
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() =>
                        table.setPageIndex(table.getPageCount() - 1)
                      }
                      disabled={!table.getCanNextPage()}
                      aria-label="Go to last page"
                    >
                      <span className="sr-only">Go to last page</span>
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>

            <div className="hidden md:flex w-[100px] items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={consentDialogOpen} onOpenChange={setConsentDialogOpen}>
  <PatientConsentDialog
    appointmentIds={selectedAppointmentIds}
    patientConsentDialog={consentDialogOpen}
  />
</Dialog>

    </div>
  );
};

export default PatientQueue;
