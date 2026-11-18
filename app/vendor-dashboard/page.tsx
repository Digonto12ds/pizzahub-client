"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, RefreshCw } from "lucide-react"

import OverviewStats from "@/components/dashboard/vendor/overview-stats"
import { getVendorOverview, type VendorOverview } from "@/lib/api/vendor"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function VendorDashboardPage() {
  const [overview, setOverview] = useState<VendorOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadOverview = async () => {
    try {
      setError("")

      const data = await getVendorOverview()
      setOverview(data)
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load dashboard."
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true

    const fetchOverview = async () => {
      try {
        const data = await getVendorOverview()

        if (isMounted) {
          setOverview(data)
        }
      } catch (error) {
        if (isMounted) {
          setError(
            error instanceof Error ? error.message : "Failed to load dashboard."
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
    <div className="space-y-8">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Badge className="mb-3 border-0 bg-red-50 text-[#C93627] hover:bg-red-50">
            VENDOR WORKSPACE
          </Badge>

          <h2 className="text-2xl font-extrabold text-[#35100A] sm:text-3xl">
            Welcome Back!
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Here&apos;s what&apos;s happening with your restaurant today.
          </p>
        </div>

        <Link
          href="/vendor-dashboard/menu/add"
          className="inline-flex items-center justify-center rounded-md bg-[#C93627] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#a92d21]"
        >
          Add Menu Item
        </Link>
      </div>

      {/* Statistics */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Card key={index} className="border-orange-100">
              <CardContent className="space-y-4 p-5">
                <Skeleton className="size-11 rounded-xl" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-8 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="border-red-200">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <p className="text-sm text-red-600">{error}</p>
            <Button onClick={loadOverview} variant="outline">
              <RefreshCw size={16} className="mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : overview ? (
        <OverviewStats overview={overview} />
      ) : null}

      {/* Quick actions */}
      <div>
        <h3 className="text-lg font-bold text-[#35100A]">Quick Actions</h3>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Link
            href="/vendor-dashboard/menu/add"
            className="group rounded-2xl border border-orange-100 bg-white p-5 transition hover:border-[#C93627] hover:shadow-md"
          >
            <div className="flex size-11 items-center justify-center rounded-xl bg-red-50 text-[#C93627]">
              <Plus size={22} />
            </div>

            <h4 className="mt-4 font-bold text-[#35100A]">Add New Menu Item</h4>

            <p className="mt-1 text-sm text-gray-500">
              Add a new pizza, side, or dessert to your restaurant menu.
            </p>

            <p className="mt-4 text-sm font-semibold text-[#C93627]">
              Create menu item →
            </p>
          </Link>

          <Link
            href="/vendor-dashboard/orders"
            className="group rounded-2xl border border-orange-100 bg-white p-5 transition hover:border-[#C93627] hover:shadow-md"
          >
            <div className="flex size-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <RefreshCw size={21} />
            </div>

            <h4 className="mt-4 font-bold text-[#35100A]">
              Manage Customer Orders
            </h4>

            <p className="mt-1 text-sm text-gray-500">
              Review customer orders and manage their status.
            </p>

            <p className="mt-4 text-sm font-semibold text-[#C93627]">
              View orders →
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}
