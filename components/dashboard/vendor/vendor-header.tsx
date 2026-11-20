
"use client";

import { Menu, Bell, Store, CalendarDays } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

type VendorHeaderProps = {
  onMenuClick: () => void;
};

export default function VendorHeader({
  onMenuClick,
}: VendorHeaderProps) {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const firstName = user?.name?.split(" ")[0] || "Vendor";

  return (
    <header className="sticky top-0 z-30 w-full border-b border-[#f0e3d8] bg-white/95 backdrop-blur-xl">
      <div className="flex h-[76px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Section */}
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <button
            onClick={onMenuClick}
            aria-label="Open navigation"
            className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#f0e3d8] bg-white text-[#35100A] transition hover:border-[#C93627] hover:bg-[#fff5f2] lg:hidden"
          >
            <Menu size={21} />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-lg font-extrabold tracking-tight text-[#35100A] sm:text-xl">
                Welcome, {firstName}!
              </h1>

              <span className="hidden rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-green-700 sm:inline-flex">
                Vendor
              </span>
            </div>

            <div className="mt-1 flex items-center gap-1.5 text-xs text-[#8b7c72]">
              <CalendarDays size={13} />
              <span>{today}</span>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex shrink-0 items-center gap-3 sm:gap-5">
          {/* Notification */}
          <button
            type="button"
            aria-label="Notifications"
            title="Notifications"
            className="relative flex size-10 items-center justify-center rounded-xl border border-[#f0e3d8] bg-white text-[#786b62] transition hover:border-[#C93627] hover:bg-[#fff5f2] hover:text-[#C93627]"
          >
            <Bell size={19} />

            <span className="absolute right-2 top-2 size-2.5 rounded-full border-2 border-white bg-[#C93627]" />
          </button>

          {/* Profile */}
          <div className="flex items-center gap-3 border-l border-[#f0e3d8] pl-3 sm:pl-5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#C93627] to-[#F2A43A] text-white shadow-sm shadow-red-200">
              {user?.image ? (
                <Image
  src={user.image}
  alt={user.name || "Vendor"}
  width={40}
  height={40}
  unoptimized
  className="size-10 rounded-xl object-cover"
/>
              ) : (
                <Store size={19} />
              )}
            </div>

            <div className="hidden min-w-0 sm:block">
              <p className="max-w-36 truncate text-sm font-bold text-[#35100A]">
                {user?.name || "Vendor"}
              </p>

              <p className="mt-0.5 text-[11px] font-medium text-[#9a8b80]">
                Vendor Account
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
