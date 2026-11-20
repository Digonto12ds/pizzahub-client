
"use client";

import { useEffect, useState } from "react";
import { Check, Crown, Zap, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

import { authClient } from "@/lib/auth-client";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const plans = [
  {
    name: "Free",
    price: "৳0",
    description: "Get started with the basic features.",
    features: [
      "Add up to 3 menu items",
      "Basic vendor dashboard",
      "Manage your menu",
    ],
  },
  {
    name: "Premium",
    price: "৳19",
    description: "Unlock all features for your restaurant.",
    features: [
      "Unlimited menu items",
      "Premium vendor features",
      "More flexibility to grow your business",
    ],
  },
];

export default function SubscriptionPlan() {
  const { data: session, isPending } = authClient.useSession();

  const [currentPlan, setCurrentPlan] = useState("free");
  const [subscriptionStatus, setSubscriptionStatus] = useState("inactive");
  const [subscriptionExpiresAt, setSubscriptionExpiresAt] =
    useState<string | null>(null);
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(false);

  const [loading, setLoading] = useState(false);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);

const isPageLoading = isPending || (!!session && subscriptionLoading);

  const isPremium = currentPlan.toLowerCase() === "premium";

  // Fetch current subscription
 useEffect(() => {
  if (isPending || !session) return;

  let active = true;

  const fetchSubscription = async () => {
    try {
      const { data, error } = await authClient.getSession();
      const token = data?.session?.token;

      if (error || !token) {
        throw new Error("Please sign in again.");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/vendor/subscription`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.message || "Failed to load subscription."
        );
      }

      if (active) {
        setCurrentPlan(result.subscriptionPlan || "free");
        setSubscriptionStatus(result.subscriptionStatus || "inactive");
        setSubscriptionExpiresAt(
          result.subscriptionExpiresAt || null
        );
        setCancelAtPeriodEnd(Boolean(result.cancelAtPeriodEnd));
      }
    } catch (error) {
      if (active) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load subscription."
        );
      }
    } finally {
      if (active) {
        setSubscriptionLoading(false);
      }
    }
  };

  void fetchSubscription();

  return () => {
    active = false;
  };
}, [isPending, session]);

  // Create Stripe checkout session
  const handleUpgrade = async () => {
    if (loading || isPremium) return;

    try {
      setLoading(true);

      const { data, error } = await authClient.getSession();
      const token = data?.session?.token;

      if (error || !token) {
        throw new Error("Please sign in again.");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/vendor/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.message || "Failed to create checkout session."
        );
      }

      if (!result?.url) {
        throw new Error("Stripe checkout URL was not returned.");
      }

      window.location.assign(result.url);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );

      setLoading(false);
    }
  };

  // Loading state
  if (isPageLoading) {
    return (
      <div className="flex min-h-75 items-center justify-center bg-[#faf7f2]">
        <Loader2 className="size-10 animate-spin text-[#C93627]" />
      </div>
    );
  }

  // Not authenticated
  if (!session) {
    return (
      <div className="rounded-2xl border border-[#f0e3d8] bg-white p-8 text-center text-[#35100A]">
        <h2 className="text-xl font-semibold text-[#35100A]">
          Please sign in
        </h2>

        <p className="mt-2 text-sm text-[#786b62]">
          Sign in to view your subscription information.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-8 bg-[#faf7f2] text-[#35100A]">

      {/* Page Heading */}
      <div>
        <h1 className="text-2xl font-bold text-[#35100A] sm:text-3xl">
          Subscription Plans
        </h1>

        <p className="mt-2 text-sm text-[#786b62]">
          Choose the right plan for your restaurant.
        </p>
      </div>

      {/* Current Plan */}
      <div className="rounded-2xl border border-[#f0e3d8] bg-white p-6 text-[#35100A] shadow-sm">
        <p className="text-sm text-[#786b62]">
          Your Current Plan
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h2 className="text-2xl font-bold capitalize text-[#35100A]">
            {currentPlan}
          </h2>

          {isPremium ? (
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              Premium Active
            </span>
          ) : (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
              Free Plan
            </span>
          )}
        </div>

        {/* Premium Information */}
        {isPremium && (
          <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4">
            <div className="flex items-center gap-2">
              <Crown className="size-5 text-green-700" />

              <span className="font-semibold text-green-800">
                Premium Subscription Active
              </span>
            </div>

            <p className="mt-2 text-sm text-green-700">
              Status: {subscriptionStatus}
            </p>

            {subscriptionExpiresAt && (
              <p className="mt-1 text-sm text-green-700">
                Expires on:{" "}
                {new Date(
                  subscriptionExpiresAt
                ).toLocaleDateString("en-BD")}
              </p>
            )}

            {cancelAtPeriodEnd && (
              <p className="mt-2 text-sm font-medium text-orange-700">
                Your subscription will end after the current billing period.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Available Plans */}
      <div className="grid gap-6 md:grid-cols-2">
        {plans.map((plan) => {
          const isCurrentPlan =
            currentPlan.toLowerCase() === plan.name.toLowerCase();

          const isPremiumPlan = plan.name === "Premium";

          return (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border bg-white p-6 text-[#35100A] ${
                isPremiumPlan
                  ? "border-[#C93627] shadow-lg shadow-orange-100"
                  : "border-[#f0e3d8] shadow-sm"
              }`}
            >
              {/* Recommended Label */}
              {isPremiumPlan && (
                <div className="absolute -top-3 right-5 rounded-full bg-[#C93627] px-4 py-1 text-xs font-semibold text-white shadow-sm">
                  Recommended
                </div>
              )}

              {/* Plan Name */}
              <div className="flex items-center gap-2">
                {isPremiumPlan ? (
                  <Crown className="size-6 text-[#C93627]" />
                ) : (
                  <Zap className="size-6 text-[#9A8270]" />
                )}

                <h2 className="text-xl font-bold text-[#35100A]">
                  {plan.name}
                </h2>
              </div>

              {/* Price */}
              <div className="mt-5">
                <span className="text-4xl font-bold text-[#35100A]">
                  {plan.price}
                </span>

                {isPremiumPlan && (
                  <span className="ml-2 text-sm text-[#786b62]">
                    / month
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="mt-3 text-sm text-[#786b62]">
                {plan.description}
              </p>

              <div className="my-6 h-px bg-[#f0e3d8]" />

              {/* Features */}
              <ul className="flex-1 space-y-4">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-sm text-[#49372C]"
                  >
                    <Check className="size-4 shrink-0 text-green-600" />

                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Plan Button */}
              <button
                type="button"
                onClick={handleUpgrade}
                disabled={
                  isPremium ||
                  loading ||
                  subscriptionLoading ||
                  !isPremiumPlan
                }
                className={`mt-8 flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition ${
                  isPremiumPlan
                    ? "bg-[#C93627] text-white hover:bg-[#A92D21]"
                    : "cursor-not-allowed border border-[#e8d5c9] bg-[#f5f0eb] text-[#9A8270]"
                } disabled:cursor-not-allowed disabled:opacity-60`}
              >
                {loading && isPremiumPlan ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Redirecting...
                  </>
                ) : isCurrentPlan ? (
                  "Current Plan"
                ) : isPremium ? (
                  "Already Premium"
                ) : isPremiumPlan ? (
                  "Upgrade to Premium"
                ) : (
                  "Free Plan"
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
