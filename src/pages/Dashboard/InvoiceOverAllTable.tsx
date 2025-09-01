import React, { useState, useMemo } from "react";
import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { pdf } from "@react-pdf/renderer";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { InvoiceHistory } from "@/services/invoiceService";
import { formatReadableDateWithoutDate } from "@/utlis/calculateAge";
import { Checkbox2 } from "@/components/ui/CustomComponents/checkbox2";
import { Button } from "@/components/ui/button";
import { Download, Filter, XCircle } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Table, TableBody, TableHeader } from "@/components/ui/table";
import InvoicePDF from "../Invoice/InvoicePDF";
import {
  PopoverContentDialog,
  PopoverDialog,
  PopoverTriggerDialog,
} from "@/components/ui/CustomComponents/popoverdialog";

type Props = {
  overallInvoiceHistory: InvoiceHistory[];
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const InvoiceOverAllTable: React.FC<Props> = ({
  overallInvoiceHistory,
  setLoading,
}) => {
  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);

  // Function to handle bulk PDF downloads
  const handleAllReportsDownload = async () => {
    try {
      setLoading(true);

      const selectedInvoices = overallInvoiceHistory.filter((invoice) =>
        selectedRowIds.includes(invoice.refIHId)
      );

      if (selectedInvoices.length === 0) {
        alert("No invoices selected for download.");
        return;
      }

      if (selectedInvoices.length === 1) {
        const invoice = selectedInvoices[0];
        console.log("------>", invoice);

        // Add validation before PDF generation
        if (invoice && validateInvoiceData(invoice)) {
          const pdfBlob = await pdf(
            <InvoicePDF invoiceHistory={invoice} />
          ).toBlob();
          saveAs(pdfBlob, `Invoice_QT${invoice.refIHId + 1000}.pdf`);
        } else {
          alert("Invoice data is incomplete. Cannot generate PDF.");
          return;
        }
      }

      // For multiple invoices, create a zip file
      const zip = new JSZip();

      // Generate PDFs for each selected invoice
      const pdfPromises = selectedInvoices.map(async (invoice) => {
        const pdfBlob = await pdf(
          <InvoicePDF invoiceHistory={invoice} />
        ).toBlob();
        const fileName = `Invoice_QT${invoice.refIHId + 1000}.pdf`;
        zip.file(fileName, pdfBlob);
        return true;
      });

      // Wait for all PDFs to be generated
      await Promise.all(pdfPromises);

      // Generate and download the zip file
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const zipFileName = `Invoices_${
        new Date().toISOString().split("T")[0]
      }.zip`;
      saveAs(zipBlob, zipFileName);
    } catch (error) {
      console.error("Error generating PDFs:", error);
      alert("Error occurred while generating PDFs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Add a validation function
  const validateInvoiceData = (invoice: InvoiceHistory): boolean => {
    // Check for required properties that your InvoicePDF component needs
    return (
      invoice &&
      invoice.refIHId !== null &&
      invoice.refIHId !== undefined &&
      // Add other required property checks based on your InvoicePDF component
      invoice.refIHTotal !== null &&
      invoice.refIHTotal !== undefined
    );
  };

  // Extract unique months and users for filter options
  const { uniqueMonths, uniqueUsers } = useMemo(() => {
    const months = new Set<string>();
    const users = new Set<string>();

    overallInvoiceHistory.forEach((item) => {
      if (item.refIHFromDate) {
        months.add(formatReadableDateWithoutDate(item.refIHFromDate));
      }

      const user = item.refSCId === 0 ? item.refUserCustId : item.refSCCustId;
      if (user) {
        users.add(user);
      }
    });

    return {
      uniqueMonths: Array.from(months).sort(),
      uniqueUsers: Array.from(users).sort(),
    };
  }, [overallInvoiceHistory]);

  // Define your columns with filters
  const columns: ColumnDef<InvoiceHistory>[] = [
    {
      accessorKey: "select",
      id: "select",
      enableHiding: true,
      header: ({ table }) => {
        return (
          <>
            <div className="flex w-full md:w-[20px] lg:w-[10px] gap-3 justify-between items-center">
              <Checkbox2
                className="border-[#f1d4d4] bg-[#fff] data-[state=checked]:bg-[#f1d4d4] data-[state=checked]:text-[#b1b8aa] data-[state=checked]:border-[#a4b2a1]"
                checked={
                  table.getRowModel().rows.length > 0 &&
                  table
                    .getRowModel()
                    .rows.every((row) =>
                      selectedRowIds.includes(row.original.refIHId)
                    )
                }
                onCheckedChange={(e) => {
                  if (e) {
                    // Select all - add all appointment IDs
                    setSelectedRowIds(
                      table
                        .getRowModel()
                        .rows.map((row) => row.original.refIHId)
                    );
                  } else {
                    // Deselect all - clear the array
                    setSelectedRowIds([]);
                  }
                }}
              />
              <Button
                onClick={handleAllReportsDownload}
                className="flex items-center bg-[#b1b8aa] gap-1 text-white hover:bg-[#b1b8aa] w-6 h-6"
                disabled={selectedRowIds.length === 0}
                title={`Download ${selectedRowIds.length} selected invoice${
                  selectedRowIds.length === 1 ? "" : "s"
                }`}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </>
        );
      },
      cell: ({ row }) => {
        return (
          <>
            <div className="w-[10px] flex justify-start items-center">
              <Checkbox2
                checked={selectedRowIds.includes(row.original.refIHId)}
                onCheckedChange={(e) => {
                  const appointmentId = row.original.refIHId;
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
            </div>
          </>
        );
      },
    },
    {
      accessorKey: "refIHFromDate",
      header: ({ column }) => {
        return (
          <div className="flex justify-between items-center gap-1 font-semibold">
            <span>Month</span>
            {column.getCanFilter() && (
              <PopoverDialog>
                <PopoverTriggerDialog asChild>
                  <Button
                    variant="ghost"
                    className="!p-0 hover:bg-transparent hover:text-gray-200"
                  >
                    <Filter />
                  </Button>
                </PopoverTriggerDialog>

                <PopoverContentDialog className="w-64 p-2">
                  <div>
                    {uniqueMonths.map((month) => {
                      const current =
                        (column.getFilterValue() as string[]) ?? [];
                      const isSelected = current.includes(month);

                      return (
                        <div
                          key={month}
                          className="flex items-center gap-2 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            const updated = isSelected
                              ? current.filter((m) => m !== month)
                              : [...current, month];
                            column.setFilterValue(
                              updated.length ? updated : undefined
                            );
                          }}
                        >
                          <Checkbox2
                            checked={isSelected}
                            onCheckedChange={() => {
                              const updated = isSelected
                                ? current.filter((m) => m !== month)
                                : [...current, month];
                              column.setFilterValue(
                                updated.length ? updated : undefined
                              );
                            }}
                          />
                          <span>{month}</span>
                        </div>
                      );
                    })}

                    <Button
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation(); // keep popover open
                        column.setFilterValue(undefined);
                      }}
                      className="mt-2 text-red-500 hover:text-red-700 flex items-center gap-1"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>Clear</span>
                    </Button>
                  </div>
                </PopoverContentDialog>
              </PopoverDialog>
            )}
          </div>
        );
      },
      cell: (info) => {
        const value = info.getValue() as string;
        return value ? formatReadableDateWithoutDate(value) : "";
      },
      enableColumnFilter: true,
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue || !Array.isArray(filterValue)) return true;
        const value = row.getValue(columnId) as string;
        const formattedMonth = value
          ? formatReadableDateWithoutDate(value)
          : "";
        return filterValue.includes(formattedMonth);
      },
    },
    {
      accessorKey: "refSCId",
      header: ({ column }) => {
        return (
          <div className="flex justify-between items-center gap-1 font-semibold">
            <span>Invoice Users</span>
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
                      {uniqueUsers.map((user) => {
                        const current =
                          (column.getFilterValue() as string[]) ?? [];
                        const isSelected = current.includes(user);

                        return (
                          <CommandItem
                            key={user}
                            className="flex items-center gap-2 cursor-pointer"
                            onSelect={() => {
                              const updated = isSelected
                                ? current.filter((u) => u !== user)
                                : [...current, user];
                              column.setFilterValue(
                                updated.length ? updated : undefined
                              );
                            }}
                          >
                            <Checkbox2
                              checked={isSelected}
                              onCheckedChange={() => {}}
                            />
                            <span>{user}</span>
                          </CommandItem>
                        );
                      })}
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
        const { refSCId, refUserCustId, refSCCustId } = row.original;
        return refSCId === 0 ? refUserCustId : refSCCustId;
      },
      enableColumnFilter: true,
      filterFn: (row, _, filterValue) => {
        if (!filterValue || !Array.isArray(filterValue)) return true;
        const { refSCId, refUserCustId, refSCCustId } = row.original;
        const user = refSCId === 0 ? refUserCustId : refSCCustId;
        return filterValue.includes(user);
      },
    },
    {
      accessorKey: "refIHTotal",
      header: "Total Amount",
      cell: (info) =>
        Number(info.getValue()).toLocaleString("en-IN", {
          style: "currency",
          currency: "INR",
        }),
    },
    {
      accessorKey: "refIHModePayment",
      header: "Payment Mode",
    },
  ];

  // Setup table instance
  const table = useReactTable({
    data: overallInvoiceHistory,
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
    <div className="overflow-x-auto rounded-lg mx-5 mb-5">
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
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border border-gray-300 px-4 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
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

export default InvoiceOverAllTable;
