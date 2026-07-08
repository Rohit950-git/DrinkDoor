"use client";

import React, { useMemo } from "react";
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
import {
  TrendingUp,
  Users,
  ShoppingBag,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Download,
  Filter,
  CheckCircle,
  AlertCircle,
  Truck,
  Building,
  Key,
  Shield,
  HelpCircle
} from "lucide-react";

export default function AdminDashboardPage() {
  const { user, loading } = useAuth();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  // Mock Data for Showcases
  const stats = useMemo(() => [
    {
      title: "Total Revenue",
      value: "$142,384.50",
      change: "+12.4%",
      isPositive: true,
      description: "vs last month",
      icon: TrendingUp,
      iconColor: "text-indigo-500 bg-indigo-500/10 dark:bg-indigo-500/20",
    },
    {
      title: "Active Distributors",
      value: "48",
      change: "+4.3%",
      isPositive: true,
      description: "3 pending approval",
      icon: Truck,
      iconColor: "text-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/20",
    },
    {
      title: "Registered Shopkeepers",
      value: "1,204",
      change: "+8.2%",
      isPositive: true,
      description: "+24 new this week",
      icon: Users,
      iconColor: "text-blue-500 bg-blue-500/10 dark:bg-blue-500/20",
    },
    {
      title: "Pending Orders",
      value: "14",
      change: "-18.5%",
      isPositive: false,
      description: "avg. 28m fulfillment",
      icon: Clock,
      iconColor: "text-rose-500 bg-rose-500/10 dark:bg-rose-500/20",
    },
  ], []);

  const orders = useMemo(() => [
    { id: "ORD-9024", shopkeeper: "Central Beverages", items: "48 Cases (Soda & Water)", amount: "$840.00", status: "fulfilled", time: "10 mins ago" },
    { id: "ORD-9023", shopkeeper: "Quick Stop Market", items: "12 Cases (Energy Drinks)", amount: "$320.00", status: "pending", time: "45 mins ago" },
    { id: "ORD-9022", shopkeeper: "Apex Distribution", items: "120 Cases (Juices)", amount: "$2,400.00", status: "fulfilled", time: "2 hours ago" },
    { id: "ORD-9021", shopkeeper: "Metro Supermarket", items: "30 Cases (Sparkling)", amount: "$610.00", status: "failed", time: "5 hours ago" },
    { id: "ORD-9020", shopkeeper: "Hilltop Corner Store", items: "15 Cases (Mixed)", amount: "$280.05", status: "fulfilled", time: "1 day ago" },
  ], []);

  const products = useMemo(() => [
    { name: "Premium Spring Water", category: "Water", sku: "WTR-SPR-01", price: "$12.00 / case", stock: "145 cases", status: "In Stock" },
    { name: "Sparkling Lemon Citrus", category: "Sparkling", sku: "SPK-LEM-02", price: "$18.50 / case", stock: "82 cases", status: "In Stock" },
    { name: "Organic Energy Ginger", category: "Energy", sku: "ENG-GNG-03", price: "$28.00 / case", stock: "12 cases", status: "Low Stock" },
    { name: "Classic Cola Zero", category: "Soda", sku: "SDA-COL-04", price: "$15.00 / case", stock: "0 cases", status: "Out of Stock" },
  ], []);

  return (
    <AuthGuard allowedRoles={[UserRole.ADMIN]}>
      <DashboardLayout>
        <PageContainer>
          {/* Overview Tab View */}
          {activeTab === "overview" && (
            <>
              {/* Header */}
              <Header
                title={`Overview`}
                description={`Welcome back, ${user?.name || "Administrator"}. Here is your enterprise overview for today.`}
                actions={
                  <>
                    <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export Reports
                    </Button>
                    <Button variant="primary" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </>
                }
              />

              {/* Stats Grid */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                {stats.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <Card key={idx} hoverGlow={true}>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                          {stat.title}
                        </CardTitle>
                        <div className={`p-2 rounded-xl border border-zinc-200/20 dark:border-zinc-800/40 ${stat.iconColor}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-550">
                          {stat.value}
                        </div>
                        <div className="flex items-center gap-1.5 mt-2">
                          <span
                            className={`flex items-center text-[10px] font-bold px-1.5 py-0.2 rounded font-sans ${
                              stat.isPositive
                                ? "bg-emerald-500/10 text-emerald-650 dark:text-emerald-400"
                                : "bg-rose-500/10 text-rose-650 dark:text-rose-450"
                            }`}
                          >
                            {stat.isPositive ? (
                              <ArrowUpRight className="h-3 w-3 mr-0.5" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3 mr-0.5" />
                            )}
                            {stat.change}
                          </span>
                          <span className="text-[10px] text-zinc-450 dark:text-zinc-500 font-sans">
                            {stat.description}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Charts & Actions Section */}
              <div className="grid gap-6 lg:grid-cols-3 mb-8">
                {/* Visual SVG Chart Card */}
                <Card className="lg:col-span-2" hoverGlow={false}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-sm font-bold text-zinc-850 dark:text-zinc-150">Sales Performance</CardTitle>
                        <CardDescription>Visual sales growth over the past 30 days</CardDescription>
                      </div>
                      <span className="text-[10px] font-bold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded uppercase tracking-wider font-sans">
                        Live Analytics
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="h-64 flex flex-col justify-end pt-4">
                    {/* Glowing Premium SVG Area Chart Mockup */}
                    <div className="relative w-full flex-1 flex items-end">
                      <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="rgb(99, 102, 241)" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="rgb(99, 102, 241)" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        {/* Grid lines */}
                        <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(128,128,128,0.05)" strokeWidth="1" />
                        <line x1="0" y1="100" x2="500" y2="100" stroke="rgba(128,128,128,0.05)" strokeWidth="1" />
                        <line x1="0" y1="150" x2="500" y2="150" stroke="rgba(128,128,128,0.05)" strokeWidth="1" />
                        
                        {/* Area path */}
                        <path
                          d="M 0 170 Q 50 140 100 150 T 200 110 T 300 70 T 400 90 T 500 40 L 500 200 L 0 200 Z"
                          fill="url(#chartGradient)"
                        />
                        {/* Line path */}
                        <path
                          d="M 0 170 Q 50 140 100 150 T 200 110 T 300 70 T 400 90 T 500 40"
                          fill="none"
                          stroke="rgb(99, 102, 241)"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />
                        {/* Chart dots */}
                        <circle cx="300" cy="70" r="5" fill="rgb(99, 102, 241)" stroke="white" strokeWidth="2" />
                        <circle cx="500" cy="40" r="5" fill="rgb(99, 102, 241)" stroke="white" strokeWidth="2" />
                      </svg>
                    </div>
                    {/* Chart Labels */}
                    <div className="flex items-center justify-between text-[10px] text-zinc-400 font-sans mt-4 border-t border-zinc-100 dark:border-zinc-900 pt-3">
                      <span>June 1</span>
                      <span>June 10</span>
                      <span>June 20</span>
                      <span>June 30</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Account Credentials Overview */}
                <Card hoverGlow={false}>
                  <CardHeader>
                    <CardTitle className="text-sm font-bold text-zinc-850 dark:text-zinc-150">My Operator Profile</CardTitle>
                    <CardDescription>System access permissions and roles</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 rounded-2xl border border-zinc-200/50 dark:border-zinc-900/60 bg-zinc-50/50 dark:bg-zinc-950/40 p-4">
                      <Avatar name={user?.name || "Admin"} size="lg" showStatus={true} />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-zinc-900 dark:text-zinc-150 truncate leading-snug">
                          {user?.name}
                        </p>
                        <p className="text-[10px] text-zinc-400 truncate mt-0.5 font-sans leading-none">
                          {user?.email}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 font-sans">
                      <div className="flex items-center justify-between text-xs py-1 border-b border-zinc-100 dark:border-zinc-900/40 pb-2">
                        <span className="text-zinc-450 dark:text-zinc-500">Security Clearance</span>
                        <span className="inline-flex items-center gap-1 font-bold text-[10px] uppercase bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 px-2 py-0.5 rounded leading-none">
                          <Shield className="h-3 w-3 mr-0.5" />
                          {user?.role}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs py-1 border-b border-zinc-100 dark:border-zinc-900/40 pb-2">
                        <span className="text-zinc-450 dark:text-zinc-500">Access Key ID</span>
                        <span className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
                          {user?.id?.substring(0, 12)}...
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs py-1">
                        <span className="text-zinc-450 dark:text-zinc-500">Status</span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-650 dark:text-emerald-450 leading-none">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Online
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Transactions Table Section */}
              <Card hoverGlow={false}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-bold text-zinc-850 dark:text-zinc-150">Recent Retail Orders</CardTitle>
                    <CardDescription>Orders submitted by shopkeepers across your network</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs font-semibold text-indigo-500">
                    View all orders
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-150 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-950/40 text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider select-none font-sans">
                          <th className="px-6 py-4">Order ID</th>
                          <th className="px-6 py-4">Shopkeeper</th>
                          <th className="px-6 py-4">Details</th>
                          <th className="px-6 py-4">Amount</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900/60 text-xs">
                        {orders.map((order, idx) => (
                          <tr
                            key={idx}
                            className="hover:bg-zinc-50/40 dark:hover:bg-zinc-900/20 transition-colors group cursor-pointer"
                          >
                            <td className="px-6 py-4.5 font-mono text-[10px] font-semibold text-zinc-900 dark:text-zinc-50">
                              {order.id}
                            </td>
                            <td className="px-6 py-4.5">
                              <div className="flex items-center gap-3">
                                <Avatar name={order.shopkeeper} size="sm" />
                                <span className="font-semibold text-zinc-800 dark:text-zinc-100">
                                  {order.shopkeeper}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4.5 text-zinc-500 dark:text-zinc-400 font-sans">
                              {order.items}
                            </td>
                            <td className="px-6 py-4.5 font-bold text-zinc-900 dark:text-zinc-100">
                              {order.amount}
                            </td>
                            <td className="px-6 py-4.5">
                              <span
                                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider font-sans border ${
                                  order.status === "fulfilled"
                                    ? "bg-emerald-500/10 text-emerald-650 dark:text-emerald-400 border-emerald-500/20"
                                    : order.status === "pending"
                                    ? "bg-amber-500/10 text-amber-650 dark:text-amber-400 border-amber-500/20"
                                    : "bg-rose-500/10 text-rose-650 dark:text-rose-450 border-rose-500/20"
                                }`}
                              >
                                {order.status === "fulfilled" ? (
                                  <CheckCircle className="h-2.5 w-2.5" />
                                ) : order.status === "pending" ? (
                                  <Clock className="h-2.5 w-2.5" />
                                ) : (
                                  <AlertCircle className="h-2.5 w-2.5" />
                                )}
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4.5 text-zinc-400 font-sans">
                              {order.time}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Products Tab View */}
          {activeTab === "products" && (
            <>
              <Header
                title="Product Catalog"
                description="Manage inventory items, SKUs, wholesale pricing, and availability states."
                actions={
                  <Button variant="primary" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Catalog Entry
                  </Button>
                }
              />

              <Card hoverGlow={false}>
                <CardContent className="p-0">
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-150 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-950/40 text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider font-sans">
                          <th className="px-6 py-4">Product Details</th>
                          <th className="px-6 py-4">SKU Code</th>
                          <th className="px-6 py-4">Wholesale Price</th>
                          <th className="px-6 py-4">In-Stock Count</th>
                          <th className="px-6 py-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900/60 text-xs">
                        {products.map((product, idx) => (
                          <tr key={idx} className="hover:bg-zinc-50/40 dark:hover:bg-zinc-900/20 transition-colors">
                            <td className="px-6 py-4.5">
                              <div>
                                <p className="font-semibold text-zinc-900 dark:text-zinc-100">{product.name}</p>
                                <span className="text-[10px] text-zinc-450 dark:text-zinc-500 font-sans capitalize">{product.category} Beverage</span>
                              </div>
                            </td>
                            <td className="px-6 py-4.5 font-mono text-[10px] text-zinc-500 dark:text-zinc-400">{product.sku}</td>
                            <td className="px-6 py-4.5 font-bold text-zinc-900 dark:text-zinc-50">{product.price}</td>
                            <td className="px-6 py-4.5 text-zinc-650 dark:text-zinc-400 font-sans">{product.stock}</td>
                            <td className="px-6 py-4.5">
                              <span
                                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider font-sans border ${
                                  product.status === "In Stock"
                                    ? "bg-emerald-500/10 text-emerald-650 dark:text-emerald-400 border-emerald-500/20"
                                    : product.status === "Low Stock"
                                    ? "bg-amber-500/10 text-amber-650 dark:text-amber-400 border-amber-500/20"
                                    : "bg-rose-500/10 text-rose-650 dark:text-rose-450 border-rose-500/20"
                                }`}
                              >
                                {product.status}
                              </span>
                            </td>
                          </tr>
                        ))}
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
                  <Button variant="primary" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Register Distributor
                  </Button>
                }
              />
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Active Logistics Entities</CardTitle>
                  <CardDescription>System logs show 48 routes online in real time.</CardDescription>
                </CardHeader>
                <CardContent className="h-64 flex flex-col items-center justify-center text-center">
                  <Truck className="h-10 w-10 text-indigo-500 mb-3 animate-bounce" />
                  <p className="text-xs font-bold text-zinc-900 dark:text-zinc-150">Distributor database synced.</p>
                  <p className="text-[10px] text-zinc-450 font-sans mt-1 max-w-sm">All licensed distribution partners are currently online. Real-time telemetry monitoring is active.</p>
                </CardContent>
              </Card>
            </>
          )}

          {/* Shopkeepers Tab View */}
          {activeTab === "shopkeepers" && (
            <>
              <Header
                title="Shopkeeper Accounts"
                description="Manage authorization limits and credentials of retail store managers."
              />
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Retailer Subscriptions</CardTitle>
                  <CardDescription>Overview of authorized outlets.</CardDescription>
                </CardHeader>
                <CardContent className="h-64 flex flex-col items-center justify-center text-center">
                  <Building className="h-10 w-10 text-emerald-500 mb-3 animate-pulse" />
                  <p className="text-xs font-bold text-zinc-900 dark:text-zinc-150">Shopkeeper Accounts Verified.</p>
                  <p className="text-[10px] text-zinc-450 font-sans mt-1 max-w-sm">Permissions are managed dynamically by the DrinkDoor core security gateway.</p>
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
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-bold text-zinc-800 dark:text-zinc-150">Security Gateways</CardTitle>
                    <CardDescription>JWT and encryption configurations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 font-sans text-xs">
                    <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-3">
                      <div>
                        <p className="font-bold text-zinc-900 dark:text-zinc-100">Core Auth Guard</p>
                        <p className="text-[10px] text-zinc-400">Restricts pages based on database attributes</p>
                      </div>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-650 dark:text-emerald-450 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase">
                        Active
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-3">
                      <div>
                        <p className="font-bold text-zinc-900 dark:text-zinc-100">JWT Token Rotation</p>
                        <p className="text-[10px] text-zinc-400">Tokens rotated every 12 hours automatically</p>
                      </div>
                      <span className="text-[10px] bg-zinc-100 dark:bg-zinc-900 text-zinc-450 dark:text-zinc-550 border border-zinc-200/50 dark:border-zinc-800 px-2 py-0.5 rounded font-bold uppercase">
                        Enforced
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-zinc-900 dark:text-zinc-100">Database Connection</p>
                        <p className="text-[10px] text-zinc-400">Mongoose / MongoDB database cluster</p>
                      </div>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-650 dark:text-emerald-450 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase">
                        Connected
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-bold text-zinc-850 dark:text-zinc-150">Aesthetic Preferences</CardTitle>
                    <CardDescription>Tailwind v4 styling variables</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 font-sans text-xs">
                    <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-3">
                      <div>
                        <p className="font-bold text-zinc-900 dark:text-zinc-100">Grid system sizing</p>
                        <p className="text-[10px] text-zinc-400">Aligned to an 8px spacing standard</p>
                      </div>
                      <span className="font-mono text-[10px] text-zinc-500">8px grid</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-3">
                      <div>
                        <p className="font-bold text-zinc-900 dark:text-zinc-100">Corner rounding index</p>
                        <p className="text-[10px] text-zinc-400">Consistent borders with Vercel styling</p>
                      </div>
                      <span className="font-mono text-[10px] text-zinc-500">20px rounded</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-zinc-900 dark:text-zinc-100">Primary design highlights</p>
                        <p className="text-[10px] text-zinc-400">Indigo accents alongside emerald indicators</p>
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
    </AuthGuard>
  );
}
