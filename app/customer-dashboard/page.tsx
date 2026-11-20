
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  getCustomerOverview,
  getCustomerOrders,
  cancelCustomerOrder,
  type CustomerOrder,
  type CustomerOverview,
} from "@/lib/api/customer-orders";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  Pizza,
} from "lucide-react";

const initialOverview: CustomerOverview = {
  totalOrders: 0,
  pendingOrders: 0,
  acceptedOrders: 0,
  rejectedOrders: 0,
};

const formatDate = (date?: string) => {
  if (!date) return "Not provided";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatPrice = (price?: number) => {
  return `৳${Number(price || 0).toLocaleString("en-BD")}`;
};

const getStatusStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return {
        label: "Pending",
        background: "#FFF4D6",
        color: "#A16207",
        dot: "#D97706",
      };

    case "accepted":
      return {
        label: "Accepted",
        background: "#DCFCE7",
        color: "#15803D",
        dot: "#16A34A",
      };

    case "rejected":
      return {
        label: "Rejected",
        background: "#FEE2E2",
        color: "#B91C1C",
        dot: "#DC2626",
      };

    case "cancelled":
      return {
        label: "Cancelled",
        background: "#F1F5F9",
        color: "#475569",
        dot: "#64748B",
      };

    default:
      return {
        label: status,
        background: "#F3F4F6",
        color: "#374151",
        dot: "#6B7280",
      };
  }
};

const overviewConfig = [
  {
    title: "Total Orders",
    key: "totalOrders" as const,
    icon: ShoppingBag,
    iconColor: "#EA580C",
    iconBackground: "#FFF0E5",
    description: "All your orders",
  },
  {
    title: "Pending Orders",
    key: "pendingOrders" as const,
    icon: Clock,
    iconColor: "#D97706",
    iconBackground: "#FFF7DB",
    description: "Waiting for approval",
  },
  {
    title: "Accepted Orders",
    key: "acceptedOrders" as const,
    icon: CheckCircle2,
    iconColor: "#16A34A",
    iconBackground: "#DCFCE7",
    description: "Approved orders",
  },
  {
    title: "Rejected Orders",
    key: "rejectedOrders" as const,
    icon: XCircle,
    iconColor: "#DC2626",
    iconBackground: "#FEE2E2",
    description: "Rejected orders",
  },
];

function OverviewSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {overviewConfig.map((item) => (
        <div
          key={item.key}
          className="rounded-2xl border p-5 shadow-sm"
          style={{
            backgroundColor: "#FFFFFF",
            borderColor: "#F0E3D8",
          }}
        >
          <div className="flex items-center justify-between">
            <div
              className="h-4 w-28 animate-pulse rounded"
              style={{ backgroundColor: "#F0E8E2" }}
            />
            <div
              className="h-11 w-11 animate-pulse rounded-xl"
              style={{ backgroundColor: "#F0E8E2" }}
            />
          </div>

          <div
            className="mt-6 h-9 w-16 animate-pulse rounded-lg"
            style={{ backgroundColor: "#EEE5DC" }}
          />

          <div
            className="mt-3 h-3 w-32 animate-pulse rounded"
            style={{ backgroundColor: "#F0E8E2" }}
          />
        </div>
      ))}
    </div>
  );
}

