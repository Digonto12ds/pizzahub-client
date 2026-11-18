
"use client";
import { Menu, Bell, Store } from "lucide-react";
import { authClient } from "@/lib/auth-client";
type VendorHeaderProps = {
  onMenuClick: () => void;
};
export default function VendorHeader({
  onMenuClick,
}: VendorHeaderProps) {
 
  const { data: session } = authClient.useSession();
  const user = session?.user;
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-orange-100 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg border border-orange-100 p-2 text-[#35100A] hover:bg-orange-50 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={22} />
        </button>
        <div>
          <h1 className="text-lg font-bold text-[#35100A] sm:text-xl">
            Vendor Dashboard
          </h1>
          <p className="hidden text-xs text-gray-500 sm:block">
            Manage your restaurant and orders
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 sm:gap-5">
        <button
          className="relative rounded-full p-2 text-gray-500 transition hover:bg-orange-50 hover:text-[#C93627]"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={20} />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-[#C93627]" />
        </button>
        <div className="flex items-center gap-2 border-l border-orange-100 pl-3 sm:pl-5">
          <div className="flex size-10 items-center justify-center rounded-full bg-red-50 text-[#C93627]">
            <Store size={19} />
          </div>
          <div className="hidden min-w-0 sm:block">
            <p className="max-w-36 truncate text-sm font-semibold text-[#35100A]">
              {user?.name || "Vendor"}
            </p>
            <p className="text-xs text-gray-500">Vendor Account</p>
          </div>
        </div>
      </div>
    </header>
  );
}
