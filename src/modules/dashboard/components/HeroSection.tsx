"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/src/modules/auth/hooks/useAuth";
import { UserRole } from "@/src/modules/auth/types";
import { Button } from "@/src/components/common/Button";
import { Calendar, Clock, Sparkles, TrendingUp, Truck, PlusCircle, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

export function HeroSection() {
  const { user } = useAuth();
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
      setDate(
        now.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return (
          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider">
            <ShieldAlert className="h-3.5 w-3.5" />
            System Administrator
          </span>
        );
      case UserRole.DISTRIBUTOR:
        return (
          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
            <Truck className="h-3.5 w-3.5" />
            Licensed Distributor
          </span>
        );
      case UserRole.SHOPKEEPER:
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            Premium Shopkeeper
          </span>
        );
    }
  };

  const getQuickActions = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return (
          <>
            <Button variant="outline" className="border-white/[0.08] hover:bg-zinc-800 text-xs">
              System Logs
            </Button>
            <Button className="bg-[#D4AF37] hover:bg-[#B8932C] text-black text-xs font-bold shadow-[0_4px_20px_rgba(212,175,55,0.25)]">
              Manage Distributors
            </Button>
          </>
        );
      case UserRole.DISTRIBUTOR:
        return (
          <>
            <Button variant="outline" className="border-white/[0.08] hover:bg-zinc-800 text-xs">
              View Inventory
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold">
              Create Dispatch
            </Button>
          </>
        );
      case UserRole.SHOPKEEPER:
      default:
        return (
          <>
            <Button variant="outline" className="border-white/[0.08] hover:bg-zinc-800 text-xs">
              Order History
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold">
              <PlusCircle className="h-4 w-4 mr-1.5" />
              New Stock Request
            </Button>
          </>
        );
    }
  };

  if (!user) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-zinc-950 px-6 py-8 sm:px-8 sm:py-10 shadow-2xl">
      {/* Decorative premium gradients */}
      <div className="absolute top-[-20%] right-[-10%] w-[350px] h-[350px] rounded-full bg-[#D4AF37]/5 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[350px] h-[350px] rounded-full bg-indigo-500/5 blur-[80px] pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
        <div className="space-y-3.5">
          <div className="flex flex-wrap items-center gap-3">
            {getRoleBadge(user.role)}
          </div>

          <h2 className="text-2xl sm:text-3.5xl font-extrabold tracking-tight text-white font-sans leading-none">
            Welcome back, <span className="text-[#D4AF37] font-semibold">{user.name}</span>
          </h2>

          <p className="text-xs sm:text-sm text-zinc-400 font-sans max-w-xl leading-relaxed">
            Liquor Distribution ERP is active. System resources are optimal, database latency is 12ms, and <strong>{user.role === UserRole.ADMIN ? "3 requests pending approval" : "your dashboard is synced"}</strong>.
          </p>
        </div>

        {/* Real-time date/time & action drawer */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center lg:self-center gap-4 sm:gap-6 lg:shrink-0">
          <div className="flex flex-col gap-1.5 bg-zinc-900/60 backdrop-blur-xl border border-white/[0.04] p-3 px-4.5 rounded-2xl select-none">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 font-sans">
              <Calendar className="h-3.5 w-3.5 text-[#D4AF37]" />
              <span>{date || "Loading..."}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-300 font-sans tracking-wide">
              <Clock className="h-3.5 w-3.5 text-indigo-400" />
              <span>{time || "--:--:--"}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {getQuickActions(user.role)}
          </div>
        </div>
      </div>
    </div>
  );
}
