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
  CloudUpload,
  Loader2Icon,
  Trash,
  CircleCheckBig,
  Circle,
  UserRoundCog,
  RefreshCcw,
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
  ListOldReportModel,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import PatientConsentDialog from "./PatientConsentDialog";
import SendMailDialog from "./SendMailDialog";
import { downloadReportsPdf } from "@/utlis/downloadReportsPdf";
import { Label } from "@/components/ui/label";
import { formatReadableDate } from "@/utlis/calculateAge";
import FileView from "@/components/FileView/FileView";
import DownloadingOverlay from "@/components/ui/CustomComponents/DownloadingOverlay";

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
  const selectedRowSet = React.useMemo(
    () => new Set(selectedRowIds),
    [selectedRowIds]
  );

  const [progress, setProgress] = useState({
    downloadedMB: 0,
    percentage: 0,
    currentFile: "",
  });
  const [isDownloading, setIsDownloading] = useState(false);

  const hasSignedOffReport = (
    ids: number[],
    queue: TechnicianPatientQueue[]
  ) => {
    if (ids.length === 0) {
      return false;
    }
    return ids.every((id) =>
      queue.some(
        (p) =>
          p.refAppointmentId === id &&
          (p.refAppointmentComplete === "Signed Off" ||
            p.refAppointmentComplete === "Signed Off (A)")
      )
    );
  };

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
      case "noteligible":
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
          report: true,
          color: "grey",
          editAccess: ["scribe", "admin", "radiologist", "wgdoctor", "doctor"],
          readOnlyAccess: [],
        };
      }

      if (status === "reportformfill") {
        return {
          text: "Yet to Report",
          report: true,
          color: "grey",
          editAccess: ["scribe", "admin", "radiologist", "wgdoctor", "doctor"],
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
          editAccess: ["scribe", "admin", "wgdoctor", "codoctor", "doctor"],
          readOnlyAccess: ["scribe", "admin", "wgdoctor", "codoctor", "doctor"],
        };
      }

      if (status === "reviewed 2") {
        return {
          text: "Reviewed 2",
          report: true,
          color: "#bf9000",
          editAccess: ["scribe", "admin", "doctor", "wgdoctor", "codoctor"],
          readOnlyAccess: [
            "scribe",
            "admin",
            "technician",
            "wgdoctor",
            "codoctor",
          ],
        };
      }

      if (status === "signed off") {
        return {
          text: "Signed Off",
          report: true,
          color: "#38761d",
          editAccess: ["admin"],
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

      if (status === "signed off (a)") {
        return {
          text: "Signed Off (A)",
          report: true,
          color: "#38761d",
          editAccess: ["admin"],
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

      if (status === "noteligible") {
        return {
          text: "Not Eligible",
          report: true,
          color: "red",
          editAccess: [],
          readOnlyAccess: [],
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

  const statusOptions = [
    "Yet to Report",
    "Predraft",
    "Draft",
    "Reviewed 1",
    "Reviewed 2",
    "Signed Off",
    "Signed Off (A)",
    "Not Eligible",
  ];

  const listAllRemarks = async (appointmentId: number) => {
    setLoading(true);
    try {
      const res = await technicianService.listAllRemarks(appointmentId);
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

  const [SCconsultantStatus, setSCConsultantStatus] = useState(false);
  const [SCconsultantLink, setSCConsultantLink] = useState("");

  const fetchPatientQueue = async () => {
    setLoading(true);
    try {
      if (role?.type == "patient") {
        const res = await appointmentService.listPatientMedicalHistory();
        console.log("res", res);
        if (res.status) {
          setPatientQueue(res.data);
          setSCConsultantStatus(res.consultantStatus);
          setSCConsultantLink(res.consultantLink);
        } else {
          // Handle error or empty data scenario from API response
          console.warn("API response status is false, or no data:", res);
          setPatientQueue([]); // Ensure patientQueue is empty if API indicates failure
        }
      } else {
        const res = await technicianService.listPatientQueue();
        console.log("res", res);
        console.log("PatientQueue.tsx / res / 371 -------------------  ", res);
        if (res.status) {
          const filteredData = res.data.filter(
            (item: TechnicianPatientQueue) => {
              // const { refAppointmentComplete, dicomFiles } = item;
              const { refAppointmentComplete } = item;

              // Always filter out 'fillform'
              if (refAppointmentComplete === "fillform") return true;

              // Filter out 'technologistformfill' if role is not technician
              // if (
              //   refAppointmentComplete === "technologistformfill" &&
              //   role?.type !== "technician" &&
              //   role?.type !== "admin"
              // )
              //   return false;

              // Filter out 'reportformfill' with no DICOMs if not technician
              // if (
              //   refAppointmentComplete === "reportformfill" &&
              //   !dicomFiles &&
              //   role?.type !== "technician" &&
              //   role?.type !== "admin"
              // )
              //   return false;

              // Always filter out 'Predraft'
              // if (
              //   refAppointmentComplete === "Predraft" &&
              //   (role?.type === "technician" || role?.type === "manager")
              // )
              //   return false;

              // // Always filter out 'Draft'
              // if (
              //   refAppointmentComplete === "Draft" &&
              //   (role?.type === "technician" || role?.type === "manager")
              // )
              //   return false;

              // 🔴 NEW: For doctor or codoctor, only allow if status is 'Reviewed 1' or 'Reviewed 2'
              if (
                role?.type === "codoctor" &&
                refAppointmentComplete !== "Reviewed 1" &&
                refAppointmentComplete !== "Reviewed 2" &&
                refAppointmentComplete !== "Signed Off" &&
                refAppointmentComplete !== "Signed Off (A)"
              )
                return false;

              // ✅ Keep the item
              return true;
            }
          );

          setStaffData(res.staffData);
          setPatientQueue(filteredData);
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
      setLoading(true);
      const res = await technicianService.AssignUser(
        appointmentId,
        patientId,
        AssignUserId,
        AssignCustId
      );

      if (res.status) {
        fetchPatientQueue();
        // setPatientQueue(res.data);
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

  const handleAllowOverride = async (appointmentId: number) => {
    const response: {
      status: boolean;
    } = await reportService.allowOverRide(appointmentId);

    if (response.status) {
      // setAllowScan(false);
      fetchPatientQueue();
      return true;
    } else {
      return false;
    }
  };

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

  const handleAllReportsDownload = async () => {
    try {
      setLoading(true);
      const res = await reportService.getPatientReport(selectedRowIds);

      if (res.status && res.data?.length > 0) {
        for (let i = 0; i < res.data.length; i++) {
          const reportData = res.data[i];
          const tempData = patientQueue.find(
            (item) => item.refAppointmentId == reportData.refAppointmentId
          );

          const fileName = `${
            tempData?.refUserCustId && tempData?.refUserCustId.length > 0
              ? tempData?.refUserCustId
              : tempData?.refUserFirstName
          }_${tempData?.refAppointmentDate}_FinalReport`;

          // 🔹 Wait between downloads to prevent blocking
          await new Promise((resolve) => setTimeout(resolve, 300));

          downloadReportsPdf(reportData.refRTCText, fileName);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAllConsentDownload = async () => {
    try {
      setLoading(true);
      const res = await reportService.getPatientConsent(selectedRowIds);

      if (res.status) {
        res.data?.map((reportData) => {
          const tempData = patientQueue.find(
            (item) => item.refAppointmentId == reportData.refAppointmentId
          );

          downloadReportsPdf(
            reportData.refAppointmentConsent,
            `${
              tempData?.refUserCustId && tempData?.refUserCustId.length > 0
                ? tempData?.refUserCustId
                : tempData?.refUserFirstName
            }_${tempData?.refAppointmentDate}_Consent`
          );
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(
    null
  );

  const CheckboxCell = React.memo(
    ({ checked, onClick }: { checked: boolean; onClick: (e: any) => void }) => (
      <Checkbox2 checked={checked} onClick={onClick} />
    )
  );

  const columns = useMemo<ColumnDef<TechnicianPatientQueue>[]>(
    () => [
      {
        accessorKey: "select",
        id: "select",
        enableHiding: true,
        header: ({ table }) => (
          <div className="w-full flex justify-center items-center">
            <Checkbox2
              className="border-[#f1d4d4] bg-[#fff] data-[state=checked]:bg-[#f1d4d4] data-[state=checked]:text-[#b1b8aa] data-[state=checked]:border-[#a4b2a1]"
              checked={
                table.getRowModel().rows.length > 0 &&
                table
                  .getRowModel()
                  .rows.every((row) =>
                    selectedRowSet.has(row.original.refAppointmentId)
                  )
              }
              onCheckedChange={(e) => {
                if (e) {
                  setSelectedRowIds(
                    table
                      .getRowModel()
                      .rows.map((row) => row.original.refAppointmentId)
                  );
                } else {
                  setSelectedRowIds([]);
                }
              }}
            />
          </div>
        ),
        cell: ({ row, table }) => {
          const appointmentId = row.original.refAppointmentId;

          const handleRowSelect = (e: boolean, event: React.MouseEvent) => {
            const visibleRows = table.getRowModel().rows; // ✅ Sorted + Filtered rows

            setSelectedRowIds((prev) => {
              let newSelected = [...prev];

              const currentIndex = visibleRows.findIndex(
                (r) => r.id === row.id
              );

              if (!event.shiftKey) {
                // Normal click
                if (e) {
                  if (!newSelected.includes(appointmentId))
                    newSelected.push(appointmentId);
                } else {
                  newSelected = newSelected.filter(
                    (id) => id !== appointmentId
                  );
                }
                setLastSelectedIndex(currentIndex);
              } else if (lastSelectedIndex !== null) {
                // Shift + click
                const start = Math.min(lastSelectedIndex, currentIndex);
                const end = Math.max(lastSelectedIndex, currentIndex);

                const rangeIds = visibleRows
                  .slice(start, end + 1)
                  .map((r) => r.original.refAppointmentId);

                if (e) {
                  newSelected = Array.from(
                    new Set([...newSelected, ...rangeIds])
                  );
                } else {
                  newSelected = newSelected.filter(
                    (id) => !rangeIds.includes(id)
                  );
                }
              }

              return newSelected;
            });
          };

          return (
            <CheckboxCell
              checked={selectedRowSet.has(appointmentId)}
              onClick={(e) => {
                e.stopPropagation();
                const checked = !selectedRowSet.has(appointmentId);
                handleRowSelect(checked, e);
              }}
            />
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
              onClick={() => {
                // Trigger TanStack sorting logic
                column.toggleSorting(column.getIsSorted() === "asc");

                // ✅ Save sorting state in localStorage
                const sortOrder =
                  column.getIsSorted() === "asc" ? "desc" : "asc";
                localStorage.setItem(
                  "appointmentDateSort",
                  JSON.stringify({
                    id: "dateOfAppointment",
                    desc: sortOrder === "desc",
                  })
                );
              }}
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
                    onSelect={(range) => {
                      column.setFilterValue(range);

                      // ✅ Store in localStorage
                      if (range?.from) {
                        localStorage.setItem(
                          "appointmentDateRange",
                          JSON.stringify({
                            from: range.from.toISOString(),
                            to: range.to ? range.to.toISOString() : null,
                          })
                        );
                      } else {
                        localStorage.removeItem("appointmentDateRange");
                      }
                    }}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>
        ),
        cell: ({ row }) => {
          return (
            <div className="text-center w-auto whitespace-normal break-words">
              {formatReadableDate(row.original.refAppointmentDate)}
            </div>
          ); // Format date for display
        },
        enableColumnFilter: true,
        filterFn: (row, columnId, filterValue) => {
          const value = row.getValue(columnId); // e.g., "2025-12-30"
          if (!value) return true;
          if (typeof value !== "string") return true;

          const [rowYear, rowMonth, rowDay] = value.split("-").map(Number);
          if (!rowYear || !rowMonth || !rowDay) return true;

          const { from, to } = filterValue || {};
          if (!from && !to) return true;

          // Convert selected dates safely
          const fromYear = from ? from.getFullYear() : rowYear;
          const fromMonth = from ? from.getMonth() + 1 : rowMonth;
          const fromDay = from ? from.getDate() : rowDay;

          const toYear = to ? to.getFullYear() : rowYear;
          const toMonth = to ? to.getMonth() + 1 : rowMonth;
          const toDay = to ? to.getDate() : rowDay;

          // Compare as YYYYMMDD numbers
          const rowNum = rowYear * 10000 + rowMonth * 100 + rowDay;
          const fromNum = fromYear * 10000 + fromMonth * 100 + fromDay;
          const toNum = toYear * 10000 + toMonth * 100 + toDay;

          return rowNum >= fromNum && rowNum <= toNum;
        },
      },
      {
        accessorKey: "refSCCustId",
        id: "refSCCustId",
        header: ({ column, table }) => (
          <div className="flex items-center justify-center gap-1">
            {/* ---- Sort Trigger ---- */}
            <span
              className="cursor-pointer text-grey font-semibold"
              onClick={() => {
                // Toggle sorting normally
                column.toggleSorting(column.getIsSorted() === "asc");

                // ✅ Store sorting in localStorage
                const sortOrder =
                  column.getIsSorted() === "asc" ? "desc" : "asc";
                localStorage.setItem(
                  "scanCenterSort",
                  JSON.stringify({
                    id: "refSCCustId",
                    desc: sortOrder === "desc",
                  })
                );
              }}
            >
              <div className="flex gap-x-2 gap-y-0 p-1 justify-center items-center flex-wrap">
                <div>Scan</div>
                <div>Center</div>
              </div>
            </span>

            {/* ---- Filter ---- */}
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
                      {/* ✅ Dynamically get unique Scan Centers */}
                      {Array.from(
                        new Set(
                          table
                            .getCoreRowModel()
                            .rows.map((r) => r.original.refSCCustId)
                        )
                      ).map((scanCenter) => {
                        const current =
                          (column.getFilterValue() as string[]) ?? [];
                        const isSelected = current.includes(scanCenter);

                        return (
                          <CommandItem
                            key={scanCenter}
                            className="flex items-center gap-2 cursor-pointer"
                            onSelect={() => {
                              const current =
                                (column.getFilterValue() as string[]) ?? [];
                              const isSelected = current.includes(scanCenter);

                              const updated = isSelected
                                ? current.filter((id) => id !== scanCenter)
                                : [...current, scanCenter];

                              // ✅ Update filter
                              column.setFilterValue(
                                updated.length ? updated : undefined
                              );

                              // ✅ Save to localStorage
                              if (updated.length) {
                                localStorage.setItem(
                                  "selectedScanCenters",
                                  JSON.stringify(updated)
                                );
                              } else {
                                localStorage.removeItem("selectedScanCenters");
                              }
                            }}
                          >
                            <Checkbox2
                              checked={isSelected}
                              onCheckedChange={() => {}}
                            />
                            <span>{scanCenter}</span>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </Command>

                  <Button
                    variant="ghost"
                    onClick={() => {
                      column.setFilterValue(undefined);
                      localStorage.removeItem("selectedScanCenters");
                    }}
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

        cell: ({ row }) => <span>{row.original.refSCCustId}</span>,

        enableColumnFilter: true,

        // ✅ Filter logic for multiple selections
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue || !Array.isArray(filterValue)) return true;
          const value = row.getValue(columnId);
          return filterValue.includes(value);
        },
      },
      {
        accessorKey: "refUserCustId",
        id: "refUserCustId",
        header: ({ column }) => (
          <div className="flex items-center justify-center gap-1">
            {/* ---- Sort Trigger ---- */}
            <span
              className="cursor-pointer font-semibold"
              onClick={() => {
                // Toggle sorting
                column.toggleSorting(column.getIsSorted() === "asc");

                // ✅ Save sort order to localStorage
                const sortOrder =
                  column.getIsSorted() === "asc" ? "desc" : "asc";
                localStorage.setItem(
                  "patientIdSort",
                  JSON.stringify({
                    id: "refUserCustId",
                    desc: sortOrder === "desc",
                  })
                );
              }}
            >
              <div className="flex gap-x-2 gap-y-0 p-1 justify-center items-center flex-wrap">
                <div>Patient</div>
                <div>ID</div>
              </div>
            </span>

            {/* ---- Filter ---- */}
            {column.getCanFilter() && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="hover:bg-transparent hover:text-gray-200 !p-0"
                  >
                    <Filter />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2">
                  <Input
                    placeholder="Filter Patient ID..."
                    value={(column.getFilterValue() ?? "") as string}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      const value = event.target.value;
                      column.setFilterValue(value);

                      // ✅ Save search value in localStorage
                      if (value) {
                        localStorage.setItem("patientIdFilter", value);
                      } else {
                        localStorage.removeItem("patientIdFilter");
                      }
                    }}
                    className="max-w-sm"
                  />

                  <Button
                    variant="ghost"
                    onClick={() => {
                      column.setFilterValue(undefined);
                      localStorage.removeItem("patientIdFilter");
                    }}
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

        cell: ({ row }) => (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex w-full px-1 items-center justify-center">
                  <Label className="max-w-15 2xl:max-w-30 truncate">
                    {row.original.refUserCustId}
                  </Label>
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs" side="bottom">
                {row.original.refUserCustId}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ),

        enableColumnFilter: true,
      },
      {
        accessorKey: "refUserFirstName",
        id: "refUserFirstName",
        header: ({ column }) => (
          <div className="flex items-center justify-center gap-1">
            {/* ---- Sort Trigger ---- */}
            <span
              className="cursor-pointer font-semibold"
              onClick={() => {
                // Toggle sorting
                column.toggleSorting(column.getIsSorted() === "asc");

                // ✅ Save sorting in localStorage
                const sortOrder =
                  column.getIsSorted() === "asc" ? "desc" : "asc";
                localStorage.setItem(
                  "patientNameSort",
                  JSON.stringify({
                    id: "refUserFirstName",
                    desc: sortOrder === "desc",
                  })
                );
              }}
            >
              <div className="flex gap-x-2 gap-y-0 p-1 justify-center items-center flex-wrap">
                <div>Name</div>
              </div>
            </span>

            {/* ---- Filter ---- */}
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
                    placeholder="Filter Patient Name..."
                    value={(column.getFilterValue() ?? "") as string}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      const value = event.target.value;
                      column.setFilterValue(value);

                      // ✅ Save search value in localStorage
                      if (value) {
                        localStorage.setItem("patientNameFilter", value);
                      } else {
                        localStorage.removeItem("patientNameFilter");
                      }
                    }}
                    className="max-w-sm"
                  />

                  <Button
                    variant="ghost"
                    onClick={() => {
                      column.setFilterValue(undefined);
                      localStorage.removeItem("patientNameFilter");
                    }}
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

        /* ---- Cell UI ---- */
        cell: ({ row }) => (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex w-full px-1 items-center justify-center">
                  <Label className="max-w-15 2xl:max-w-30 truncate">
                    {row.original.refUserFirstName}
                  </Label>
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs" side="bottom">
                {row.original.refUserFirstName}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ),

        enableColumnFilter: true,
      },
      {
        accessorKey: "consentView",
        accessorFn: (row) => {
          const isNotStarted =
            getPatientFormName(row.refCategoryId) === "Not Yet Started";

          return isNotStarted ? "None" : "Signed";
        },

        id: "consentView",

        header: ({ column }) => (
          <div className="flex items-center justify-center gap-1">
            {/* ---- Sort ---- */}
            <span
              className="cursor-pointer font-semibold"
              onClick={() => {
                const isAsc = column.getIsSorted() === "asc";

                // Toggle sorting
                column.toggleSorting(isAsc);

                // Save new sort order
                const newSort = isAsc ? "desc" : "asc";

                localStorage.setItem(
                  "consentSortOrder",
                  JSON.stringify({
                    id: "consentView",
                    desc: newSort === "desc",
                  })
                );
              }}
            >
              Consent
            </span>

            {/* ---- Filter ---- */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="!p-0 hover:bg-transparent hover:text-gray-500"
                >
                  <Filter size={16} />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-48 p-2">
                <Command>
                  <CommandGroup className="max-h-60 overflow-auto">
                    {["Signed", "None"].map((option) => {
                      const current =
                        (column.getFilterValue() as string[]) ?? [];
                      const checked = current.includes(option);

                      return (
                        <CommandItem
                          key={option}
                          className="flex items-center gap-2 cursor-pointer"
                          onSelect={() => {
                            const updated = checked
                              ? current.filter((v) => v !== option)
                              : [...current, option];

                            // Set filter
                            column.setFilterValue(
                              updated.length ? updated : undefined
                            );

                            // Save to localStorage
                            if (updated.length) {
                              localStorage.setItem(
                                "consentFilter",
                                JSON.stringify(updated)
                              );
                            } else {
                              localStorage.removeItem("consentFilter");
                            }
                          }}
                        >
                          <Checkbox2 checked={checked} />
                          <span>{option}</span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </Command>

                {/* Clear Filter */}
                <Button
                  variant="ghost"
                  onClick={() => {
                    column.setFilterValue(undefined);
                    localStorage.removeItem("consentFilter");
                    localStorage.removeItem("consentSortOrder");
                  }}
                  className="mt-2 text-red-500 hover:text-red-700 flex items-center gap-1"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Clear</span>
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        ),

        /* ---- CELL ---- */
        cell: ({ row }) => {
          const appointmentId = row.original.refAppointmentId;
          // State for Consent Dialog (GLOBAL in component)
          const [consentDialogOpen, setConsentDialogOpen] = useState(false);
          const [selectedAppointmentIds, setSelectedAppointmentIds] = useState<
            number[]
          >([]);

          if (row.original.refAppointmentComplete === "fillform") {
            return <div>-</div>;
          }

          return (
            <>
              <div
                className={`hover:underline cursor-pointer font-bold text-center ${
                  getPatientFormName(row.original.refCategoryId) ===
                  "Not Yet Started"
                    ? "text-[#999999]"
                    : ""
                }`}
                onClick={() => {
                  setSelectedAppointmentIds([appointmentId]);
                  setConsentDialogOpen(true);
                }}
              >
                View
              </div>

              {consentDialogOpen && (
                <Dialog
                  open={consentDialogOpen}
                  onOpenChange={setConsentDialogOpen}
                >
                  <PatientConsentDialog
                    appointmentIds={selectedAppointmentIds}
                    patientConsentDialog={consentDialogOpen}
                    appointmentDate={row.original.refAppointmentDate}
                    patientCustId={
                      (row.original.refUserCustId &&
                      row.original.refUserCustId.length > 0
                        ? row.original.refUserCustId
                        : row.original.refUserFirstName) ??
                      (user?.refUserCustId && user?.refUserCustId.length > 0
                        ? user?.refUserCustId
                        : user?.refUserFirstName)
                    }
                  />
                </Dialog>
              )}
            </>
          );
        },

        /* ---- FILTER FUNCTION ---- */
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue || filterValue.length === 0) return true;
          const value = row.getValue(columnId);
          return filterValue.includes(value);
        },

        enableColumnFilter: true,
      },
      {
        accessorFn: (row) => getPatientFormName(row.refCategoryId),
        id: "patientFormAndStatus",
        header: ({ column }) => (
          <div className="flex justify-center items-center gap-1 font-semibold">
            {/* 🔹 Click header to sort */}
            <span
              className="cursor-pointer"
              onClick={() => {
                column.toggleSorting(column.getIsSorted() === "asc");

                // ✅ Save sort order to localStorage
                const sortOrder =
                  column.getIsSorted() === "asc" ? "desc" : "asc";
                localStorage.setItem(
                  "patientFormAndStatus_sortOrder",
                  sortOrder
                );
              }}
            >
              Form
            </span>

            {/* 🔹 Filter Popover */}
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

                                const newValue = updated.length
                                  ? updated
                                  : undefined;
                                column.setFilterValue(newValue);

                                // ✅ Save filter to localStorage
                                localStorage.setItem(
                                  "patientFormAndStatus_filter",
                                  JSON.stringify(newValue ?? [])
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

                  {/* 🔹 Clear Filter Button */}
                  <Button
                    variant="ghost"
                    onClick={() => {
                      column.setFilterValue(undefined);
                      localStorage.removeItem("patientFormAndStatus_filter");
                    }}
                    className="mt-2 text-red-500 hover:text-red-700 flex items-center gap-1"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>Clear Filter</span>
                  </Button>
                </PopoverContent>
              </Popover>
            )}
          </div>
        ),
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
            // <span className="text-muted-foreground">Not Filled</span>
            <div className="flex gap-x-2 gap-y-0 p-1 justify-center items-center flex-wrap">
              <div>Not</div>
              <div>Filled</div>
            </div>
          );

          if (formStatus) {
            statusContent = (
              <button
                className="hover:underline cursor-pointer font-bold text-center"
                onClick={() =>
                  navigate("/patientInTakeForm", {
                    state: {
                      fetchFormData: true,
                      appointmentId: row.original.refAppointmentId,
                      userId,
                      readOnly: true,
                      name:
                        row.original.refUserFirstName ?? user?.refUserFirstName,
                      custId: row.original.refUserCustId ?? user?.refUserCustId,
                      scancenterCustId: row.original.refSCCustId,
                      OverrideStatus: row.original.refOverrideStatus,
                      categoryId: row.original.refCategoryId,
                    },
                  })
                }
              >
                View
              </button>
            );
          } else if (
            // currentUserRole === "patient" &&
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
          // else if (
          //   // currentUserRole === "patient" &&
          //   appointmentComplete === "fillform"
          // ) {
          //   statusContent = (
          //     <button
          //       className="hover:underline cursor-pointer font-bold"
          //       onClick={() => {
          //         setIsEditDialogBroucherOpen(true);
          //       }}
          //     >
          //       Start
          //     </button>
          //   );
          // }

          return (
            <div className="flex flex-wrap justify-center items-center text-center">
              {(formName !== "Not Yet Started" || role?.type === "patient") && (
                <span className="font-xs flex flex-wrap justify-center items-center gap-x-2 gap-y-0 text-center">
                  {appointmentComplete === "noteligible" ? (
                    <>
                      <span className="text-center" style={{ color: "red" }}>
                        Not
                      </span>
                      <span className="text-center" style={{ color: "red" }}>
                        Eligible
                      </span>
                    </>
                  ) : (
                    <span className="text-center">{formName}</span>
                  )}
                </span>
              )}
              {(formName !== "Not Yet Started" || role?.type === "patient") && (
                <span className="text-center">&nbsp;-&nbsp;</span>
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
                    viewStatus={true}
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
                    onSubmit={(consent) => {
                      const now = new Date();
                      const formatted =
                        now.getFullYear() +
                        "-" +
                        String(now.getMonth() + 1).padStart(2, "0") +
                        "-" +
                        String(now.getDate()).padStart(2, "0") +
                        " " +
                        String(now.getHours()).padStart(2, "0") +
                        ":" +
                        String(now.getMinutes()).padStart(2, "0") +
                        ":" +
                        String(now.getSeconds()).padStart(2, "0");

                      localStorage.setItem("patientIntakeStartTime", formatted);
                      navigate("/patientInTakeForm", {
                        state: {
                          fetchFormData: false,
                          appointmentId: row.original.refAppointmentId,
                          userId,
                          readOnly: false,
                          name:
                            row.original.refUserFirstName ??
                            user?.refUserFirstName,
                          custId:
                            row.original.refUserCustId ?? user?.refUserCustId,
                          scancenterCustId: row.original.refSCCustId,
                          consent: consent,
                          OverrideStatus: row.original.refOverrideStatus,
                        },
                      });
                    }}
                    scId={row.original.refSCId}
                    viewStatus={true}
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
        accessorFn: (row) => {
          const tempStatus = getFormStatus(row.refAppointmentComplete);
          const formStatus = tempStatus?.technicianForm;
          const appointmentComplete = row.refAppointmentComplete;

          if (formStatus) {
            return "View";
          } else if (
            (currentUserRole === "technician" || currentUserRole === "admin") &&
            (appointmentComplete === "fillform" ||
              appointmentComplete === "noteligible")
          ) {
            return "Not Yet Started";
          } else if (
            currentUserRole === "technician" ||
            currentUserRole === "admin"
          ) {
            return "Start";
          } else {
            return "Not Filled";
          }
        },
        header: ({ column }) => (
          <div className="flex items-center justify-center gap-1">
            {/* 🔹 Sort header */}
            <div
              onClick={() => {
                column.toggleSorting(column.getIsSorted() === "asc");

                // ✅ Save sorting to localStorage
                const sortOrder =
                  column.getIsSorted() === "asc" ? "desc" : "asc";
                localStorage.setItem("technicianForm_sortOrder", sortOrder);
              }}
              className="flex gap-x-2 gap-y-0 p-1 justify-center items-center flex-wrap cursor-pointer"
            >
              <div>Tech</div>
              <div>Form</div>
            </div>

            {/* 🔹 Filter dropdown */}
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
                  const current = column.getFilterValue();
                  const isSelected = current === value;

                  return (
                    <div
                      key={value}
                      className="flex items-center gap-2 cursor-pointer py-1"
                      onClick={() => {
                        const newValue = isSelected ? undefined : value;
                        column.setFilterValue(newValue);

                        // ✅ Save filter to localStorage
                        localStorage.setItem(
                          "technicianForm_filter",
                          JSON.stringify(newValue ?? "")
                        );
                      }}
                    >
                      <Checkbox2 checked={isSelected} />
                      <span>{option}</span>
                    </div>
                  );
                })}

                {/* 🔹 Clear filter button */}
                <Button
                  variant="ghost"
                  className="mt-2 text-red-500 hover:text-red-700 flex items-center gap-1"
                  onClick={() => {
                    column.setFilterValue(undefined);
                    localStorage.removeItem("technicianForm_filter");
                  }}
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
                  className={`hover:underline cursor-pointer font-bold ${
                    row.original.patientPrivatePublicStatus !== "private"
                      ? `text-[#3c78d8]`
                      : ``
                  }`}
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
                        overrideStatus: row.original.refOverrideStatus,
                      },
                    })
                  }
                >
                  View
                </button>
              </span>
            );
          } else if (
            // (currentUserRole === "technician" || currentUserRole === "admin") &&
            appointmentComplete === "fillform" ||
            appointmentComplete === "noteligible"
          ) {
            // Form not started but technician has access and status is 'fillform'
            return (
              <div className="flex gap-x-1 gap-y-0 p-1 justify-center text-sm items-center flex-wrap">
                <div>Not</div>
                <div>Yet</div>
                <div>Started</div>
              </div>
            );
          } else {
            // Not filled yet and technician has access
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
                        name: row.original.refUserFirstName,
                        custId: row.original.refUserCustId,
                        scancenterCustId: row.original.refSCCustId,
                        readOnly: false,
                        overrideStatus: row.original.refOverrideStatus,
                      },
                    })
                  }
                >
                  Start
                </button>
              </span>
            );
          }
          // else {
          //   // Not filled and no write access
          //   return <div className="text-muted-foreground">Not Filled</div>;
          // }
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
              <span className="px-4 border-r border-gray-500">R</span>
              <span className="px-4">L</span>
            </div>
          </div>
        ),
        cell: ({ row }) => {
          const dicomFiles = row.original.dicomFiles as DicomFiles[];
          const appointmentId = row.original.refAppointmentId;
          const userId = row.original.refUserId;
          // const isTechnician = currentUserRole === "technician" || "admin";

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
              <div className="flex justify-center gap-2 items-center text-sm text-center">
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
                          .join("_") + "_R.zip",
                        setProgress,
                        setIsDownloading
                      )
                    }
                    className="hover:bg-[#d4d5ca]"
                  >
                    ({rightCount})<Download />
                    <span className="sr-only">Right DICOM</span>
                  </Button>
                ) : (
                  <span className="w-10 text-muted-foreground">-</span>
                )}

                <div className="h-5 w-px bg-gray-400" />

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
                          .join("_") + "_L.zip",
                        setProgress,
                        setIsDownloading
                      )
                    }
                    className="hover:bg-[#d4d5ca]"
                  >
                    ({leftCount})<Download />
                    <span className="sr-only">Left DICOM</span>
                  </Button>
                ) : (
                  <span className="w-10 text-muted-foreground">-</span>
                )}
              </div>
            );
          }

          if (!hasDicom) {
            return (
              <div className="text-muted-foreground text-center text-xs w-full">
                Not Uploaded
              </div>
            );
          }

          return <div className="text-center w-full">-</div>;
        },
      },
      {
        id: "dicomFull",
        accessorFn: (row) => {
          const dicomFiles = row.dicomFiles || [];

          // Correct & stable: check count > 0
          const hasDicom = dicomFiles.length > 0;

          return hasDicom ? "1" : "0";
        },
        header: ({ column }) => (
          <div className="flex items-center justify-center gap-2">
            {/* ---- Sort ---- */}
            <span
              className="cursor-pointer"
              onClick={() => {
                const prev = column.getIsSorted();
                column.toggleSorting(prev === "asc");

                const next = prev === "asc" ? "desc" : "asc";

                localStorage.setItem(
                  "dicom_sort",
                  JSON.stringify({ id: "dicomFull", desc: next === "desc" })
                );
              }}
            >
              DICOM
            </span>

            {/* ---- Filter ---- */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="!p-0 hover:bg-transparent">
                  <Filter />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-56 p-2">
                <Command>
                  <CommandGroup>
                    {[
                      { label: "View DICOM", value: "1" },
                      { label: "Upload DICOM", value: "0" },
                    ].map((item) => {
                      const current =
                        (column.getFilterValue() as string[]) ?? [];

                      const isSelected = current.includes(item.value);

                      return (
                        <CommandItem
                          key={item.value}
                          onSelect={() => {
                            const updated = isSelected
                              ? current.filter((v) => v !== item.value)
                              : [...current, item.value];

                            column.setFilterValue(
                              updated.length ? updated : undefined
                            );

                            if (updated.length)
                              localStorage.setItem(
                                "dicom_filter",
                                JSON.stringify(updated)
                              );
                            else localStorage.removeItem("dicom_filter");
                          }}
                          className="flex gap-2 items-center"
                        >
                          <Checkbox2 checked={isSelected} />
                          <span>{item.label}</span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </Command>

                <Button
                  variant="ghost"
                  className="mt-2 text-red-500 flex gap-1"
                  onClick={() => {
                    column.setFilterValue(undefined);
                    localStorage.removeItem("dicom_filter");
                  }}
                >
                  <XCircle className="h-4 w-4" /> Clear
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        ),
        cell: ({ row }) => {
          const dicomFiles = row.original.dicomFiles as DicomFiles[];
          const appointmentId = row.original.refAppointmentId;
          const userId = row.original.refUserId;
          // const isTechnician = currentUserRole === "technician" || "admin";

          const leftDicom = dicomFiles?.find((f) => f.refDFSide === "Left");
          const rightDicom = dicomFiles?.find((f) => f.refDFSide === "Right");

          const hasDicom = leftDicom || rightDicom;

          if (
            // isTechnician &&
            !hasDicom
            // row.original.refAppointmentComplete === "reportformfill"
          ) {
            return (
              <div className="text-center p-1">
                <button
                  className="hover:underline flex justify-center items-center flex-wrap gap-2 cursor-pointer text-xs font-bold"
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
                  <div>Upload</div>
                  <div>DICOM</div>
                </button>
              </div>
            );
          } else if (hasDicom) {
            return (
              <div className="text-center p-1">
                <button
                  className="hover:underline flex justify-center items-center flex-wrap gap-1 cursor-pointer text-xs font-bold"
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
                  <div>View</div>
                  <div>DICOM</div>
                </button>
              </div>
            );
          }

          // else {
          //   return <div className="text-center w-full">-</div>;
          // }
        },
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue || filterValue.length === 0) return true;

          const value = row.getValue(columnId); // always "1" or "0"

          return filterValue.includes(value);
        },
      },

      {
        id: "oldreport",
        header: () => (
          <div className="flex items-center justify-center gap-1">
            <div className="flex gap-x-2 gap-y-0 p-1 justify-center items-center flex-wrap cursor-pointer">
              <div>Old</div>
              <div>Report</div>
            </div>
          </div>
        ),
        cell: ({ row }) => {
          const [dialogOpen, setDialogOpen] = useState(false);
          const [reportData, setReportData] = useState<ListOldReportModel[]>(
            []
          );

          const [OldLoading, setOldLoading] = useState(false);
          const menuOptions = [
            {
              label: "Thermogram",
              indexVal: 1,
            },
            {
              label: "Mammogram",
              indexVal: 2,
            },
            {
              label: "Breast Ultrasound / HERscan",
              indexVal: 3,
            },
            {
              label: "Breast MRI",
              indexVal: 4,
            },
            {
              label: "PET/CT Scan",
              indexVal: 5,
            },
            {
              label: "QT Imaging",
              indexVal: 6,
            },
            {
              label:
                "Other Imaging or Scans ( Like Bone scans, Scintimammography, etc)",
              indexVal: 7,
            },
            {
              label: "Biopsy Report",
              indexVal: 8,
            },
            {
              label: "Other Report",
              indexVal: 9,
            },
          ];

          const [currentOpen, setCurrentOpen] = useState(1);

          const ListAllOldReport = async (
            appointmentId: number,
            patientId: number,
            categoryId: number
          ) => {
            setCurrentOpen(categoryId);
            setOldLoading(true);
            const response = await technicianService.listOldReport(
              appointmentId,
              patientId,
              categoryId
            );

            if (response.status) {
              console.log("\n\n\nresponse\n\n", response);
              setReportData(response.data || []);
            }
            setOldLoading(false);
          };

          const handleFileChange = async (
            e: React.ChangeEvent<HTMLInputElement>,
            appointmentId: number,
            patientId: number,
            categoryId: number
          ) => {
            setOldLoading(true);
            const files = e.target.files;
            if (!files) return;

            for (const file of files) {
              try {
                const response = await technicianService.uploadOldReportFile({
                  file,
                  appointmentId,
                  patientId,
                  categoryId,
                });

                if (response) {
                  setPatientQueue((prevQueue) =>
                    prevQueue.map((item) =>
                      item.refAppointmentId === appointmentId
                        ? {
                            ...item,
                            OldReportCount: String(
                              (item.OldReportCount
                                ? parseInt(item.OldReportCount)
                                : 0) + 1
                            ),
                          }
                        : item
                    )
                  );
                  console.log("response", response);
                  console.log("Uploaded:", response.viewURL);
                  // Update UI or form data here if needed
                } else {
                  console.error("Upload failed for:", file.name);
                }
              } catch (error) {
                console.error("Error uploading file:", file.name, error);
              }
            }

            ListAllOldReport(appointmentId, patientId, categoryId);
            setOldLoading(false);
          };

          const handleDeleteFile = async (
            ORId: number,
            appointmentId: number,
            patientId: number,
            categoryId: number
          ) => {
            setOldLoading(true);

            await technicianService.deleteOldReportFile(ORId);

            ListAllOldReport(appointmentId, patientId, categoryId);
          };

          return (
            <div className="flex items-center cursor-pointer justify-center gap-1">
              <CloudUpload
                onClick={() => {
                  setDialogOpen(true);
                  ListAllOldReport(
                    row.original.refAppointmentId,
                    row.original.refUserId,
                    1
                  );
                }}
                size={20}
              />
              {row.original.OldReportCount !== "0" && (
                <Label>{row.original.OldReportCount}</Label>
              )}
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="w-[98%] lg:w-[90%] h-[90vh]">
                  <DialogHeader>
                    <DialogTitle>Upload Old Report</DialogTitle>
                  </DialogHeader>
                  <div className="w-full h-[78vh] flex">
                    <div className="w-[30%] h-[78vh] p-3 bg-[#a4b2a1] rounded-l-lg overflow-y-auto">
                      {menuOptions.map((data) => (
                        <div
                          onClick={() => {
                            // setCurrentOpen(data.indexVal);
                            ListAllOldReport(
                              row.original.refAppointmentId,
                              row.original.refUserId,
                              data.indexVal
                            );
                          }}
                          className={`w-[100%] flex gap-2 cursor-pointer p-3 ${
                            currentOpen === data.indexVal
                              ? `bg-[#f8f3eb] rounded-lg text-[#a4b2a1]`
                              : `text-[#ffffff]`
                          }`}
                        >
                          <div>
                            {currentOpen === data.indexVal ? (
                              <CircleCheckBig size={20} />
                            ) : (
                              <Circle size={20} />
                            )}
                          </div>
                          <div>{data.label}</div>
                        </div>
                      ))}
                    </div>
                    <div
                      className={`w-[70%] h-[78vh] bg-[#f8e3e1] rounded-r-lg overflow-y-auto ${
                        OldLoading ? `flex justify-center items-center` : ``
                      } `}
                    >
                      {OldLoading ? (
                        <Loader2Icon
                          size={25}
                          className="animate-spin  text-[#3f3f3d]"
                        />
                      ) : (
                        <>
                          <div className="text-lg my-2 font-bold text-[#3f3f3d] text-center">
                            {
                              menuOptions.find(
                                (option) => option.indexVal === currentOpen
                              )?.label
                            }
                          </div>

                          <div className=" flex gap-1 px-3 ">
                            <Label className="text-xs font-bold">
                              UPLOAD REPORT
                            </Label>

                            <label className="cursor-pointer border px-3 py-1 rounded bg-white hover:bg-gray-100 w-fit">
                              <input
                                type="file"
                                accept=".pdf, .jpg, .jpeg, .png"
                                className="sr-only"
                                multiple
                                onChange={(e) => {
                                  handleFileChange(
                                    e,
                                    row.original.refAppointmentId,
                                    row.original.refUserId,
                                    currentOpen
                                  );
                                }}
                              />
                              Upload File
                            </label>
                          </div>

                          <div className="space-y-2 px-2 lg:px-10 my-5">
                            {reportData.length > 0 ? (
                              <>
                                {reportData.map((file, index) => {
                                  const displayName =
                                    file.refORFilename.split("/").pop() ||
                                    "unknown_file";

                                  return (
                                    <div
                                      key={index}
                                      className="bg-[#f9f4ed] rounded-lg px-0 lg:px-2 py-2 w-[80%] md:w-[60%] lg:w-[100%] flex justify-between items-center gap-3 text-sm font-medium pointer-events-auto"
                                    >
                                      <FileView
                                        displayName={displayName}
                                        fileUrl={file.refORFilename}
                                      />

                                      <div
                                        className="cursor-pointer"
                                        onClick={() => {
                                          handleDeleteFile(
                                            file.refORId,
                                            row.original.refAppointmentId,
                                            row.original.refUserId,
                                            currentOpen
                                          );
                                          setPatientQueue((prevQueue) =>
                                            prevQueue.map((item) =>
                                              item.refAppointmentId ===
                                              row.original.refAppointmentId
                                                ? {
                                                    ...item,
                                                    OldReportCount: String(
                                                      (item.OldReportCount
                                                        ? parseInt(
                                                            item.OldReportCount
                                                          )
                                                        : 0) - 1
                                                    ),
                                                  }
                                                : item
                                            )
                                          );
                                        }}
                                      >
                                        <Trash
                                          size={15}
                                          className="text-red-500"
                                        />
                                      </div>
                                    </div>
                                  );
                                })}
                              </>
                            ) : (
                              <div>No Report Uploaded</div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          );
        },
      },

      {
        id: "reportStatus",
        accessorFn: (row) => row.reportStatus ?? "-",
        header: ({ column }) => (
          <div className="flex items-center justify-center gap-1">
            {/* 🔹 Sort header */}
            <div
              onClick={() => {
                column.toggleSorting(column.getIsSorted() === "asc");

                // ✅ Save sorting to localStorage
                const sortOrder =
                  column.getIsSorted() === "asc" ? "desc" : "asc";
                localStorage.setItem("reportStatus_sortOrder", sortOrder);
              }}
              className="flex gap-x-2 gap-y-0 p-1 justify-center items-center flex-wrap cursor-pointer"
            >
              <div>Report</div>
            </div>

            {/* 🔹 Filter dropdown */}
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
                  const isSelected = column.getFilterValue() === value;

                  return (
                    <div
                      key={value}
                      className="flex items-center gap-2 cursor-pointer py-1"
                      onClick={() => {
                        const newValue = isSelected ? undefined : value;
                        column.setFilterValue(newValue);

                        // ✅ Save filter to localStorage
                        localStorage.setItem(
                          "reportStatus_filter",
                          JSON.stringify(newValue ?? "")
                        );
                      }}
                    >
                      <Checkbox2 checked={isSelected} />
                      <span>{option}</span>
                    </div>
                  );
                })}

                {/* 🔹 Clear filter button */}
                <Button
                  variant="ghost"
                  className="mt-2 text-red-500 hover:text-red-700 flex items-center gap-1"
                  onClick={() => {
                    column.setFilterValue(undefined);
                    localStorage.removeItem("reportStatus_filter");
                  }}
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
              if (status && accessId === currentUserId) {
                // Direct edit access
                navigate("/report", {
                  state: {
                    appointmentId: row.original.refAppointmentId,
                    userId: row.original.refUserId,
                    readOnly: false,
                    categoryId: row.original.refCategoryId,
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
              if (role === "patient") {
                setPatientReportDialog(true);
              } else {
                navigate("/report", {
                  state: {
                    appointmentId: row.original.refAppointmentId,
                    userId: row.original.refUserId,
                    readOnly: true,
                    categoryId: row.original.refCategoryId,
                  },
                });
              }
              // }
            } else {
              const { status, accessId, custId } = await handleCheckAccess(
                row.original.refAppointmentId
              );
              setCurrentAccess(custId);
              if (status && accessId === currentUserId) {
                // Direct edit access
                navigate("/report", {
                  state: {
                    appointmentId: row.original.refAppointmentId,
                    userId: row.original.refUserId,
                    readOnly: false,
                    categoryId: row.original.refCategoryId,
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
            }
          };

          return (
            <div
              className={`text-center ${
                row.original.reportStatus === "Urgent" ? "text-[red]" : ""
              } w-full`}
            >
              {/* !row.original.dicomFiles ||
              row.original.dicomFiles.length === 0 ? (
                <span>-</span>
              ) : */}
              {row.original.refAppointmentComplete === "reportformfill" ? (
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
                              categoryId: row.original.refCategoryId,
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
                              categoryId: row.original.refCategoryId,
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
                              categoryId: row.original.refCategoryId,
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
                    appointmentDate={row.original.refAppointmentDate}
                    appointmentId={row.original.refAppointmentId}
                    patientReportDialog={patientReportDialog}
                  />
                </Dialog>
              )}
            </div>
          );
        },
        filterFn: (row, _columnId, value) => {
          const tempStatus = getFormStatus(row.original.refAppointmentComplete);
          const filled = tempStatus?.technicianForm === true;
          return value === "filled" ? filled : !filled;
        },
        enableColumnFilter: true,
      },

      {
        id: "refAppointmentComplete",
        accessorFn: (row) => getStatus(row.refAppointmentComplete)?.text ?? "-",
        header: ({ column, table }) => {
          const handleSort = () => {
            // Toggle sorting and save state
            column.toggleSorting(column.getIsSorted() === "asc");
            const currentSort = column.getIsSorted() === "asc" ? "desc" : "asc";
            localStorage.setItem("appointmentStatus_sortOrder", currentSort);
          };

          const handleFilterChange = (updated: any) => {
            // Save filter to localStorage
            if (updated?.length) {
              column.setFilterValue(updated.length ? updated : undefined);
              localStorage.setItem(
                "appointmentStatus_filter",
                JSON.stringify(updated)
              );
            } else {
              column.setFilterValue(undefined);
              localStorage.removeItem("appointmentStatus_filter");
            }
          };

          const handleClear = () => {
            column.setFilterValue(undefined);
            localStorage.removeItem("appointmentStatus_filter");
            localStorage.removeItem("appointmentStatus_sortOrder");
            table.setSorting([]); // clear sorting
          };

          return (
            <div className="flex items-center justify-center gap-1">
              <div
                onClick={handleSort}
                className="flex gap-x-2 gap-y-0 p-1 justify-center items-center flex-wrap cursor-pointer"
              >
                <div>Report</div>
                <div>Status</div>
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="hover:bg-transparent hover:text-gray-200 !p-0"
                  >
                    <Filter />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-2">
                  <Command>
                    <CommandGroup className="max-h-60 overflow-auto">
                      {statusOptions.map((statusLabel) => {
                        const current =
                          (column.getFilterValue() as string[]) ?? [];

                        const isSelected = current.includes(statusLabel);
                        return (
                          <CommandItem
                            key={statusLabel}
                            className="flex items-center gap-2 cursor-pointer"
                            onSelect={() => {
                              const updated = isSelected
                                ? current.filter((s) => s !== statusLabel)
                                : [...current, statusLabel];
                              handleFilterChange(updated);
                            }}
                          >
                            <Checkbox2
                              checked={isSelected}
                              onCheckedChange={() => {}}
                            />
                            <span>{statusLabel}</span>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </Command>

                  <Button
                    variant="ghost"
                    onClick={handleClear}
                    className="mt-2 text-red-500 hover:text-red-700 flex items-center gap-1"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>Clear</span>
                  </Button>
                </PopoverContent>
              </Popover>
            </div>
          );
        },
        cell: ({ row }) => {
          const status = getStatus(row.original.refAppointmentComplete);
          const [allowScan, setAllowScan] = useState(false);
          return (
            <div
              className="text-center flex flex-wrap justify-center items-center gap-1 uppercase text-xs font-semibold break-words"
              style={{ color: status?.color }}
            >
              {status?.text === "Signed Off" ? (
                <>
                  <div>Signed</div>
                  <div>Off</div>
                </>
              ) : status?.text === "Signed Off (A)" ? (
                <>
                  <div>Signed</div>
                  <div>Off</div>
                  <div>(A)</div>
                </>
              ) : status?.text === "Yet to Report" ? (
                <>
                  <div>Yet</div>
                  <div>To</div>
                  <div>Report</div>
                </>
              ) : status?.text === "Reviewed 1" ? (
                <>
                  <div>Reviewed</div>
                  <div>1</div>
                </>
              ) : status?.text === "Reviewed 2" ? (
                <>
                  <div>Reviewed</div>
                  <div>2</div>
                </>
              ) : status?.text === "Not Eligible" ? (
                <>
                  <div>Not</div>
                  <div>Eligible</div>
                  {role?.type === "admin" ||
                  role?.type === "scadmin" ||
                  role?.type === "technician" ? (
                    <>
                      <br />{" "}
                      <div
                        onClick={() => {
                          setAllowScan(true);
                        }}
                        className="text-[#364153] justify-center items-center flex flex-wrap gap-1 text-xs font-bold cursor-pointer hover:underline"
                      >
                        <div>Allow</div>
                        <div>Scan</div>
                      </div>
                      <Dialog open={allowScan} onOpenChange={setAllowScan}>
                        <DialogContent className="sm:max-w-[400px] ">
                          <DialogHeader>
                            <DialogTitle className="mt-2">
                              Do you want to allow patient{" "}
                              {row.original.refUserCustId}'s scan to be
                              processed?
                            </DialogTitle>
                          </DialogHeader>

                          <DialogFooter className="mt-4">
                            <DialogClose asChild>
                              <Button variant="outline">No</Button>
                            </DialogClose>
                            <Button
                              variant="greenTheme"
                              onClick={async () => {
                                const allowed = await handleAllowOverride(
                                  row.original.refAppointmentId
                                );
                                if (allowed) {
                                  setAllowScan(false);
                                }
                              }}
                            >
                              Confirm
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </>
                  ) : (
                    ``
                  )}
                </>
              ) : (
                status?.text
              )}
            </div>
          );
        },
        filterFn: (row, _columnId, filterValue) => {
          const statusText =
            getStatus(row.original.refAppointmentComplete)?.text ?? "-";

          if (
            !filterValue ||
            !Array.isArray(filterValue) ||
            filterValue.length === 0
          )
            return true;

          if (filterValue.includes("Yet to Report")) {
            return (
              filterValue.includes(statusText) ||
              statusText === "-" ||
              statusText === "" ||
              statusText === null
            );
          }

          return filterValue.includes(statusText);
        },
        enableColumnFilter: true,
      },

      {
        id: "patientReportMail",
        header: ({ column }) => {
          // --- 🔹 Save & Restore Filter Helpers ---
          const handleFilterChange = (option: any) => {
            const current = column.getFilterValue();
            const newValue = current === option ? undefined : option;

            // Update filter in table
            column.setFilterValue(newValue);

            // Save or clear in localStorage
            if (newValue) {
              localStorage.setItem(
                "patientReportMail_filter",
                JSON.stringify(newValue)
              );
            } else {
              localStorage.removeItem("patientReportMail_filter");
            }
          };

          const handleClear = () => {
            column.setFilterValue(undefined);
            localStorage.removeItem("patientReportMail_filter");
          };

          return (
            <div className="flex items-center justify-center">
              <div className="flex gap-x-2 gap-y-0 p-1 justify-center items-center flex-wrap">
                <div>Report</div>
                <div>Delivery</div>
              </div>

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
                  {["Send Mail", "Resend Mail", "Not Yet Available"].map(
                    (option) => (
                      <div
                        key={option}
                        className="flex items-center gap-2 cursor-pointer py-1 text-sm"
                        onClick={() => handleFilterChange(option)}
                      >
                        <Checkbox2
                          checked={column.getFilterValue() === option}
                        />
                        <span>{option}</span>
                      </div>
                    )
                  )}

                  <Button
                    variant="ghost"
                    className="mt-2 text-red-500 hover:text-red-700 flex items-center gap-1"
                    onClick={handleClear}
                  >
                    <XCircle className="h-4 w-4" />
                    <span>Clear</span>
                  </Button>
                </PopoverContent>
              </Popover>
            </div>
          );
        },
        cell: ({ row }) => {
          const [showMailDialog, setShowMailDialog] = useState(false);

          const isSignedOff =
            row.original.refAppointmentComplete?.toLowerCase() ===
              "signed off" ||
            row.original.refAppointmentComplete?.toLowerCase() ===
              "signed off (a)";
          const hasMailSent = row.original.refAppointmentMailSendStatus !== "";

          return (
            <>
              {hasMailSent || isSignedOff ? (
                <button
                  className="hover:underline cursor-pointer text-xs font-bold"
                  onClick={() => setShowMailDialog(true)}
                >
                  {hasMailSent ? (
                    <div className="flex justify-center gap-x-1 gap-y-1 flex-wrap">
                      <div>Resend</div>
                      <div>Mail</div>
                    </div>
                  ) : (
                    <div className="flex justify-center gap-x-1 gap-y-1 flex-wrap">
                      <div>Send</div>
                      <div>Mail</div>
                    </div>
                  )}
                </button>
              ) : (
                <div className="text-center text-gray-400">-</div>
              )}

              {showMailDialog && (
                <SendMailDialog
                  appointmentId={row.original.refAppointmentId}
                  patientId={row.original.refUserId}
                  showMailDialog={showMailDialog}
                  setShowMailDialog={setShowMailDialog}
                  handleRefreshData={fetchPatientQueue}
                  patientPrivatePublicStatus={
                    row.original.patientPrivatePublicStatus
                  }
                />
              )}
            </>
          );
        },
        enableColumnFilter: true,
        filterFn: (row, _columnId, value) => {
          const status = row.original.refAppointmentComplete?.toLowerCase();
          const isSignedOff = status === "signed off";
          const hasMailSent = row.original.refAppointmentMailSendStatus !== "";

          if (value === "Send Mail") return isSignedOff && !hasMailSent;
          if (value === "Resend Mail") return isSignedOff && hasMailSent;
          if (value === "Not Available") return !isSignedOff;

          return true; // fallback
        },
      },
      {
        id: "assigned",
        accessorFn: (row) => String(row.refAppointmentAssignedUserId ?? 0),
        header: ({ column, table }) => (
          <div className="flex items-center justify-center gap-1">
            {/* ---- Sort Trigger ---- */}
            <span
              className="cursor-pointer font-semibold"
              onClick={() => {
                // Get previous sort BEFORE toggling
                const prevSort = column.getIsSorted(); // "asc" | "desc" | false

                // Now toggle normally
                column.toggleSorting(prevSort === "asc");

                // Determine next sort value
                const nextSort = prevSort === "asc" ? "desc" : "asc";

                // Save to localStorage
                localStorage.setItem(
                  "assigned_sortOrder",
                  JSON.stringify({
                    id: "assigned",
                    desc: nextSort === "desc",
                  })
                );
              }}
            >
              Assign
            </span>

            {/* ---- Filter ---- */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="!p-0 hover:bg-transparent">
                  <Filter />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-64 p-2">
                <Command>
                  <CommandGroup className="max-h-60 overflow-auto">
                    {/* Unique Assigned Values */}
                    {Array.from(
                      new Set(
                        table
                          .getCoreRowModel()
                          .rows.map(
                            (r) => r.original.refAppointmentAssignedUserId
                          )
                      )
                    ).map((assignedId) => {
                      // Find staff in staffData
                      const staff = staffData.find(
                        (s) => String(s.refUserId) === String(assignedId)
                      );

                      // ❌ Skip IDs not in staffData AND also not 0
                      if (!staff && assignedId !== 0) return null;

                      const current =
                        (column.getFilterValue() as string[]) ?? [];
                      const isSelected = current.includes(String(assignedId));

                      const displayName =
                        assignedId === 0
                          ? "None"
                          : staff && staff.refUserCustId;

                      return (
                        <CommandItem
                          key={assignedId}
                          className="flex items-center gap-2 cursor-pointer"
                          onSelect={() => {
                            const updated = isSelected
                              ? current.filter(
                                  (id) => id !== String(assignedId)
                                )
                              : [...current, String(assignedId)];

                            column.setFilterValue(
                              updated.length ? updated : undefined
                            );

                            if (updated.length > 0) {
                              localStorage.setItem(
                                "assigned_filter",
                                JSON.stringify(updated)
                              );
                            } else {
                              localStorage.removeItem("assigned_filter");
                            }
                          }}
                        >
                          <Checkbox2 checked={isSelected} />
                          <span>{displayName}</span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </Command>

                {/* ---- Clear Filter ---- */}
                <Button
                  variant="ghost"
                  className="mt-2 text-red-500 flex items-center gap-1"
                  onClick={() => {
                    column.setFilterValue(undefined);
                    localStorage.removeItem("assigned_filter");
                  }}
                >
                  <XCircle className="h-4 w-4" />
                  Clear
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        ),

        // Filter function
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue || !Array.isArray(filterValue)) return true;

          const value = row.getValue(columnId);

          // Convert both to string
          return filterValue.includes(String(value || ""));
        },

        cell: ({ row }) => {
          return (
            <div className="flex w-[100px] xl:w-full justify-center items-center px-1">
              <Select
                value={
                  row.original.refAppointmentAssignedUserId === 0
                    ? "none"
                    : String(row.original.refAppointmentAssignedUserId)
                }
                onValueChange={(value) => {
                  if (value === "none") {
                    AssignUser(
                      row.original.refAppointmentId,
                      row.original.refUserId,
                      0,
                      ""
                    );
                  } else {
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
                  }
                }}
              >
                <SelectTrigger className="bg-white m-0 text-xs w-full xl:w-25">
                  <SelectValue placeholder="Assign" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="none">None</SelectItem>

                  {staffData.map(
                    (tech) =>
                      (tech.refSCId === 0 ||
                        tech.refSCId.toString() ===
                          row.original.refSCId.toString()) && (
                        <SelectItem
                          key={tech.refUserId}
                          value={String(tech.refUserId)}
                        >
                          {tech.refUserCustId}
                        </SelectItem>
                      )
                  )}
                </SelectContent>
              </Select>
            </div>
          );
        },

        enableColumnFilter: true,
      },
      {
        id: "pendingRemarks",
        header: ({ column, table }) => (
          <div className="flex items-center justify-center gap-1">
            Pending Remarks
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="hover:bg-transparent text-muted-foreground !p-0"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-44 p-2 space-y-1">
                {["Remarks Filled", "No Remarks"].map((option) => (
                  <div
                    key={option}
                    className="flex items-center gap-2 cursor-pointer py-1 text-sm"
                    onClick={() => {
                      const newValue =
                        column.getFilterValue() === option ? undefined : option;

                      column.setFilterValue(newValue);
                      // ✅ Save filter value to localStorage
                      localStorage.setItem(
                        "pendingRemarks_filter",
                        JSON.stringify(newValue)
                      );
                    }}
                  >
                    <Checkbox2 checked={column.getFilterValue() === option} />
                    <span>{option}</span>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  className="mt-1 text-red-500 hover:text-red-700 flex items-center gap-1"
                  onClick={() => {
                    // ✅ Clear filter + sort + localStorage
                    column.setFilterValue(undefined);
                    localStorage.removeItem("pendingRemarks_filter");
                    localStorage.removeItem("pendingRemarks_sortOrder");
                    table.resetSorting();
                  }}
                >
                  <XCircle className="h-4 w-4" />
                  <span>Clear</span>
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        ),
        cell: ({ row }) => {
          const latestRemark = row.original.refAppointmentRemarks?.trim() || "";
          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild disabled={!latestRemark}>
                  <Input
                    tabIndex={-1}
                    className={`text-xs 2xl:text-sm text-start bg-white border mx-2 w-30 truncate caret-transparent focus-visible:border-none focus-visible:ring-0 ${
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
        enableColumnFilter: true,
        filterFn: (row, _columnId, value) => {
          const hasRemarks = row.original.refAppointmentRemarks?.trim() !== "";
          return value === "Remarks Filled" ? hasRemarks : !hasRemarks;
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
                  className="w-8 h-8 p-0"
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
                  className="w-8 h-8 p-0"
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
      "refUserCustId",
      "patientId",
      "refSCCustId",
      "consentView",
      "patientFormAndStatus",
      "technicianForm",
      "dicom",
      "dicomFull",
      "oldreport",
      "reportStatus",
      "refAppointmentComplete",
      "patientReportMail",
      "assigned",
      "changes",
      "pendingRemarks",
      "totalRemarks",
    ],
    technician: [
      "select",
      "dateOfAppointment",
      "refUserFirstName",
      "refUserCustId",
      "patientId",
      "refSCCustId",
      "patientFormAndStatus",
      "technicianForm", // Start/View logic handled in cell
      "dicom",
      "dicomFull",
      "oldreport",
      "reportStatus",
      "assigned",
      "refAppointmentComplete",
      "patientReportMail",
      "pendingRemarks",
      "totalRemarks",
    ],
    scribe: [
      "select",
      "dateOfAppointment",
      "refUserCustId",
      "refUserFirstName",
      "patientId",
      "refSCCustId",
      "patientFormAndStatus",
      "technicianForm", // only "View" if filled
      "dicom",
      "dicomFull",
      "oldreport",
      "reportStatus",
      "refAppointmentComplete",
      "patientReportMail",
      "assigned",
      "changes",
      "pendingRemarks",
      "totalRemarks",
    ],
    scadmin: [
      "select",
      "dateOfAppointment",
      "refUserCustId",
      "refUserFirstName",
      "patientId",
      "refSCCustId",
      "consentView",
      "patientFormAndStatus",
      "technicianForm", // only "View" if filled
      "dicom",
      "dicomFull",
      "oldreport",
      "reportStatus",
      "refAppointmentComplete",
      "patientReportMail",
      "assigned",
      "changes",
      "pendingRemarks",
      "totalRemarks",
    ],
    patient: [
      "dateOfAppointment",
      "consentView",
      "refSCCustId",
      "patientFormAndStatus",
      "oldreport",
      "reportStatus",
    ],
    doctor: [
      "select",
      "dateOfAppointment",
      "refUserCustId",
      "refUserFirstName",
      "patientId",
      "refSCCustId",
      "patientFormAndStatus",
      "technicianForm", // only "View" if filled
      "dicom",
      "dicomFull",
      "oldreport",
      "reportStatus",
      "refAppointmentComplete",
      "patientReportMail",
      "assigned",
      "changes",
      "pendingRemarks",
      "totalRemarks",
    ],
    radiologist: [
      "select",
      "dateOfAppointment",
      "refUserCustId",
      "refUserFirstName",
      "patientId",
      "refSCCustId",
      "patientFormAndStatus",
      "technicianForm", // only "View" if filled
      "dicom",
      "dicomFull",
      "oldreport",
      "reportStatus",
      "refAppointmentComplete",
      "assigned",
      "changes",
      "pendingRemarks",
      "totalRemarks",
    ],
    codoctor: [
      "select",
      "dateOfAppointment",
      "refUserCustId",
      "refUserFirstName",
      "patientId",
      "refSCCustId",
      "patientFormAndStatus",
      "technicianForm", // only "View" if filled
      "dicom",
      "dicomFull",
      "oldreport",
      "reportStatus",
      "refAppointmentComplete",
      "assigned",
      "changes",
      "pendingRemarks",
      "totalRemarks",
    ],
    manager: [
      "select",
      "dateOfAppointment",
      "refUserCustId",
      "refUserFirstName",
      "patientId",
      "refSCCustId",
      "consentView",
      "patientFormAndStatus",
      "technicianForm", // only "View" if filled
      "dicom",
      "dicomFull",
      "oldreport",
      "reportStatus",
      "refAppointmentComplete",
      "patientReportMail",
      "assigned",
      "changes",
      "pendingRemarks",
      "totalRemarks",
    ],
    wgdoctor: [
      "select",
      "dateOfAppointment",
      "refUserCustId",
      "refUserFirstName",
      "patientId",
      "refSCCustId",
      "consentView",
      "patientFormAndStatus",
      "technicianForm",
      "dicom",
      "dicomFull",
      "oldreport",
      "reportStatus",
      "refAppointmentComplete",
      "patientReportMail",
      "assigned",
      "changes",
      "pendingRemarks",
      "totalRemarks",
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

  useEffect(() => {
    // ✅ Restore date range filter
    const savedRange = localStorage.getItem("appointmentDateRange");
    if (savedRange) {
      try {
        const { from, to } = JSON.parse(savedRange);
        if (from) {
          const range = {
            from: new Date(from),
            to: to ? new Date(to) : undefined,
          };
          table.getColumn("dateOfAppointment")?.setFilterValue(range);
        }
      } catch (err) {
        console.error("Error restoring date filter:", err);
      }
    }

    // ✅ Restore date sorting
    const savedSort = localStorage.getItem("appointmentDateSort");
    if (savedSort) {
      try {
        const parsed = JSON.parse(savedSort);
        if (parsed?.id && typeof parsed.desc === "boolean") {
          table.setSorting([{ id: parsed.id, desc: parsed.desc }]);
        }
      } catch (err) {
        console.error("Error restoring sort order:", err);
      }
    }

    const savedScanCenters = localStorage.getItem("selectedScanCenters");
    if (savedScanCenters) {
      try {
        const parsedCenters = JSON.parse(savedScanCenters);
        if (Array.isArray(parsedCenters) && parsedCenters.length > 0) {
          table.getColumn("refSCCustId")?.setFilterValue(parsedCenters);
        }
      } catch (err) {
        console.error("Error restoring Scan Center filter:", err);
      }
    }

    const ScanCentersavedSort = localStorage.getItem("scanCenterSort");
    if (ScanCentersavedSort) {
      try {
        const parsed = JSON.parse(ScanCentersavedSort);
        if (parsed?.id && typeof parsed.desc === "boolean") {
          table.setSorting([{ id: parsed.id, desc: parsed.desc }]);
        }
      } catch (err) {
        console.error("Error restoring Scan Center sort:", err);
      }
    }

    // ✅ Restore Patient ID filter
    const savedPatientId = localStorage.getItem("patientIdFilter");
    if (savedPatientId) {
      try {
        table.getColumn("refUserCustId")?.setFilterValue(savedPatientId);
      } catch (err) {
        console.error("Error restoring Patient ID filter:", err);
      }
    }

    // ✅ Restore Patient ID sort
    const savedPatientSort = localStorage.getItem("patientIdSort");
    if (savedPatientSort) {
      try {
        const parsed = JSON.parse(savedPatientSort);
        if (parsed?.id && typeof parsed.desc === "boolean") {
          table.setSorting([{ id: parsed.id, desc: parsed.desc }]);
        }
      } catch (err) {
        console.error("Error restoring Patient ID sort:", err);
      }
    }

    // ✅ Restore Patient Name filter
    const savedPatientName = localStorage.getItem("patientNameFilter");
    if (savedPatientName) {
      try {
        table.getColumn("refUserFirstName")?.setFilterValue(savedPatientName);
      } catch (err) {
        console.error("Error restoring Patient Name filter:", err);
      }
    }

    // ✅ Restore Patient Name sorting
    const savedPatientNameSort = localStorage.getItem("patientNameSort");
    if (savedPatientNameSort) {
      try {
        const parsed = JSON.parse(savedPatientNameSort);
        if (parsed?.id && typeof parsed.desc === "boolean") {
          table.setSorting([{ id: parsed.id, desc: parsed.desc }]);
        }
      } catch (err) {
        console.error("Error restoring Patient Name sort:", err);
      }
    }

    const savedFormFilter = localStorage.getItem("patientFormAndStatus_filter");
    const savedFormSort = localStorage.getItem(
      "patientFormAndStatus_sortOrder"
    );

    const columnForm = table.getColumn("patientFormAndStatus");

    if (columnForm && savedFormFilter) {
      columnForm.setFilterValue(JSON.parse(savedFormFilter));
    }

    if (savedFormSort) {
      table.setSorting([
        { id: "patientFormAndStatus", desc: savedFormSort === "desc" },
      ]);
    }

    //Tech Form
    const savedTechFilter = localStorage.getItem("technicianForm_filter");
    const savedTechSort = localStorage.getItem("technicianForm_sortOrder");

    const columnTech = table.getColumn("technicianForm");

    if (columnTech && savedTechFilter) {
      columnTech.setFilterValue(JSON.parse(savedTechFilter));
    }

    if (savedTechSort) {
      table.setSorting([
        { id: "technicianForm", desc: savedTechSort === "desc" },
      ]);
    }

    //Report
    const savedReportStatusFilter = localStorage.getItem("reportStatus_filter");
    const savedReportStatusSort = localStorage.getItem(
      "reportStatus_sortOrder"
    );

    const reportStatusColumn = table.getColumn("reportStatus");

    if (reportStatusColumn && savedReportStatusFilter) {
      reportStatusColumn.setFilterValue(JSON.parse(savedReportStatusFilter));
    }

    if (savedReportStatusSort) {
      table.setSorting([
        { id: "reportStatus", desc: savedReportStatusSort === "desc" },
      ]);
    }

    //Appointment Status
    const savedAppointmentStatusFilter = localStorage.getItem(
      "appointmentStatus_filter"
    );
    const savedAppointmentStatusSort = localStorage.getItem(
      "appointmentStatus_sortOrder"
    );

    const columnAppointmentStatus = table.getColumn("refAppointmentComplete");

    // Restore filter
    if (columnAppointmentStatus && savedAppointmentStatusFilter) {
      columnAppointmentStatus.setFilterValue(
        JSON.parse(savedAppointmentStatusFilter)
      );
    }

    // Restore sorting
    if (savedAppointmentStatusSort) {
      table.setSorting([
        {
          id: "refAppointmentComplete",
          desc: savedAppointmentStatusSort === "desc",
        },
      ]);
    }

    //Report Delivery
    const savedReportDeveliveryFilter = localStorage.getItem(
      "patientReportMail_filter"
    );
    const ReportDeveliverycolumn = table.getColumn("patientReportMail");

    if (ReportDeveliverycolumn && savedReportDeveliveryFilter) {
      ReportDeveliverycolumn.setFilterValue(
        JSON.parse(savedReportDeveliveryFilter)
      );
    }

    //Pending remarks
    const savedPendingRemarksFilter = localStorage.getItem(
      "pendingRemarks_filter"
    );
    const savedPendingRemakrsSort = localStorage.getItem(
      "pendingRemarks_sortOrder"
    );

    const columnPendingRemarks = table.getColumn("pendingRemarks");

    if (columnPendingRemarks && savedPendingRemarksFilter) {
      columnPendingRemarks.setFilterValue(
        JSON.parse(savedPendingRemarksFilter)
      );
    }

    if (savedPendingRemakrsSort) {
      table.setSorting([
        { id: "pendingRemarks", desc: savedPendingRemakrsSort === "desc" },
      ]);
    }

    //Global Search
    const savedGlobalFilter = localStorage.getItem("globalFilter");
    if (savedGlobalFilter) {
      setGlobalFilter(savedGlobalFilter);
    }

    // Restore filter
    const savedAssignedFilter = localStorage.getItem("assigned_filter");
    if (savedAssignedFilter) {
      try {
        const parsed = JSON.parse(savedAssignedFilter);
        table.getColumn("assigned")?.setFilterValue(parsed);
      } catch (err) {
        console.error("Error restoring assigned filter:", err);
      }
    }

    // Restore sorting
    const savedAssignedSort = localStorage.getItem("assigned_sortOrder");
    if (savedAssignedSort) {
      try {
        const parsed = JSON.parse(savedAssignedSort);
        table.setSorting([{ id: parsed.id, desc: parsed.desc }]);
      } catch (err) {
        console.error("Error restoring assigned sort:", err);
      }
    }

    const savedFilter = localStorage.getItem("dicom_filter");
    if (savedFilter) {
      try {
        const parsed = JSON.parse(savedFilter);
        table.getColumn("dicomFull")?.setFilterValue(parsed);
      } catch {}
    }

    const savedFilterSort = localStorage.getItem("dicom_sort");
    if (savedFilterSort) {
      try {
        const parsed = JSON.parse(savedFilterSort);
        table.setSorting([{ id: parsed.id, desc: parsed.desc }]);
      } catch {}
    }

    // Restore Consent Filter
    const savedConsentFilter = localStorage.getItem("consentFilter");
    if (savedConsentFilter) {
      try {
        const parsed = JSON.parse(savedConsentFilter);
        if (Array.isArray(parsed)) {
          table.getColumn("consentView")?.setFilterValue(parsed);
        }
      } catch {}
    }

    // Restore Consent Sort
    const savedConsentSort = localStorage.getItem("consentSortOrder");
    if (savedConsentSort) {
      try {
        const parsed = JSON.parse(savedConsentSort);
        if (parsed?.id && typeof parsed.desc === "boolean") {
          table.setSorting([{ id: parsed.id, desc: parsed.desc }]);
        }
      } catch {}
    }
  }, [table]);

  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex + 1;

  const visiblePages = 10; // show only 10 pages
  const half = Math.floor(visiblePages / 2);

  let startPage = Math.max(currentPage - half, 1);
  let endPage = startPage + visiblePages - 1;

  if (endPage > pageCount) {
    endPage = pageCount;
    startPage = Math.max(endPage - visiblePages + 1, 1);
  }

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  const clearAllFilters = () => {
    setGlobalFilter("");
    setColumnFilters([]);
    setSorting([]);
    localStorage.removeItem("appointmentDateRange");
    localStorage.removeItem("appointmentDateSort");
    localStorage.removeItem("selectedScanCenters");
    localStorage.removeItem("scanCenterSort");
    localStorage.removeItem("patientIdFilter"); // ✅ added
    localStorage.removeItem("patientIdSort"); // ✅ added
    localStorage.removeItem("patientNameFilter"); // ✅ new
    localStorage.removeItem("patientNameSort"); // ✅ new
    localStorage.removeItem("patientFormAndStatus_filter"); // ✅ new
    localStorage.removeItem("patientFormAndStatus_sortOrder"); // ✅ new
    localStorage.removeItem("technicianForm_filter"); // ✅ new
    localStorage.removeItem("technicianForm_sortOrder"); // ✅ new
    localStorage.removeItem("reportStatus_filter"); // ✅ new
    localStorage.removeItem("reportStatus_sortOrder"); // ✅ new
    localStorage.removeItem("appointmentStatus_filter"); // ✅ new
    localStorage.removeItem("appointmentStatus_sortOrder"); // ✅ new
    localStorage.removeItem("pendingRemarks_filter"); // ✅ new
    localStorage.removeItem("pendingRemarks_sortOrder"); // ✅ new
    localStorage.removeItem("assigned_sortOrder"); // ✅ new
    localStorage.removeItem("globalFilter"); // ✅ new
    localStorage.removeItem("assigned_filter");
    localStorage.removeItem("assigned_sortOrder");
    localStorage.removeItem("dicom_filter");
    localStorage.removeItem("dicom_sort");
    localStorage.removeItem("consentFilter");
    localStorage.removeItem("consentSortOrder");
    setSelectedRowIds([]);
  };

  return (
    <div className="w-full mx-auto">
      {loading && <LoadingOverlay />}
      {isDownloading && (
        <DownloadingOverlay
          downloadedMB={progress.downloadedMB}
          percentage={progress.percentage}
          currentFile={progress.currentFile}
        />
      )}
      <div className="w-[99%] h-[85vh] overflow-y-scroll bg-radial-greeting-02 mx-auto space-y-3 p-1 my-2 lg:py-2 rounded-lg">
        {/* Global Filter and Clear Filters Button */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-4 gap-2 w-full">
          <Button
            onClick={() => {
              navigate("../managePatient", {
                state: {
                  scanCenterId: user?.refSCId,
                  SCName: user?.refSCCustId,
                },
              });
            }}
            className="flex items-center bg-[#b1b8aa] gap-1 text-white hover:bg-[#b1b8aa] w-full lg:w-auto"
            hidden={role?.type !== "scadmin"}
          >
            <UserRoundCog className="h-4 w-4" />
            Manage Patient
          </Button>
          <Button
            onClick={async () => {
              setIsDownloading(true);
              setProgress({ downloadedMB: 0, percentage: 0, currentFile: "" });
              await handleAllDownloadDicom(selectedRowIds, setProgress);
              setIsDownloading(false);
            }}
            className="flex items-center bg-[#b1b8aa] gap-1 text-white hover:bg-[#b1b8aa] w-full lg:w-auto"
            disabled={selectedRowIds.length === 0}
            hidden={role?.type == "patient"}
          >
            <Download className="h-4 w-4" />
            Download Dicom
          </Button>
          <Button
            onClick={async () => {
              setLoading(true);
              await handleAllReportsDownload();
              setLoading(false);
            }}
            className="flex items-center bg-[#b1b8aa] gap-1 text-white hover:bg-[#b1b8aa] w-full lg:w-auto"
            disabled={!hasSignedOffReport(selectedRowIds, patientQueue)}
            hidden={
              role?.type == "patient" ||
              role?.type == "scribe" ||
              role?.type == "radiologist"
            }
          >
            <Download className="h-4 w-4" />
            Download Final Reports
          </Button>

          <Button
            onClick={async () => {
              setLoading(true);
              await handleAllConsentDownload();
              setLoading(false);
            }}
            className="flex items-center bg-[#b1b8aa] gap-1 text-white hover:bg-[#b1b8aa] w-full lg:w-auto"
            disabled={selectedRowIds.length === 0}
            hidden={
              role?.type !== "admin" &&
              role?.type !== "scadmin" &&
              role?.type !== "manager" &&
              role?.type !== "wgdoctor"
            }
          >
            <Download className="h-4 w-4" />
            Download Patient Consent
          </Button>

          <Button
            onClick={async () => {
              fetchPatientQueue();
            }}
            className="flex items-center bg-[#b1b8aa] gap-1 text-white hover:bg-[#b1b8aa] w-full lg:w-auto"
            hidden={role?.type === "patient"}
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh Table
          </Button>

          <Button
            variant="outline"
            onClick={clearAllFilters}
            className="flex items-center gap-1 border border-red-300 text-red-500 hover:bg-red-100 hover:text-red-600 w-full lg:w-auto"
          >
            <XCircle className="h-4 w-4" /> Clear All Filters
          </Button>
          <Input
            placeholder="Search all columns..."
            value={globalFilter ?? ""}
            onChange={(event) => {
              setGlobalFilter(event.target.value);
              localStorage.setItem("globalFilter", event.target.value);
            }}
            className="w-full"
          />
        </div>

        {/* Table Container */}
        <div
          className={`rounded-lg grid w-full ${
            role?.type === "patient" && SCconsultantStatus
              ? "h-[64%]"
              : "h-[74%]"
          } border `}
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

        {role?.type === "patient" && SCconsultantStatus && (
          <div className="p-1 text-center">
            <h1 className="text-sm lg:text-lg text-[#50b33b] font-bold">
              If you would like to discuss your report, you may schedule an
              appointment{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={SCconsultantLink}
                className="text-blue-600 underline hover:text-blue-800 transition-colors italic duration-200"
              >
                here
              </a>
              .
            </h1>
          </div>
        )}

        {/* ShadCN Pagination Controls */}
        <div className="flex flex-col items-center py-1">
          {role?.type !== "patient" && selectedRowIds.length !== 0 && (
            <div className="text-xs w-full text-start -mb-1 -mt-3">
              Selected Rows: {selectedRowIds.length}
            </div>
          )}
          <div className="flex md:hidden items-center justify-center w-full space-x-4 mb-2">
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
              <Pagination className="mt-4 flex justify-center">
                <PaginationContent>
                  {/* First Page */}
                  <PaginationItem>
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => table.setPageIndex(0)}
                      disabled={!table.getCanPreviousPage()}
                      aria-label="Go to first page"
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                  </PaginationItem>

                  {/* Previous Page */}
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => table.previousPage()}
                      className={
                        !table.getCanPreviousPage()
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }
                      aria-label="Go to previous page"
                    />
                  </PaginationItem>

                  {/* Page Numbers */}
                  {pages.map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => table.setPageIndex(page - 1)}
                        isActive={page === currentPage}
                        className={`cursor-pointer ${
                          page === currentPage ? "bg-primary text-white" : ""
                        }`}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  {/* Next Page */}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => table.nextPage()}
                      className={
                        !table.getCanNextPage()
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }
                      aria-label="Go to next page"
                    />
                  </PaginationItem>

                  {/* Last Page */}
                  <PaginationItem>
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => table.setPageIndex(pageCount - 1)}
                      disabled={!table.getCanNextPage()}
                      aria-label="Go to last page"
                    >
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
