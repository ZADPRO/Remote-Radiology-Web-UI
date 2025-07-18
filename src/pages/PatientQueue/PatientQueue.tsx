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
  TechnicianPatientQueue,
  technicianService,
} from "@/services/technicianServices"; // Import technicianService
import { useNavigate } from "react-router-dom"; // Import useNavigate
import MultiDateCalendarBody from "@/components/ui/CustomComponents/MultiDateCalendarBody";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Checkbox2 } from "@/components/ui/CustomComponents/checkbox2";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { reportService } from "@/services/reportService";
import { useAuth, UserRole } from "../Routes/AuthContext";
import { downloadAllDicom, handleAllDownloadDicom } from "@/lib/commonUtlis";

interface staffData {
  refUserCustId: string;
  refUserFirstName: string;
  refUserId: number;
}

interface StatusInfo {
  text: string;
  report: boolean;
  color?: string;
  editAccess: UserRole[];
  readOnlyAccess: UserRole[];
}

const PatientQueue: React.FC = () => {
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
        return "Not yet started";
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
          editAccess: ["scribe", "admin", "doctor"],
          readOnlyAccess: [],
        };
      }

      if (status === "predraft") {
        return {
          text: "Predraft",
          report: true,
          color: "#8e7cc3",
          editAccess: ["radiologist", "admin", "doctor", "scribe"],
          readOnlyAccess: ["scribe", "radiologist", "admin", "doctor"],
        };
      }

      if (status === "draft") {
        return {
          text: "Draft",
          report: true,
          color: "#3c78d8",
          editAccess: ["admin", "scribe", "doctor"],
          readOnlyAccess: [
            "scribe",
            "radiologist",
            "admin",
            "doctor",
            "scadmin",
          ],
        };
      }

      if (status === "reviewed 1") {
        return {
          text: "Reviewed 1",
          report: true,
          color: "#e69138",
          editAccess: ["scribe", "admin", "codoctor"],
          readOnlyAccess: ["scribe", "admin", "doctor", "scadmin"],
        };
      }

      if (status === "reviewed 2") {
        return {
          text: "Reviewed 2",
          report: true,
          color: "#bf9000",
          editAccess: ["scribe", "admin", "doctor"],
          readOnlyAccess: [
            "scribe",
            "admin",
            "doctor",
            "scadmin",
            "technician",
            "codoctor",
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

  const fetchPatientQueue = async () => {
    setLoading(true);
    try {
      const res = await technicianService.listPatientQueue();
      console.log("Fetching patient queue...", res);
      if (res.status) {
        setStaffData(res.staffData);
        setPatientQueue(res.data);
        console.log(res.staffData);
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

      // Assuming response = { status: true, accessId: 74 }
      return {
        status: response.status,
        accessId: response.accessId,
      };
    } catch (error) {
      console.log(error);
      return { status: false, accessId: null };
    } finally {
      setLoading(false);
    }
  };

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
                  <MultiDateCalendarBody
                    value={column.getFilterValue() as Date[]}
                    onChange={(value) =>
                      column.setFilterValue(value?.length ? value : undefined)
                    }
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
        filterFn: (row, columnId, filterDates: Date[]) => {
          if (!filterDates || filterDates.length === 0) return true;
          const rowDate = new Date(row.getValue(columnId));
          return filterDates.some(
            (filterDate) => rowDate.toDateString() === filterDate.toDateString()
          );
        },
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
        id: "patientFormName",
        header: ({ column }) => (
          <div className="flex justify-center items-center gap-1">
            <span
              className="cursor-pointer font-semibold "
              onClick={column.getToggleSortingHandler()}
            >
              Form Name
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
                      {["S", "Da", "Db", "Dc", "Not yet started"].map(
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
        ),
        cell: ({ row }) => {
          const formName = getPatientFormName(row.original.refCategoryId);
          const isFillForm = row.original.refAppointmentComplete === "fillform";

          return (
            <p
              className={
                isFillForm ? "italic text-muted-foreground text-center" : ""
              }
            >
              {formName}
            </p>
          );
        },
        enableColumnFilter: true,
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue || !Array.isArray(filterValue)) return true;

          const formName = row.getValue(columnId); // This is already "S", "Da", etc.
          return filterValue.includes(formName);
        },
      },
      {
        accessorKey: "refSCCustId",
        id: "refSCCustId",
        header: ({ column }) => (
          <div className="flex items-center">
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
        id: "patientForm",
        header: ({ column }) => (
          <div className="flex items-center justify-center gap-1">
            Patient Form
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
          const formStatus = tempStatus?.patientForm;

          return (
            <span>
              {formStatus ? (
                <button
                  className="hover:underline cursor-pointer font-bold"
                  onClick={() =>
                    navigate("/patientInTakeForm", {
                      state: {
                        fetchFormData: true,
                        appointmentId: row.original.refAppointmentId,
                        userId: row.original.refUserId,
                        readOnly: true,
                      },
                    })
                  }
                >
                  View
                </button>
              ) : (
                <div className="text-muted-foreground">Not Filled</div>
              )}
            </span>
          );
        },
        enableColumnFilter: true,
        filterFn: (row, value) => {
          const tempStatus = getFormStatus(row.original.refAppointmentComplete);
          const filled = tempStatus?.patientForm === true;
          return value === "filled" ? filled : !filled;
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
                      },
                    })
                  }
                >
                  View
                </button>
              </span>
            );
          } else if (
            currentUserRole === "technician" &&
            appointmentComplete === "fillform"
          ) {
            // Form not started but technician has access and status is 'fillform'
            return <div className="text-muted-foreground">Not yet started</div>;
          } else if (currentUserRole === "technician") {
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
        filterFn: (row, value) => {
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
          const isTechnician = currentUserRole === "technician";

          const leftDicom = dicomFiles?.find((f) => f.refDFSide === "Left");
          const rightDicom = dicomFiles?.find((f) => f.refDFSide === "Right");

          const hasDicom = leftDicom || rightDicom;

          if (hasDicom) {
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
                    <Download />
                    <span className="sr-only">Left DICOM</span>
                  </Button>
                ) : (
                  <span className="w-10 text-muted-foreground">-</span>
                )}

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
                    <Download />
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
                      state: { appointmentId, userId },
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
        header: () => <div className="text-center w-full">Report</div>,
        cell: ({ row }) => {
          const [dialogOpen, setDialogOpen] = useState(false);
          const [selectedRow, setSelectedRow] = useState<any>(null);
          const [accessModeDialog, setAccessModeDialog] = useState(false);
          const navigate = useNavigate();

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
              const { status, accessId } = await handleCheckAccess(
                row.original.refAppointmentId
              );

              if (status && (accessId === currentUserId || accessId === 0)) {
                // Direct edit access
                navigate("/report", {
                  state: {
                    appointmentId: row.original.refAppointmentId,
                    userId: row.original.refUserId,
                    readOnly: false,
                  },
                });
              } else if (status) {
                // Someone else editing — show read-only prompt
                setSelectedRow(row.original);
                setDialogOpen(true);
              } else {
                // Fallback: no access
                setSelectedRow(row.original);
                setDialogOpen(true);
              }
            } else if (hasReadOnlyAccess) {
              navigate("/report", {
                state: {
                  appointmentId: row.original.refAppointmentId,
                  userId: row.original.refUserId,
                  readOnly: true,
                },
              });
            }
          };

          return (
            <div className="text-center w-full">
              {row.original.dicomFiles === null ? (
                <span>-</span>
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
                    This report is currently being accessed by someone else.
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
            </div>
          );
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
                      <SelectItem
                        key={tech.refUserId}
                        value={String(tech.refUserId)}
                      >
                        {tech.refUserFirstName}
                      </SelectItem>
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
      {
        id: "changes",
        header: () => (
          <div className="text-center w-full font-medium m-0 p-0">Changes</div>
        ),
        cell: () => <div className="text-center w-full">-</div>,
      },

      {
        id: "pendingRemarks",
        header: () => (
          <div className="text-center w-full font-medium">Pending Remarks</div>
        ),
        cell: ({ row }) => {
          const [open, setOpen] = React.useState(false);
          const [remark, setRemark] = React.useState(
            row.original.refAppointmentRemarks
          );

          return (
            <div className="flex justify-center">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      {remark?.trim() ? "View" : "Add"}
                    </Button>
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[400px]">
                  <DialogHeader>
                    <DialogTitle>Enter Remark</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4 space-y-4">
                    <Textarea
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                      placeholder="Enter remarks..."
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => setOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="pinkTheme"
                        onClick={() => {
                          console.log(row.original.refAppointmentId);
                          console.log(row.original.refUserId);
                          // Save remark logic goes here
                          UpdateRemarks(
                            row.original.refAppointmentId,
                            row.original.refUserId,
                            remark
                          );
                          setOpen(false);
                        }}
                      >
                        Save
                      </Button>
                    </div>
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
      "patientFormName",
      "refSCCustId",
      "patientForm",
      "technicianForm",
      "dicom",
      "report",
      "refAppointmentComplete",
      "assigned",
      "changes",
      "pendingRemarks",
    ],
    technician: [
      "select",
      "dateOfAppointment",
      "refUserFirstName",
      "patientId",
      "patientFormName",
      "refSCCustId",
      "patientForm",
      "technicianForm", // Start/View logic handled in cell
      "dicom",
      "report",
      "refAppointmentComplete",
    ],
    scribe: [
      "select",
      "dateOfAppointment",
      "refUserFirstName",
      "patientId",
      "patientFormName",
      "refSCCustId",
      "patientForm",
      "technicianForm", // only "View" if filled
      "dicom",
      "report",
      "refAppointmentComplete",
      "assigned",
      "changes",
      "pendingRemarks",
    ],
    scadmin: [
      "select",
      "dateOfAppointment",
      "refUserFirstName",
      "patientId",
      "patientFormName",
      "refSCCustId",
      "patientForm",
      "technicianForm", // only "View" if filled
      "dicom",
      "report",
      "refAppointmentComplete",
      "assigned",
      "changes",
      "pendingRemarks",
    ],
    patient: [], // Dummy
    doctor: [
      "select",
      "dateOfAppointment",
      "refUserFirstName",
      "patientId",
      "patientFormName",
      "refSCCustId",
      "patientForm",
      "technicianForm", // only "View" if filled
      "dicom",
      "report",
      "refAppointmentComplete",
      "assigned",
      "changes",
      "pendingRemarks",
    ],
    radiologist: [
      "select",
      "dateOfAppointment",
      "refUserFirstName",
      "patientId",
      "patientFormName",
      "refSCCustId",
      "patientForm",
      "technicianForm", // only "View" if filled
      "dicom",
      "report",
      "refAppointmentComplete",
      "assigned",
      "changes",
      "pendingRemarks",
    ],
    codoctor: [
      "select",
      "dateOfAppointment",
      "refUserFirstName",
      "patientId",
      "patientFormName",
      "refSCCustId",
      "patientForm",
      "technicianForm", // only "View" if filled
      "dicom",
      "report",
      "refAppointmentComplete",
      "assigned",
      "changes",
      "pendingRemarks",
    ],
    manager: [
      "select",
      "dateOfAppointment",
      "refUserFirstName",
      "patientId",
      "patientFormName",
      "refSCCustId",
      "patientForm",
      "technicianForm", // only "View" if filled
      "dicom",
      "report",
      "refAppointmentComplete",
      "assigned",
      "changes",
      "pendingRemarks",
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
        pageSize: 5,
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
      <div className="w-11/12 h-[80vh] bg-radial-greeting-02 mx-auto my-5 space-y-3 p-2 lg:p-6 rounded-lg">
        {/* Global Filter and Clear Filters Button */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
          <Input
            placeholder="Search all columns..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="w-full"
          />
          <Button
            variant="outline"
            onClick={clearAllFilters}
            className="flex items-center gap-1 border border-red-300 text-red-500 hover:bg-red-100 hover:text-red-600"
          >
            <XCircle className="h-4 w-4" /> Clear All Filters
          </Button>
          <Button
            onClick={async () => {
              setLoading(true);
              await handleAllDownloadDicom(selectedRowIds);
              setLoading(false);
            }}
            className="flex items-center bg-[#b1b8aa] gap-1 text-white hover:bg-[#b1b8aa]"
            disabled={selectedRowIds.length === 0}
          >
            <Download className="h-4 w-4" />
            Download Dicom
          </Button>
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
                      className="py-1 text-left tracking-wider border text-[11px] 2xl:text-base p-0"
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
    </div>
  );
};

export default PatientQueue;
