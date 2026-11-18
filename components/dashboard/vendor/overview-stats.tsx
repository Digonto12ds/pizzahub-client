
import {
  Card,
  CardContent,
} from "@/components/ui/card";
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
};

export default function OverviewStats({
  overview,
}: OverviewStatsProps) {
  const stats = [
    {
      title: "Total Menu Items",
      value: overview.totalMenuItems,
      icon: Pizza,
      color: "bg-orange-50 text-orange-600",
    },
    {
      title: "Active Menu Items",
      value: overview.activeMenuItems,
      icon: CheckCircle2,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Pending Orders",
      value: overview.pendingOrders,
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Accepted Orders",
      value: overview.acceptedOrders,
      icon: ShoppingBag,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Subscription Plan",
      value: overview.subscriptionPlan,
      icon: Crown,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card
            key={stat.title}
            className="border-orange-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
          >
            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-3">
                <div
                  className={`flex size-11 items-center justify-center rounded-xl ${stat.color}`}
                >
                  <Icon size={22} />
                </div>
                {stat.title === "Subscription Plan" && (
                  <span className="rounded-full bg-orange-50 px-2 py-1 text-[10px] font-bold uppercase text-[#C93627]">
                    Current
                  </span>
                )}
              </div>

              <p className="mt-5 text-sm text-gray-500">
                {stat.title}
              </p>

              <h3 className="mt-1 text-2xl font-extrabold capitalize text-[#35100A]">
                {stat.value}
              </h3>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