function OrdersSkeleton() {
  return (
    <div className="grid gap-4">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="flex flex-col gap-4 rounded-2xl border p-5 sm:flex-row"
          style={{
            backgroundColor: "#FFFFFF",
            borderColor: "#F0E3D8",
          }}
        >
          <div
            className="h-44 w-full animate-pulse rounded-xl sm:h-28 sm:w-32"
            style={{ backgroundColor: "#F0E8E2" }}
          />

          <div className="flex-1 space-y-4">
            <div
              className="h-5 w-40 animate-pulse rounded"
              style={{ backgroundColor: "#F0E8E2" }}
            />
            <div
              className="h-4 w-28 animate-pulse rounded"
              style={{ backgroundColor: "#F0E8E2" }}
            />
            <div
              className="h-4 w-full max-w-xs animate-pulse rounded"
              style={{ backgroundColor: "#F0E8E2" }}
            />
            <div
              className="h-4 w-24 animate-pulse rounded"
              style={{ backgroundColor: "#EEE5DC" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CustomerDashboard() {
  const [overview, setOverview] =
    useState<CustomerOverview>(initialOverview);

  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedOrder, setSelectedOrder] =
    useState<CustomerOrder | null>(null);

  const [cancelOrderId, setCancelOrderId] =
    useState<string | null>(null);

  const [cancelling, setCancelling] = useState(false);
  const [notice, setNotice] = useState("");
  const [cancelError, setCancelError] = useState("");

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [overviewData, ordersData] = await Promise.all([
        getCustomerOverview(),
        getCustomerOrders(),
      ]);

      setOverview(overviewData);
      setOrders(ordersData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadDashboard();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadDashboard]);

  const handleCancelOrder = async () => {
    if (!cancelOrderId || cancelling) return;

    try {
      setCancelling(true);
      setCancelError("");

      const result = await cancelCustomerOrder(cancelOrderId);

      setNotice(result.message || "Order cancelled successfully.");
      setCancelOrderId(null);

      await loadDashboard();
    } catch (err) {
      setCancelError(
        err instanceof Error
          ? err.message
          : "Failed to cancel order."
      );
    } finally {
      setCancelling(false);
    }
  };

  return (
    <main
      className="min-h-screen px-4 py-8 sm:px-6 lg:px-8"
      style={{
        backgroundColor: "#FFF9F0",
        color: "#35100A",
      }}
    >
      <div className="mx-auto max-w-7xl space-y-9">

        {/* Dashboard Heading */}
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p
              className="text-sm font-bold tracking-widest"
              style={{ color: "#C93627" }}
            >
              CUSTOMER PANEL
            </p>

            <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
              My Dashboard
            </h1>

            <p className="mt-2 text-sm sm:text-base" style={{ color: "#786B62" }}>
              Manage your pizza orders and track their status.
            </p>
          </div>

          <Button
            onClick={loadDashboard}
            disabled={loading}
            variant="outline"
            className="w-full border-[#C93627] bg-white text-[#C93627] hover:bg-orange-50 sm:w-auto"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </section>

        {/* Success Notice */}
        {notice && (
          <div
            className="flex items-center justify-between gap-3 rounded-xl border p-4 text-sm"
            style={{
              backgroundColor: "#FFFFFF",
              borderColor: "#BBF7D0",
              color: "#15803D",
            }}
          >
            <p>{notice}</p>

            <button
              onClick={() => setNotice("")}
              aria-label="Dismiss message"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Overview Cards */}
        <section>
          <div className="mb-5">
            <h2 className="text-xl font-extrabold sm:text-2xl">
              Order Overview
            </h2>
            <p className="mt-1 text-sm" style={{ color: "#786B62" }}>
              A quick summary of your pizza orders.
            </p>
          </div>

          {loading ? (
            <OverviewSkeleton />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {overviewConfig.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.key}
                    className="rounded-2xl border p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#F0E3D8",
                    }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p
                        className="text-sm font-semibold"
                        style={{ color: "#786B62" }}
                      >
                        {item.title}
                      </p>

                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                        style={{ backgroundColor: item.iconBackground }}
                      >
                        <Icon
                          className="h-6 w-6"
                          style={{ color: item.iconColor }}
                        />
                      </div>
                    </div>

                    <p className="mt-5 text-3xl font-extrabold">
                      {overview[item.key]}
                    </p>

                    <p
                      className="mt-2 text-xs font-medium"
                      style={{ color: "#A1948B" }}
                    >
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* My Orders */}
        <section>
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-extrabold sm:text-2xl">
                My Orders
              </h2>

              <p className="mt-1 text-sm" style={{ color: "#786B62" }}>
                View and manage your pizza orders.
              </p>
            </div>

            <span
              className="w-fit rounded-full px-4 py-2 text-xs font-bold"
              style={{
                backgroundColor: "#FFF0E5",
                color: "#C93627",
              }}
            >
              {orders.length} Orders
            </span>
          </div>

          {error && (
            <div
              className="mb-4 flex flex-col gap-3 rounded-xl border p-5 text-sm sm:flex-row sm:items-center sm:justify-between"
              style={{
                backgroundColor: "#FFF1F2",
                borderColor: "#FECDD3",
                color: "#BE123C",
              }}
            >
              <p>{error}</p>

              <Button
                onClick={loadDashboard}
                variant="outline"
                size="sm"
                className="border-red-300 bg-white text-red-600 hover:bg-red-50"
              >
                Try again
              </Button>
            </div>
          )}

          {loading ? (
            <OrdersSkeleton />
          ) : !error && orders.length === 0 ? (
            <div
              className="rounded-2xl border border-dashed px-5 py-16 text-center"
              style={{
                backgroundColor: "#FFFFFF",
                borderColor: "#E8D8CA",
              }}
            >
              <div
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{ backgroundColor: "#FFF0E5" }}
              >
                <ShoppingBag className="h-8 w-8" style={{ color: "#C93627" }} />
              </div>

              <h3 className="mt-5 text-lg font-bold">
                No orders yet
              </h3>

              <p className="mt-2 text-sm" style={{ color: "#786B62" }}>
                Your pizza orders will appear here.
              </p>

              <Link href="/menu" className="mt-6 inline-block">
                <Button className="bg-[#C93627] text-white hover:bg-[#A9271B]">
                  Browse Menu
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {orders.map((order) => {
                const status = getStatusStyle(order.status);

                return (
                  <article
                    key={order._id}
                    className="overflow-hidden rounded-2xl border shadow-sm transition hover:shadow-md"
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#F0E3D8",
                    }}
                  >
                    <div className="flex flex-col gap-5 p-4 sm:p-5 lg:flex-row">

                      {/* Product Image */}
                      <div
                        className="relative h-48 w-full shrink-0 overflow-hidden rounded-xl sm:h-52 lg:h-32 lg:w-36"
                        style={{ backgroundColor: "#FFF0E5" }}
                      >
                        {order.item?.images?.[0] ? (
                          <Image
                            src={order.item.images[0]}
                            alt={order.item.itemName || "Pizza"}
                            fill
                            sizes="(max-width: 1024px) 100vw, 144px"
                            className="object-cover"
                            unoptimized
                            loading="eager"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Pizza className="h-12 w-12" style={{ color: "#C93627" }} />
                          </div>
                        )}
                      </div>

                      {/* Order Information */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                          <div className="min-w-0">
                            <h3 className="break-words text-lg font-bold">
                              {order.item?.itemName || "Unavailable item"}
                            </h3>

                            <p className="mt-1 text-sm" style={{ color: "#786B62" }}>
                              Vendor:{" "}
                              {order.vendor?.businessName ||
                                order.vendor?.name ||
                                "Unknown vendor"}
                            </p>
                          </div>

                          <span
                            className="flex w-fit shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold"
                            style={{
                              backgroundColor: status.background,
                              color: status.color,
                            }}
                          >
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: status.dot }}
                            />
                            {status.label}
                          </span>
                        </div>

                        {/* Order Details */}
                        <div
                          className="mt-5 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2"
                          style={{ color: "#786B62" }}
                        >
                          <p className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 shrink-0" style={{ color: "#C93627" }} />
                            Delivery: {formatDate(order.deliveryDate)}
                          </p>

                          <p className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 shrink-0" style={{ color: "#C93627" }} />
                            Requested: {formatDate(order.requestDate)}
                          </p>

                          <p className="flex items-start gap-2 sm:col-span-2">
                            <MapPin className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "#C93627" }} />
                            <span className="break-words">
                              {order.deliveryAddress || "No address provided"}
                            </span>
                          </p>
                        </div>

                        {/* Price and Actions */}
                        <div
                          className="mt-5 flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-center sm:justify-between"
                          style={{ borderColor: "#F0E3D8" }}
                        >
                          <p
                            className="text-lg font-extrabold"
                            style={{ color: "#C93627" }}
                          >
                            {formatPrice(order.totalPrice)}
                          </p>

                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedOrder(order)}
                              className="border-[#E8D8CA] bg-white text-[#35100A] hover:bg-orange-50"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Details
                            </Button>

                            {order.status.toLowerCase() === "pending" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setCancelError("");
                                  setCancelOrderId(order._id);
                                }}
                                className="border-red-200 bg-white text-red-600 hover:bg-red-50"
                              >
                                <X className="mr-2 h-4 w-4" />
                                Cancel
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Order Details Dialog */}
      <Dialog
        open={!!selectedOrder}
        onOpenChange={(open) => {
          if (!open) setSelectedOrder(null);
        }}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto border-[#F0E3D8] bg-white text-[#35100A] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Order Details
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-5">
              <div
                className="relative h-48 overflow-hidden rounded-xl"
                style={{ backgroundColor: "#FFF0E5" }}
              >
                {selectedOrder.item?.images?.[0] ? (
                  <Image
                    src={selectedOrder.item.images[0]}
                    alt={selectedOrder.item.itemName || "Pizza"}
                    fill
                    sizes="(max-width: 640px) 100vw, 512px"
                    className="object-cover"
                    unoptimized
                    loading="eager"

                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Pizza className="h-14 w-14" style={{ color: "#C93627" }} />
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-bold">
                  {selectedOrder.item?.itemName || "Unavailable item"}
                </h3>
                <p className="mt-1 text-sm" style={{ color: "#786B62" }}>
                  {selectedOrder.item?.category || "Pizza"}
                </p>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm" style={{ color: "#786B62" }}>
                  Order status
                </span>

                {(() => {
                  const status = getStatusStyle(selectedOrder.status);

                  return (
                    <span
                      className="rounded-full px-3 py-1 text-xs font-bold"
                      style={{
                        backgroundColor: status.background,
                        color: status.color,
                      }}
                    >
                      {status.label}
                    </span>
                  );
                })()}
              </div>

              <div
                className="space-y-4 rounded-xl p-4 text-sm"
                style={{ backgroundColor: "#FFF9F0" }}
              >
                <div className="flex justify-between gap-4">
                  <span style={{ color: "#786B62" }}>Order ID</span>
                  <span className="break-all text-right font-medium">
                    {selectedOrder._id}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span style={{ color: "#786B62" }}>Vendor</span>
                  <span className="text-right font-medium">
                    {selectedOrder.vendor?.businessName ||
                      selectedOrder.vendor?.name ||
                      "Unknown"}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span style={{ color: "#786B62" }}>Quantity</span>
                  <span className="font-medium">
                    {selectedOrder.quantity ?? "—"}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span style={{ color: "#786B62" }}>Unit price</span>
                  <span className="font-medium">
                    {formatPrice(selectedOrder.item?.price)}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span style={{ color: "#786B62" }}>Total price</span>
                  <span className="font-bold" style={{ color: "#C93627" }}>
                    {formatPrice(selectedOrder.totalPrice)}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span style={{ color: "#786B62" }}>Delivery date</span>
                  <span className="font-medium">
                    {formatDate(selectedOrder.deliveryDate)}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span style={{ color: "#786B62" }}>Request date</span>
                  <span className="font-medium">
                    {formatDate(selectedOrder.requestDate)}
                  </span>
                </div>

                <div>
                  <p style={{ color: "#786B62" }}>Delivery address</p>
                  <p className="mt-1 break-words font-medium">
                    {selectedOrder.deliveryAddress || "No address provided"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog
        open={!!cancelOrderId}
        onOpenChange={(open) => {
          if (!open && !cancelling) setCancelOrderId(null);
        }}
      >
        <AlertDialogContent className="border-[#F0E3D8] bg-white text-[#35100A]">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Cancel this order?
            </AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to cancel this order? This action cannot be undone.
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
                event.preventDefault();
                void handleCancelOrder();
              }}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {cancelling ? "Cancelling..." : "Yes, Cancel Order"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
