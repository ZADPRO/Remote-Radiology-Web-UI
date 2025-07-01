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
  TechnicianPatientQueue,
  technicianService,
} from "@/services/technicianServices"; // Import technicianService
import { useNavigate } from "react-router-dom"; // Import useNavigate

const PatientQueue: React.FC = () => {
  const [patientQueue, setPatientQueue] = useState<TechnicianPatientQueue[]>(
    []
  );
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  // Helper function to map refCategoryId to Patient Form names
  // This is taken directly from your MedicalHistory component
  const getPatientFormName = (categoryId: number): string => {
    switch (categoryId) {
      case 1:
        return "S-Screening form";
      case 2:
        return "Da-Breast QT Diagnostic Evaluation Form";
      case 3:
        return "Db-Breast QT Diagnostic Evaluation Form";
      case 4:
        return "Dc-Breast QT Diagnostic Evaluation Form";
      default:
        return "Not yet started";
    }
  };

  const getStatus = (status: string): any => {
    switch (status) {
      case "fillform":
        return {
          text: "Yet to Start",
          color: "green",
        };
      case "complete":
        return {
          text: "Complete",
          color: "#078292",
        };

      default:
        return {
          text: "Yet to Start",
          color: "green",
        };
    }
  };

  const fetchPatientQueue = async () => {
    setLoading(true);
    try {
      const res = await technicianService.listPatientQueue();
      console.log("Fetching patient queue...", res);
      if (res.status) {
        setPatientQueue(res.data);
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

  const columns = useMemo<ColumnDef<TechnicianPatientQueue>[]>(
    () => [
      {
        accessorKey: "refAppointmentDate",
        id: "dateOfAppointment",
        header: ({ column }) => (
          <div className="flex items-center">
            <span
              className="cursor-pointer font-semibold text-white"
              onClick={column.getToggleSortingHandler()}
            >
              Appointment Date
            </span>
            <Button
              variant="ghost"
              onClick={column.getToggleSortingHandler()}
              className="p-0 h-auto ml-1 text-white hover:bg-transparent hover:text-gray-200"
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
                    size="icon"
                    className="h-6 w-6 ml-2 text-white hover:bg-transparent hover:text-gray-200"
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2">
                  <Input
                    placeholder={`Filter Date...`}
                    value={(column.getFilterValue() ?? "") as string}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      column.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>
        ),
        enableColumnFilter: true,
      },
      {
        accessorKey: "refUserFirstName",
        id: "refUserFirstName",
        header: ({ column }) => (
          <div className="flex items-center">
            <span
              className="cursor-pointer font-semibold text-white"
              onClick={column.getToggleSortingHandler()}
            >
              Patient Name
            </span>
            <Button
              variant="ghost"
              onClick={column.getToggleSortingHandler()}
              className="p-0 h-auto ml-1 text-white hover:bg-transparent hover:text-gray-200"
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
          </div>
        ),
        enableColumnFilter: true,
      },
      {
        // Changed from refSCId to refUserCustId for PatientQueue
        accessorKey: "refUserCustId",
        id: "patientId", // Renamed ID to reflect content
        header: ({ column }) => (
          <div className="flex items-center">
            <span
              className="cursor-pointer font-semibold text-white"
              onClick={column.getToggleSortingHandler()}
            >
              Patient ID
            </span>
            <Button
              variant="ghost"
              onClick={column.getToggleSortingHandler()}
              className="p-0 h-auto ml-1 text-white hover:bg-transparent hover:text-gray-200"
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
                    size="icon"
                    className="h-6 w-6 ml-2 text-white hover:bg-transparent hover:text-gray-200"
                  >
                    <Filter className="h-4 w-4" />
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
                </PopoverContent>
              </Popover>
            )}
          </div>
        ),
        cell: ({ row }) => <span>{`${row.original.refUserCustId}`}</span>,
        enableColumnFilter: true,
      },
      {
  accessorKey: "refCategoryId",
  id: "patientForm",
  header: ({ column }) => (
    <div className="flex items-center">
      <span
        className="cursor-pointer font-semibold text-white"
        onClick={column.getToggleSortingHandler()}
      >
        Form Name
      </span>
      <Button
        variant="ghost"
        onClick={column.getToggleSortingHandler()}
        className="p-0 h-auto ml-1 text-white hover:bg-transparent hover:text-gray-200"
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
              size="icon"
              className="h-6 w-6 ml-2 text-white hover:bg-transparent hover:text-gray-200"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2">
            <Select
              value={(column.getFilterValue() ?? "all") as string}
              onValueChange={(value) =>
                column.setFilterValue(value === "all" ? undefined : value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="S-Screening form">S-Screening form</SelectItem>
                <SelectItem value="Da-Breast QT Diagnostic Evaluation Form">
                  Da-Breast QT Diagnostic Evaluation Form
                </SelectItem>
                <SelectItem value="Db-Breast QT Diagnostic Evaluation Form">
                  Db-Breast QT Diagnostic Evaluation Form
                </SelectItem>
                <SelectItem value="Dc-Breast QT Diagnostic Evaluation Form">
                  Dc-Breast QT Diagnostic Evaluation Form
                </SelectItem>
                <SelectItem value="Not yet started">Not yet started</SelectItem>
              </SelectContent>
            </Select>
          </PopoverContent>
        </Popover>
      )}
    </div>
  ),
  cell: ({ row }) => {
    const formName = getPatientFormName(row.original.refCategoryId);
    const isFillForm = row.original.refAppointmentComplete === "fillform";

    return (
      <div className="flex justify-between items-center w-full">
        <span className={isFillForm ? "italic text-muted-foreground" : ""}>
          {formName}
        </span>
      </div>
    );
  },
  enableColumnFilter: true,
  filterFn: (row, columnId, filterValue) => {
    if (!filterValue) return true;
    const formName = getPatientFormName(row.getValue(columnId));
    return formName === filterValue;
  },
},

      {
        id: "viewPatientForm",
        header: () => <div className="text-white">Patient Form</div>,
        cell: ({ row }) => {
          const { refAppointmentId, refUserId, refCategoryId } = row.original;

          const isAllowed = [1, 2, 3, 4].includes(refCategoryId);

          return (
            <u
              className={`font-medium ${
                isAllowed
                  ? "text-blue-600 hover:underline cursor-pointer"
                  : "text-gray-400 cursor-not-allowed"
              }`}
              onClick={() => {
                if (!isAllowed) return;
                console.log(
                  "View Report for Appointment ID:",
                  refAppointmentId
                );
                navigate("/patientInTakeForm-01", {
                  state: {
                    fetchFormData: true,
                    apiInfo: {
                      userId: refUserId,
                      appointmentId: refAppointmentId,
                    },
                  },
                });
              }}
            >
              View
            </u>
          );
        },

        enableSorting: false,
        enableColumnFilter: false,
        enableHiding: false,
      },
      {
        id: "viewTechnicianForm",
        header: () => <div className="text-white">Technician Form</div>,
        cell: ({ row }) => {
          const { refAppointmentId, refUserId, refCategoryId } = row.original;

          const isAllowed = [1, 2, 3, 4].includes(refCategoryId);

          return (
            <u
              className={`font-medium ${
                isAllowed
                  ? "hover:underline cursor-pointer text-blue-600"
                  : "text-gray-400 cursor-not-allowed"
              }`}
              onClick={() => {
                if (!isAllowed) return;
                console.log(
                  "View Report for Appointment ID:",
                  refAppointmentId
                );
                navigate("/technicianpatientintakeform", {
                  state: {
                    fetchFormData: true,
                    apiInfo: {
                      userId: refUserId,
                      appointmentId: refAppointmentId,
                    },
                  },
                });
              }}
            >
              View
            </u>
          );
        },
        enableSorting: false,
        enableColumnFilter: false,
        enableHiding: false,
      },
      {
        id: "reportView",
        header: () => <div className="text-white">Report</div>,
        cell: ({ row }) => {
          const { refAppointmentId, refCategoryId } = row.original;

          const isAllowed = [1, 2, 3, 4].includes(refCategoryId);

          return (
            <u
              className={`font-medium ${
                isAllowed
                  ? "text-blue-600 hover:underline cursor-pointer"
                  : "text-gray-400 cursor-not-allowed"
              }`}
              onClick={() => {
                if (!isAllowed) return; // prevent action if disabled
                console.log(
                  "View Report for Appointment ID:",
                  refAppointmentId
                );
                // Implement navigation or modal
              }}
            >
              View
            </u>
          );
        },

        enableSorting: false,
        enableColumnFilter: false,
        enableHiding: false,
      },
     {
  accessorKey: "refAppointmentComplete",
  id: "status",
  header: ({ column }) => (
    <div className="flex items-center">
      <span
        className="cursor-pointer font-semibold text-white"
        onClick={column.getToggleSortingHandler()}
      >
        Status
      </span>
      <Button
        variant="ghost"
        onClick={column.getToggleSortingHandler()}
        className="p-0 h-auto ml-1 text-white hover:bg-transparent hover:text-gray-200"
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
              size="icon"
              className="h-6 w-6 ml-2 text-white hover:bg-transparent hover:text-gray-200"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2">
            <Select
              value={(column.getFilterValue() ?? "all") as string}
              onValueChange={(value) =>
                column.setFilterValue(value === "all" ? undefined : value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Complete">Complete</SelectItem>
                <SelectItem value="Yet to Start">Yet to Start</SelectItem>
              </SelectContent>
            </Select>
          </PopoverContent>
        </Popover>
      )}
    </div>
  ),
  cell: ({ row }) => {
    const status = getStatus(row.original.refAppointmentComplete);
    return (
      <div className="flex justify-between items-center w-full">
        <span
          style={{ color: status.color }}
          className="text-sm font-semibold"
        >
          {status.text}
        </span>
      </div>
    );
  },
  enableColumnFilter: true,
  filterFn: (row, columnId, filterValue) => {
    if (!filterValue) return true;
    const status = getStatus(row.getValue(columnId));
    return status.text === filterValue;
  },
},
               
    ],
    [navigate] // Add navigate to useMemo dependencies
  );

  const table = useReactTable<TechnicianPatientQueue>({
    data: patientQueue,
    columns,
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
  });

  return (
    <div className="w-full mx-auto">
      {loading && <LoadingOverlay />}
      <div className="w-11/12 h-[80vh] bg-radial-greeting-02 mx-auto my-5 space-y-3 p-2 lg:p-6 rounded-lg">
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
                <TableRow
                  key={headerGroup.id}
                  className="[&>*]:whitespace-nowrap"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="py-3 text-left tracking-wider"
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
                  <TableRow key={row.id} className="bg-[#f7f0e9]">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="py-4 whitespace-nowrap text-sm text-gray-700"
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
