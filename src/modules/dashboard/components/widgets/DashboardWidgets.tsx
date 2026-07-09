"use client";

import React from "react";
import {
  ActivityLog,
  StockRequest,
  DispatchLog,
  LowStockProduct,
} from "../../types";
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Info,
  ArrowRight,
  TrendingUp,
  FileText,
  Truck,
  PlusCircle,
  Users,
  Settings,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Custom Card Container for Widgets
 */
interface WidgetCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function WidgetCard({
  title,
  subtitle,
  children,
  action,
  className,
}: WidgetCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/[0.06] bg-zinc-900/40 backdrop-blur-xl p-6 shadow-xl relative overflow-hidden flex flex-col h-full",
        className
      )}
    >
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-white font-sans tracking-wide">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-zinc-500 font-sans mt-0.5 tracking-wide">
              {subtitle}
            </p>
          )}
        </div>
        {action}
      </div>
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}

/**
 * Recent Activities Log Widget
 */
export function RecentActivitiesWidget({ activities }: { activities: ActivityLog[] }) {
  const getLogIcon = (type: ActivityLog["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-400" />;
      case "error":
        return <AlertTriangle className="h-4 w-4 text-rose-400" />;
      case "info":
      default:
        return <Info className="h-4 w-4 text-[#D4AF37]" />;
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((act) => (
        <div key={act.id} className="flex gap-3">
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-800/40 border border-white/[0.04]">
            {getLogIcon(act.type)}
          </div>
          <div className="space-y-1 text-xs">
            <p className="text-zinc-300 font-medium">
              <span className="font-bold text-white">{act.user}</span> ({act.role}){" "}
              <span className="text-zinc-400">{act.action}</span>{" "}
              <span className="text-[#D4AF37] font-semibold">{act.target}</span>
            </p>
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-sans">
              <Clock className="h-3 w-3" />
              <span>{act.time}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Recent Stock Requests Widget (Shopkeeper Requests)
 */
export function RecentStockRequestsWidget({ requests }: { requests: StockRequest[] }) {
  const getStatusBadge = (status: StockRequest["status"]) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            Rejected
          </span>
        );
      case "pending":
      default:
        return (
          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Pending
          </span>
        );
    }
  };

  return (
    <div className="overflow-x-auto select-none">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/[0.04]">
            <th className="pb-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500 font-sans">
              Request ID
            </th>
            <th className="pb-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500 font-sans">
              Shopkeeper
            </th>
            <th className="pb-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500 font-sans">
              Items
            </th>
            <th className="pb-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500 font-sans text-right">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.02]">
          {requests.map((req) => (
            <tr key={req.id} className="group hover:bg-white/[0.01] transition-colors">
              <td className="py-3 text-xs font-bold text-white font-sans">{req.id}</td>
              <td className="py-3 text-xs text-zinc-300 font-sans">{req.shopkeeper}</td>
              <td className="py-3 text-xs text-zinc-400 truncate max-w-[150px] font-sans">{req.items}</td>
              <td className="py-3 text-xs text-right">{getStatusBadge(req.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Latest Dispatches Widget (Distributor dispatches)
 */
export function LatestDispatchesWidget({ dispatches }: { dispatches: DispatchLog[] }) {
  const getDispatchStatus = (status: DispatchLog["status"]) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Completed
          </span>
        );
      case "in-transit":
        return (
          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 animate-pulse">
            In Transit
          </span>
        );
      case "dispatched":
      default:
        return (
          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Dispatched
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {dispatches.map((disp) => (
        <div
          key={disp.id}
          className="flex items-center justify-between p-3 rounded-xl border border-white/[0.04] bg-zinc-900/20 hover:bg-zinc-900/40 transition-colors"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white font-sans">{disp.id}</span>
              <span className="text-[10px] text-zinc-500 font-sans">• {disp.time}</span>
            </div>
            <p className="text-[11px] text-zinc-400 font-sans">
              To: <span className="text-zinc-300 font-medium">{disp.destination}</span>
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            {getDispatchStatus(disp.status)}
            <span className="text-[9px] text-zinc-500 font-sans">{disp.distributor}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Low Stock Products Alerts Widget
 */
export function LowStockAlertsWidget({ products }: { products: LowStockProduct[] }) {
  return (
    <div className="space-y-3.5">
      {products.map((prod) => (
        <div
          key={prod.id}
          className="flex items-center justify-between p-3 rounded-xl border border-rose-500/10 bg-rose-500/[0.02]"
        >
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-white font-sans">{prod.name}</h4>
            <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-sans">
              <span>SKU: {prod.sku}</span>
              <span>•</span>
              <span>{prod.category}</span>
            </div>
          </div>
          <div className="text-right space-y-0.5">
            <span className="text-xs font-extrabold text-rose-400 font-sans">
              {prod.stock} / {prod.minStock} Left
            </span>
            <p className="text-[9px] text-rose-500/80 font-bold uppercase tracking-wider">
              Critical Alert
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Calendar / Agenda Widget
 */
export function CalendarWidget() {
  const today = new Date();
  const dayName = today.toLocaleDateString("en-US", { weekday: "short" });
  const dayNum = today.getDate();
  const monthName = today.toLocaleDateString("en-US", { month: "short" });

  const events = [
    { time: "09:00 AM", title: "Daily Sales Standup", type: "corporate" },
    { time: "11:30 AM", title: "Distributor Audit Review", type: "audit" },
    { time: "03:00 PM", title: "Dispatch Logistics Sync", type: "logistics" },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-6 items-stretch h-full">
      {/* Visual calendar card */}
      <div className="flex flex-col items-center justify-center shrink-0 w-24 bg-[#D4AF37]/5 border border-[#D4AF37]/15 rounded-2xl p-4 select-none">
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] font-sans">
          {monthName}
        </span>
        <span className="text-3.5xl font-black text-white font-sans leading-none my-1">
          {dayNum}
        </span>
        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider font-sans">
          {dayName}
        </span>
      </div>

      {/* Agenda events list */}
      <div className="flex-1 space-y-3.5">
        <h4 className="text-xs font-bold text-zinc-400 font-sans select-none flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-[#D4AF37]" />
          Today's Events & Schedule
        </h4>
        <div className="space-y-2.5">
          {events.map((ev, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-zinc-500 font-sans tracking-wide shrink-0">
                {ev.time}
              </span>
              <div className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
              <span className="text-xs text-zinc-300 font-sans truncate">{ev.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * ERP Quick Actions Grid Widget
 */
export function QuickActionsWidget() {
  const actionsList = [
    { label: "Request Stock", desc: "Open catalog order", icon: PlusCircle, color: "text-emerald-450 hover:bg-emerald-500/5 hover:border-emerald-500/20" },
    { label: "Dispatch Inventory", desc: "Ship orders out", icon: Truck, color: "text-indigo-450 hover:bg-indigo-500/5 hover:border-indigo-500/20" },
    { label: "Manage Clients", desc: "Configure users list", icon: Users, color: "text-[#D4AF37] hover:bg-[#D4AF37]/5 hover:border-[#D4AF37]/20" },
    { label: "Audit Reports", desc: "Generate sales report", icon: FileText, color: "text-amber-450 hover:bg-amber-500/5 hover:border-amber-500/20" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3.5 flex-1">
      {actionsList.map((act, index) => (
        <button
          key={index}
          className={cn(
            "flex flex-col items-start text-left p-4 rounded-xl border border-white/[0.04] bg-zinc-900/10 transition-all duration-200 cursor-pointer outline-none",
            act.color
          )}
        >
          <act.icon className="h-5 w-5 mb-2.5" />
          <h4 className="text-xs font-bold text-white font-sans">{act.label}</h4>
          <p className="text-[10px] text-zinc-500 font-sans mt-0.5">{act.desc}</p>
        </button>
      ))}
    </div>
  );
}
