"use client";

import React, { useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Search,
  Eye,
  SlidersHorizontal,
  Download,
  Printer,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/src/components/common/Button";
import { Input } from "@/src/components/common/Input";
import { cn } from "@/lib/utils";

export interface TableColumn<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  searchPlaceholder?: string;
  // Options for filtering
  filterFields?: {
    key: string;
    label: string;
    options: { value: string; label: string }[];
  }[];
  actions?: React.ReactNode;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  searchPlaceholder = "Search records...",
  filterFields = [],
  actions,
}: DataTableProps<T>) {
  // 1. Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  
  // 2. Sorting State
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // 3. Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 4. Column Visibility State
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    columns.map((c) => c.key)
  );
  const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);

  // 5. Row Selection State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Reset Filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setFilters({});
    setSortKey(null);
    setCurrentPage(1);
  };

  // Toggle Column Visibility
  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) =>
      prev.includes(key)
        ? prev.filter((colKey) => colKey !== key)
        : [...prev, key]
    );
  };

  // Toggle Row Selection
  const toggleRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Toggle Select All
  const isAllSelected = useMemo(() => {
    return data.length > 0 && selectedIds.size === data.length;
  }, [selectedIds, data]);

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(data.map((row) => row.id)));
    }
  };

  // Filter & Search Logic
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      // Search term matching
      const matchesSearch = Object.keys(row).some((key) => {
        const val = row[key];
        return (
          val !== null &&
          val !== undefined &&
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        );
      });

      // Select filters matching
      const matchesFilters = Object.keys(filters).every((key) => {
        const filterVal = filters[key];
        if (!filterVal) return true;
        const rowVal = row[key];
        return String(rowVal).toLowerCase() === filterVal.toLowerCase();
      });

      return matchesSearch && matchesFilters;
    });
  }, [data, searchTerm, filters]);

  // Sorting Logic
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];

      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;

      if (typeof valA === "number" && typeof valB === "number") {
        return sortDirection === "asc" ? valA - valB : valB - valA;
      }

      return sortDirection === "asc"
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [filteredData, sortKey, sortDirection]);

  // Pagination Logic
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Sorting Click Handler
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  // Export to CSV Function
  const exportToCSV = () => {
    const activeHeaders = columns.filter((c) => visibleColumns.includes(c.key));
    const csvRows = [];
    
    // Header Row
    csvRows.push(activeHeaders.map((c) => `"${c.label}"`).join(","));

    // Data Rows
    sortedData.forEach((row) => {
      csvRows.push(
        activeHeaders
          .map((c) => {
            const val = row[c.key];
            return `"${String(val || "").replace(/"/g, '""')}"`;
          })
          .join(",")
      );
    });

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "exported_users.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Function
  const printTable = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* 1. Toolbar Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-zinc-900/20 p-4 rounded-2xl border border-white/[0.04]">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[260px] max-w-md">
          <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-zinc-500" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900/60 border border-white/[0.06] rounded-xl pl-11 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 outline-none hover:border-white/[0.12] focus:border-[#D4AF37] transition-all font-sans"
          />
        </div>

        {/* Dynamic Filters Grid */}
        <div className="flex flex-wrap items-center gap-3">
          {filterFields.map((field) => (
            <select
              key={field.key}
              value={filters[field.key] || ""}
              onChange={(e) => {
                const val = e.target.value;
                setFilters((prev) => ({ ...prev, [field.key]: val }));
                setCurrentPage(1);
              }}
              className="bg-zinc-900/60 border border-white/[0.06] rounded-xl px-3 py-2 text-xs text-zinc-300 font-sans outline-none cursor-pointer focus:border-[#D4AF37] hover:border-white/[0.1] transition-all"
            >
              <option value="" className="bg-zinc-950 text-zinc-400">All {field.label}</option>
              {field.options.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-zinc-950 text-white">
                  {opt.label}
                </option>
              ))}
            </select>
          ))}

          {/* Reset Filters */}
          {(searchTerm || Object.keys(filters).length > 0 || sortKey) && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleResetFilters}
              className="h-9 w-9 hover:bg-zinc-800 rounded-xl"
              title="Reset Filters"
            >
              <RotateCcw className="h-4 w-4 text-zinc-450" />
            </Button>
          )}

          {/* Column Visibility Controls */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsColumnDropdownOpen((prev) => !prev)}
              className="border-white/[0.06] hover:bg-zinc-800 text-xs font-semibold gap-1.5 rounded-xl h-9"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Columns
            </Button>

            {isColumnDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsColumnDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-zinc-950/95 backdrop-blur-md border border-white/[0.08] p-3 rounded-xl shadow-2xl z-50 space-y-2">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-1 select-none">
                    Toggle Columns
                  </p>
                  {columns.map((col) => (
                    <label
                      key={col.key}
                      className="flex items-center gap-2.5 text-xs text-zinc-300 hover:text-white cursor-pointer select-none font-sans py-0.5"
                    >
                      <input
                        type="checkbox"
                        checked={visibleColumns.includes(col.key)}
                        onChange={() => toggleColumn(col.key)}
                        className="accent-[#D4AF37] h-3.5 w-3.5 rounded border-white/[0.06]"
                      />
                      <span>{col.label}</span>
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="h-6 w-px bg-white/[0.06]" />

          {/* Export & Print */}
          <Button
            variant="outline"
            size="icon"
            onClick={exportToCSV}
            className="h-9 w-9 border-white/[0.06] hover:bg-zinc-800 rounded-xl"
            title="Export CSV"
          >
            <Download className="h-4 w-4 text-zinc-400" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={printTable}
            className="h-9 w-9 border-white/[0.06] hover:bg-zinc-800 rounded-xl"
            title="Print"
          >
            <Printer className="h-4 w-4 text-zinc-400" />
          </Button>

          {actions}
        </div>
      </div>

      {/* 2. Enterprise Responsive Data Table Container */}
      <div className="rounded-2xl border border-white/[0.06] bg-zinc-900/40 backdrop-blur-xl overflow-hidden shadow-2xl relative">
        <div className="overflow-x-auto w-full max-h-[500px] scrollbar-thin">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            {/* Sticky Header */}
            <thead>
              <tr className="sticky top-0 z-20 bg-zinc-950/80 backdrop-blur-lg border-b border-white/[0.06] text-[10px] font-bold text-zinc-500 uppercase tracking-widest select-none font-sans">
                {/* Checkbox Header */}
                <th className="px-6 py-4.5 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="accent-[#D4AF37] h-4 w-4 rounded border-white/[0.06]"
                  />
                </th>

                {/* Columns headers */}
                {columns
                  .filter((col) => visibleColumns.includes(col.key))
                  .map((col) => (
                    <th
                      key={col.key}
                      onClick={() => col.sortable !== false && handleSort(col.key)}
                      className={cn(
                        "px-6 py-4.5 font-bold tracking-widest",
                        col.sortable !== false && "cursor-pointer hover:text-white transition-colors"
                      )}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{col.label}</span>
                        {col.sortable !== false && sortKey === col.key && (
                          sortDirection === "asc" ? (
                            <ChevronUp className="h-3 w-3 text-[#D4AF37]" />
                          ) : (
                            <ChevronDown className="h-3 w-3 text-[#D4AF37]" />
                          )
                        )}
                      </div>
                    </th>
                  ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-white/[0.02] text-xs">
              {paginatedData.length > 0 ? (
                paginatedData.map((row) => {
                  const isRowSelected = selectedIds.has(row.id);
                  return (
                    <tr
                      key={row.id}
                      className={cn(
                        "hover:bg-white/[0.01] transition-colors group",
                        isRowSelected && "bg-white/[0.015]"
                      )}
                    >
                      {/* Checkbox Cell */}
                      <td className="px-6 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={isRowSelected}
                          onChange={() => toggleRow(row.id)}
                          className="accent-[#D4AF37] h-3.5 w-3.5 rounded border-white/[0.06]"
                        />
                      </td>

                      {/* Display Data Cells */}
                      {columns
                        .filter((col) => visibleColumns.includes(col.key))
                        .map((col) => (
                          <td key={col.key} className="px-6 py-4 text-zinc-300 font-sans">
                            {col.render ? col.render(row) : row[col.key]}
                          </td>
                        ))}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="px-6 py-12 text-center text-zinc-500 font-sans text-xs"
                  >
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Pagination Controls Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-900/20 p-4 rounded-2xl border border-white/[0.04]">
        <div className="text-xs text-zinc-500 font-sans">
          Showing <span className="font-bold text-white">{filteredData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</span> to{" "}
          <span className="font-bold text-white">
            {Math.min(currentPage * pageSize, filteredData.length)}
          </span>{" "}
          of <span className="font-bold text-white">{filteredData.length}</span> records
          {selectedIds.size > 0 && (
            <span className="ml-1 text-[#D4AF37] font-semibold">
              ({selectedIds.size} selected)
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Items per Page Select */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 font-sans">Page Size:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-zinc-900/60 border border-white/[0.06] rounded-xl px-2 py-1 text-xs text-zinc-300 font-sans outline-none focus:border-[#D4AF37]"
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size} className="bg-zinc-950 text-white">
                  {size}
                </option>
              ))}
            </select>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="h-8.5 w-8.5 border-white/[0.06] hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none rounded-lg"
            >
              <ChevronLeft className="h-4 w-4 text-zinc-400" />
            </Button>
            
            <div className="text-xs text-zinc-450 font-sans min-w-[60px] text-center select-none">
              Page <span className="font-bold text-white">{currentPage}</span> of{" "}
              <span className="font-bold text-white">{totalPages || 1}</span>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="h-8.5 w-8.5 border-white/[0.06] hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none rounded-lg"
            >
              <ChevronRight className="h-4 w-4 text-zinc-400" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
