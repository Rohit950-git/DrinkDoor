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
} from "@/src/components/charts/DashboardCharts";
import {
  WidgetCard,
  RecentStockRequestsWidget,
  CalendarWidget,
  QuickActionsWidget,
} from "@/src/modules/dashboard/components/widgets/DashboardWidgets";
import {
  TrendingUp,
  Clock,
  Plus,
  ShoppingBag,
  CheckCircle2,
  Calendar,
} from "lucide-react";

export default function ShopkeeperDashboardPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  const { data: dashboardData, isLoading } = useGetDashboardDataQuery();

  const statsList = useMemo(() => {
    if (!dashboardData) return [];
    const s = dashboardData.stats;
    return [
      { title: "Today's Purchases", value: "$3,420.00", change: 12.4, isPositive: true, icon: ShoppingBag, color: "text-[#D4AF37] bg-[#D4AF37]/10" },
      { title: "Pending Orders", value: s.pendingRequests.value, change: s.pendingRequests.change, isPositive: s.pendingRequests.isPositive, icon: Clock, color: "text-amber-450 bg-amber-500/10" },
      { title: "Approved Orders", value: s.approvedRequests.value, change: s.approvedRequests.change, isPositive: s.approvedRequests.isPositive, icon: CheckCircle2, color: "text-emerald-450 bg-emerald-500/10" },
      { title: "Monthly Spending", value: "$18,240.00", change: 4.8, isPositive: true, icon: TrendingUp, color: "text-indigo-400 bg-indigo-500/10" },
    ];
  }, [dashboardData]);

  if (isLoading || !dashboardData) {
    return (
      <AuthGuard allowedRoles={[UserRole.SHOPKEEPER]}>
        <DashboardLayout>
          <PageContainer className="flex h-[80vh] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
              <p className="text-sm font-semibold text-zinc-500 animate-pulse">Syncing shopkeeper console...</p>
            </div>
          </PageContainer>
        </DashboardLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard allowedRoles={[UserRole.SHOPKEEPER]}>
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
                  <WidgetCard
                    title="Recent Stock Orders"
                    subtitle="Status of requests submitted to distributors"
                    action={
                      <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold" size="sm">
                        <Plus className="h-4 w-4 mr-1.5" />
                        New Request
                      </Button>
                    }
                  >
                    <RecentStockRequestsWidget requests={dashboardData.recentStockRequests} />
                  </WidgetCard>
                </div>
                <WidgetCard title="Retail Operations Console" subtitle="System controls">
                  <QuickActionsWidget />
                </WidgetCard>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                <WidgetCard title="Logistics Agenda Calendar" subtitle="Drops schedule events">
                  <CalendarWidget />
                </WidgetCard>
                <div className="lg:col-span-2">
                  <WidgetCard title="Order Allocation Analytics" subtitle="Weekly expenditure metrics">
                    <SalesOverviewChart data={dashboardData.salesOverview} height={200} />
                  </WidgetCard>
                </div>
              </div>
            </div>
          )}

          {activeTab === "order" && (
            <>
              <Header
                title="Catalog Ordering"
                description="Browse available brands and submit wholesale stock requests to distributors."
                actions={
                  <Button className="bg-[#D4AF37] hover:bg-[#B8932C] text-black font-bold" size="sm">
                    View Shopping Cart (0)
                  </Button>
                }
              />
              <Card className="border-white/[0.06] bg-zinc-900/40 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-base text-white">Wholesale Catalog</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/[0.06] bg-zinc-900/60 text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-sans">
                          <th className="px-6 py-4">Brand / Item</th>
                          <th className="px-6 py-4">Category</th>
                          <th className="px-6 py-4">Wholesale Price</th>
                          <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.02] text-xs">
                        <tr className="hover:bg-white/[0.01] transition-colors">
                          <td className="px-6 py-4.5 font-semibold text-white">Macallan Sherry Oak 18 Year</td>
                          <td className="px-6 py-4.5 text-zinc-500">Whiskey</td>
                          <td className="px-6 py-4.5 font-bold text-white">$240.00 / bottle</td>
                          <td className="px-6 py-4.5 text-right">
                            <Button className="bg-[#D4AF37] hover:bg-[#B8932C] text-black font-bold" size="sm">
                              Add
                            </Button>
                          </td>
                        </tr>
                        <tr className="hover:bg-white/[0.01] transition-colors">
                          <td className="px-6 py-4.5 font-semibold text-white">Grey Goose Original Vodka</td>
                          <td className="px-6 py-4.5 text-zinc-500">Vodka</td>
                          <td className="px-6 py-4.5 font-bold text-white">$65.00 / bottle</td>
                          <td className="px-6 py-4.5 text-right">
                            <Button className="bg-[#D4AF37] hover:bg-[#B8932C] text-black font-bold" size="sm">
                              Add
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === "settings" && (
            <>
              <Header title="Retail Settings" description="Configure retail outlet options and profile." />
              <Card className="border-white/[0.06] bg-zinc-900/40 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-base text-white">Store credentials</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 font-sans text-xs">
                  <div className="flex items-center justify-between border-b border-white/[0.04] pb-3">
                    <span className="text-zinc-500">Authorized Manager</span>
                    <span className="font-semibold text-white">{user?.name}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/[0.04] pb-3">
                    <span className="text-zinc-500">Email</span>
                    <span className="font-semibold text-white">{user?.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Clearance Grade</span>
                    <span className="font-semibold text-[#D4AF37] uppercase tracking-wide">{user?.role}</span>
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
