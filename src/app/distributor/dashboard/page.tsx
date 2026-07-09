"use client";

import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/src/modules/auth/hooks/useAuth";
import { UserRole } from "@/src/modules/auth/types";
import { AuthGuard } from "@/src/modules/auth/components/AuthGuard";
import { Button } from "@/src/components/common/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/common/Card";
import { DashboardLayout } from "@/src/components/layout/DashboardLayout";
import { PageContainer } from "@/src/components/layout/PageContainer";
import { Header } from "@/src/components/layout/Header";
import { HeroSection } from "@/src/modules/dashboard/components/HeroSection";
import { StatCard } from "@/src/components/cards/StatCard";
import { useGetDashboardDataQuery } from "@/src/modules/dashboard/services/dashboardApi";
import {
  SalesOverviewChart,
  InventoryDistributionChart,
} from "@/src/components/charts/DashboardCharts";
import {
  WidgetCard,
  LatestDispatchesWidget,
  LowStockAlertsWidget,
  CalendarWidget,
} from "@/src/modules/dashboard/components/widgets/DashboardWidgets";
import {
  TrendingUp,
  Clock,
  Plus,
  Truck,
  Building,
  Shield,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export default function DistributorDashboardPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  const { data: dashboardData, isLoading } = useGetDashboardDataQuery();

  const statsList = useMemo(() => {
    if (!dashboardData) return [];
    const s = dashboardData.stats;
    return [
      { title: "Today's Deliveries", value: s.deliveries.value, change: s.deliveries.change, isPositive: s.deliveries.isPositive, icon: CheckCircle2, color: "text-emerald-450 bg-emerald-500/10" },
      { title: "Active Dispatches", value: s.dispatches.value, change: s.dispatches.change, isPositive: s.dispatches.isPositive, icon: Truck, color: "text-indigo-400 bg-indigo-500/10" },
      { title: "Pending Orders", value: s.pendingRequests.value, change: s.pendingRequests.change, isPositive: s.pendingRequests.isPositive, icon: Clock, color: "text-amber-450 bg-amber-500/10" },
      { title: "Low Stock Items", value: s.lowStockCount.value, change: s.lowStockCount.change, isPositive: s.lowStockCount.isPositive, icon: AlertTriangle, color: "text-rose-450 bg-rose-500/10" },
    ];
  }, [dashboardData]);

  if (isLoading || !dashboardData) {
    return (
      <AuthGuard allowedRoles={[UserRole.DISTRIBUTOR]}>
        <DashboardLayout>
          <PageContainer className="flex h-[80vh] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
              <p className="text-sm font-semibold text-zinc-500 animate-pulse">Syncing logistics console...</p>
            </div>
          </PageContainer>
        </DashboardLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard allowedRoles={[UserRole.DISTRIBUTOR]}>
      <DashboardLayout>
        <PageContainer>
          {activeTab === "overview" && (
            <div className="space-y-8">
              <HeroSection />

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {statsList.map((stat, idx) => (
                  <StatCard
                    key={idx}
                    title={stat.title}
                    value={stat.value}
                    change={stat.change}
                    isPositive={stat.isPositive}
                    icon={stat.icon}
                    iconColor={stat.color}
                  />
                ))}
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <WidgetCard title="Logistics Dispatches Console" subtitle="Telematics monitoring active">
                    <LatestDispatchesWidget dispatches={dashboardData.latestDispatches} />
                  </WidgetCard>
                </div>
                <WidgetCard title="Distributor Route Calendar" subtitle="Agenda of drops">
                  <CalendarWidget />
                </WidgetCard>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                <WidgetCard title="Critical Stock Levels" subtitle="Restock recommendations">
                  <LowStockAlertsWidget products={dashboardData.lowStockProducts} />
                </WidgetCard>
                <div className="lg:col-span-2">
                  <WidgetCard title="Dispatch Telemetry Trend" subtitle="Daily logistics volumes">
                    <SalesOverviewChart data={dashboardData.dispatchTrend} height={200} />
                  </WidgetCard>
                </div>
              </div>
            </div>
          )}

          {activeTab === "inventory" && (
            <>
              <Header
                title="Warehouse Inventory"
                description="Manage inventory quantities at your distribution hub."
              />
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <Card className="border-white/[0.06] bg-zinc-900/40 backdrop-blur-xl">
                    <CardHeader>
                      <CardTitle className="text-base text-white">Stock Allocation</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto w-full">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-white/[0.06] bg-zinc-900/60 text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-sans">
                              <th className="px-6 py-4">Product</th>
                              <th className="px-6 py-4">SKU</th>
                              <th className="px-6 py-4">Category</th>
                              <th className="px-6 py-4 text-right">In Stock</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/[0.02] text-xs">
                            <tr className="hover:bg-white/[0.01] transition-colors">
                              <td className="px-6 py-4.5 font-semibold text-white">Macallan Sherry Oak 18 Year</td>
                              <td className="px-6 py-4.5 font-mono text-[10px] text-zinc-400">WHI-MAC-18Y</td>
                              <td className="px-6 py-4.5 text-zinc-450 font-sans">Whiskey</td>
                              <td className="px-6 py-4.5 text-right font-bold text-rose-400">3 cases</td>
                            </tr>
                            <tr className="hover:bg-white/[0.01] transition-colors">
                              <td className="px-6 py-4.5 font-semibold text-white">Grey Goose Original Vodka</td>
                              <td className="px-6 py-4.5 font-mono text-[10px] text-zinc-400">VOD-GRY-GSE</td>
                              <td className="px-6 py-4.5 text-zinc-450 font-sans">Vodka</td>
                              <td className="px-6 py-4.5 text-right font-bold text-[#D4AF37]">48 cases</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <WidgetCard title="Inventory Distribution" subtitle="Stock holding volume">
                  <InventoryDistributionChart data={dashboardData.inventoryDistribution} height={250} />
                </WidgetCard>
              </div>
            </>
          )}

          {activeTab === "settings" && (
            <>
              <Header title="Hub Settings" description="Configure distribution hub keys and profile." />
              <Card className="border-white/[0.06] bg-zinc-900/40 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-base text-white">Operator profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 font-sans text-xs">
                  <div className="flex items-center justify-between border-b border-white/[0.04] pb-3">
                    <span className="text-zinc-500">Name</span>
                    <span className="font-semibold text-white">{user?.name}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/[0.04] pb-3">
                    <span className="text-zinc-500">Email</span>
                    <span className="font-semibold text-white">{user?.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Node Clearance</span>
                    <span className="font-semibold text-indigo-400 uppercase tracking-wide">{user?.role}</span>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </PageContainer>
      </DashboardLayout>
    </AuthGuard>
  );
}
