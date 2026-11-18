
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import {
  getMenuItemById,
  type MenuItem,
} from "@/lib/api/menu";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

import {
  MapPin,
  Store,
  ShoppingCart,
  Pizza,
  ArrowLeft,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  ShieldCheck,
  Truck,
  Utensils,
  Heart,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

type UserRole = "customer" | "vendor" | "admin";

type SessionUser = {
  id: string;
  role?: UserRole;
};

function DetailsSkeleton() {
  return (
    <main className="min-h-screen bg-[#FFF9F0] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Skeleton className="mb-8 h-9 w-36" />

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <Skeleton className="aspect-5/4 w-full rounded-3xl" />
            <div className="flex gap-3">
              {[1, 2, 3].map((n) => (
                <Skeleton key={n} className="size-20 rounded-xl" />
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <Skeleton className="h-7 w-28" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-9 w-36" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        </div>
      </div>
    </main>
  );
}

export default function MenuItemDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const itemId = params.id;

  const { data: session, isPending } = authClient.useSession();

  const [item, setItem] = useState<MenuItem | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favorite, setFavorite] = useState(false);

  const user = session?.user as SessionUser | undefined;

  // Redirect logged-out users to Sign In
  useEffect(() => {
    if (!isPending && !session) {
      router.replace(
        `/signin?callbackURL=${encodeURIComponent(`/menu/${itemId}`)}`
      );
    }
  }, [isPending, session, router, itemId]);

  // Fetch menu item
  useEffect(() => {
    if (isPending || !session || !itemId) return;

    const controller = new AbortController();

    async function fetchItem() {
      try {
        const data = await getMenuItemById(itemId, controller.signal);

        if (!controller.signal.aborted) {
          setItem(data);
          setSelectedImage(0);
          setError("");
        }
      } catch (err) {
        if (controller.signal.aborted) return;

        if (err instanceof Error && err.message === "INVALID_ID") {
          setError("INVALID_ID");
        } else if (err instanceof Error && err.message === "NOT_FOUND") {
          setError("NOT_FOUND");
        } else {
          setError("FETCH_ERROR");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchItem();

    return () => controller.abort();
  }, [itemId, isPending, session]);

  const isOwnItem =
    user?.role === "vendor" &&
    item?.vendorId === user.id;

  const canOrder =
    user?.role === "customer" ||
    (user?.role === "vendor" && !isOwnItem);

  const images = item?.images?.length ? item.images : [];

  const totalPrice = item ? item.price * quantity : 0;

  const handleOrder = () => {
    if (!item || !canOrder) return;

    router.push(
      `/checkout?menuItemId=${item._id}&quantity=${quantity}`
    );
  };

  const nextImage = () => {
    setSelectedImage((current) =>
      current === images.length - 1 ? 0 : current + 1
    );
  };

  const previousImage = () => {
    setSelectedImage((current) =>
      current === 0 ? images.length - 1 : current - 1
    );
  };

  if (isPending || loading) {
    return <DetailsSkeleton />;
  }

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFF9F0]">
        <p className="text-sm text-gray-500">
          Redirecting you to Sign In...
        </p>
      </main>
    );
  }

  if (error || !item) {
    const errorTitle =
      error === "INVALID_ID"
        ? "Invalid Menu Item"
        : error === "NOT_FOUND"
          ? "Item Not Available"
          : "Unable to Load Item";

    const errorDescription =
      error === "INVALID_ID"
        ? "The menu item address is invalid."
        : error === "NOT_FOUND"
          ? "This item may have been removed, disabled, or is not approved."
          : "Something went wrong. Please try again.";

    return (
      <main className="flex min-h-[75vh] items-center justify-center bg-[#FFF9F0] px-4 py-16">
        <Card className="w-full max-w-lg overflow-hidden rounded-3xl border-orange-100 shadow-xl">
          <CardContent className="flex flex-col items-center p-9 text-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-red-50">
              <Pizza className="size-10 text-[#C93627]" />
            </div>

            <h1 className="mt-6 text-2xl font-extrabold text-[#35100A]">
              {errorTitle}
            </h1>

            <p className="mt-3 max-w-sm text-sm leading-7 text-gray-500">
              {errorDescription}
            </p>

            <Button
              onClick={() => router.push("/menu")}
              className="mt-7 h-12 rounded-xl bg-[#C93627] px-7 hover:bg-[#A92C20]"
            >
              <ArrowLeft className="mr-2 size-4" />
              Explore Menu
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFF9F0] pb-24 lg:pb-12">

      {/* Top Breadcrumb Area */}
      <div className="border-b border-orange-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/menu")}
            className="gap-2 text-sm font-semibold text-[#35100A] hover:bg-red-50 hover:text-[#C93627]"
          >
            <ArrowLeft className="size-4" />
            Back to Menu
          </Button>

          <div className="hidden items-center gap-2 text-xs text-gray-400 sm:flex">
            <Link href="/" className="hover:text-red-600">PizzaHub</Link>
            <span>/</span>
            <Link href="/menu" className="hover:text-red-600">Menu</Link>
            <span>/</span>
            <span className="font-semibold text-[#C93627]">
              {item.itemName}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setFavorite((value) => !value)}
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
            aria-pressed={favorite}
            className={`flex size-10 items-center justify-center rounded-full border transition ${
              favorite
                ? "border-red-200 bg-red-50 text-[#C93627]"
                : "border-orange-100 bg-white text-gray-500 hover:text-[#C93627]"
            }`}
          >
            <Heart
              className="size-5"
              fill={favorite ? "currentColor" : "none"}
            />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">

        {/* Main Product Layout */}
        <div className="grid items-start gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12">

          {/* LEFT: Image Gallery */}
          <div className="min-w-0">

            <div className="group relative aspect-5/4 overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm">

              {images[selectedImage] ? (
                <Image
                  src={images[selectedImage]}
                  alt={item.itemName}
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-orange-50">
                  <Pizza className="size-24 text-[#C93627]/30" />
                </div>
              )}

              {/* Image Overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/50 to-transparent p-5 sm:p-7">
                <div className="flex items-end justify-between">
                  <div>
                    <Badge className="border-none bg-white/95 text-[#C93627] hover:bg-white">
                      {item.category}
                    </Badge>
                    <p className="mt-3 text-sm font-medium text-white/90">
                      Freshly prepared with quality ingredients
                    </p>
                  </div>

                  <span className="rounded-full bg-black/40 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                    {images.length ? selectedImage + 1 : 0} / {images.length}
                  </span>
                </div>
              </div>

              {/* Gallery Controls */}
              {images.length > 1 && (
                <>
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={previousImage}
                    aria-label="Previous image"
                    className="absolute left-4 top-1/2 size-10 -translate-y-1/2 rounded-full border border-white/50 bg-white/90 shadow-lg hover:bg-white"
                  >
                    <ChevronLeft className="size-5" />
                  </Button>

                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={nextImage}
                    aria-label="Next image"
                    className="absolute right-4 top-1/2 size-10 -translate-y-1/2 rounded-full border border-white/50 bg-white/90 shadow-lg hover:bg-white"
                  >
                    <ChevronRight className="size-5" />
                  </Button>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    aria-label={`View image ${index + 1}`}
                    aria-pressed={selectedImage === index}
                    className={`relative size-20 shrink-0 overflow-hidden rounded-xl border-2 transition sm:size-24 ${
                      selectedImage === index
                        ? "border-[#C93627] ring-2 ring-[#C93627]/15"
                        : "border-transparent opacity-65 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${item.itemName} image ${index + 1}`}
                      fill
                      unoptimized
                      sizes="96px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Quality Highlights */}
            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-2xl border border-orange-100 bg-white p-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-50">
                  <Utensils className="size-5 text-[#C93627]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#35100A]">Fresh Food</p>
                  <p className="mt-1 text-[11px] text-gray-500">Made to order</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-orange-100 bg-white p-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-50">
                  <ShieldCheck className="size-5 text-[#C93627]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#35100A]">Quality</p>
                  <p className="mt-1 text-[11px] text-gray-500">Approved item</p>
                </div>
              </div>

              <div className="col-span-2 flex items-center gap-3 rounded-2xl border border-orange-100 bg-white p-4 sm:col-span-1">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-yellow-50">
                  <Sparkles className="size-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#35100A]">PizzaHub</p>
                  <p className="mt-1 text-[11px] text-gray-500">Discover more</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Product Information */}
          <div className="min-w-0">

            {/* Category and Availability */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="border-none bg-red-100 px-3 py-1.5 text-[#C93627] hover:bg-red-100">
                {item.category}
              </Badge>

              <Badge variant="outline" className="gap-1.5 border-green-200 bg-green-50 text-green-700">
                <CheckCircle2 className="size-3.5" />
                Available
              </Badge>
            </div>

            {/* Product Name */}
            <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-[#35100A] sm:text-4xl lg:text-[42px]">
              {item.itemName}
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-8 text-gray-600 sm:text-base">
              {item.description || "A delicious choice from PizzaHub. Discover the taste and enjoy every bite."}
            </p>

            {/* Price Panel */}
            <div className="mt-7 rounded-2xl border border-red-100 bg-linear-to-br from-red-50 to-orange-50 p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                Our Price
              </p>

              <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <span className="text-4xl font-extrabold tracking-tight text-[#C93627] sm:text-5xl">
                    ৳{item.price.toLocaleString("en-BD")}
                  </span>
                  <p className="mt-2 text-xs text-gray-500">
                    Price per item
                  </p>
                </div>

                <div className="rounded-xl bg-white px-4 py-3 text-xs font-semibold text-[#35100A] shadow-sm">
                  <span className="flex items-center gap-2">
                    <Sparkles className="size-4 text-[#C93627]" />
                    Great choice!
                  </span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="mt-6 flex gap-4 rounded-2xl border border-orange-100 bg-white p-4 sm:p-5">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-red-50">
                <MapPin className="size-6 text-[#C93627]" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500">
                  Restaurant Location
                </p>
                <p className="mt-1 font-bold text-[#35100A]">
                  {item.location}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Check availability for your delivery area
                </p>
              </div>
            </div>

            {/* Vendor Profile */}
            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-bold text-[#35100A]">
                  Your Pizza Vendor
                </h2>
                <span className="text-xs font-medium text-[#C93627]">
                  Local Partner
                </span>
              </div>

              <Card className="overflow-hidden rounded-2xl border-orange-100 bg-white shadow-sm">
                <CardContent className="flex items-center justify-between gap-3 p-4 sm:p-5">
                  <div className="flex min-w-0 items-center gap-3">
                    {item.vendor?.image ? (
                      <Image
                        src={item.vendor.image}
                        alt={item.vendor.name || "Vendor"}
                        width={56}
                        height={56}
                        unoptimized
                        className="size-14 shrink-0 rounded-2xl border border-orange-100 object-cover"
                      />
                    ) : (
                      <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-red-50">
                        <Store className="size-7 text-[#C93627]" />
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate font-bold text-[#35100A]">
                        {item.vendor?.businessName || "Pizza Vendor"}
                      </p>
                      <p className="mt-1 truncate text-sm text-gray-500">
                        {item.vendor?.name || "Local Vendor"}
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-green-600">
                        <CheckCircle2 className="size-3.5" />
                        Verified menu listing
                      </p>
                    </div>
                  </div>

                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-orange-50">
                    <Store className="size-5 text-[#C93627]" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quantity Selector */}
            {canOrder && (
              <div className="mt-7 rounded-2xl border border-orange-100 bg-white p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-[#35100A]">
                      Select Quantity
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">
                      Choose how many you want
                    </p>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-orange-100 p-1.5">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      disabled={quantity <= 1}
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      aria-label="Decrease quantity"
                      className="size-9 rounded-lg text-[#C93627] hover:bg-red-50"
                    >
                      <Minus className="size-4" />
                    </Button>

                    <span className="min-w-6 text-center font-bold text-[#35100A]">
                      {quantity}
                    </span>

                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      disabled={quantity >= 10}
                      onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                      aria-label="Increase quantity"
                      className="size-9 rounded-lg text-[#C93627] hover:bg-red-50"
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>
                </div>

                <Separator className="my-5 bg-orange-100" />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Subtotal ({quantity} {quantity === 1 ? "item" : "items"})
                  </span>

                  <span className="text-xl font-extrabold text-[#35100A]">
                    ৳{totalPrice.toLocaleString("en-BD")}
                  </span>
                </div>
              </div>
            )}

            {/* Order Button / Permission */}
            <div className="mt-6">
              {canOrder ? (
                <Button
                  onClick={handleOrder}
                  className="h-14 w-full rounded-xl bg-[#C93627] text-base font-bold text-white shadow-lg shadow-red-900/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#A92C20] hover:shadow-xl"
                >
                  <ShoppingCart className="mr-2 size-5" />
                  Continue to Order
                  <span className="ml-auto rounded-lg bg-white/15 px-3 py-1.5 text-sm">
                    ৳{totalPrice.toLocaleString("en-BD")}
                  </span>
                </Button>
              ) : isOwnItem ? (
                <Alert className="rounded-xl border-orange-200 bg-orange-50 text-[#35100A]">
                  <AlertCircle className="size-4 text-[#C93627]" />
                  <AlertTitle>Vendor Restriction</AlertTitle>
                  <AlertDescription>
                    You cannot order your own menu items.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="rounded-xl border-orange-200 bg-orange-50 text-[#35100A]">
                  <AlertCircle className="size-4 text-[#C93627]" />
                  <AlertTitle>Ordering Not Available</AlertTitle>
                  <AlertDescription>
                    Admin accounts cannot place customer orders.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <p className="mt-4 text-center text-xs leading-6 text-gray-400">
              <ShieldCheck className="mr-1 inline size-3.5" />
              Your order will be confirmed during checkout.
            </p>
          </div>
        </div>

        {/* Bottom Information Section */}
        <section className="mt-16 border-t border-orange-100 pt-10">
          <div className="mb-7">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C93627]">
              The PizzaHub Promise
            </span>
            <h2 className="mt-2 text-2xl font-extrabold text-[#35100A] sm:text-3xl">
              A better way to enjoy your favorites.
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex gap-4 rounded-2xl border border-orange-100 bg-white p-5">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-red-50">
                <ShieldCheck className="size-5 text-[#C93627]" />
              </div>
              <div>
                <h3 className="font-bold text-[#35100A]">Approved Listings</h3>
                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Browse menu items approved and activated by PizzaHub.
                </p>
              </div>
            </div>

            <div className="flex gap-4 rounded-2xl border border-orange-100 bg-white p-5">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-orange-50">
                <Store className="size-5 text-[#C93627]" />
              </div>
              <div>
                <h3 className="font-bold text-[#35100A]">Local Vendors</h3>
                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Discover menu items from different restaurant partners.
                </p>
              </div>
            </div>

            <div className="flex gap-4 rounded-2xl border border-orange-100 bg-white p-5 sm:col-span-2 lg:col-span-1">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-yellow-50">
                <Truck className="size-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-[#35100A]">Easy Ordering</h3>
                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Continue to checkout to review and confirm your order.
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Mobile Sticky Order Bar */}
      {canOrder && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-orange-100 bg-white/95 p-4 shadow-[0_-8px_30px_rgba(53,16,10,0.08)] backdrop-blur-md lg:hidden">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs text-gray-500">Total Price</p>
              <p className="truncate text-xl font-extrabold text-[#C93627]">
                ৳{totalPrice.toLocaleString("en-BD")}
              </p>
            </div>

            <Button
              onClick={handleOrder}
              className="h-12 shrink-0 rounded-xl bg-[#C93627] px-5 font-bold text-white hover:bg-[#A92C20]"
            >
              <ShoppingCart className="mr-2 size-4" />
              Order Now
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}
