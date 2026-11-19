"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { toast } from "react-hot-toast"
import {
  ArrowLeft,
  CalendarDays,
  Loader2,
  MapPin,
  Minus,
  Plus,
} from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { createCustomerOrder } from "@/lib/api/checkout"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

type MenuItem = {
  _id: string
  itemName: string
  category: string
  description: string
  price: number
  location: string
  images: string[]
  vendor?: {
    name?: string
    businessName?: string
    image?: string
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get menu item ID and quantity from URL
  const menuItemId = searchParams.get("menuItemId")
  const initialQuantity = Number(searchParams.get("quantity")) || 1

  // Better Auth session
  const { data: session, isPending } = authClient.useSession()

  // States
  const [item, setItem] = useState<MenuItem | null>(null)
  const [quantity, setQuantity] = useState(
    Math.min(Math.max(initialQuantity, 1), 10)
  )

  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [deliveryDate, setDeliveryDate] = useState("")

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Fetch menu item
  useEffect(() => {
    if (!menuItemId) {
      return
    }

    const controller = new AbortController()

    const fetchMenuItem = async () => {
      try {
        const response = await fetch(`${BASE_URL}/menu/${menuItemId}`, {
          signal: controller.signal,
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.message || "Failed to load menu item.")
        }

        setItem(result.data || result)
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          toast.error(error.message)
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchMenuItem()

    return () => controller.abort()
  }, [menuItemId])

  // Handle quantity decrease
  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1))
  }

  // Handle quantity increase
  const increaseQuantity = () => {
    setQuantity((prev) => Math.min(10, prev + 1))
  }

  // Calculate total price
  const totalPrice = item ? item.price * quantity : 0

  // Handle order submission
  const handlePlaceOrder = async () => {
    if (!item) return

    if (!deliveryAddress.trim() || !deliveryDate) {
      toast.error("Please provide your delivery address and date.")
      return
    }

    if (deliveryAddress.trim().length < 10) {
      toast.error("Please enter a complete delivery address.")
      return
    }

    try {
      setSubmitting(true)

      // Call the API function from lib/api/checkout.ts
      await createCustomerOrder({
        menuItemId: item._id,
        quantity,
        deliveryAddress: deliveryAddress.trim(),
        deliveryDate,
      })

      toast.success("Your order has been placed successfully!")

      router.push("/customer-dashboard")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      )
    } finally {
      setSubmitting(false)
    }
  }

  // Loading state
  if (isPending || (Boolean(menuItemId) && loading)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    )
  }

  // Authentication check
  if (!session?.user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <h2 className="text-xl font-bold text-[#35100A]">
          Please sign in first
        </h2>

        <p className="text-sm text-gray-500">
          You need to sign in before placing an order.
        </p>

        <Link
          href="/signin"
          className="rounded-lg bg-[#C93627] px-5 py-2.5 font-semibold text-white hover:bg-[#a92b20]"
        >
          Sign In
        </Link>
      </div>
    )
  }

  // Missing or invalid menu item
  if (!menuItemId || !item) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <h2 className="text-xl font-bold text-[#35100A]">
          Menu item not found
        </h2>

        <p className="text-sm text-gray-500">
          This menu item may no longer be available.
        </p>

        <Link
          href="/menu"
          className="rounded-lg bg-[#C93627] px-5 py-2.5 font-semibold text-white hover:bg-[#a92b20]"
        >
          Browse Menu
        </Link>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#FFF9F0] px-4 py-10">
      <div className="mx-auto max-w-5xl">
        {/* Back button */}
        <Link
          href={`/menu/${item._id}`}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-red-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to menu item
        </Link>

        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#35100A] sm:text-4xl">
            Checkout
          </h1>

          <p className="mt-2 text-gray-600">
            Complete your delivery information to place your order.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* ========================= */}
          {/* ORDER SUMMARY */}
          {/* ========================= */}

          <Card className="h-fit border-orange-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-[#35100A]">
                Order Summary
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Product information */}
              <div className="flex gap-4">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-orange-50">
                  <Image
                    src={item.images?.[0] || "/Banner.png"}
                    alt={item.itemName}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-[#35100A]">{item.itemName}</h3>

                  <p className="mt-1 text-sm text-gray-500">{item.category}</p>

                  <p className="mt-2 font-semibold text-red-600">
                    ৳{item.price.toLocaleString("en-BD")} / item
                  </p>
                </div>
              </div>

              {/* Vendor information */}
              <div className="rounded-xl bg-orange-50 p-4">
                <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                  Sold by
                </p>

                <p className="mt-1 font-semibold text-[#35100A]">
                  {item.vendor?.businessName ||
                    item.vendor?.name ||
                    "Pizza Vendor"}
                </p>

                <p className="mt-2 flex items-center gap-1 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 shrink-0" />
                  {item.location}
                </p>
              </div>

              {/* Quantity selector */}
              <div>
                <Label className="text-sm font-semibold text-[#35100A]">
                  Quantity
                </Label>

                <div className="mt-3 flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={quantity <= 1}
                    onClick={decreaseQuantity}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>

                  <span className="min-w-8 text-center text-lg font-bold text-[#35100A]">
                    {quantity}
                  </span>

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={quantity >= 10}
                    onClick={increaseQuantity}
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <p className="mt-2 text-xs text-gray-500">
                  You can order between 1 and 10 items.
                </p>
              </div>

              {/* Price calculation */}
              <div className="space-y-3 border-t border-dashed border-orange-200 pt-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Price per item</span>
                  <span>৳{item.price.toLocaleString("en-BD")}</span>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <span>Quantity</span>
                  <span>{quantity}</span>
                </div>

                <div className="flex justify-between border-t border-orange-100 pt-3">
                  <span className="font-bold text-[#35100A]">Total Amount</span>

                  <span className="text-xl font-bold text-red-600">
                    ৳{totalPrice.toLocaleString("en-BD")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ========================= */}
          {/* DELIVERY INFORMATION */}
          {/* ========================= */}

          <Card className="h-fit border-orange-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-[#35100A]">
                Delivery Information
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Delivery address */}
              <div className="space-y-2">
                <Label htmlFor="address">Delivery Address</Label>

                <textarea
                  id="address"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter your full delivery address..."
                  rows={4}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm transition outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-red-500"
                />
              </div>

              {/* Delivery date */}
              <div className="space-y-2">
                <Label htmlFor="deliveryDate">Delivery Date</Label>

                <div className="relative">
                  <CalendarDays className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />

                  <Input
                    id="deliveryDate"
                    type="date"
                    min={new Date().toLocaleDateString("en-CA")}
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Payment information */}
              <div className="rounded-xl border border-orange-100 bg-orange-50 p-4">
                <p className="font-semibold text-[#35100A]">
                  Payment Information
                </p>

                <p className="mt-1 text-sm leading-relaxed text-gray-600">
                  No online payment is required for this order. Your order will
                  be sent to the vendor for confirmation.
                </p>
              </div>

              {/* Place order button */}
              <Button
                type="button"
                className="w-full bg-[#C93627] py-6 text-base font-bold text-white hover:bg-[#a92b20]"
                disabled={submitting}
                onClick={handlePlaceOrder}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  `Place Order — ৳${totalPrice.toLocaleString("en-BD")}`
                )}
              </Button>

              <p className="text-center text-xs text-gray-500">
                By placing this order, you agree to our ordering terms.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
