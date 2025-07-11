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
  AppointmentDetails,
  appointmentService,
} from "@/services/patientInTakeFormService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Routes/AuthContext";

const MedicalHistory: React.FC = () => {
  const [medicalHistory, setMedicalHistory] = useState<AppointmentDetails[]>(
    []
  );
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const { user } = useAuth();

  // Helper function to map refCategoryId to Patient Form names
  const getPatientFormName = (categoryId: number): string => {
    console.log(categoryId);
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

  const handleFetchMedicalHistory = async () => {
    setLoading(true);
    try {
      const res = await appointmentService.listPatientMedicalHistory();
      console.log("Fetching medical history...", res);

      setMedicalHistory(res.data);
    } catch (error) {
      console.error("Failed to fetch medical history:", error);
      setMedicalHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const getFormStatus = (status: string): any => {
    switch (status) {
      case "fillform":
        return {
          text: "Yet to Start",
          color: "text-blue-600"
        
      };
      case "technologistformfill":
        return {
          text: "Completed",
          color: "text-green-600"
        };
      default:
        return {
          text: "Completed",
          color: "text-green-600"
        };

    }
  }

  useEffect(() => {
    handleFetchMedicalHistory();
  }, []);

  const columns = useMemo<ColumnDef<AppointmentDetails>[]>(
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
              Date of Appointment
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
        accessorKey: "refSCId",
        id: "scanCentre",
        header: ({ column }) => (
          <div className="flex items-center">
            <span
              className="cursor-pointer font-semibold text-white"
              onClick={column.getToggleSortingHandler()}
            >
              Scan Centre
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
                    placeholder={`Filter Scan Centre ID...`}
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
        cell: ({ row }) => <span>{`${row.original.refSCCustId}`}</span>,
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
              Patient Form
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
                  <Select
                    value={(column.getFilterValue() ?? "all") as string}
                    onValueChange={(value) =>
                      column.setFilterValue(value || undefined)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="S Form">S-Screening form</SelectItem>
                      <SelectItem value="Da Form">
                        Da-Breast QT Diagnostic Evaluation Form
                      </SelectItem>
                      <SelectItem value="Db Form">
                        Db-Breast QT Diagnostic Evaluation Form
                      </SelectItem>
                      <SelectItem value="Dc Form">
                        Dc-Breast QT Diagnostic Evaluation Form
                      </SelectItem>
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
          const actionText = isFillForm ? "Start" : "View";

          return (
            <div className="flex justify-between items-center w-full">
              <span className={isFillForm ? "italic" : ""}>{formName}</span>
              <span
                className={`${actionText == "View" ? "text-green-600" : "text-blue-600 "} hover:underline cursor-pointer font-medium ml-4`}
                onClick={() => {
                  if (isFillForm) {
                    console.log(
                      `Start Form for ${formName} (Appointment ID: ${row.original.refAppointmentId})`
                    );
                    navigate("/patientInTakeForm", {
                      state: {
                        fetchFormData: false,
                        appointmentId: row.original.refAppointmentId,
                      },
                    });
                  } else {
                    console.log(
                      `View Completed Form for ${formName} (Appointment ID: ${row.original.refAppointmentId})`
                    );
                    navigate("/patientInTakeForm", {
                      state: {
                        fetchFormData: true,
                        appointmentId: row.original.refAppointmentId,
                        userId: user?.refUserId,
                        readOnly: true,
                      },
                    });
                  }
                }}
              >
                {actionText}
              </span>
            </div>
          );
        },

        enableColumnFilter: true,
        filterFn: (row, filterValue) => {
          const formName = getPatientFormName(row.original.refCategoryId);
          return formName
            .toLowerCase()
            .includes(String(filterValue).toLowerCase());
        },
        size: 350,
      },
      // {
      //   id: "reportView",
      //   header: () => <div className="text-white">Report</div>,
      //   cell: ({ row }) => (
      //     <u
      //       onClick={() => {
      //         console.log(
      //           "View Report for Appointment ID:",
      //           row.original.refAppointmentId
      //         );
      //       }}
      //     >
      //       View
      //     </u>
      //   ),
      //   enableSorting: false,
      //   enableColumnFilter: false,
      //   enableHiding: false,
      //   size: 80,
      //   minSize: 70,
      //   maxSize: 90,
      // },
      {
  id: "status",
  header: () => <div className="text-white">Status</div>,
  cell: ({ row }) => {
    const statusData = getFormStatus(row.original.refAppointmentComplete);
    if (!statusData) return null;

    return (
      <span className={`font-medium ${statusData.color}`}>
        {statusData.text}
      </span>
    );
  }
}

      // {
      //   id: "upload",
      //   header: () => <div className="text-white">Upload</div>,
      //   cell: ({ row }) => (
      //     <Upload
      //       className="cursor-pointer hover:text-blue-600"
      //       onClick={() => {
      //         console.log(
      //           "Upload for Appointment ID:",
      //           row.original.refAppointmentId
      //         );
      //       }}
      //     />
      //   ),
      //   enableSorting: false,
      //   enableColumnFilter: false,
      //   enableHiding: false,
      //   size: 90,
      //   minSize: 80,
      //   maxSize: 100,
      // },
    ],
    []
  );

  const table = useReactTable<AppointmentDetails>({
    data: medicalHistory,
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
      <div className="w-11/12 h-[80vh] bg-radial-greeting-02 mx-auto my-5 space-y-3 p-6 rounded-lg">
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
                      className="px-6 py-3 text-left tracking-wider"
                      style={{
                        width: header.getSize(),
                        minWidth:
                          (
                            header.column
                              .columnDef as ColumnDef<AppointmentDetails>
                          ).minSize || "auto",
                        maxWidth:
                          (
                            header.column
                              .columnDef as ColumnDef<AppointmentDetails>
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
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
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
                    No Medical History Found.
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

export default MedicalHistory;
