"use client";

import React, { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/src/modules/auth/hooks/useAuth";
import { UserRole } from "@/src/modules/auth/types";
import { AuthGuard } from "@/src/modules/auth/components/AuthGuard";
import { Button } from "@/src/components/common/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/common/Card";
import { Avatar } from "@/src/components/common/Avatar";
import { DashboardLayout } from "@/src/components/layout/DashboardLayout";
import { PageContainer } from "@/src/components/layout/PageContainer";
import { Header } from "@/src/components/layout/Header";
import { HeroSection } from "@/src/modules/dashboard/components/HeroSection";
import { StatCard } from "@/src/components/cards/StatCard";
import { useGetDashboardDataQuery } from "@/src/modules/dashboard/services/dashboardApi";
import {
  SalesOverviewChart,
  RevenueAnalyticsChart,
  InventoryDistributionChart,
} from "@/src/components/charts/DashboardCharts";
import {
  WidgetCard,
  RecentActivitiesWidget,
  RecentStockRequestsWidget,
  LatestDispatchesWidget,
  LowStockAlertsWidget,
  CalendarWidget,
  QuickActionsWidget,
} from "@/src/modules/dashboard/components/widgets/DashboardWidgets";
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useToggleUserStatusMutation,
  useAssignDistributorMutation,
  useResetUserPasswordMutation,
} from "@/src/modules/users/services/usersApi";
import { DataTable } from "@/src/components/tables/DataTable";
import { UserForm } from "@/src/modules/users/components/forms/UserForms";
import { BaseModal } from "@/src/modules/users/components/modals/UserModals";
import {
  DeleteConfirmationModal,
  StatusConfirmationModal,
  AssignDistributorModal,
  ResetPasswordModal,
} from "@/src/modules/users/components/modals/UserModals";
import { UserItem } from "@/src/modules/users/types";
import { toast } from "sonner";
import {
  TrendingUp,
  Users,
  ShoppingBag,
  Clock,
  Plus,
  Truck,
  Building,
  Key,
  Shield,
  Loader,
  KeyRound,
  ShieldAlert,
  CheckCircle2,
  UserMinus,
  Edit2,
  Trash2,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  // Dashboard API Query
  const { data: dashboardData, isLoading: isDashboardLoading } = useGetDashboardDataQuery();

  // Users Directory API Query & Mutations
  const { data: usersData, isLoading: isUsersLoading } = useGetUsersQuery();
  const [createUser, { isLoading: isCreateLoading }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdateLoading }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleteLoading }] = useDeleteUserMutation();
  const [toggleUserStatus, { isLoading: isStatusLoading }] = useToggleUserStatusMutation();
  const [assignDistributor, { isLoading: isAssignLoading }] = useAssignDistributorMutation();
  const [resetPassword, { isLoading: isResetLoading }] = useResetUserPasswordMutation();

  // Modal State Management
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);

  // Stats list calculations
  const statsList = useMemo(() => {
    if (!dashboardData) return [];
    const s = dashboardData.stats;
    return [
      { title: "Monthly Revenue", value: s.monthlyRevenue.value, change: s.monthlyRevenue.change, isPositive: s.monthlyRevenue.isPositive, icon: TrendingUp, color: "text-[#D4AF37] bg-[#D4AF37]/10" },
      { title: "Inventory Valuation", value: s.totalInventory.value, change: s.totalInventory.change, isPositive: s.totalInventory.isPositive, icon: ShoppingBag, color: "text-indigo-400 bg-indigo-500/10" },
      { title: "Pending Requests", value: s.pendingRequests.value, change: s.pendingRequests.change, isPositive: s.pendingRequests.isPositive, icon: Clock, color: "text-amber-450 bg-amber-500/10" },
      { title: "Active Users", value: s.activeUsers.value, change: s.activeUsers.change, isPositive: s.activeUsers.isPositive, icon: Users, color: "text-emerald-450 bg-emerald-500/10" },
    ];
  }, [dashboardData]);

  // CRUD Trigger Handlers
  const handleAddSubmit = async (data: any) => {
    try {
      const res = await createUser(data).unwrap();
      if (res.success) {
        toast.success(`Operator ${data.name} registered successfully`);
        setIsAddOpen(false);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create user");
    }
  };

  const handleEditSubmit = async (data: any) => {
    if (!selectedUser) return;
    try {
      const res = await updateUser({ id: selectedUser.id, body: data }).unwrap();
      if (res.success) {
        toast.success(`Operator details updated`);
        setIsEditOpen(false);
        setSelectedUser(null);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update user");
    }
  };

  const handleDeleteSubmit = async () => {
    if (!selectedUser) return;
    try {
      await deleteUser(selectedUser.id).unwrap();
      toast.success("User access revoked permanently");
      setIsDeleteOpen(false);
      setSelectedUser(null);
    } catch (err: any) {
      toast.error("Failed to delete user");
    }
  };

  const handleStatusToggle = async () => {
    if (!selectedUser) return;
    try {
      await toggleUserStatus({ id: selectedUser.id, isActive: !selectedUser.isActive }).unwrap();
      toast.success(`Operator access status modified`);
      setIsStatusOpen(false);
      setSelectedUser(null);
    } catch (err: any) {
      toast.error("Failed to toggle operator status");
    }
  };

  const handleAssignSubmit = async (data: any) => {
    if (!selectedUser) return;
    try {
      await assignDistributor({ id: selectedUser.id, distributor: data.distributor }).unwrap();
      toast.success(`Logistics hub assigned successfully`);
      setIsAssignOpen(false);
      setSelectedUser(null);
    } catch (err: any) {
      toast.error("Failed to assign distributor");
    }
  };

  const handleResetSubmit = async (data: any) => {
    if (!selectedUser) return;
    try {
      await resetPassword(selectedUser.id).unwrap();
      toast.success(`Password updated for ${selectedUser.name}`);
      setIsResetOpen(false);
      setSelectedUser(null);
    } catch (err: any) {
      toast.error("Failed to reset password");
    }
  };

  // Enterprise Columns Definitions for DataTable
  const userColumns = [
    {
      key: "name",
      label: "Operator Name",
      render: (row: UserItem) => (
        <div className="flex items-center gap-3 select-none">
          <Avatar name={row.name} size="sm" showStatus={false} />
          <div>
            <p className="font-bold text-white leading-tight">{row.name}</p>
            <p className="text-[10px] text-zinc-500 font-sans">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      label: "Phone Contact",
      render: (row: UserItem) => <span className="font-sans">{row.phone || "—"}</span>,
    },
    {
      key: "role",
      label: "Portal Role",
      render: (row: UserItem) => {
        const colors =
          row.role === UserRole.ADMIN
            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
            : row.role === UserRole.DISTRIBUTOR
            ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
        return (
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border uppercase tracking-wider ${colors}`}>
            {row.role}
          </span>
        );
      },
    },
    {
      key: "distributor",
      label: "Assigned Hub",
      render: (row: UserItem) => (
        <span className="font-sans font-medium text-zinc-300">
          {row.distributor ? (
            <span className="flex items-center gap-1">
              <Truck className="h-3.5 w-3.5 text-indigo-400" />
              {row.distributor}
            </span>
          ) : (
            <span className="text-zinc-650">—</span>
          )}
        </span>
      ),
    },
    {
      key: "isActive",
      label: "System Status",
      render: (row: UserItem) => (
        <button
          onClick={() => {
            setSelectedUser(row);
            setIsStatusOpen(true);
          }}
          className="outline-none"
        >
          {row.isActive ? (
            <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-3 w-3" />
              Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold bg-zinc-900 text-zinc-500 border border-white/[0.04]">
              <UserMinus className="h-3 w-3" />
              Deactivated
            </span>
          )}
        </button>
      ),
    },
    {
      key: "lastLogin",
      label: "Last Seen",
      render: (row: UserItem) => <span className="font-sans text-zinc-450">{row.lastLogin || "Never"}</span>,
    },
    {
      key: "actions",
      label: "Controls",
      sortable: false,
      render: (row: UserItem) => (
        <div className="flex items-center gap-2">
          {/* Edit User */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedUser(row);
              setIsEditOpen(true);
            }}
            className="h-7 w-7 rounded-lg hover:bg-zinc-800 hover:text-white"
            title="Edit details"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>

          {/* Key Reset */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedUser(row);
              setIsResetOpen(true);
            }}
            className="h-7 w-7 rounded-lg hover:bg-zinc-800 hover:text-indigo-400"
            title="Rotate Key/Password"
          >
            <KeyRound className="h-3.5 w-3.5" />
          </Button>

          {/* Assign Hub */}
          {(row.role === UserRole.SHOPKEEPER || row.role === UserRole.DISTRIBUTOR) && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedUser(row);
                setIsAssignOpen(true);
              }}
              className="h-7 w-7 rounded-lg hover:bg-zinc-800 hover:text-[#D4AF37]"
              title="Assign distributor hub"
            >
              <Truck className="h-3.5 w-3.5" />
            </Button>
          )}

          {/* Revoke Access */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedUser(row);
              setIsDeleteOpen(true);
            }}
            className="h-7 w-7 rounded-lg hover:bg-zinc-850 hover:text-rose-400"
            title="Revoke access"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  const filterFields = [
    {
      key: "role",
      label: "Roles",
      options: [
        { value: UserRole.ADMIN, label: "Admin" },
        { value: UserRole.DISTRIBUTOR, label: "Distributor" },
        { value: UserRole.SHOPKEEPER, label: "Shopkeeper" },
      ],
    },
    {
      key: "distributor",
      label: "Logistics Hubs",
      options: [
        { value: "Apex Logistics", label: "Apex Logistics" },
        { value: "Global Transit", label: "Global Transit" },
      ],
    },
  ];

  if (isDashboardLoading || !dashboardData) {
    return (
      <AuthGuard allowedRoles={[UserRole.ADMIN]}>
        <DashboardLayout>
          <PageContainer className="flex h-[80vh] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#D4AF37] border-t-transparent" />
              <p className="text-sm font-semibold text-zinc-500 animate-pulse">Syncing dashboard data...</p>
            </div>
          </PageContainer>
        </DashboardLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard allowedRoles={[UserRole.ADMIN]}>
      <DashboardLayout>
        <PageContainer>
          {/* Overview Tab View */}
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
                <WidgetCard
                  title="Sales & Projections"
                  subtitle="Unified performance and forecast models"
                  className="lg:col-span-2"
                >
                  <RevenueAnalyticsChart data={dashboardData.revenueAnalytics} height={320} />
                </WidgetCard>

                <WidgetCard title="Inventory Breakdown" subtitle="Distribution by category">
                  <InventoryDistributionChart data={dashboardData.inventoryDistribution} height={300} />
                </WidgetCard>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                <WidgetCard title="Operations Agenda" subtitle="Logistics schedule events">
                  <CalendarWidget />
                </WidgetCard>

                <WidgetCard title="Recent Activity logs" subtitle="Decentralized operator actions">
                  <RecentActivitiesWidget activities={dashboardData.recentActivities} />
                </WidgetCard>

                <WidgetCard title="Quick Console actions" subtitle="Enterprise ERP functions">
                  <QuickActionsWidget />
                </WidgetCard>
              </div>

              <WidgetCard
                title="Recent Stock Requests"
                subtitle="Retailer requests pending or approved"
                action={
                  <Button variant="ghost" className="text-xs text-[#D4AF37] hover:text-[#B8932C]">
                    View all requests
                  </Button>
                }
              >
                <RecentStockRequestsWidget requests={dashboardData.recentStockRequests} />
              </WidgetCard>
            </div>
          )}

          {/* User Directory Tab View */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <Header
                title="User Directory"
                description="Securely manage operations access, assign distribution nodes, and enforce password rotation guidelines."
                actions={
                  <Button
                    onClick={() => setIsAddOpen(true)}
                    className="bg-[#D4AF37] hover:bg-[#B8932C] text-black font-bold h-9.5 rounded-xl px-4 text-xs tracking-wide shadow-lg flex items-center gap-1.5"
                  >
                    <Plus className="h-4 w-4" />
                    Add Operator
                  </Button>
                }
              />

              {isUsersLoading ? (
                <div className="flex h-64 items-center justify-center">
                  <Loader className="h-6 w-6 animate-spin text-[#D4AF37]" />
                </div>
              ) : (
                <DataTable
                  columns={userColumns}
                  data={usersData?.data || []}
                  searchPlaceholder="Search operator name, email, role..."
                  filterFields={filterFields}
                />
              )}
            </div>
          )}

          {/* Products Tab View */}
          {activeTab === "products" && (
            <>
              <Header
                title="Product Catalog"
                description="Manage inventory items, SKUs, wholesale pricing, and availability states."
                actions={
                  <Button className="bg-[#D4AF37] hover:bg-[#B8932C] text-black font-bold" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Catalog Entry
                  </Button>
                }
              />

              <div className="grid gap-6 lg:grid-cols-3 mb-8">
                <WidgetCard title="Sales Performance" subtitle="Sales analytics" className="lg:col-span-2">
                  <SalesOverviewChart data={dashboardData.salesOverview} height={280} />
                </WidgetCard>

                <WidgetCard title="Critical Stock Alerts" subtitle="Restock threshold warnings">
                  <LowStockAlertsWidget products={dashboardData.lowStockProducts} />
                </WidgetCard>
              </div>

              <Card className="border-white/[0.06] bg-zinc-900/40 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-base text-white">Catalog Inventory Items</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/[0.06] bg-zinc-900/60 text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-sans">
                          <th className="px-6 py-4">Product Details</th>
                          <th className="px-6 py-4">SKU Code</th>
                          <th className="px-6 py-4">Wholesale Price</th>
                          <th className="px-6 py-4">In-Stock Count</th>
                          <th className="px-6 py-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.02] text-xs">
                        <tr className="hover:bg-white/[0.01] transition-colors">
                          <td className="px-6 py-4.5">
                            <div>
                              <p className="font-semibold text-white">Macallan Sherry Oak 18 Year</p>
                              <span className="text-[10px] text-zinc-500 font-sans capitalize">Whiskey Beverage</span>
                            </div>
                          </td>
                          <td className="px-6 py-4.5 font-mono text-[10px] text-zinc-400">WHI-MAC-18Y</td>
                          <td className="px-6 py-4.5 font-bold text-white">$240.00 / bottle</td>
                          <td className="px-6 py-4.5 text-zinc-450 font-sans">3 cases</td>
                          <td className="px-6 py-4.5">
                            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider font-sans border bg-rose-500/10 text-rose-450 border-rose-500/20">
                              Low Stock
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-white/[0.01] transition-colors">
                          <td className="px-6 py-4.5">
                            <div>
                              <p className="font-semibold text-white">Glenfiddich 12 Year Single Malt</p>
                              <span className="text-[10px] text-zinc-500 font-sans capitalize">Whiskey Beverage</span>
                            </div>
                          </td>
                          <td className="px-6 py-4.5 font-mono text-[10px] text-zinc-400">WHI-GLN-12Y</td>
                          <td className="px-6 py-4.5 font-bold text-white">$65.00 / bottle</td>
                          <td className="px-6 py-4.5 text-zinc-450 font-sans">48 cases</td>
                          <td className="px-6 py-4.5">
                            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider font-sans border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                              In Stock
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Distributors Tab View */}
          {activeTab === "distributors" && (
            <>
              <Header
                title="Distributor Directory"
                description="List of vetted logistics teams delivering packages to shopkeepers."
                actions={
                  <Button className="bg-[#D4AF37] hover:bg-[#B8932C] text-black font-bold" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Register Distributor
                  </Button>
                }
              />
              <div className="grid gap-6 md:grid-cols-3 mb-8">
                <WidgetCard title="Dispatch Trend" subtitle="Daily logistics volumes">
                  <SalesOverviewChart data={dashboardData.dispatchTrend} height={200} />
                </WidgetCard>
                <div className="md:col-span-2">
                  <WidgetCard title="Active Logistics Entities" subtitle="Latest dispatches status">
                    <LatestDispatchesWidget dispatches={dashboardData.latestDispatches} />
                  </WidgetCard>
                </div>
              </div>
            </>
          )}

          {/* Shopkeepers Tab View */}
          {activeTab === "shopkeepers" && (
            <>
              <Header
                title="Shopkeeper Accounts"
                description="Manage authorization limits and credentials of retail store managers."
              />
              <Card className="border-white/[0.06] bg-zinc-900/40 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-base text-white">Retailer Outlet Subscriptions</CardTitle>
                  <CardDescription className="text-zinc-500">Overview of authorized outlet outlets.</CardDescription>
                </CardHeader>
                <CardContent className="h-64 flex flex-col items-center justify-center text-center">
                  <Building className="h-10 w-10 text-emerald-500 mb-3 animate-pulse" />
                  <p className="text-xs font-bold text-white">Shopkeeper Accounts Verified.</p>
                  <p className="text-[10px] text-zinc-500 font-sans mt-1 max-w-sm">
                    Permissions are managed dynamically by the DrinkDoor core security gateway.
                  </p>
                </CardContent>
              </Card>
            </>
          )}

          {/* Settings Tab View */}
          {activeTab === "settings" && (
            <>
              <Header
                title="System Settings"
                description="Manage security tokens, layout views, and administrative profiles."
              />
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-white/[0.06] bg-zinc-900/40 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-base text-white">Security Gateways</CardTitle>
                    <CardDescription className="text-zinc-500">JWT and encryption configurations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 font-sans text-xs">
                    <div className="flex items-center justify-between border-b border-white/[0.04] pb-3">
                      <div>
                        <p className="font-bold text-white">Core Auth Guard</p>
                        <p className="text-[10px] text-zinc-500">Restricts pages based on database attributes</p>
                      </div>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase">
                        Active
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-b border-white/[0.04] pb-3">
                      <div>
                        <p className="font-bold text-white">JWT Token Rotation</p>
                        <p className="text-[10px] text-zinc-500">Tokens rotated every 12 hours automatically</p>
                      </div>
                      <span className="text-[10px] bg-zinc-900 text-zinc-400 border border-white/[0.06] px-2 py-0.5 rounded font-bold uppercase">
                        Enforced
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">Database Connection</p>
                        <p className="text-[10px] text-zinc-500">Mongoose / MongoDB database cluster</p>
                      </div>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase">
                        Connected
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-white/[0.06] bg-zinc-900/40 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-base text-white">Aesthetic Preferences</CardTitle>
                    <CardDescription className="text-zinc-500">Tailwind v4 styling variables</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 font-sans text-xs">
                    <div className="flex items-center justify-between border-b border-white/[0.04] pb-3">
                      <div>
                        <p className="font-bold text-white">Grid system sizing</p>
                        <p className="text-[10px] text-zinc-500">Aligned to an 8px spacing standard</p>
                      </div>
                      <span className="font-mono text-[10px] text-zinc-500">8px grid</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-white/[0.04] pb-3">
                      <div>
                        <p className="font-bold text-white">Corner rounding index</p>
                        <p className="text-[10px] text-zinc-500">Consistent borders with Vercel styling</p>
                      </div>
                      <span className="font-mono text-[10px] text-zinc-500">16px rounded</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">Primary design highlights</p>
                        <p className="text-[10px] text-zinc-500">Indigo accents alongside emerald indicators</p>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <span className="h-4 w-4 rounded-full bg-indigo-500 border border-indigo-400/20 shadow-sm" />
                        <span className="h-4 w-4 rounded-full bg-emerald-500 border border-emerald-400/20 shadow-sm" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </PageContainer>
      </DashboardLayout>

      {/* CRUD Modals Integration */}
      {/* 1. Add Operator Modal */}
      <BaseModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Register New Portal Operator"
        description="Add a new administrator, shopkeeper, or distributor node to the network."
      >
        <UserForm onSubmit={handleAddSubmit} isLoading={isCreateLoading} isEdit={false} />
      </BaseModal>

      {/* 2. Edit Operator Modal */}
      {selectedUser && (
        <BaseModal
          isOpen={isEditOpen}
          onClose={() => {
            setIsEditOpen(false);
            setSelectedUser(null);
          }}
          title={`Edit Operator: ${selectedUser.name}`}
          description="Update credentials and system access permissions."
        >
          <UserForm
            onSubmit={handleEditSubmit}
            isLoading={isUpdateLoading}
            isEdit={true}
            defaultValues={{
              name: selectedUser.name,
              email: selectedUser.email,
              phone: selectedUser.phone,
              role: selectedUser.role,
              distributor: selectedUser.distributor || "",
            }}
          />
        </BaseModal>
      )}

      {/* 3. Status Switch Confirmation Modal */}
      {selectedUser && (
        <StatusConfirmationModal
          isOpen={isStatusOpen}
          onClose={() => {
            setIsStatusOpen(false);
            setSelectedUser(null);
          }}
          onConfirm={handleStatusToggle}
          userName={selectedUser.name}
          isActive={selectedUser.isActive}
          isLoading={isStatusLoading}
        />
      )}

      {/* 4. Assign Logistics Hub Modal */}
      {selectedUser && (
        <AssignDistributorModal
          isOpen={isAssignOpen}
          onClose={() => {
            setIsAssignOpen(false);
            setSelectedUser(null);
          }}
          onSubmit={handleAssignSubmit}
          userName={selectedUser.name}
          defaultHub={selectedUser.distributor}
          isLoading={isAssignLoading}
        />
      )}

      {/* 5. Force Password Rotation Modal */}
      {selectedUser && (
        <ResetPasswordModal
          isOpen={isResetOpen}
          onClose={() => {
            setIsResetOpen(false);
            setSelectedUser(null);
          }}
          onSubmit={handleResetSubmit}
          userName={selectedUser.name}
          isLoading={isResetLoading}
        />
      )}

      {/* 6. Revoke Access Confirmation Modal */}
      {selectedUser && (
        <DeleteConfirmationModal
          isOpen={isDeleteOpen}
          onClose={() => {
            setIsDeleteOpen(false);
            setSelectedUser(null);
          }}
          onConfirm={handleDeleteSubmit}
          userName={selectedUser.name}
          isLoading={isDeleteLoading}
        />
      )}
    </AuthGuard>
  );
}
