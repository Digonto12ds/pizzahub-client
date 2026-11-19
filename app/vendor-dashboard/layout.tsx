
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import VendorSidebar from "@/components/dashboard/vendor/vendor-sidebar";
import VendorHeader from "@/components/dashboard/vendor/vendor-header";

type VendorUser = {
  role?: string;
  isBlocked?: boolean;
};

export default function VendorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [mobileOpen, setMobileOpen] = useState(false);

  const user = session?.user as VendorUser | undefined;

  useEffect(() => {
    if (isPending) return;

    // User is not logged in
    if (!session) {
      router.replace("/sign-in");
      return;
    }

    // Blocked user
    if (user?.isBlocked) {
      router.replace("/sign-in");
      return;
    }

    // Only vendors can access this dashboard
    if (user?.role !== "vendor") {
      router.replace("/unauthorise");
    }
  }, [session, isPending, router, user]);

  const isAuthorized =
    !!session &&
    user?.role === "vendor" &&
    !user?.isBlocked;

  // Show loading while checking authentication
  if (isPending || !isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFF9F0]">
        <div className="text-center">
          <div className="mx-auto size-10 animate-spin rounded-full border-4 border-orange-200 border-t-[#C93627]" />

          <p className="mt-4 text-sm text-gray-500">
            Checking your account...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F0]">
      <VendorSidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="min-h-screen lg:pl-72">
        <VendorHeader
          onMenuClick={() => setMobileOpen(true)}
        />

        <main className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
