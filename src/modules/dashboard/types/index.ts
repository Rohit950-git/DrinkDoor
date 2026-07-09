export interface DashboardStats {
  totalProducts: { value: number; change: number; isPositive: boolean };
  totalInventory: { value: string; change: number; isPositive: boolean };
  todaySales: { value: string; change: number; isPositive: boolean };
  monthlyRevenue: { value: string; change: number; isPositive: boolean };
  pendingRequests: { value: number; change: number; isPositive: boolean };
  approvedRequests: { value: number; change: number; isPositive: boolean };
  dispatches: { value: number; change: number; isPositive: boolean };
  deliveries: { value: number; change: number; isPositive: boolean };
  lowStockCount: { value: number; change: number; isPositive: boolean };
  activeUsers: { value: number; change: number; isPositive: boolean };
}

export interface ChartDataPoint {
  name: string;
  value: number;
  secondary?: number;
}

export interface ActivityLog {
  id: string;
  user: string;
  role: string;
  action: string;
  target: string;
  time: string;
  type: "info" | "success" | "warning" | "error";
}

export interface StockRequest {
  id: string;
  shopkeeper: string;
  items: string;
  status: "pending" | "approved" | "rejected";
  time: string;
}

export interface DispatchLog {
  id: string;
  distributor: string;
  destination: string;
  items: string;
  status: "in-transit" | "dispatched" | "completed";
  time: string;
}

export interface DeliveryLog {
  id: string;
  distributor: string;
  shopkeeper: string;
  status: "delivered" | "failed" | "returned";
  amount: string;
  time: string;
}

export interface TopProduct {
  id: string;
  name: string;
  category: string;
  sales: number;
  revenue: string;
  image?: string;
}

export interface LowStockProduct {
  id: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  sku: string;
}

export interface DashboardResponse {
  stats: DashboardStats;
  salesOverview: ChartDataPoint[];
  revenueAnalytics: ChartDataPoint[];
  weeklySales: ChartDataPoint[];
  monthlySales: ChartDataPoint[];
  inventoryDistribution: ChartDataPoint[];
  productCategories: ChartDataPoint[];
  dispatchTrend: ChartDataPoint[];
  deliveryTrend: ChartDataPoint[];
  stockMovement: ChartDataPoint[];
  recentActivities: ActivityLog[];
  recentStockRequests: StockRequest[];
  latestDispatches: DispatchLog[];
  latestDeliveries: DeliveryLog[];
  lowStockProducts: LowStockProduct[];
  topSellingProducts: TopProduct[];
}
