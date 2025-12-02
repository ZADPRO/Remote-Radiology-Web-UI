import React, { useState, useEffect } from "react";
import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { Table, TableBody, TableHeader } from "@/components/ui/table";
import LoadingOverlay from "@/components/ui/CustomComponents/loadingOverlay";
import {
  analyticsService,
  RefAuditTransHistory,
} from "@/services/analyticsService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronsLeft, ChevronsRight, Filter, XCircle } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

const AuditLogs: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [auditData, setAuditData] = useState<RefAuditTransHistory[]>([]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  useEffect(() => {
    getAuditLog();
  }, []);

  const getAuditLog = async () => {
    setLoading(true);
    const response = await analyticsService.getAuditLog();
    console.log("#############", response);
    if (response.status) {
      setAuditData(response.data);
    }
    setLoading(false);
  };

  const [filterOpen, setFilterOpen] = useState<{ [key: string]: boolean }>({});

  const columns: ColumnDef<RefAuditTransHistory>[] = [
    {
      accessorKey: "refUserCustId",
      header: ({ column }) => (
        <div className="flex items-center gap-1">
          <span
            className="cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            User ID
          </span>

          <Popover
            open={filterOpen["refUserCustId"] || false}
            onOpenChange={(open) =>
              setFilterOpen((prev) => ({ ...prev, refUserCustId: open }))
            }
          >
            <PopoverTrigger asChild>
              <Button variant="ghost" className="h-4 w-4 p-0">
                <Filter size={14} />
              </Button>
            </PopoverTrigger>

            <PopoverContent
              className="p-2 w-48"
              onInteractOutside={(e) => {
                const el = e.target as HTMLElement;

                // prevent closing if clicking inside the input inside popover
                if (el.closest("input")) {
                  e.preventDefault();
                }
              }}
              onOpenAutoFocus={(e) => e.preventDefault()} // keep focus stabl
            >
              <Input
                placeholder="Filter User ID..."
                value={(column.getFilterValue() ?? "") as string}
                onChange={(e) => column.setFilterValue(e.target.value)}
                autoFocus
              />

              <Button
                variant="ghost"
                className="mt-2 flex items-center text-red-500"
                onClick={() => column.setFilterValue("")}
              >
                <XCircle size={16} /> Clear
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      ),
      enableSorting: true,
      enableColumnFilter: true,
      filterFn: "includesString",
    },
    {
      accessorKey: "refCODOEmail",
      header: ({ column }) => (
        <div className="flex items-center gap-1">
          <span
            className="cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email ID
          </span>

          <Popover
            open={filterOpen["refCODOEmail"] || false}
            onOpenChange={(open) =>
              setFilterOpen((prev) => ({ ...prev, refCODOEmail: open }))
            }
          >
            <PopoverTrigger asChild>
              <Button variant="ghost" className="h-4 w-4 p-0">
                <Filter size={14} />
              </Button>
            </PopoverTrigger>

            <PopoverContent
              className="p-2 w-48"
              onInteractOutside={(e) => {
                const el = e.target as HTMLElement;

                // prevent closing if clicking inside the input inside popover
                if (el.closest("input")) {
                  e.preventDefault();
                }
              }}
              onOpenAutoFocus={(e) => e.preventDefault()} // keep focus stabl
            >
              <Input
                placeholder="Filter Email..."
                value={(column.getFilterValue() ?? "") as string}
                onChange={(e) => column.setFilterValue(e.target.value)}
                autoFocus
              />

              <Button
                variant="ghost"
                className="mt-2 flex items-center text-red-500"
                onClick={() => column.setFilterValue("")}
              >
                <XCircle size={16} /> Clear
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      ),
      enableSorting: true,
      enableColumnFilter: true,
      filterFn: "includesString",
    },
    {
      accessorKey: "refTHData",
      header: "Data",
    },
    {
      accessorKey: "refTHTime",
      header: "Timestamp",
      cell: (info) =>
        new Date(info.getValue() as string).toLocaleString("en-IN"),
    },
  ];

  const table = useReactTable({
    data: auditData,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: { pageSize: 50 },
    },
  });

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

  return (
    <div className="grid w-[96%] h-[85vh] p-5 bg-[#f7efe8] overflow-x-auto rounded-lg mx-5 mb-5">
      {loading ? (
        <LoadingOverlay />
      ) : (
        <>
          <Table className="divide-y divide-gray-200">
            <TableHeader className="bg-[#a4b2a1] sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="border border-gray-300 h-10 px-4 py-0 text-left text-xs"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </TableHeader>

            <TableBody className="divide-y divide-gray-100">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-[#e4e4e2]">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="border border-gray-300 px-4 py-2 text-xs"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </TableBody>
          </Table>

          {/* ShadCN Pagination Controls */}
          <div className="flex flex-col items-center py-1">
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
        </>
      )}
    </div>
  );
};

export default AuditLogs;
