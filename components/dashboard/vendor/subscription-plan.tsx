
"use client";

import { useEffect, useState } from "react";
import { Check, Crown, Zap } from "lucide-react";
import { toast } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

type SubscriptionResponse = {
  success: boolean;
  subscriptionPlan: string;
  subscriptionStatus: string;
  subscriptionExpiresAt: string | null;
  cancelAtPeriodEnd: boolean;
  message?: string;
};

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

  const isPremium = currentPlan.toLowerCase() === "premium";

  // Fetch current subscription information from backend
 useEffect(() => {
  if (isPending || !session) return;

  const fetchSubscription = async () => {
    try {
      const { data, error } = await authClient.getSession();
      const token = data?.session?.token;

      if (error || !token) {
        throw new Error("Please sign in again.");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"}/api/vendor/subscription`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to load subscription."
        );
      }

      setCurrentPlan(result.subscriptionPlan);
      setSubscriptionStatus(result.subscriptionStatus);
      setSubscriptionExpiresAt(result.subscriptionExpiresAt);
      setCancelAtPeriodEnd(result.cancelAtPeriodEnd);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load subscription."
      );
    } finally {
      setSubscriptionLoading(false);
    }
  };

  fetchSubscription();
}, [isPending, session]);

  // Create Stripe checkout session
  const handleUpgrade = async () => {
    try {
      setLoading(true);

      const { data, error } = await authClient.getSession();
      const token = data?.session?.token;

      if (error || !token) {
        throw new Error("Please sign in again.");
      }

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL ||
          "http://localhost:5000"
        }/api/vendor/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to create checkout session."
        );
      }

      if (!result.url) {
        throw new Error("Stripe checkout URL was not returned.");
      }

      window.location.href = result.url;
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
      setLoading(false);
    }
  };

  if (isPending || subscriptionLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="size-10 animate-spin rounded-full border-4 border-gray-200 border-t-primary" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="rounded-xl border p-8 text-center">
        <h2 className="text-xl font-semibold">Please sign in</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to view your subscription information.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold">Subscription Plans</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose the right plan for your restaurant.
        </p>
      </div>

      {/* Current plan */}
      <div className="rounded-2xl border bg-card p-6">
        <p className="text-sm text-muted-foreground">Your Current Plan</p>

        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h2 className="text-2xl font-bold capitalize">
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
                {new Date(subscriptionExpiresAt).toLocaleDateString()}
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

      {/* Available plans */}
      <div className="grid gap-6 md:grid-cols-2">
        {plans.map((plan) => {
          const isCurrentPlan =
            currentPlan.toLowerCase() === plan.name.toLowerCase();

          const isPremiumPlan = plan.name === "Premium";

          return (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border p-6 ${
                isPremiumPlan
                  ? "border-primary shadow-lg"
                  : "border-border"
              }`}
            >
              {isPremiumPlan && (
                <div className="absolute -top-3 right-5 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                  Recommended
                </div>
              )}

              <div className="flex items-center gap-2">
                {isPremiumPlan ? (
                  <Crown className="size-6 text-primary" />
                ) : (
                  <Zap className="size-6 text-muted-foreground" />
                )}

                <h2 className="text-xl font-bold">{plan.name}</h2>
              </div>

              <div className="mt-5">
                <span className="text-4xl font-bold">{plan.price}</span>
                {isPremiumPlan && (
                  <span className="ml-2 text-sm text-muted-foreground">
                    / month
                  </span>
                )}
              </div>

              <p className="mt-3 text-sm text-muted-foreground">
                {plan.description}
              </p>

              <div className="my-6 h-px bg-border" />

              <ul className="flex-1 space-y-4">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-sm"
                  >
                    <Check className="size-4 shrink-0 text-green-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={handleUpgrade}
                disabled={
                  isPremium ||
                  loading ||
                  subscriptionLoading ||
                  !isPremiumPlan
                }
                className={`mt-8 w-full rounded-lg px-5 py-3 text-sm font-semibold transition ${
                  isPremiumPlan
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "cursor-not-allowed bg-muted text-muted-foreground"
                } disabled:cursor-not-allowed disabled:opacity-60`}
              >
                {isCurrentPlan
                  ? "Current Plan"
                  : isPremium
                    ? "Already Premium"
                    : loading
                      ? "Redirecting..."
                      : isPremiumPlan
                        ? "Upgrade to Premium"
                        : "Free Plan"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
