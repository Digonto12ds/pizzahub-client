
"use client"

import { useEffect, useState } from "react"
import {
  Users,
  Store,
  UserRound,
  UtensilsCrossed,
  Clock,
  CreditCard,
  RefreshCw,
} from "lucide-react"
import { toast } from "react-hot-toast"

import { authClient } from "@/lib/auth-client"

const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

type DashboardStats = {
  totalUsers: number
  totalVendors: number
  totalCustomers: number
  totalMenuItems: number
  pendingMenuItems: number
  totalTransactions: number
}

const initialStats: DashboardStats = {
  totalUsers: 0,
  totalVendors: 0,
  totalCustomers: 0,
  totalMenuItems: 0,
  pendingMenuItems: 0,
  totalTransactions: 0,
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(initialStats)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const { data, error } = await authClient.getSession()
        const token = data?.session?.token

        if (error || !token) {
          throw new Error("Please sign in again.")
        }

        const response = await fetch(
          `${API_URL}/api/admin/overview`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const result = await response.json()

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to load dashboard."
          )
        }

        setStats(result.stats)
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Something went wrong."
        )
      } finally {
        setLoading(false)
      }
    }

    fetchOverview()
  }, [])

  const statCards = [
    {
      title: "Total Registered Users",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Total Vendors",
      value: stats.totalVendors,
      icon: Store,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: UserRound,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Total Menu Items",
      value: stats.totalMenuItems,
      icon: UtensilsCrossed,
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Pending Menu Items",
      value: stats.pendingMenuItems,
      icon: Clock,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "Total Transactions",
      value: stats.totalTransactions,
      icon: CreditCard,
      color: "bg-pink-100 text-pink-600",
    },
  ]

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Admin Overview
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Welcome to your PizzaHub admin dashboard.
          Here is an overview of your platform.
        </p>
      </div>

      {/* Statistics Cards */}
      {loading ? (
        <div className="flex min-h-60 items-center justify-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <RefreshCw className="size-5 animate-spin" />
            Loading dashboard statistics...
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {statCards.map((card) => {
            const Icon = card.icon

            return (
              <div
                key={card.title}
                className="rounded-xl border bg-card p-5 shadow-sm"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {card.title}
                    </p>

                    <h2 className="mt-3 text-3xl font-bold">
                      {card.value.toLocaleString()}
                    </h2>
                  </div>

                  <div
                    className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${card.color}`}
                  >
                    <Icon className="size-6" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
