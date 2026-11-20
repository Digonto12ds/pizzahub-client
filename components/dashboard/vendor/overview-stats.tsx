
import {
  Pizza,
  CheckCircle2,
  Clock,
  ShoppingBag,
  Crown,
} from "lucide-react";

import type { VendorOverview } from "@/lib/api/vendor";

type OverviewStatsProps = {
  overview: VendorOverview;
  isLoading?: boolean;
};

const statsConfig = [
  {
    title: "Total Menu Items",
    key: "totalMenuItems",
    icon: Pizza,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    title: "Active Menu Items",
    key: "activeMenuItems",
    icon: CheckCircle2,
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    title: "Pending Orders",
    key: "pendingOrders",
    icon: Clock,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    title: "Accepted Orders",
    key: "acceptedOrders",
    icon: ShoppingBag,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    title: "Subscription Plan",
    key: "subscriptionPlan",
    icon: Crown,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
] as const;

function StatsSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5"
      style={{ backgroundColor: "transparent" }}
    >
      {statsConfig.map((stat) => (
        <div
          key={stat.title}
          className="min-w-0 rounded-2xl border p-5 shadow-sm"
          style={{
            backgroundColor: "#ffffff",
            borderColor: "#f0e3d8",
          }}
        >
          <div className="flex items-center justify-between">
            <div
              className="size-11 animate-pulse rounded-xl"
              style={{ backgroundColor: "#f3ece6" }}
            />

            <div
              className="h-4 w-12 animate-pulse rounded-full"
              style={{ backgroundColor: "#f3ece6" }}
            />
          </div>

          <div
            className="mt-5 h-4 w-28 animate-pulse rounded"
            style={{ backgroundColor: "#f3ece6" }}
          />

          <div
            className="mt-3 h-8 w-20 animate-pulse rounded-lg"
            style={{ backgroundColor: "#eee5dc" }}
          />
        </div>
      ))}
    </div>
  );
}

export default function OverviewStats({
  overview,
  isLoading = false,
}: OverviewStatsProps) {
  if (isLoading) {
    return <StatsSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {statsConfig.map((stat) => {
        const Icon = stat.icon;
        const value = overview[stat.key];

        return (
          <div
            key={stat.title}
            className="group min-w-0 rounded-2xl border border-[#f0e3d8] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#f2c8b8] hover:shadow-lg hover:shadow-[#35100A]/5"
          >
            <div className="flex items-center justify-between gap-3">
              <div
                className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${stat.iconBg} ${stat.iconColor} transition-transform duration-300 group-hover:scale-110`}
              >
                <Icon size={22} strokeWidth={2} />
              </div>

              {stat.key === "subscriptionPlan" && (
                <span className="rounded-full bg-[#fff1e9] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#C93627]">
                  Current
                </span>
              )}
            </div>

            <p className="mt-5 text-sm font-medium text-[#8b7c72]">
              {stat.title}
            </p>

            <h3 className="mt-1 truncate text-2xl font-extrabold capitalize tracking-tight text-[#35100A]">
              {value ?? 0}
            </h3>
          </div>
        );
      })}
    </div>
  );
}
