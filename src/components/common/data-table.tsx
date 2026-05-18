"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  ColumnFiltersState,
  VisibilityState,
  Table as ReactTable,
  RowData,
} from "@tanstack/react-table";
import { ChevronsLeft, ChevronsRight, Ellipsis } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "../ui/skeleton";
import NoData from "./no-data";

export type FooterRendererProps<TData extends RowData> = {
  table: ReactTable<TData>;
  getColWidth: (index: number) => number;
  sticky?: boolean;
  stickyColumnCount: number;
  columnWidths: number[];
};

export type FooterRenderer<TData extends RowData> = (
  props: FooterRendererProps<TData>,
) => React.ReactNode;

interface DataTableProps<TData, TValue> {
  name: string; // for localStorage keys
  data: TData[];
  loading?: boolean;
  columns: ColumnDef<TData, TValue>[];
  searchable?: (keyof TData)[]; // fields to search against
  onRowClick?: (row: TData) => void;
  onSelectionChange?: (selected: TData[]) => void;
  columnVisibility?: VisibilityState;
  onColumnVisibilityChange?: (state: VisibilityState) => void;
  // onTableReady?: (table: ReturnType<typeof useReactTable<TData>>) => void;
  visibilityToggle?: boolean;
  sticky?: boolean;
  stickyColumnCount?: number;
  columnWidths?: number[];

  footerRenderer?: FooterRenderer<TData>;
  serverPagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  onPageChange?: (page: number, pageSize: number) => void;
  maxHeight?: string;
  renderExpandedRow?: (row: TData) => React.ReactNode;
  defaultPageSize?: number;
  pagination?: boolean;
}

