
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  UtensilsCrossed,
  CreditCard,
  X,
  Pizza,
} from "lucide-react"

type AdminSidebarProps = {
  mobileOpen: boolean
  onClose: () => void
}

const navigation = [
  {
    name: "Overview",
    href: "/admin-dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Manage Users",
    href: "/admin-dashboard/users",
    icon: Users,
  },
  {
    name: "Manage Menu Items",
    href: "/admin-dashboard/menu",
    icon: UtensilsCrossed,
  },
  {
    name: "Transactions",
    href: "/admin-dashboard/transactions",
    icon: CreditCard,
  },
]

export default function AdminSidebar({
  mobileOpen,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/admin-dashboard") {
      return pathname === href
    }

    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 flex h-screen w-72 flex-col border-r bg-white transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b px-6">
          <Link
            href="/admin-dashboard"
            onClick={onClose}
            className="flex items-center gap-3"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <Pizza className="size-6" />
            </div>

            <div>
              <h2 className="text-lg font-bold">PizzaHub</h2>
              <p className="text-xs text-muted-foreground">
                Admin Dashboard
              </p>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="rounded-md p-2 hover:bg-gray-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          <p className="mb-4 px-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Admin Menu
          </p>

          {navigation.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                  active
                    ? "bg-orange-100 text-orange-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon className="size-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t p-4">
          <p className="text-center text-xs text-muted-foreground">
            PizzaHub Admin Panel
          </p>
        </div>
      </aside>
    </>
  )
}
