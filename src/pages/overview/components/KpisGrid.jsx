import {
  DollarSign,
  ShoppingBag,
  CheckCircle2,
  Users,
  Package,
  FolderTree,
  TrendingUp,
} from "lucide-react";
import KpiCard from "./KpiCard";
import { formatCurrency, formatNumber } from "../utils";

const KpisGrid = ({ kpis }) => {
  const items = [
    {
      label: "Total Revenue",
      value: formatCurrency(kpis?.totalRevenue),
      icon: DollarSign,
      accent: "main",
    },
    {
      label: "Avg Order Value",
      value: formatCurrency(kpis?.averageOrderValue),
      icon: TrendingUp,
      accent: "main",
    },
    {
      label: "Total Orders",
      value: formatNumber(kpis?.totalOrders),
      icon: ShoppingBag,
      accent: "soft",
      to: "/orders",
    },
    {
      label: "Paid Orders",
      value: formatNumber(kpis?.paidOrders),
      icon: CheckCircle2,
      accent: "main",
      to: "/orders?status=PAID",
    },
    {
      label: "Total Users",
      value: formatNumber(kpis?.totalUsers),
      icon: Users,
      accent: "blue",
      to: "/system",
    },
    {
      label: "Total Products",
      value: formatNumber(kpis?.totalProducts),
      icon: Package,
      accent: "soft",
      to: "/products",
    },
    {
      label: "Total Categories",
      value: formatNumber(kpis?.totalCategories),
      icon: FolderTree,
      accent: "amber",
      to: "/categories",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <KpiCard key={item.label} {...item} />
      ))}
    </div>
  );
};

export default KpisGrid;