export function DataTable<TData, TValue>({
  name,
  data,
  columns,
  searchable,
  onRowClick,
  onSelectionChange,
  loading = false,
  columnVisibility,
  onColumnVisibilityChange,
  // onTableReady,
  visibilityToggle = true,
  sticky = false,
  stickyColumnCount = 3,
  columnWidths = [],
  footerRenderer,
  serverPagination,
  onPageChange,
  maxHeight,
  renderExpandedRow,
  defaultPageSize = 50,
  pagination = true,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [internalVisibility, setInternalVisibility] =
    React.useState<VisibilityState>(() => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(name ? `${name}Visibility` : "");
        return saved ? JSON.parse(saved) : {};
      }
      return {};
    });

  const visibility = columnVisibility ?? internalVisibility;
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState<string>("");
  const DEFAULT_WIDTH = 70;

  const getColWidth = (index: number) => columnWidths[index] ?? DEFAULT_WIDTH;

  const getLeftOffset = (index: number): number =>
    Array.from({ length: index }).reduce<number>(
      (sum, _, i) => sum + getColWidth(i),
      0,
    );

  const [clientPagination, setClientPagination] = React.useState({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });

  const table = useReactTable({
    data,
    columns,
    manualPagination: !!serverPagination,
    pageCount: serverPagination
      ? serverPagination.totalPages
      : Math.ceil(data.length / clientPagination.pageSize),
    state: {
      sorting,
      columnFilters,
      columnVisibility: visibility,
      rowSelection,
      globalFilter,
      pagination: serverPagination
        ? {
            pageIndex: serverPagination.page - 1,
            pageSize: serverPagination.pageSize,
          }
        : clientPagination,
    },
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === "function"
          ? updater(table.getState().pagination)
          : updater;

      if (serverPagination) {
        onPageChange?.(newState.pageIndex + 1, newState.pageSize);
      } else {
        setClientPagination(newState);
      }
    },
    autoResetPageIndex: false,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    // onColumnVisibilityChange: setColumnVisibility,
    // onColumnVisibilityChange: (updater) => {
    //   const newState =
    //     typeof updater === "function" ? updater(columnVisibility) : updater;
    //   setColumnVisibility(newState);

    //   // persist to localStorage
    //   localStorage.setItem(
    //     name ? `${name}Visibility` : "",
    //     JSON.stringify(newState)
    //   );
    // },
    onColumnVisibilityChange: (updater) => {
      const newState =
        typeof updater === "function" ? updater(visibility) : updater;

      onColumnVisibilityChange?.(newState); // notify parent
      if (!columnVisibility) setInternalVisibility(newState); // keep internal if uncontrolled

      localStorage.setItem(
        name ? `${name}Visibility` : "",
        JSON.stringify(newState),
      );
    },
    // onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: pagination ? getPaginationRowModel() : undefined,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, _columnId, filterValue) => {
      if (!searchable?.length) return true;
      const search = String(filterValue ?? "").toLowerCase();
      if (!search) return true;

      return searchable.some((key) => {
        const value = String(row.original[key] ?? "").toLowerCase();
        return value.includes(search);
      });
    },
    onRowSelectionChange: (updater) => {
      const newSelection =
        typeof updater === "function" ? updater(rowSelection) : updater;
      setRowSelection(newSelection);

      const selectedRows = Object.keys(newSelection)
        .filter((id) => newSelection[id])
        .map((id) => table.getRow(id)?.original);

      onSelectionChange?.(selectedRows);
    },
  });
  // React.useEffect(() => {
  //   const { pageIndex } = table.getState().pagination;
  //   const pageCount = table.getPageCount();
  //   if (pageIndex >= pageCount && pageCount > 0) {
  //     table.setPageIndex(0);
  //   }
  // }, [data.length, table]);
  React.useEffect(() => {
    if (loading) return;
    if (data.length === 0) return;
    const { pageIndex } = table.getState().pagination;
    const pageCount = table.getPageCount();
    if (pageIndex >= pageCount && pageCount > 0) {
      table.setPageIndex(0);
    }
  }, [data.length, loading, table]);

  // React.useEffect(() => {
  //   console.log(table.getState().columnVisibility, "visibility use effect");

  //   onTableReady?.(table);
  // }, [table, onTableReady]);

  return (
    <div className="w-full ">
      {/* Toolbar */}
      {(searchable || visibilityToggle) && (
        <div className="flex items-center justify-between py-4 gap-3">
          {searchable && (
            <Input
              placeholder={`Search by ${searchable.join(", ")}...`}
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="max-w-sm"
            />
          )}

          {/* Column visibility toggle */}
          {visibilityToggle && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="ml-auto">
                  <Ellipsis />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize cursor-pointer"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}

      {/* max-h-[calc(100vh-18rem)] */}
      {/* Table */}
      <div
        className="rounded-t-md table-border overflow-y-auto "
        style={{ maxHeight: maxHeight ?? "calc(100vh - 19rem)" }}
      >
        <Table className="table-auto rounded-t-md">
          <TableHeader className="sticky top-0 z-30">
            {table.getHeaderGroups().map((headerGroup) => (
              // <TableRow
              //   key={headerGroup.id}
              // >
              //   {headerGroup.headers.map((header) => (
              //     <TableHead key={header.id} className="h-7 border-b border-(--table-header-bg) bg-(--table-header-bg) hover:none first:rounded-tl-md last:rounded-tr-md">
              //       {header.isPlaceholder
              //         ? null
              //         : flexRender(
              //           header.column.columnDef.header,
              //           header.getContext()
              //         )}
              //     </TableHead>
              //   ))}
              // </TableRow>

              <TableRow key={headerGroup.id} className="sticky top-0">
                {headerGroup.headers.map((header, index) => {
                  const isStickyCol = sticky && index < stickyColumnCount;

                  return (
                    <TableHead
                      key={header.id}
                      className={`h-7 border-b py-3 border-(--table-header-bg) bg-(--table-header-bg) hover:none first:rounded-tl-md last:rounded-tr-md ${
                        isStickyCol ? "sticky z-20" : ""
                      }`}
                      style={
                        isStickyCol
                          ? {
                              left: getLeftOffset(index),
                              width: getColWidth(index),
                              minWidth: getColWidth(index),
                              maxWidth: getColWidth(index),
                            }
                          : { minWidth: DEFAULT_WIDTH }
                      }
                    >
                      <div className="truncate">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <Spinner size={48} />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow
                    key={row.id}
                    onClick={() => onRowClick?.(row.original)}
                    className={`${onRowClick ? "cursor-pointer" : ""} text-sm`}
                  >
                    {row.getVisibleCells().map((cell, index) => {
                      const isStickyCol = sticky && index < stickyColumnCount;

                      return (
                        <TableCell
                          key={cell.id}
                          className={
                            isStickyCol ? "sticky z-10 bg-background" : ""
                          }
                          style={
                            isStickyCol
                              ? {
                                  left: getLeftOffset(index),
                                  width: getColWidth(index),
                                  minWidth: getColWidth(index),
                                  maxWidth: getColWidth(index),
                                }
                              : { minWidth: DEFAULT_WIDTH }
                          }
                        >
                          <div className="truncate">
                            {/* {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )} */}
                            {(() => {
                              const rawValue = cell.getValue();

                              if (
                                typeof rawValue === "string" &&
                                rawValue.trim() === ""
                              ) {
                                return "N/A";
                              }

                              return flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              );
                            })()}
                          </div>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                  {renderExpandedRow && (
                    <TableRow className="hover:bg-transparent border-0 p-0">
                      <TableCell
                        colSpan={columns.length}
                        className="p-0 border-0"
                      >
                        {renderExpandedRow(row.original)}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <NoData />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          {footerRenderer && (
            <TableFooter>
              {footerRenderer({
                table,
                getColWidth,
                sticky,
                stickyColumnCount,
                columnWidths,
              })}
            </TableFooter>
          )}
        </Table>
      </div>

      {/* Pagination */}
      {/* <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div> */}
      {pagination && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-4">
          <div className="flex items-center gap-2">
            {loading ? (
              <>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-9 w-16" />
              </>
            ) : (
              <>
                <span className="text-sm">Rows per page:</span>
                <Select
                  value={table.getState().pagination.pageSize.toString()}
                  onValueChange={(value) => {
                    table.setPageSize(Number(value));
                  }}
                >
                  <SelectTrigger className="w-20 px-1.5">
                    <SelectValue placeholder="Rows per page" />
                  </SelectTrigger>
                  <SelectContent className="">
                    <SelectGroup>
                      {[5, 10, 20, 30, 50, 100].map((pageSize) => (
                        <SelectItem key={pageSize} value={pageSize.toString()}>
                          {pageSize}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </>
            )}
          </div>

          {/* Showing item range */}
          <div className="text-sm text-muted-foreground">
            {loading ? (
              <Skeleton className="h-4 w-45" />
            ) : table.getPageCount() > 0 ? (
              serverPagination ? (
                <>
                  Showing{" "}
                  <span className="font-medium">
                    {(serverPagination.page - 1) * serverPagination.pageSize +
                      1}
                  </span>{" "}
                  -{" "}
                  <span className="font-medium">
                    {Math.min(
                      serverPagination.page * serverPagination.pageSize,
                      serverPagination.total,
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{serverPagination.total}</span>{" "}
                  items
                </>
              ) : table.getFilteredRowModel().rows.length > 0 ? (
                <>
                  Showing{" "}
                  <span className="font-medium">
                    {table.getState().pagination.pageIndex *
                      table.getState().pagination.pageSize +
                      1}
                  </span>{" "}
                  -{" "}
                  <span className="font-medium">
                    {Math.min(
                      (table.getState().pagination.pageIndex + 1) *
                        table.getState().pagination.pageSize,
                      table.getFilteredRowModel().rows.length,
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">
                    {table.getFilteredRowModel().rows.length}
                  </span>{" "}
                  items
                </>
              ) : (
                "No items"
              )
            ) : null}
          </div>

          {/* Numbered pagination */}
          <div className="flex items-center gap-1">
            {loading ? (
              <>
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </>
            ) : table.getPageCount() > 0 ? (
              <>
                <Button
                  variant="outline"
                  className="rounded-sm p-3"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronsLeft className="p-0 m-0 text-center items-center flex justify-center text-primary" />
                </Button>

                {Array.from({ length: table.getPageCount() }, (_, i) => (
                  <Button
                  className="rounded-sm p-3"
                    key={i}
                    variant={
                      i === table.getState().pagination.pageIndex
                        ? "default"
                        : "outline"
                    }
                    // size="sm"
                    onClick={() => table.setPageIndex(i)}
                  >
                    {i + 1}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  className="rounded-sm p-3"
                  // size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <ChevronsRight className="p-0 m-0 text-center items-center flex justify-center text-primary" />
                </Button>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
