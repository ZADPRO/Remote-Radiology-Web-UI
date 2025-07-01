import React, { useState, useMemo, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import addRadiologist_Bg from "../../assets/Add Admins/Add Radiologist BG.png";
import { Button } from '@/components/ui/button';
// Import ArrowUp and ArrowDown
import { Plus, ChevronsLeft, ChevronsRight, Filter, ArrowUp, ArrowDown } from 'lucide-react';

// Import ShadCN UI Popover, Input, and Dialog components
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

// ShadCN Pagination Imports
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// ShadCN Select Imports for page size
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
} from '@tanstack/react-table';
import LoadingOverlay from '@/components/ui/CustomComponents/loadingOverlay';
import { useLocation, useNavigate } from 'react-router-dom';
import { doctorService, ListAllCoDoctor,  } from '@/services/doctorService';
import EditCoReportingDoctor from './EditCoReportingDoctor';

const ManageCoReportingDoctor: React.FC = () => {
  const [coDoctors, setCoDoctors] = useState<ListAllCoDoctor[]>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [selectedCoDoctorId, setSelectedCoDoctorId] = useState<number | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  // const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const scanCenterId = Number(location.state);

  const getAllCoDoctors = async () => {
    setLoading(true);
    try {
        console.log("Fetching Co-Doctors...", scanCenterId);
      const res = await doctorService.getAllCoDoctor(scanCenterId);
      console.log("Fetching Co-Doctors...", res);
      setCoDoctors(res.data);
    } catch (error) {
      console.error("Failed to fetch Co-Doctors:", error);
      setCoDoctors([]);
    }
    finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllCoDoctors();
  }, []);

  const columns = useMemo<ColumnDef<ListAllCoDoctor>[]>(
    () => [
      {
        accessorFn: (row: ListAllCoDoctor) => `${row.refUserFirstName} ${row.refUserLastName}`,
        id: 'name',
        header: ({ column }) => (
          <div className="flex items-center"> {/* Removed justify-between */}
            <span
              className="cursor-pointer font-semibold text-white"
              onClick={column.getToggleSortingHandler()}
            >
              Name
            </span>
            <Button
              variant="ghost"
              onClick={column.getToggleSortingHandler()}
              className="p-0 h-auto ml-1 text-white hover:bg-transparent hover:text-gray-200"
              aria-label={
                column.getIsSorted() === 'asc'
                  ? 'Sorted ascending'
                  : column.getIsSorted() === 'desc'
                  ? 'Sorted descending'
                  : 'Not sorted'
              }
            >
              {column.getIsSorted() === 'asc' ? (
                <ArrowUp className="h-4 w-4" />
              ) : column.getIsSorted() === 'desc' ? (
                <ArrowDown className="h-4 w-4" />
              ) : (
                <ArrowUp className="h-4 w-4 opacity-50" /> // Subtle arrow for unsorted
              )}
            </Button>
            {column.getCanFilter() && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 ml-2 text-white hover:bg-transparent hover:text-gray-200">
                    <Filter className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2">
                  <Input
                    placeholder={`Filter Name...`}
                    value={(column.getFilterValue() ?? '') as string}
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
        cell: ({ row }) => (
          <div className="flex items-center">
            {/* <img src={profilePic} alt="profile" className="h-8 w-8 rounded-full mr-2" /> */}
            {`${row.original.refUserFirstName} ${row.original.refUserLastName}`}
          </div>
        ),
        enableColumnFilter: true,
      },
      {
        accessorKey: 'refUserCustId',
        id: 'coDoctorId',
        header: ({ column }) => (
          <div className="flex items-center">
            <span
              className="cursor-pointer font-semibold text-white"
              onClick={column.getToggleSortingHandler()}
            >
              Co-Doctor ID
            </span>
            <Button
              variant="ghost"
              onClick={column.getToggleSortingHandler()}
              className="p-0 h-auto ml-1 text-white hover:bg-transparent hover:text-gray-200"
              aria-label={
                column.getIsSorted() === 'asc'
                  ? 'Sorted ascending'
                  : column.getIsSorted() === 'desc'
                  ? 'Sorted descending'
                  : 'Not sorted'
              }
            >
              {column.getIsSorted() === 'asc' ? (
                <ArrowUp className="h-4 w-4" />
              ) : column.getIsSorted() === 'desc' ? (
                <ArrowDown className="h-4 w-4" />
              ) : (
                <ArrowUp className="h-4 w-4 opacity-50" />
              )}
            </Button>
            {column.getCanFilter() && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 ml-2 text-white hover:bg-transparent hover:text-gray-200">
                    <Filter className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2">
                  <Input
                    placeholder={`Filter Co-Doctor ID...`}
                    value={(column.getFilterValue() ?? '') as string}
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
        accessorKey: 'refCODOEmail',
        id: 'mailId',
        header: ({ column }) => (
          <div className="flex items-center">
            <span
              className="cursor-pointer font-semibold text-white"
              onClick={column.getToggleSortingHandler()}
            >
              Mail ID
            </span>
            <Button
              variant="ghost"
              onClick={column.getToggleSortingHandler()}
              className="p-0 h-auto ml-1 text-white hover:bg-transparent hover:text-gray-200"
              aria-label={
                column.getIsSorted() === 'asc'
                  ? 'Sorted ascending'
                  : column.getIsSorted() === 'desc'
                  ? 'Sorted descending'
                  : 'Not sorted'
              }
            >
              {column.getIsSorted() === 'asc' ? (
                <ArrowUp className="h-4 w-4" />
              ) : column.getIsSorted() === 'desc' ? (
                <ArrowDown className="h-4 w-4" />
              ) : (
                <ArrowUp className="h-4 w-4 opacity-50" />
              )}
            </Button>
            {column.getCanFilter() && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 ml-2 text-white hover:bg-transparent hover:text-gray-200">
                    <Filter className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2">
                  <Input
                    placeholder={`Filter Mail ID...`}
                    value={(column.getFilterValue() ?? '') as string}
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
        accessorKey: 'refCODOPhoneNo1',
        id: 'mobileNumber',
        header: ({ column }) => (
          <div className="flex items-center">
            <span
              className="cursor-pointer font-semibold text-white"
              onClick={column.getToggleSortingHandler()}
            >
              Mobile Number
            </span>
            <Button
              variant="ghost"
              onClick={column.getToggleSortingHandler()}
              className="p-0 h-auto ml-1 text-white hover:bg-transparent hover:text-gray-200"
              aria-label={
                column.getIsSorted() === 'asc'
                  ? 'Sorted ascending'
                  : column.getIsSorted() === 'desc'
                  ? 'Sorted descending'
                  : 'Not sorted'
              }
            >
              {column.getIsSorted() === 'asc' ? (
                <ArrowUp className="h-4 w-4" />
              ) : column.getIsSorted() === 'desc' ? (
                <ArrowDown className="h-4 w-4" />
              ) : (
                <ArrowUp className="h-4 w-4 opacity-50" />
              )}
            </Button>
            {column.getCanFilter() && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 ml-2 text-white hover:bg-transparent hover:text-gray-200">
                    <Filter className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2">
                  <Input
                    placeholder={`Filter Mobile Number...`}
                    value={(column.getFilterValue() ?? '') as string}
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
        accessorFn: (row: ListAllCoDoctor) => (row.refUserStatus === "true" ? 'Active' : 'Inactive'),
        id: 'status',
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
              aria-label={
                column.getIsSorted() === 'asc'
                  ? 'Sorted ascending'
                  : column.getIsSorted() === 'desc'
                  ? 'Sorted descending'
                  : 'Not sorted'
              }
            >
              {column.getIsSorted() === 'asc' ? (
                <ArrowUp className="h-4 w-4" />
              ) : column.getIsSorted() === 'desc' ? (
                <ArrowDown className="h-4 w-4" />
              ) : (
                <ArrowUp className="h-4 w-4 opacity-50" />
              )}
            </Button>
            {column.getCanFilter() && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 ml-2 text-white hover:bg-transparent hover:text-gray-200">
                    <Filter className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2">
                  <select
                    value={(column.getFilterValue() ?? '') as string}
                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                      column.setFilterValue(event.target.value || undefined)
                    }
                    className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">All</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </PopoverContent>
              </Popover>
            )}
          </div>
        ),
        cell: ({ row }) => {
          const status = row.original.refUserStatus === "true" ? 'Active' : 'Inactive';
          return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <span className={`w-2 h-2 mr-1 rounded-full ${
                status === 'Active' ? 'bg-green-500' : 'bg-red-500'
              }`}></span>
              {status}
            </span>
          );
        },
        enableColumnFilter: true,
        filterFn: 'equals',
      },
      {
        id: 'actions',
        header: () => (
          <div className='text-white'>Manage Profile</div>
        ),
        cell: ({ row }) => (
          <Button
            className='bg-[#A3B1A1] hover:bg-[#81927f] py-1 px-3 rounded text-xs'
            onClick={() => {
              setSelectedCoDoctorId(row.original.refUserId);
              setIsEditDialogOpen(true);
            }}
          >
            Edit
          </Button>
        ),
        enableSorting: false,
        enableColumnFilter: false,
        enableHiding: false,
      },
    ],
    []
  );

  const table = useReactTable<ListAllCoDoctor>({
    data: coDoctors,
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
      }
    }
  });

  return (
    <div className="w-full mx-auto">
      {loading && <LoadingOverlay />}
      <div
        className="p-4 bg-[#A3B1A1] lg:bg-[length:70%_100%] lg:bg-no-repeat lg:bg-right-top"
        style={{
          backgroundImage:
            window.innerWidth >= 1024 ? `url(${addRadiologist_Bg})` : undefined,
        }}
      >
        <h1 className="text-[#3F3F3D] uppercase font-[900] text-xl lg:text-2xl text-center lg:text-left tracking-widest">
          Manage Co-Reporting Doctor
        </h1>
      </div>
      <div className="w-11/12 mx-auto my-0 space-y-3 py-4">
        {/* Top Controls: Global Search, Column Visibility, Add Center Admin */}
        <div
          className="flex flex-col lg:flex-row items-center justify-between gap-4 rounded-lg p-3"
          style={{
            background:
              "radial-gradient(100.97% 186.01% at 50.94% 50%, #F9F4EC 25.14%, #EED8D6 100%)",
          }}
        >
          {/* Global Search Input */}
          <div className="flex-grow lg:w-4/5 w-full">
            <Input
              value={globalFilter}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setGlobalFilter(e.target.value)
              }
              placeholder="Search all columns..."
              className="w-full"
            />
          </div>

          {/* Column Visibility Dropdown */}
          {/* <div className="relative inline-block text-left w-full md:w-auto">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                >
                  Columns{" "}
                  <ChevronDown
                    className="-mr-1 ml-2 h-5 w-5"
                    aria-hidden="true"
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2">
                <div className="grid gap-2">
                  <p className="text-sm font-semibold">Toggle Columns</p>
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => (
                      <label
                        key={column.id}
                        className="flex items-center text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={column.getIsVisible()}
                          onChange={column.getToggleVisibilityHandler()}
                          className="mr-2"
                        />
                        {column.id.charAt(0).toUpperCase() +
                          column.id
                            .slice(1)
                            .replace(/([A-Z])/g, " $1")
                            .trim()}
                      </label>
                    ))}
                </div>
              </PopoverContent>
            </Popover>
          </div> */}

          {/* Add Co-Doctor Button */}
          <Button className="bg-[#a4b2a1] hover:bg-[#81927f] w-full lg:w-1/5" onClick={() => navigate("../addCoReportingDoctor", {state: scanCenterId, replace: true})}>
            <Plus /> Add Co-Reporting Doctor
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
                              .columnDef as ColumnDef<ListAllCoDoctor>
                          ).minSize || "auto",
                        maxWidth:
                          (
                            header.column
                              .columnDef as ColumnDef<ListAllCoDoctor>
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
                    No results found.
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
                      onClick={() => table.getCanPreviousPage() && table.previousPage()}
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

      {/* Edit Co-Doctor Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent style={{background: "radial-gradient(100.97% 186.01% at 50.94% 50%, #F9F4EC 25.14%, #EED8D6 100%)"}} className="h-11/12 w-[90vw] lg:w-[80vw] overflow-y-auto">
                <DialogTitle>Edit Co-Reporting Doctor</DialogTitle>

          {selectedCoDoctorId !== null && (
            <EditCoReportingDoctor scanCenterId={scanCenterId} scanCenterDoctorId={selectedCoDoctorId} setIsEditDialogOpen={setIsEditDialogOpen} onUpdate={getAllCoDoctors}/>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ManageCoReportingDoctor;