import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Table, TableBody, TableHeader } from "@/components/ui/table";
import LoadingOverlay from "@/components/ui/CustomComponents/loadingOverlay";
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
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Checkbox2 } from "@/components/ui/CustomComponents/checkbox2";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { Calendar } from "@/components/calendar";
import { DateRange } from "react-day-picker";
import {
  DailyListResponse,
  dailyListService,
} from "@/services/dailylistService";
import { useAuth } from "../Routes/AuthContext";

const DailyList: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  const [open, setOpen] = React.useState(false);

  // // ✅ Load sorting and filters from localStorage on mount
  // const loadSortingFromStorage = (): SortingState => {
  //   const saved = localStorage.getItem("dailyListSorting");
  //   return saved ? JSON.parse(saved) : [];
  // };

  // const loadFiltersFromStorage = (): ColumnFiltersState => {
  //   const saved = localStorage.getItem("dailyListFilters");
  //   return saved ? JSON.parse(saved) : [];
  // };

  // const [sorting, setSorting] = useState<SortingState>(loadSortingFromStorage);
  // const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
  //   loadFiltersFromStorage
  // );

  // ✅ Persist sorting and filters to localStorage whenever they change
  // useEffect(() => {
  //   if (sorting.length > 0) {
  //     localStorage.setItem("dailyListSorting", JSON.stringify(sorting));
  //   } else {
  //     localStorage.removeItem("dailyListSorting");
  //   }
  // }, [sorting]);

  // useEffect(() => {
  //   if (columnFilters.length > 0) {
  //     localStorage.setItem("dailyListFilters", JSON.stringify(columnFilters));
  //   } else {
  //     localStorage.removeItem("dailyListFilters");
  //   }
  // }, [columnFilters]);

  const handleSelect = (range: DateRange | undefined) => {
    if (range) {
      setDateRange(range);
      getDailyList(
        range.from
          ? format(range.from, "yyyy-MM-dd")
          : format(startOfMonth(new Date()), "yyyy-MM-dd"),
        range.to
          ? format(range.to, "yyyy-MM-dd")
          : format(endOfMonth(new Date()), "yyyy-MM-dd"),
        role?.id === 1 ? 0 : user?.refSCId || 0
      );
    }
  };

  const { user, role } = useAuth();

  const [loading, setLoading] = useState(true);
  const [dailyListData, setDailyListData] = useState<DailyListResponse[]>([]);

  useEffect(() => {
    getDailyList(
      format(startOfMonth(new Date()), "yyyy-MM-dd"),
      format(endOfMonth(new Date()), "yyyy-MM-dd"),
      role?.id === 1 ? 0 : user?.refSCId || 0
    );
  }, []);

  const getDailyList = async (
    fromDate: string,
    toDate: string,
    refSCId: number
  ) => {
    setLoading(true);
    const response = await dailyListService.GetDailyList(
      fromDate,
      toDate,
      refSCId
    );
    if (response.status) {
      if (response.data && response.data.length > 0) {
        setDailyListData(response.data);
      } else {
        setDailyListData([]);
      }
    }
    setLoading(false);
  };

  const downloadExcel = () => {
    const filteredRows = table.getFilteredRowModel().rows;

    if (!filteredRows || filteredRows.length === 0) return;

    const headers = [
      { header: "Signed Date", key: "AppointmentDate" },
      { header: "Patient ID", key: "refUserCustId" },
      { header: "Patient Name", key: "refUserFirstName" },
      { header: "Scan Center", key: "refSCCustId" },
      { header: "Form", key: "refCategoryId" },
      { header: "Scan Side", key: "scanSide" },
      { header: "Draft By", key: "handlerName" },
      { header: "Impression Left", key: "refAppointmentImpression" },
      { header: "Recommendation Left", key: "refAppointmentRecommendation" },
      { header: "Impression Right", key: "refAppointmentImpressionRight" },
      {
        header: "Recommendation Right",
        key: "refAppointmentRecommendationRight",
      },
    ];

    const rows = filteredRows.map((row) =>
      headers.map((h) => row.original[h.key as keyof DailyListResponse] ?? "")
    );

    const worksheet = XLSX.utils.aoa_to_sheet([
      headers.map((h) => h.header),
      ...rows,
    ]);

    worksheet["!cols"] = headers.map((h) => ({ wch: h.header.length + 5 }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DailyList");

    // ===========================================
    // ✅ DISTINCT refSCCustId for filename
    // ===========================================
    const distinctScanCenters = Array.from(
      new Set(filteredRows.map((r) => r.original.refSCCustId))
    );

    const scanCenterPart =
      distinctScanCenters.length > 0 ? distinctScanCenters.join(",") : "";

    // ===========================================
    // Date Formatting
    // ===========================================
    const fromDate = dateRange?.from
      ? format(dateRange.from, "yyyy-MM-dd")
      : "NA";

    const toDate = dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : "NA";

    // ===========================================
    // Final File Name
    // ===========================================
    const fileName = `Daily List ${fromDate} to ${toDate} ${scanCenterPart}.xlsx`;

    XLSX.writeFile(workbook, fileName);
  };

  const columns: ColumnDef<DailyListResponse>[] = [
    {
      accessorKey: "AppointmentDate",
      id: "AppointmentDate",
      header: ({ column }) => (
        <div className="flex items-center justify-center gap-1">
          <span
            className="cursor-pointer font-semibold"
            onClick={() => {
              column.toggleSorting(column.getIsSorted() === "asc");
            }}
          >
            <div className="flex gap-x-2 gap-y-0 p-1 justify-center items-center flex-wrap">
              <div>Signed</div>
              <div>Date</div>
            </div>
          </span>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="w-22">
            {row.original.AppointmentDate.split(" ")[0]}
          </div>
        );
      },
      enableSorting: true,
      sortingFn: "datetime",
    },
    {
      accessorKey: "refUserCustId",
      id: "refUserCustId",
      header: ({ column }) => (
        <div className="flex items-center justify-center gap-1">
          <span
            className="cursor-pointer font-semibold"
            onClick={() => {
              column.toggleSorting(column.getIsSorted() === "asc");
            }}
          >
            <div className="flex gap-x-2 gap-y-0 p-1 justify-center items-center flex-wrap">
              <div>Patient</div>
              <div>ID</div>
            </div>
          </span>

          {/* {column.getCanFilter() && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="!p-0 hover:bg-transparent hover:text-gray-200"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2">
                <Input
                  placeholder="Filter Patient ID..."
                  value={(column.getFilterValue() ?? "") as string}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    column.setFilterValue(event.target.value);
                  }}
                  className="max-w-sm"
                />
                <Button
                  variant="ghost"
                  onClick={() => {
                    column.setFilterValue(undefined);
                  }}
                  className="p-0 mt-2 text-red-500 hover:text-red-700 flex items-center gap-1"
                >
                  <XCircle className="h-4 w-4" /> <span>Clear</span>
                </Button>
              </PopoverContent>
            </Popover>
          )} */}
        </div>
      ),
      enableSorting: true,
      enableColumnFilter: true,
      filterFn: "includesString",
    },
    {
      accessorKey: "refUserFirstName",
      id: "refUserFirstName",
      header: ({ column }) => (
        <div className="flex items-center justify-center gap-1">
          <span
            className="cursor-pointer font-semibold"
            onClick={() => {
              column.toggleSorting(column.getIsSorted() === "asc");
            }}
          >
            <div className="flex gap-x-1 gap-y-0 p-1 justify-center items-center flex-wrap">
              <div>Patient</div>
              <div>Name</div>
            </div>
          </span>

          {/* {column.getCanFilter() && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="!p-0 hover:bg-transparent hover:text-gray-200"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2">
                <Input
                  placeholder="Filter Patient Name..."
                  value={(column.getFilterValue() ?? "") as string}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    column.setFilterValue(event.target.value);
                  }}
                  className="max-w-sm"
                />
                <Button
                  variant="ghost"
                  onClick={() => {
                    column.setFilterValue(undefined);
                  }}
                  className="p-0 mt-2 text-red-500 hover:text-red-700 flex items-center gap-1"
                >
                  <XCircle className="h-4 w-4" /> <span>Clear</span>
                </Button>
              </PopoverContent>
            </Popover>
          )} */}
        </div>
      ),
      enableSorting: true,
      enableColumnFilter: true,
      filterFn: "includesString",
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
              const sortOrder = column.getIsSorted() === "asc" ? "desc" : "asc";
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
      accessorKey: "refCategoryId",
      id: "refCategoryId",
      header: ({ column, table }) => (
        <div className="flex items-center justify-center gap-1">
          <span
            className="cursor-pointer font-semibold"
            onClick={() => {
              column.toggleSorting(column.getIsSorted() === "asc");
            }}
          >
            <div className="flex gap-x-2 gap-y-0 p-1 justify-center items-center flex-wrap">
              <div>Form</div>
            </div>
          </span>

          {column.getCanFilter() && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="!p-0 hover:bg-transparent hover:text-gray-200"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2">
                <Command>
                  <CommandGroup className="max-h-60 overflow-auto">
                    {Array.from(
                      new Set(
                        table
                          .getCoreRowModel()
                          .rows.map((r) => r.original.refCategoryId)
                      )
                    ).map((form) => {
                      const current =
                        (column.getFilterValue() as string[]) ?? [];
                      const isSelected = current.includes(form);

                      return (
                        <CommandItem
                          key={form}
                          className="flex items-center gap-2 cursor-pointer"
                          onSelect={() => {
                            const current =
                              (column.getFilterValue() as string[]) ?? [];
                            const isSelected = current.includes(form);

                            const updated = isSelected
                              ? current.filter((id) => id !== form)
                              : [...current, form];

                            column.setFilterValue(
                              updated.length ? updated : undefined
                            );
                          }}
                        >
                          <Checkbox2
                            checked={isSelected}
                            onCheckedChange={() => {}}
                          />
                          <span>{form}</span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </Command>

                <Button
                  variant="ghost"
                  onClick={() => {
                    column.setFilterValue(undefined);
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
      enableSorting: true,
      enableColumnFilter: true,
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue || !Array.isArray(filterValue)) return true;
        const value = row.getValue(columnId);
        return filterValue.includes(value);
      },
    },
    {
      accessorKey: "scanSide",
      id: "scanSide",
      header: ({ column, table }) => (
        <div className="flex items-center justify-center gap-1">
          <span
            className="cursor-pointer font-semibold"
            onClick={() => {
              column.toggleSorting(column.getIsSorted() === "asc");
            }}
          >
            <div className="flex gap-x-2 gap-y-0 p-1 justify-center items-center flex-wrap">
              <div>Scan</div>
              <div>Side</div>
            </div>
          </span>

          {column.getCanFilter() && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="!p-0 hover:bg-transparent hover:text-gray-200"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2">
                <Command>
                  <CommandGroup className="max-h-60 overflow-auto">
                    {Array.from(
                      new Set(
                        table
                          .getCoreRowModel()
                          .rows.map((r) => r.original.scanSide)
                      )
                    ).map((side) => {
                      const current =
                        (column.getFilterValue() as string[]) ?? [];
                      const isSelected = current.includes(side);

                      return (
                        <CommandItem
                          key={side}
                          className="flex items-center gap-2 cursor-pointer"
                          onSelect={() => {
                            const current =
                              (column.getFilterValue() as string[]) ?? [];
                            const isSelected = current.includes(side);

                            const updated = isSelected
                              ? current.filter((id) => id !== side)
                              : [...current, side];

                            column.setFilterValue(
                              updated.length ? updated : undefined
                            );
                          }}
                        >
                          <Checkbox2
                            checked={isSelected}
                            onCheckedChange={() => {}}
                          />
                          <span>{side}</span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </Command>

                <Button
                  variant="ghost"
                  onClick={() => {
                    column.setFilterValue(undefined);
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
      enableSorting: true,
      enableColumnFilter: true,
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue || !Array.isArray(filterValue)) return true;
        const value = row.getValue(columnId);
        return filterValue.includes(value);
      },
    },
    {
      accessorKey: "handlerName",
      id: "handlerName",
      header: ({ column, table }) => (
        <div className="flex items-center justify-center gap-1">
          <span
            className="cursor-pointer font-semibold"
            onClick={() => {
              column.toggleSorting(column.getIsSorted() === "asc");
            }}
          >
            <div className="flex gap-x-2 gap-y-0 p-1 justify-center items-center flex-wrap">
              <div>Draft</div>
              <div>By</div>
            </div>
          </span>

          {column.getCanFilter() && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="!p-0 hover:bg-transparent hover:text-gray-200"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2">
                <Command>
                  <CommandGroup className="max-h-60 overflow-auto">
                    {Array.from(
                      new Set(
                        table
                          .getCoreRowModel()
                          .rows.map((r) => r.original.handlerName)
                      )
                    ).map((handler) => {
                      const current =
                        (column.getFilterValue() as string[]) ?? [];
                      const isSelected = current.includes(handler);

                      return (
                        <CommandItem
                          key={handler}
                          className="flex items-center gap-2 cursor-pointer"
                          onSelect={() => {
                            const current =
                              (column.getFilterValue() as string[]) ?? [];
                            const isSelected = current.includes(handler);

                            const updated = isSelected
                              ? current.filter((id) => id !== handler)
                              : [...current, handler];

                            column.setFilterValue(
                              updated.length ? updated : undefined
                            );
                          }}
                        >
                          <Checkbox2
                            checked={isSelected}
                            onCheckedChange={() => {}}
                          />
                          <span>{handler}</span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </Command>

                <Button
                  variant="ghost"
                  onClick={() => {
                    column.setFilterValue(undefined);
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
      enableSorting: true,
      enableColumnFilter: true,
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue || !Array.isArray(filterValue)) return true;
        const value = row.getValue(columnId);
        return filterValue.includes(value);
      },
    },
    {
      accessorKey: "refAppointmentImpression",
      id: "refAppointmentImpression",
      header: ({ column, table }) => (
        <div className="flex items-center justify-center gap-1">
          <span
            className="cursor-pointer font-semibold"
            onClick={() => {
              column.toggleSorting(column.getIsSorted() === "asc");
            }}
          >
            <div className="flex gap-x-2 gap-y-0 p-1 justify-center items-center flex-wrap">
              <div>Imp</div>
              <div>Left</div>
            </div>
          </span>

          {column.getCanFilter() && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="!p-0 hover:bg-transparent hover:text-gray-200"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2">
                <Command>
                  <CommandGroup className="max-h-60 overflow-auto">
                    {Array.from(
                      new Set(
                        table
                          .getCoreRowModel()
                          .rows.map((r) => r.original.refAppointmentImpression)
                      )
                    ).map((impression) => {
                      const current =
                        (column.getFilterValue() as string[]) ?? [];
                      const isSelected = current.includes(impression);

                      return (
                        <CommandItem
                          key={impression}
                          className="flex items-center gap-2 cursor-pointer"
                          onSelect={() => {
                            const current =
                              (column.getFilterValue() as string[]) ?? [];
                            const isSelected = current.includes(impression);

                            const updated = isSelected
                              ? current.filter((id) => id !== impression)
                              : [...current, impression];

                            column.setFilterValue(
                              updated.length ? updated : undefined
                            );
                          }}
                        >
                          <Checkbox2
                            checked={isSelected}
                            onCheckedChange={() => {}}
                          />
                          <span>{impression}</span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </Command>

                <Button
                  variant="ghost"
                  onClick={() => {
                    column.setFilterValue(undefined);
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
      enableSorting: true,
      enableColumnFilter: true,
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue || !Array.isArray(filterValue)) return true;
        const value = row.getValue(columnId);
        return filterValue.includes(value);
      },
    },
    {
      accessorKey: "refAppointmentRecommendation",
      id: "refAppointmentRecommendation",
      header: ({ column, table }) => (
        <div className="flex items-center justify-center gap-1">
          <span
            className="cursor-pointer font-semibold"
            onClick={() => {
              column.toggleSorting(column.getIsSorted() === "asc");
            }}
          >
            <div className="flex gap-x-2 gap-y-0 p-1 justify-center items-center flex-wrap">
              <div>Reco</div>
              <div>Left</div>
            </div>
          </span>

          {column.getCanFilter() && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="!p-0 hover:bg-transparent hover:text-gray-200"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2">
                <Command>
                  <CommandGroup className="max-h-60 overflow-auto">
                    {Array.from(
                      new Set(
                        table
                          .getCoreRowModel()
                          .rows.map(
                            (r) => r.original.refAppointmentRecommendation
                          )
                      )
                    ).map((recommendation) => {
                      const current =
                        (column.getFilterValue() as string[]) ?? [];
                      const isSelected = current.includes(recommendation);

                      return (
                        <CommandItem
                          key={recommendation}
                          className="flex items-center gap-2 cursor-pointer"
                          onSelect={() => {
                            const current =
                              (column.getFilterValue() as string[]) ?? [];
                            const isSelected = current.includes(recommendation);

                            const updated = isSelected
                              ? current.filter((id) => id !== recommendation)
                              : [...current, recommendation];

                            column.setFilterValue(
                              updated.length ? updated : undefined
                            );
                          }}
                        >
                          <Checkbox2
                            checked={isSelected}
                            onCheckedChange={() => {}}
                          />
                          <span>{recommendation}</span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </Command>

                <Button
                  variant="ghost"
                  onClick={() => {
                    column.setFilterValue(undefined);
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
      enableSorting: true,
      enableColumnFilter: true,
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue || !Array.isArray(filterValue)) return true;
        const value = row.getValue(columnId);
        return filterValue.includes(value);
      },
    },
    {
      accessorKey: "refAppointmentImpressionRight",
      id: "refAppointmentImpressionRight",
      header: ({ column, table }) => (
        <div className="flex items-center justify-center gap-1">
          <span
            className="cursor-pointer font-semibold"
            onClick={() => {
              column.toggleSorting(column.getIsSorted() === "asc");
            }}
          >
            <div className="flex gap-x-2 gap-y-0 p-1 justify-center items-center flex-wrap">
              <div>Imp</div>
              <div>Right</div>
            </div>
          </span>

          {column.getCanFilter() && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="!p-0 hover:bg-transparent hover:text-gray-200"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2">
                <Command>
                  <CommandGroup className="max-h-60 overflow-auto">
                    {Array.from(
                      new Set(
                        table
                          .getCoreRowModel()
                          .rows.map(
                            (r) => r.original.refAppointmentImpressionRight
                          )
                      )
                    ).map((impression) => {
                      const current =
                        (column.getFilterValue() as string[]) ?? [];
                      const isSelected = current.includes(impression);

                      return (
                        <CommandItem
                          key={impression}
                          className="flex items-center gap-2 cursor-pointer"
                          onSelect={() => {
                            const current =
                              (column.getFilterValue() as string[]) ?? [];
                            const isSelected = current.includes(impression);

                            const updated = isSelected
                              ? current.filter((id) => id !== impression)
                              : [...current, impression];

                            column.setFilterValue(
                              updated.length ? updated : undefined
                            );
                          }}
                        >
                          <Checkbox2
                            checked={isSelected}
                            onCheckedChange={() => {}}
                          />
                          <span>{impression}</span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </Command>

                <Button
                  variant="ghost"
                  onClick={() => {
                    column.setFilterValue(undefined);
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
      enableSorting: true,
      enableColumnFilter: true,
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue || !Array.isArray(filterValue)) return true;
        const value = row.getValue(columnId);
        return filterValue.includes(value);
      },
    },
    {
      accessorKey: "refAppointmentRecommendationRight",
      id: "refAppointmentRecommendationRight",
      header: ({ column, table }) => (
        <div className="flex items-center justify-center gap-1">
          <span
            className="cursor-pointer font-semibold"
            onClick={() => {
              column.toggleSorting(column.getIsSorted() === "asc");
            }}
          >
            <div className="flex gap-x-2 gap-y-0 p-1 justify-center items-center flex-wrap">
              <div>Reco</div>
              <div>Right</div>
            </div>
          </span>

          {column.getCanFilter() && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="!p-0 hover:bg-transparent hover:text-gray-200"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2">
                <Command>
                  <CommandGroup className="max-h-60 overflow-auto">
                    {Array.from(
                      new Set(
                        table
                          .getCoreRowModel()
                          .rows.map(
                            (r) => r.original.refAppointmentRecommendationRight
                          )
                      )
                    ).map((recommendation) => {
                      const current =
                        (column.getFilterValue() as string[]) ?? [];
                      const isSelected = current.includes(recommendation);

                      return (
                        <CommandItem
                          key={recommendation}
                          className="flex items-center gap-2 cursor-pointer"
                          onSelect={() => {
                            const current =
                              (column.getFilterValue() as string[]) ?? [];
                            const isSelected = current.includes(recommendation);

                            const updated = isSelected
                              ? current.filter((id) => id !== recommendation)
                              : [...current, recommendation];

                            column.setFilterValue(
                              updated.length ? updated : undefined
                            );
                          }}
                        >
                          <Checkbox2
                            checked={isSelected}
                            onCheckedChange={() => {}}
                          />
                          <span>{recommendation}</span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </Command>

                <Button
                  variant="ghost"
                  onClick={() => {
                    column.setFilterValue(undefined);
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
      enableSorting: true,
      enableColumnFilter: true,
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue || !Array.isArray(filterValue)) return true;
        const value = row.getValue(columnId);
        return filterValue.includes(value);
      },
    },
  ];

  const table = useReactTable({
    data: dailyListData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // onSortingChange: setSorting,
    // onColumnFiltersChange: setColumnFilters,
    // state: {
    //   sorting,
    //   columnFilters,
    // },
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
      {loading && <LoadingOverlay />}
      <>
        <div className="flex items-start justify-between mb-3">
          <div className="">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal p-5"
                >
                  {dateRange?.from ? (
                    dateRange.to ? (
                      `${format(dateRange.from, "MMM d, yyyy")} - ${format(
                        dateRange.to,
                        "MMM d, yyyy"
                      )}`
                    ) : (
                      format(dateRange.from, "MMM d, yyyy")
                    )
                  ) : (
                    <span className="text-muted-foreground">
                      Pick a date range
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  autoFocus
                  mode="range"
                  selected={dateRange}
                  onSelect={handleSelect}
                  numberOfMonths={2}
                  required={false}
                />
              </PopoverContent>
            </Popover>
          </div>
          <Button onClick={downloadExcel} variant="outline">
            Download Excel
          </Button>
        </div>

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
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-[#e4e4e2]">
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
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="h-24 text-start lg:text-center text-gray-500"
                >
                  No Data Found.
                </td>
              </tr>
            )}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        <div className="flex flex-col items-center py-1">
          <div className="w-full flex text-start items-start justify-start">
            <div className="text-sm font-semibold mb-3">
              Total Records: {table.getFilteredRowModel().rows.length}
            </div>
          </div>
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
    </div>
  );
};

export default DailyList;
