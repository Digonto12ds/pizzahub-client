"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  PlusCircle,
  Pizza,
  ShoppingBag,
  CreditCard,
  X,
  Crown,
  CheckCircle2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

const navigation = [
  {
    name: "Overview",
    href: "/vendor-dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Add Menu Item",
    href: "/vendor-dashboard/menu/add",
    icon: PlusCircle,
  },
  {
    name: "My Menu Items",
    href: "/vendor-dashboard/menu",
    icon: Pizza,
  },
  {
    name: "Customer Orders",
    href: "/vendor-dashboard/orders",
    icon: ShoppingBag,
  },
  {
    name: "Subscription",
    href: "/vendor-dashboard/subscription",
    icon: CreditCard,
  },
];

type VendorSidebarProps = {
  mobileOpen: boolean;
  onClose: () => void;
};

export default function VendorSidebar({
  mobileOpen,
  onClose,
}: VendorSidebarProps) {
  const pathname = usePathname();

  // Get logged-in vendor session
  const { data: session } = authClient.useSession();

  // Access custom subscription fields
  const vendor = session?.user as
    | {
        subscriptionPlan?: string;
        subscriptionStatus?: string;
      }
    | undefined;

  // Check whether vendor has an active Premium subscription
  const isPremium =
    vendor?.subscriptionPlan?.toLowerCase() === "premium" &&
    ["active", "trialing"].includes(
      vendor?.subscriptionStatus?.toLowerCase() || ""
    );

  const sidebarContent = (
    <>
      {/* Sidebar Header */}
      <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
        <Link href="/" className="text-2xl font-black text-white">
          PizzaHub<span className="text-[#F2A43A]">.</span>
        </Link>

        <button
          onClick={onClose}
          className="rounded-md p-2 text-white hover:bg-white/10 lg:hidden"
          aria-label="Close navigation"
        >
          <X size={21} />
        </button>
      </div>

      {/* Navigation */}
      <div className="px-5 py-7">
        <p className="mb-4 px-3 text-xs font-bold uppercase tracking-[2px] text-[#B9A69B]">
          Vendor Workspace
        </p>

        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;

            const isActive =
  item.href === "/vendor-dashboard"
    ? pathname === item.href
    : item.href === "/vendor-dashboard/menu"
      ? pathname === item.href
      : pathname === item.href ||
        pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                  isActive
                    ? "bg-[#C93627] text-white shadow-lg shadow-red-950/20"
                    : "text-[#D7C4B8] hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon size={19} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Dynamic Subscription Section */}
      <div className="mt-auto p-5">
        {isPremium ? (
          // Premium Vendor Section
          <div className="rounded-2xl border border-[#F2A43A]/30 bg-gradient-to-br from-[#3B2817] to-[#211714] p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-[#F2A43A]" />

                <p className="text-sm font-bold text-white">
                  Premium Member
                </p>
              </div>

              <span className="rounded-full bg-[#F2A43A] px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[#35100A]">
                Premium
              </span>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-green-400">
              <CheckCircle2 size={15} />
              Your subscription is active
            </div>

            <p className="mt-2 text-xs leading-5 text-[#B9A69B]">
              Enjoy unlimited active menu items and all Premium benefits.
            </p>

            <Link
              href="/vendor-dashboard/subscription"
              onClick={onClose}
              className="mt-4 block rounded-lg border border-[#F2A43A]/40 px-3 py-2 text-center text-sm font-bold text-[#F2A43A] transition hover:bg-[#F2A43A]/10"
            >
              Manage Subscription
            </Link>
          </div>
        ) : (
          // Free Vendor Section
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-bold text-white">
              Grow your business!
            </p>

            <p className="mt-2 text-xs leading-5 text-[#B9A69B]">
              Upgrade to Premium for unlimited active menu items.
            </p>

            <Link
              href="/vendor-dashboard/subscription"
              onClick={onClose}
              className="mt-4 block rounded-lg bg-[#F2A43A] px-3 py-2 text-center text-sm font-bold text-[#35100A] transition hover:bg-[#ffc15d]"
            >
              <span className="inline-flex items-center justify-center gap-2">
                <Crown size={15} />
                Upgrade Plan
              </span>
            </Link>
          </div>
        )}

        <p className="mt-6 text-center text-xs text-[#8D756A]">
          PizzaHub Vendor Panel
        </p>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col bg-[#211714] lg:flex">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-black/60"
            onClick={onClose}
            aria-label="Close sidebar overlay"
          />

          <aside className="absolute inset-y-0 left-0 flex w-70 max-w-[85vw] flex-col bg-[#211714] shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}