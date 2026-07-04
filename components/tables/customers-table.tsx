"use client";

import * as React from "react";
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Download, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn, formatCurrency, formatRelativeTime } from "@/lib/utils";
import type { CustomerRecord } from "@/lib/data/customers";

const STATUS_VARIANT: Record<string, "emerald" | "blue" | "amber" | "red"> = {
  ACTIVE: "emerald",
  TRIAL: "blue",
  PAST_DUE: "amber",
  CHURNED: "red",
};

const SEGMENT_LABEL: Record<string, string> = {
  ENTERPRISE: "Enterprise",
  MID_MARKET: "Mid-market",
  SMB: "SMB",
  STARTUP: "Startup",
};

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

function exportToCsv(rows: CustomerRecord[]) {
  const headers = ["Name", "Company", "Email", "Plan", "Segment", "Status", "MRR", "LTV", "Health", "Country", "Last active"];
  const lines = rows.map((r) =>
    [r.name, r.company, r.email, r.plan, r.segment, r.status, r.mrr, r.ltv, r.healthScore, r.country, r.lastActiveAt]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );
  const csv = [headers.join(","), ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `customers-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function CustomersTable({ data }: { data: CustomerRecord[] }) {
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [segmentFilter, setSegmentFilter] = React.useState<string>("all");
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "mrr", desc: true }]);

  const filteredData = React.useMemo(() => {
    return data.filter((c) => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (segmentFilter !== "all" && c.segment !== segmentFilter) return false;
      if (globalFilter) {
        const q = globalFilter.toLowerCase();
        return c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
      }
      return true;
    });
  }, [data, statusFilter, segmentFilter, globalFilter]);

  const columns = React.useMemo<ColumnDef<CustomerRecord>[]>(
    () => [
      {
        id: "select",
        size: 36,
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
            onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox checked={row.getIsSelected()} onCheckedChange={(v) => row.toggleSelected(!!v)} aria-label="Select row" />
        ),
        enableResizing: false,
      },
      {
        accessorKey: "name",
        header: "Customer",
        size: 220,
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5">
            <Avatar className="size-7">
              <AvatarFallback>{initials(row.original.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-text-primary">{row.original.name}</p>
              <p className="truncate text-[11px] text-text-tertiary">{row.original.company}</p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "segment",
        header: "Segment",
        size: 110,
        cell: ({ getValue }) => <Badge variant="outline">{SEGMENT_LABEL[getValue<string>()]}</Badge>,
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 100,
        cell: ({ getValue }) => {
          const status = getValue<string>();
          return <Badge variant={STATUS_VARIANT[status]}>{status.replace("_", " ").toLowerCase()}</Badge>;
        },
      },
      {
        accessorKey: "mrr",
        size: 110,
        header: ({ column }) => (
          <button className="flex items-center gap-1" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            MRR <ArrowUpDown className="size-3" />
          </button>
        ),
        cell: ({ getValue }) => <span className="tabular-nums text-text-primary">{formatCurrency(getValue<number>())}</span>,
      },
      {
        accessorKey: "ltv",
        size: 110,
        header: ({ column }) => (
          <button className="flex items-center gap-1" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            LTV <ArrowUpDown className="size-3" />
          </button>
        ),
        cell: ({ getValue }) => <span className="tabular-nums">{formatCurrency(getValue<number>(), { compact: true })}</span>,
      },
      {
        accessorKey: "healthScore",
        size: 140,
        header: ({ column }) => (
          <button className="flex items-center gap-1" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Health <ArrowUpDown className="size-3" />
          </button>
        ),
        cell: ({ getValue }) => {
          const score = getValue<number>();
          return (
            <div className="flex items-center gap-2">
              <Progress value={score} className="w-16" indicatorClassName={score < 50 ? "bg-accent-red" : score < 75 ? "bg-accent-amber" : "bg-accent-emerald"} />
              <span className="w-7 text-[11px] tabular-nums text-text-tertiary">{score}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "country",
        header: "Country",
        size: 130,
      },
      {
        accessorKey: "lastActiveAt",
        size: 120,
        header: ({ column }) => (
          <button className="flex items-center gap-1" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Last active <ArrowUpDown className="size-3" />
          </button>
        ),
        cell: ({ getValue }) => <span className="text-text-tertiary">{formatRelativeTime(getValue<string>())}</span>,
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { rowSelection, sorting },
    columnResizeMode: "onChange",
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 8 } },
  });

  const selectedRows = table.getSelectedRowModel().rows.map((r) => r.original);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-text-tertiary" />
          <Input
            placeholder="Search customers…"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-56 pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger size="sm" className="w-32"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="TRIAL">Trial</SelectItem>
            <SelectItem value="PAST_DUE">Past due</SelectItem>
            <SelectItem value="CHURNED">Churned</SelectItem>
          </SelectContent>
        </Select>
        <Select value={segmentFilter} onValueChange={setSegmentFilter}>
          <SelectTrigger size="sm" className="w-36"><SelectValue placeholder="Segment" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All segments</SelectItem>
            <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
            <SelectItem value="MID_MARKET">Mid-market</SelectItem>
            <SelectItem value="SMB">SMB</SelectItem>
            <SelectItem value="STARTUP">Startup</SelectItem>
          </SelectContent>
        </Select>

        <div className="ml-auto flex items-center gap-2">
          {selectedRows.length > 0 && (
            <span className="text-[12px] text-text-tertiary">{selectedRows.length} selected</span>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => exportToCsv(selectedRows.length > 0 ? selectedRows : filteredData)}
          >
            <Download className="size-3.5" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border-default">
        <Table style={{ width: table.getTotalSize() }}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} style={{ width: header.getSize(), position: "relative" }}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getCanResize() && (
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={cn(
                          "absolute right-0 top-0 h-full w-1 cursor-col-resize touch-none select-none hover:bg-accent-blue/50",
                          header.column.getIsResizing() && "bg-accent-blue"
                        )}
                      />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-text-tertiary">
                  No customers match your filters.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} style={{ width: cell.column.getSize() }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-[12px] text-text-tertiary">
        <span>
          Showing {table.getRowModel().rows.length} of {filteredData.length} customers
        </span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            <ChevronLeft className="size-3.5" />
          </Button>
          <span>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
          </span>
          <Button variant="outline" size="icon" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            <ChevronRight className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
