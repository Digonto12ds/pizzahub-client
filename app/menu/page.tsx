"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { Search, MapPin, Pizza, UtensilsCrossed } from "lucide-react"

import { getMenuItems, type MenuItem } from "@/lib/api/menu"
import { authClient } from "@/lib/auth-client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const categories = [
  "Classic Pizzas",
  "Vegetarian Pizzas",
  "Meat Lovers",
  "Specialty / Gourmet Pizzas",
  "Sides & Appetizers",
  "Beverages & Desserts",
]

function MenuCardSkeleton() {
  return (
    <Card className="overflow-hidden border-orange-100">
      <Skeleton className="h-52 w-full rounded-none" />

      <CardContent className="space-y-4 p-5">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  )
}

export default function BrowseMenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [location, setLocation] = useState("")

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [refreshCount, setRefreshCount] = useState(0)

  // Check whether the user is logged in
  const { data: session, isPending } = authClient.useSession()

  // Fetch menu items whenever a filter changes
  useEffect(() => {
    const controller = new AbortController()

    const timeout = setTimeout(async () => {
      setLoading(true)
      setError("")

      try {
        const data = await getMenuItems(
          {
            search: search.trim(),
            category,
            location: location.trim(),
          },
          controller.signal
        )

        setMenuItems(data)
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return
        }

        setError("Something went wrong while loading menu items.")
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }, 300)

    return () => {
      clearTimeout(timeout)
      controller.abort()
    }
  }, [search, category, location, refreshCount])

  const clearFilters = () => {
    setSearch("")
    setCategory("all")
    setLocation("")
  }

  return (
    <main className="min-h-screen bg-[#FFF9F0]">
      {/* Page Heading */}
      <section className="bg-[#35100A] px-4 py-16 text-center text-white sm:py-20">
        <Badge className="mb-4 border-none bg-[#C93627] px-4 py-1.5 text-white hover:bg-[#C93627]">
          OUR MENU
        </Badge>

        <h1 className="text-3xl font-bold sm:text-5xl">
          Discover Your Favorite Pizza
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
          Explore delicious pizzas, sides, and desserts from our trusted local
          vendors.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Search and Filters */}
        <div className="mb-8 rounded-2xl border border-orange-100 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-[#35100A]">
              Find Your Perfect Meal
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Search and filter our available menu items.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Search by name */}
            <div className="relative">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />

              <Input
                placeholder="Search by item name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 border-orange-100 pl-10 focus-visible:ring-[#C93627]"
              />
            </div>

            {/* Filter by category */}
            <Select
              value={category}
              onValueChange={(value) => setCategory(value ?? "all")}
            >
              <SelectTrigger className="h-11 w-full border-orange-100 focus:ring-[#C93627]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>

                {categories.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filter by location */}
            <div className="relative">
              <MapPin className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />

              <Input
                placeholder="Filter by location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-11 border-orange-100 pl-10 focus-visible:ring-[#C93627]"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              onClick={clearFilters}
              className="border-[#C93627] text-[#C93627] hover:bg-red-50"
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Results Heading */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-[#35100A]">
              Explore Our Menu
            </h2>

            {!loading && !error && (
              <p className="mt-1 text-sm text-gray-500">
                {menuItems.length} menu item(s) found
              </p>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <MenuCardSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-white px-6 py-12 text-center">
            <p className="font-medium text-red-600">{error}</p>

            <Button
              onClick={() => setRefreshCount((count) => count + 1)}
              className="mt-5 bg-[#C93627] hover:bg-[#A92C20]"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && menuItems.length === 0 && (
          <div className="rounded-2xl border border-dashed border-orange-200 bg-white px-6 py-16 text-center">
            <Pizza className="mx-auto size-14 text-[#C93627]/50" />

            <h3 className="mt-5 text-xl font-bold text-[#35100A]">
              No Menu Items Found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              We couldn&apos;t find any items matching your search. Try changing
              your filters.
            </p>

            <Button
              onClick={clearFilters}
              className="mt-6 bg-[#C93627] hover:bg-[#A92C20]"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Menu Cards */}
        {!loading && !error && menuItems.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {menuItems.map((item) => {
              const detailsHref = `/menu/${item._id}`

              // Logged-out users must sign in before viewing details
              const viewDetailsHref = session
                ? detailsHref
                : `/sign-in?callbackURL=${encodeURIComponent(detailsHref)}`

              return (
                <Card
                  key={item._id}
                  className="group overflow-hidden border-orange-100 bg-white py-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Product Image */}
                  <div className="relative h-56 overflow-hidden bg-orange-50">
                    {item.images?.[0] ? (
                      <Image
                        src={item.images[0]}
                        alt={item.itemName}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <UtensilsCrossed className="size-14 text-[#C93627]/40" />
                      </div>
                    )}

                    <Badge className="absolute top-4 left-4 border-none bg-white text-[#C93627] shadow-sm hover:bg-white">
                      {item.category}
                    </Badge>
                  </div>

                  <CardContent className="space-y-4 p-5">
                    {/* Name and Price */}
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-bold text-[#35100A]">
                        {item.itemName}
                      </h3>

                      <span className="shrink-0 text-lg font-extrabold text-[#C93627]">
                        ৳{item.price.toLocaleString("en-BD")}
                      </span>
                    </div>

                    <p className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="size-4 shrink-0 text-[#C93627]" />
                      {item.location}
                    </p>

                    {/* Vendor Information */}
                    <div className="flex items-center gap-3 border-t border-orange-100 pt-4">
                      {item.vendor?.image ? (
                        <Image
                          src={item.vendor.image}
                          alt={item.vendor.name || "Vendor"}
                          width={40}
                          height={40}
                          unoptimized
                          className="size-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex size-10 items-center justify-center rounded-full bg-red-100 text-[#C93627]">
                          <UtensilsCrossed className="size-5" />
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#35100A]">
                          {item.vendor?.businessName || "Pizza Vendor"}
                        </p>

                        <p className="truncate text-xs text-gray-500">
                          {item.vendor?.name || "Local Vendor"}
                        </p>
                      </div>
                    </div>

                    {/* View Details */}
                    {isPending ? (
                      <Button disabled className="h-11 w-full">
                        Checking...
                      </Button>
                    ) : (
                      <Link
                        href={viewDetailsHref}
                        className="flex h-11 w-full items-center justify-center rounded-md bg-[#C93627] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#A92C20]"
                      >
                        View Details
                      </Link>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}
