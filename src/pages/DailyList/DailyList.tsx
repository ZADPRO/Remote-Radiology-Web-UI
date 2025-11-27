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
          : format(endOfMonth(new Date()), "yyyy-MM-dd")
      );
    }
  };

  const [loading, setLoading] = useState(true);
  const [dailyListData, setDailyListData] = useState<DailyListResponse[]>([]);

  useEffect(() => {
    getDailyList(
      format(startOfMonth(new Date()), "yyyy-MM-dd"),
      format(endOfMonth(new Date()), "yyyy-MM-dd")
    );
  }, []);

  const getDailyList = async (fromDate: string, toDate: string) => {
    setLoading(true);
    const response = await dailyListService.GetDailyList(fromDate, toDate);
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
    const visibleRows = table.getRowModel().rows;

    if (!visibleRows || visibleRows.length === 0) return;

    // Define headers (match your table order)
    const headers = [
      { header: "Signed Date", key: "AppointmentDate" },
      { header: "Patient ID", key: "refUserCustId" },
      { header: "Patient Name", key: "refUserFirstName" },
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

    // Get rows based on current table state
    const rows = visibleRows.map((row) =>
      headers.map((h) => {
        const value = row.original[h.key as keyof DailyListResponse];

        return value;
      })
    );

    // Build worksheet
    const worksheet = XLSX.utils.aoa_to_sheet([
      headers.map((h) => h.header),
      ...rows,
    ]);

    // Auto column widths
    worksheet["!cols"] = headers.map((h) => ({ wch: h.header.length + 5 }));

    // Create and download file
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Analytics");
    XLSX.writeFile(workbook, "dailylist.xlsx");
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
    </div>
  );
};

export default DailyList;
