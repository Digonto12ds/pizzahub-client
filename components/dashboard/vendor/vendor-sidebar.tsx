
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
} from "lucide-react";
import { cn } from "@/lib/utils";
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
  const sidebarContent = (
    <>
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
      <div className="mt-auto p-5">
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
            Upgrade Plan
          </Link>
        </div>
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
