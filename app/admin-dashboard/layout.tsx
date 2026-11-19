
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

    if (!session) {
      router.replace("/sign-in")
      return
    }

    if (user?.isBlocked) {
      router.replace("/sign-in")
      return
    }

    if (user?.role !== "admin") {
      router.replace("/unauthorise")
    }
  }, [session, isPending, user?.role, user?.isBlocked, router])

  if (isPending || !session || user?.role !== "admin" || user?.isBlocked) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <ShieldCheck className="size-5 animate-pulse" />
          Checking admin access...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF9F0]">
      {/* Sidebar */}
      <AdminSidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* Main Content */}
      <div className="min-h-screen lg:pl-72">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-md p-2 hover:bg-gray-100 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="size-5" />
            </button>

            <h2 className="font-semibold">Admin Panel</h2>
          </div>

          <div className="text-right">
            <p className="text-sm font-semibold">
              {session.user.name || "Admin"}
            </p>
            <p className="text-xs text-muted-foreground">
              Administrator
            </p>
          </div>
        </header>

        <main className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
