import React, { useState, useEffect } from "react";
import {
    useReactTable,
    ColumnDef,
    getCoreRowModel,
    getPaginationRowModel,
    flexRender,
} from "@tanstack/react-table";
import { Table, TableBody, TableHeader } from "@/components/ui/table";
import LoadingOverlay from "@/components/ui/CustomComponents/loadingOverlay";
import { analyticsService, RefAuditTransHistory } from "@/services/analyticsService";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";

const AuditLogs: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [auditData, setAuditData] = useState<RefAuditTransHistory[]>([]);

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

    const columns: ColumnDef<RefAuditTransHistory>[] = [
        {
            accessorKey: "refUserCustId",
            header: "User ID",
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
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: { pageSize: 50 }, // ✅ Default rows per page = 50
        },
    });

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
                                            className="border border-gray-300 h-10 px-4 py-0 text-left"
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
                                <tr key={row.id} className="hover:bg-[#d4d5ca]">
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className="border border-gray-300 px-4 py-2"
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

                    {/* Pagination Controls */}
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
                </>
            )}
        </div>
    );
};

export default AuditLogs;
