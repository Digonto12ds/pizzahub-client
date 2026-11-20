
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  Clock,
  MapPin,
  MessageSquare,
  Package,
  ShoppingBag,
  User,
  XCircle,
  Loader2,
} from "lucide-react";
import { toast } from "react-hot-toast";

import {
  getVendorOrders,
  updateVendorOrderStatus,
  type VendorOrder,
} from "@/lib/api/vendor";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// Fixed light-mode status colors
const statusStyles: Record<string, string> = {
  Pending: "border-amber-200! bg-amber-100! text-amber-800!",
  Accepted: "border-green-200! bg-green-100! text-green-800!",
  Rejected: "border-red-200! bg-red-100! text-red-800!",
  Cancelled: "border-gray-200! bg-gray-100! text-gray-700!",
};

export default function CustomerOrders() {
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Load vendor orders
  useEffect(() => {
    let active = true;

    const loadOrders = async () => {
      try {
        const result = await getVendorOrders();

        if (active) {
          setOrders(result);
          setError("");
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load customer orders."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadOrders();

    return () => {
      active = false;
    };
  }, []);

  // Update order status
  const handleStatusUpdate = async (
    order: VendorOrder,
    status: "Accepted" | "Rejected"
  ) => {
    if (order.status !== "Pending" || processingId) return;

    try {
      setProcessingId(order._id);

      await updateVendorOrderStatus(order._id, status);

      setOrders((current) =>
        current.map((item) =>
          item._id === order._id ? { ...item, status } : item
        )
      );

      toast.success(
        status === "Accepted"
          ? "Order accepted successfully."
          : "Order rejected successfully."
      );
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to update order status."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen space-y-6 bg-[#faf7f2]">
        <div className="h-8 w-56 animate-pulse rounded-lg bg-orange-100" />

        <div className="grid gap-5 xl:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-80 animate-pulse rounded-xl border border-[#f0e3d8] bg-white"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-7 bg-[#faf7f2] text-[#35100A]">

      {/* Heading */}
      <div>
        <h1 className="text-2xl font-bold text-[#35100A] sm:text-3xl">
          Customer Orders
        </h1>

        <p className="mt-2 text-sm text-[#786b62]">
          View and manage orders placed by your customers.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          {
            label: "Total Orders",
            value: orders.length,
          },
          {
            label: "Pending",
            value: orders.filter((o) => o.status === "Pending").length,
          },
          {
            label: "Accepted",
            value: orders.filter((o) => o.status === "Accepted").length,
          },
          {
            label: "Rejected",
            value: orders.filter((o) => o.status === "Rejected").length,
          },
        ].map((stat) => (
          <Card
            key={stat.label}
            className="border-[#f0e3d8]! bg-white! text-[#35100A]! shadow-sm"
          >
            <CardContent className="p-4">
              <p className="text-xs text-[#786b62]">
                {stat.label}
              </p>

              <p className="mt-2 text-2xl font-bold text-[#35100A]">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Error */}
      {error && (
        <Card className="border-red-200! bg-red-50! text-[#991b1b]!">
          <CardContent className="p-5">
            <p className="text-sm text-red-700">
              {error}
            </p>

            <Button
              className="mt-3 border border-red-200! bg-white! text-red-700! hover:bg-red-100!"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!error && orders.length === 0 && (
        <Card className="border-[#e8d5c9]! border-dashed! bg-white! text-[#35100A]! shadow-none">
          <CardContent className="flex flex-col items-center px-5 py-14 text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-orange-50 text-[#C93627]">
              <ShoppingBag className="size-7" />
            </div>

            <h2 className="text-lg font-semibold text-[#35100A]">
              No orders yet
            </h2>

            <p className="mt-2 text-sm text-[#786b62]">
              Customer orders will appear here when someone places an order.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Orders List */}
      {!error && orders.length > 0 && (
        <div className="grid gap-5 xl:grid-cols-2">
          {orders.map((order) => {
            const isProcessing = processingId === order._id;

            return (
              <Card
                key={order._id}
                className="overflow-hidden border-[#f0e3d8]! bg-white! text-[#35100A]! shadow-sm"
              >
                <CardContent className="space-y-5 p-5">

                  {/* Order Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-[#786b62]">
                        Order ID
                      </p>

                      <p className="mt-1 text-sm font-semibold text-[#35100A]">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                    </div>

                    <Badge
                      className={`border ${statusStyles[order.status] || "border-gray-200! bg-gray-100! text-gray-700!"}`}
                    >
                      {order.status}
                    </Badge>
                  </div>

                  {/* Customer Information */}
                  <div className="rounded-xl border border-orange-100 bg-[#fff8f1] p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <User className="size-4 text-[#C93627]" />

                      <h3 className="font-semibold text-[#35100A]">
                        Customer Information
                      </h3>
                    </div>

                    <div className="flex items-center gap-3">
                      {order.customer?.image ? (
                        <Image
                          src={order.customer.image}
                          alt={order.customer.name || "Customer"}
                          width={44}
                          height={44}
                          unoptimized
                          className="size-11 shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-orange-100 text-[#C93627]">
                          <User className="size-5" />
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="font-semibold text-[#35100A]">
                          {order.customer?.name || "Unknown Customer"}
                        </p>

                        <p className="break-all text-xs text-[#786b62]">
                          {order.customer?.email || "No email available"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Ordered Item */}
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <Package className="size-4 text-[#C93627]" />

                      <h3 className="font-semibold text-[#35100A]">
                        Ordered Item
                      </h3>
                    </div>

                    <div className="flex gap-4">
                      <div className="relative size-20 shrink-0 overflow-hidden rounded-lg border border-orange-100 bg-orange-50">
                        {order.item?.images?.[0] ? (
                          <Image
                            src={order.item.images[0]}
                            alt={order.item.itemName || "Ordered item"}
                            fill
                            unoptimized
                            sizes="80px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[#C93627]">
                            <Package className="size-7" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[#35100A]">
                          {order.item?.itemName || "Item unavailable"}
                        </p>

                        <p className="mt-1 text-xs text-[#786b62]">
                          {order.item?.category || "Unknown category"}
                        </p>

                        <p className="mt-2 font-bold text-[#C93627]">
                          ৳
                          {order.item?.price?.toLocaleString("en-BD") ?? "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Information */}
                  <div className="space-y-3 border-t border-[#f0e3d8] pt-4">

                    <div className="flex items-start gap-3">
                      <Clock className="mt-0.5 size-4 shrink-0 text-[#C93627]" />

                      <div>
                        <p className="text-xs text-[#786b62]">
                          Delivery Date
                        </p>

                        <p className="mt-1 text-sm font-medium text-[#35100A]">
                          {order.deliveryDate
                            ? new Date(
                                `${order.deliveryDate}T00:00:00`
                              ).toLocaleDateString("en-BD", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })
                            : "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 size-4 shrink-0 text-[#C93627]" />

                      <div>
                        <p className="text-xs text-[#786b62]">
                          Delivery Address
                        </p>

                        <p className="mt-1 text-sm text-[#35100A]">
                          {order.deliveryAddress || "No address provided"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MessageSquare className="mt-0.5 size-4 shrink-0 text-[#C93627]" />

                      <div>
                        <p className="text-xs text-[#786b62]">
                          Customer Message
                        </p>

                        <p className="mt-1 text-sm text-[#35100A]">
                          {order.message || "No additional message."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Accept / Reject Actions */}
                  {order.status === "Pending" && (
                    <div className="grid grid-cols-2 gap-3 border-t border-[#f0e3d8] pt-4">
                      <Button
                        disabled={isProcessing}
                        onClick={() =>
                          handleStatusUpdate(order, "Accepted")
                        }
                        className="bg-green-600! text-white! hover:bg-green-700! disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isProcessing ? (
                          <Loader2 className="mr-2 size-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="mr-2 size-4" />
                        )}

                        Accept
                      </Button>

                      <Button
                        disabled={isProcessing}
                        onClick={() =>
                          handleStatusUpdate(order, "Rejected")
                        }
                        className="bg-red-600! text-white! hover:bg-red-700! disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isProcessing ? (
                          <Loader2 className="mr-2 size-4 animate-spin" />
                        ) : (
                          <XCircle className="mr-2 size-4" />
                        )}

                        Reject
                      </Button>
                    </div>
                  )}

                  {/* Processed Order Message */}
                  {order.status !== "Pending" && (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-center text-xs text-gray-600">
                      This order has already been processed.
                    </div>
                  )}

                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
