
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Menu, ShieldCheck } from "lucide-react"

import { authClient } from "@/lib/auth-client"
import AdminSidebar from "@/components/dashboard/admin/admin-sidebar"

type AdminUser = {
  role?: string
  isBlocked?: boolean
}

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  const { data: session, isPending } = authClient.useSession()

  const [mobileOpen, setMobileOpen] = useState(false)

  const user = session?.user as AdminUser | undefined

  useEffect(() => {
    if (isPending) return

    if (!session || user?.isBlocked) {
      router.replace("/sign-in")
      return
    }

    if (user?.role !== "admin") {
      router.replace("/unauthorise")
    }
  }, [session, isPending, user?.role, user?.isBlocked, router])

  // Admin access loading screen
  if (
    isPending ||
    !session ||
    user?.role !== "admin" ||
    user?.isBlocked
  ) {
    return (
      <div
        className="flex min-h-screen items-center justify-center px-4"
        style={{
          backgroundColor: "#FFF9F0",
          color: "#35100A",
        }}
      >
        <div className="flex items-center gap-3">
          <ShieldCheck
            className="size-6 animate-pulse"
            style={{ color: "#C93627" }}
          />

          <p
            className="text-sm font-medium"
            style={{ color: "#786B62" }}
          >
            Checking admin access...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "#FFF9F0",
        color: "#35100A",
      }}
    >
      {/* Sidebar */}
      <AdminSidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* Main Content */}
      <div className="min-h-screen lg:pl-72">
        {/* Header */}
        <header
          className="sticky top-0 z-30 flex h-16 items-center justify-between border-b px-4 sm:px-6"
          style={{
            backgroundColor: "#FFFFFF",
            borderColor: "#F0E3D8",
          }}
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 transition-colors hover:bg-gray-100 lg:hidden"
              aria-label="Open sidebar"
              style={{ color: "#35100A" }}
            >
              <Menu className="size-5" />
            </button>

            <div>
              <h2 className="font-bold">Admin Panel</h2>

              <p
                className="hidden text-xs sm:block"
                style={{ color: "#786B62" }}
              >
                PizzaHub Management
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm font-semibold">
              {session.user.name || "Admin"}
            </p>

            <p
              className="text-xs"
              style={{ color: "#786B62" }}
            >
              Administrator
            </p>
          </div>
        </header>

        {/* Page Content */}
        <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
