
"use client"

import { useEffect, useState } from "react"
import {
  Users,
  Store,
  UserRound,
  UtensilsCrossed,
  Clock,
  CreditCard,
} from "lucide-react"
import { toast } from "react-hot-toast"

import {
  getAdminOverview,
  type DashboardStats,
} from "@/lib/api/admin"

const initialStats: DashboardStats = {
  totalUsers: 0,
  totalVendors: 0,
  totalCustomers: 0,
  totalMenuItems: 0,
  pendingMenuItems: 0,
  totalTransactions: 0,
}

const statCards = [
  {
    title: "Total Registered Users",
    key: "totalUsers" as const,
    icon: Users,
    iconBg: "#DBEAFE",
    iconColor: "#2563EB",
  },
  {
    title: "Total Vendors",
    key: "totalVendors" as const,
    icon: Store,
    iconBg: "#EDE9FE",
    iconColor: "#7C3AED",
  },
  {
    title: "Total Customers",
    key: "totalCustomers" as const,
    icon: UserRound,
    iconBg: "#DCFCE7",
    iconColor: "#16A34A",
  },
  {
    title: "Total Menu Items",
    key: "totalMenuItems" as const,
    icon: UtensilsCrossed,
    iconBg: "#FFEDD5",
    iconColor: "#EA580C",
  },
  {
    title: "Pending Menu Items",
    key: "pendingMenuItems" as const,
    icon: Clock,
    iconBg: "#FEF3C7",
    iconColor: "#D97706",
  },
  {
    title: "Total Transactions",
    key: "totalTransactions" as const,
    icon: CreditCard,
    iconBg: "#FCE7F3",
    iconColor: "#DB2777",
  },
]

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {statCards.map((card) => (
        <div
          key={card.key}
          className="rounded-2xl border p-5 shadow-sm"
          style={{
            backgroundColor: "#FFFFFF",
            borderColor: "#F0E3D8",
          }}
        >
          <div className="flex items-center justify-between">
            <div
              className="size-12 rounded-xl"
              style={{ backgroundColor: "#F3ECE6" }}
            />

            <div
              className="h-4 w-20 rounded"
              style={{ backgroundColor: "#F3ECE6" }}
            />
          </div>

          <div
            className="mt-5 h-4 w-40 rounded"
            style={{ backgroundColor: "#F3ECE6" }}
          />

          <div
            className="mt-3 h-8 w-24 rounded"
            style={{ backgroundColor: "#EEE5DC" }}
          />
        </div>
      ))}
    </div>
  )
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(initialStats)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchOverview = async () => {
      try {
        const data = await getAdminOverview()

        if (isMounted) {
          setStats(data)
        }
      } catch (error) {
        if (isMounted) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Something went wrong."
          )
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchOverview()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div
      className="min-h-full space-y-6 p-4 sm:p-6"
      style={{
        backgroundColor: "#FFF9F0",
        color: "#35100A",
      }}
    >
      {/* Page Header */}
      <div>
        <p
          className="mb-2 text-sm font-semibold"
          style={{ color: "#C93627" }}
        >
          DASHBOARD
        </p>

        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Admin Overview
        </h1>

        <p
          className="mt-2 max-w-2xl text-sm leading-6"
          style={{ color: "#786B62" }}
        >
          Welcome to your PizzaHub admin dashboard.
          Here is an overview of your platform.
        </p>
      </div>

      {/* Statistics */}
      {loading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {statCards.map((card) => {
            const Icon = card.icon

            return (
              <div
                key={card.key}
                className="min-w-0 rounded-2xl border p-5 shadow-sm transition-shadow duration-200 hover:shadow-md sm:p-6"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#F0E3D8",
                  color: "#35100A",
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p
                      className="text-sm font-medium leading-5"
                      style={{ color: "#786B62" }}
                    >
                      {card.title}
                    </p>

                    <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                      {Number(stats[card.key] ?? 0).toLocaleString()}
                    </h2>
                  </div>

                  <div
                    className="flex size-12 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: card.iconBg,
                      color: card.iconColor,
                    }}
                  >
                    <Icon className="size-6" />
                  </div>
                </div>

                <div
                  className="mt-5 h-1 w-full overflow-hidden rounded-full"
                  style={{ backgroundColor: "#F5EEE8" }}
                >
                  <div
                    className="h-full w-1/3 rounded-full"
                    style={{ backgroundColor: "#F2A43A" }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
