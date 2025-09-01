import React, { useMemo } from "react";
import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Table, TableBody, TableHeader } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Filter, XCircle } from "lucide-react";
import { Checkbox2 } from "@/components/ui/CustomComponents/checkbox2";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { OverAllScanCenterAnalytics } from "@/services/analyticsService";

export interface OverAllAnalytics {
  refUserCustId: string;
  refUserId: number;
  reportartificatsleft: number;
  reportartificatsright: number;
  techartificatsleft: number;
  techartificatsright: number;
  totalcase: number;
  totaldaform: number;
  totaldbform: number;
  totaldcform: number;
  totalreportcorrect: number;
  totalreportedit: number;
  totalsform: number;
  totaltiming: number; // float but treated as number in TS
}

type Props = {
  analyticsData: OverAllScanCenterAnalytics[];
};

const ScanCenterOverAllAnalyticsTable: React.FC<Props> = ({
  analyticsData,
}) => {
  // Extract unique users for filter
  const uniqueUsers = useMemo(() => {
    const users = new Set<string>();
    analyticsData.forEach((row) => users.add(row.refSCCustId));
    return Array.from(users).sort();
  }, [analyticsData]);

  const columns: ColumnDef<OverAllScanCenterAnalytics>[] = [
    {
      accessorKey: "refSCCustId",
      header: ({ column }) => {
        return (
          <div className="flex justify-between items-center text-xs px-1 font-semibold">
            <span>Center ID</span>
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
                <PopoverContent className="w-40 p-2 ">
                  <div className="max-h-60 overflow-auto">
                    {uniqueUsers.map((user) => {
                      const current =
                        (column.getFilterValue() as string[]) ?? [];
                      const isSelected = current.includes(user);
                      return (
                        <div
                          key={user}
                          className="flex  items-center gap-2 cursor-pointer py-1"
                          onClick={() => {
                            const updated = isSelected
                              ? current.filter((u) => u !== user)
                              : [...current, user];
                            column.setFilterValue(
                              updated.length ? updated : undefined
                            );
                          }}
                        >
                          <Checkbox2 checked={isSelected} />
                          <span>{user}</span>
                        </div>
                      );
                    })}
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => column.setFilterValue(undefined)}
                    className="mt-2 text-red-500 hover:text-red-700 flex items-center gap-1"
                  >
                    {" "}
                    <XCircle className="h-4 w-4" /> <span>Clear</span>{" "}
                  </Button>
                </PopoverContent>
              </Popover>
            )}
          </div>
        );
      },
      cell: (info) => info.getValue(),
      enableColumnFilter: true,
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue || !Array.isArray(filterValue)) return true;
        return filterValue.includes(row.getValue(columnId));
      },
    },
    {
      accessorKey: "totalcase",
      header: () => (
        <div className="flex justify-center items-center text-center text-xs px-1 font-semibold">
          Total Case
        </div>
      ),
    },
    {
      accessorKey: "totalsform",
      header: () => (
        <div className="flex justify-center items-center text-center text-xs px-1 font-semibold">
          S Form
        </div>
      ),
    },
    {
      accessorKey: "totaldaform",
      header: () => (
        <div className="flex justify-center items-center text-center text-xs px-1 font-semibold">
          Da Form
        </div>
      ),
    },
    {
      accessorKey: "totaldbform",
      header: () => (
        <div className="flex justify-center items-center text-center text-xs px-1 font-semibold">
          Db Form
        </div>
      ),
    },
    {
      accessorKey: "totaldcform",
      header: () => (
        <div className="flex justify-center items-center text-center text-xs px-1 font-semibold">
          Dc Form
        </div>
      ),
    },
    {
      accessorKey: "reportartificatsleft",
      header: () => (
        <div className="flex justify-center items-center text-center text-xs px-1 font-semibold">
          Report Artifacts Left
        </div>
      ),
    },
    {
      accessorKey: "reportartificatsright",
      header: () => (
        <div className="flex justify-center items-center text-center text-xs px-1 font-semibold">
          Report Artifacts Right
        </div>
      ),
    },
    {
      accessorKey: "techartificatsleft",
      header: () => (
        <div className="flex justify-center items-center text-center text-xs px-1 font-semibold">
          Tech Artifacts Left
        </div>
      ),
    },
    {
      accessorKey: "techartificatsright",
      header: () => (
        <div className="flex justify-center items-center text-center text-xs px-1 font-semibold">
          Tech Artifacts Right
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: analyticsData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 50 },
    },
  });

  return (
    <div className="overflow-x-auto rounded-lg">
      <Table className="divide-y divide-gray-200">
        <TableHeader className="bg-[#a4b2a1] sticky top-0 z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="border border-gray-300 px-4 py-0 text-left"
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
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="border text-center border-gray-300 px-4 py-2 text-sm text-gray-700"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={table.getAllColumns().length}
                className="text-center py-4 text-gray-500"
              >
                No users are available
              </td>
            </tr>
          )}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4">
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Prev
        </button>
        <span>
          Page{" "}
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ScanCenterOverAllAnalyticsTable;
