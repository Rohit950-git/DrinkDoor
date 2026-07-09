"use client";

import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ChartDataPoint } from "@/src/modules/dashboard/types";

// Luxury colors from design guidelines
const THEME_COLORS = {
  gold: "#D4AF37",
  indigo: "#6366f1",
  emerald: "#10b981",
  amber: "#f59e0b",
  rose: "#f43f5e",
  grid: "rgba(255, 255, 255, 0.04)",
  text: "#94A3B8",
};

interface ChartProps {
  data: ChartDataPoint[];
  height?: number;
}

/**
 * Custom Premium Tooltip Component
 */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-white/[0.08] bg-zinc-950/90 backdrop-blur-md p-3.5 shadow-2xl font-sans">
        <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-1.5">{label}</p>
        <div className="space-y-1">
          {payload.map((item: any, index: number) => (
            <div key={index} className="flex items-center gap-4 justify-between">
              <span className="flex items-center gap-1.5 text-xs text-zinc-350">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color || item.fill }} />
                {item.name}
              </span>
              <span className="text-xs font-bold text-white">
                {typeof item.value === "number" && item.value >= 1000
                  ? `$${item.value.toLocaleString()}`
                  : item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

/**
 * Sales Overview Line/Area Chart
 */
export function SalesOverviewChart({ data, height = 300 }: ChartProps) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={THEME_COLORS.gold} stopOpacity={0.2} />
              <stop offset="95%" stopColor={THEME_COLORS.gold} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={THEME_COLORS.grid} vertical={false} />
          <XAxis
            dataKey="name"
            stroke={THEME_COLORS.text}
            fontSize={11}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis
            stroke={THEME_COLORS.text}
            fontSize={11}
            tickLine={false}
            axisLine={false}
            dx={-10}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: THEME_COLORS.grid, strokeWidth: 1 }} />
          <Area
            name="Sales"
            type="monotone"
            dataKey="value"
            stroke={THEME_COLORS.gold}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorSales)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Revenue vs Projections Double Bar Chart
 */
export function RevenueAnalyticsChart({ data, height = 300 }: ChartProps) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={THEME_COLORS.grid} vertical={false} />
          <XAxis
            dataKey="name"
            stroke={THEME_COLORS.text}
            fontSize={11}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis
            stroke={THEME_COLORS.text}
            fontSize={11}
            tickLine={false}
            axisLine={false}
            dx={-10}
            tickFormatter={(value) => `$${(value / 1000)}k`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255, 255, 255, 0.02)" }} />
          <Legend
            verticalAlign="top"
            height={36}
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: "11px", color: THEME_COLORS.text }}
          />
          <Bar
            name="Actual Revenue"
            dataKey="value"
            fill={THEME_COLORS.gold}
            radius={[4, 4, 0, 0]}
            barSize={12}
          />
          <Bar
            name="Projected Revenue"
            dataKey="secondary"
            fill={THEME_COLORS.indigo}
            radius={[4, 4, 0, 0]}
            barSize={12}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Inventory Distribution Donut Chart
 */
export function InventoryDistributionChart({ data, height = 300 }: ChartProps) {
  const colorsList = [
    THEME_COLORS.gold,
    THEME_COLORS.indigo,
    THEME_COLORS.emerald,
    THEME_COLORS.amber,
    THEME_COLORS.rose,
  ];

  return (
    <div className="flex flex-col items-center justify-center" style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip content={<CustomTooltip />} />
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colorsList[index % colorsList.length]} />
            ))}
          </Pie>
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            iconSize={8}
            layout="horizontal"
            align="center"
            wrapperStyle={{ fontSize: "11px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
