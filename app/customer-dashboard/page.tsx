"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

import {
  getCustomerOverview,
  getCustomerOrders,
  cancelCustomerOrder,
  type CustomerOrder,
  type CustomerOverview,
} from "@/lib/api/customer-orders"

import { Button } from "@/components/ui/button"
import { Card, CardContent} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"

import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  X,
  MapPin,
  CalendarDays,
  RefreshCw,
} from "lucide-react"

const initialOverview: CustomerOverview = {
  totalOrders: 0,
  pendingOrders: 0,
  acceptedOrders: 0,
  rejectedOrders: 0,
}

const formatDate = (date?: string) => {
  if (!date) return "Not provided"

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return date
  }

  return parsedDate.toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

const formatPrice = (price?: number) => {
  return `৳${Number(price || 0).toLocaleString("en-BD")}`
}

const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return (
        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
          Pending
        </Badge>
      )

    case "accepted":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          Accepted
        </Badge>
      )

    case "rejected":
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
          Rejected
        </Badge>
      )

    case "cancelled":
      return (
        <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
          Cancelled
        </Badge>
      )

    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function CustomerDashboard() {
  const [overview, setOverview] = useState<CustomerOverview>(initialOverview)

  const [orders, setOrders] = useState<CustomerOrder[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null)

  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null)

  const [cancelling, setCancelling] = useState(false)
  const [notice, setNotice] = useState("")
  const [cancelError, setCancelError] = useState("")

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true)
      setError("")

      const [overviewData, ordersData] = await Promise.all([
        getCustomerOverview(),
        getCustomerOrders(),
      ])

      setOverview(overviewData)
      setOrders(ordersData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      loadDashboard()
    }, 0)

    return () => clearTimeout(timer)
  }, [loadDashboard])

  const handleCancelOrder = async () => {
    if (!cancelOrderId || cancelling) return

    try {
      setCancelling(true)
      setCancelError("")

      const result = await cancelCustomerOrder(cancelOrderId)

      setNotice(result.message || "Order cancelled successfully.")

      setCancelOrderId(null)

      await loadDashboard()
    } catch (err) {
      setCancelError(
        err instanceof Error ? err.message : "Failed to cancel order."
      )
    } finally {
      setCancelling(false)
    }
  }

  const overviewCards = [
    {
      title: "Total Orders",
      value: overview.totalOrders,
      icon: ShoppingBag,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    {
      title: "Pending",
      value: overview.pendingOrders,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
    {
      title: "Accepted",
      value: overview.acceptedOrders,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Rejected",
      value: overview.rejectedOrders,
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-100",
    },
  ]

  return (
    <main className="min-h-screen bg-[#FFF9F0] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Dashboard heading */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#C93627]">
              CUSTOMER PANEL
            </p>

            <h1 className="mt-1 text-3xl font-bold text-[#35100A] sm:text-4xl">
              My Dashboard
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              Manage your pizza orders and track their status.
            </p>
          </div>

          <Button
            onClick={loadDashboard}
            variant="outline"
            className="border-[#C93627] text-[#C93627] hover:bg-orange-50"
            disabled={loading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Success/error notice */}
        {notice && (
          <div className="flex items-center justify-between rounded-lg border border-orange-200 bg-white p-4 text-sm">
            <p>{notice}</p>

            <button onClick={() => setNotice("")} aria-label="Dismiss message">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Overview */}
        <section>
          <h2 className="mb-4 text-xl font-bold text-[#35100A]">
            Order Overview
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {overviewCards.map((item) => {
              const Icon = item.icon

              return (
                <Card key={item.title} className="border-none shadow-sm">
                  <CardContent className="flex items-center justify-between p-5">
                    <div>
                      <p className="text-sm text-gray-500">{item.title}</p>

                      {loading ? (
                        <Skeleton className="mt-2 h-8 w-16" />
                      ) : (
                        <p className="mt-2 text-3xl font-bold text-[#35100A]">
                          {item.value}
                        </p>
                      )}
                    </div>

                    <div className={`rounded-xl p-3 ${item.bg}`}>
                      <Icon className={`h-6 w-6 ${item.color}`} />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* My Orders */}
        <section>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#35100A]">My Orders</h2>

              <p className="mt-1 text-sm text-gray-500">
                View and manage your pizza orders.
              </p>
            </div>

            <Badge variant="secondary">{orders.length} Orders</Badge>
          </div>

          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-5 text-sm text-red-600">
                {error}

                <Button
                  onClick={loadDashboard}
                  variant="outline"
                  size="sm"
                  className="ml-3"
                >
                  Try again
                </Button>
              </CardContent>
            </Card>
          )}

          {loading ? (
            <div className="grid gap-4">
              {[1, 2, 3].map((item) => (
                <Card key={item}>
                  <CardContent className="flex gap-4 p-5">
                    <Skeleton className="h-24 w-24 rounded-lg" />

                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-5 w-1/3" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !error && orders.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center py-16 text-center">
                <ShoppingBag className="h-12 w-12 text-gray-300" />

                <h3 className="mt-4 text-lg font-semibold text-[#35100A]">
                  No orders yet
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Your pizza orders will appear here.
                </p>

                <Link href="/menu">
                  <Button className="...">Browse Menu</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {orders.map((order) => (
                <Card
                  key={order._id}
                  className="overflow-hidden border-none shadow-sm"
                >
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex flex-col gap-5 sm:flex-row">
                      {/* Product image */}
                      <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl bg-orange-50 sm:w-32">
                        {order.item?.images?.[0] ? (
                          <Image
                            src={order.item.images[0]}
                            alt={order.item.itemName}
                            fill
                            sizes="(max-width: 640px) 100vw, 128px"
                            className="object-cover"
                            loading="eager"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-3xl">
                            🍕
                          </div>
                        )}
                      </div>

                      {/* Order information */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h3 className="text-lg font-bold text-[#35100A]">
                              {order.item?.itemName || "Unavailable item"}
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                              Vendor:{" "}
                              {order.vendor?.businessName ||
                                order.vendor?.name ||
                                "Unknown vendor"}
                            </p>
                          </div>

                          {getStatusBadge(order.status)}
                        </div>

                        <div className="mt-4 grid gap-3 text-sm text-gray-600 sm:grid-cols-2">
                          <p className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-[#C93627]" />
                            Delivery: {formatDate(order.deliveryDate)}
                          </p>

                          <p className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-[#C93627]" />
                            Requested: {formatDate(order.requestDate)}
                          </p>

                          <p className="flex items-start gap-2 sm:col-span-2">
                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#C93627]" />
                            <span className="wrap-break-words">
                              {order.deliveryAddress || "No address provided"}
                            </span>
                          </p>
                        </div>

                        {/* Price and actions */}
                        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                          <p className="font-bold text-[#C93627]">
                            {formatPrice(order.totalPrice)}
                          </p>

                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Details
                            </Button>

                            {order.status.toLowerCase() === "pending" && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  setCancelError("")
                                  setCancelOrderId(order._id)
                                }}
                              >
                                <X className="mr-2 h-4 w-4" />
                                Cancel
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Order details dialog */}
      <Dialog
        open={!!selectedOrder}
        onOpenChange={(open) => {
          if (!open) setSelectedOrder(null)
        }}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#35100A]">
              Order Details
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-5">
              <div className="relative h-48 overflow-hidden rounded-xl bg-orange-50">
                {selectedOrder.item?.images?.[0] ? (
                  <Image
                    src={selectedOrder.item.images[0]}
                    alt={selectedOrder.item.itemName}
                    fill
                    sizes="(max-width: 640px) 100vw, 512px"
                    loading="eager"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-5xl">
                    🍕
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#35100A]">
                  {selectedOrder.item?.itemName || "Unavailable item"}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {selectedOrder.item?.category || "Pizza"}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Order status</span>
                {getStatusBadge(selectedOrder.status)}
              </div>

              <div className="space-y-3 rounded-lg bg-orange-50 p-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Order ID</span>
                  <span className="font-medium break-all">
                    {selectedOrder._id}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Vendor</span>
                  <span className="text-right font-medium">
                    {selectedOrder.vendor?.businessName ||
                      selectedOrder.vendor?.name ||
                      "Unknown"}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Quantity</span>
                  <span className="font-medium">
                    {selectedOrder.quantity ?? "—"}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Unit price</span>
                  <span className="font-medium">
                    {formatPrice(selectedOrder.item?.price)}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Total price</span>
                  <span className="font-bold text-[#C93627]">
                    {formatPrice(selectedOrder.totalPrice)}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Delivery date</span>
                  <span className="font-medium">
                    {formatDate(selectedOrder.deliveryDate)}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Request date</span>
                  <span className="font-medium">
                    {formatDate(selectedOrder.requestDate)}
                  </span>
                </div>

                <div>
                  <p className="text-gray-500">Delivery address</p>
                  <p className="mt-1 font-medium">
                    {selectedOrder.deliveryAddress}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel confirmation dialog */}
      <AlertDialog
        open={!!cancelOrderId}
        onOpenChange={(open) => {
          if (!open && !cancelling) setCancelOrderId(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this order?</AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to cancel this order? This action cannot be
              undone.
            </AlertDialogDescription>
            {cancelError && (
              <p className="mt-2 text-sm font-medium text-red-600">
                {cancelError}
              </p>
            )}
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelling}>
              Keep Order
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={cancelling}
              onClick={(event) => {
                event.preventDefault()
                handleCancelOrder()
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              {cancelling ? "Cancelling..." : "Yes, Cancel Order"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
