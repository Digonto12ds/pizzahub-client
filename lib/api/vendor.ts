import { authClient } from "@/lib/auth-client";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export type VendorOverview = {
  totalMenuItems: number;
  activeMenuItems: number;
  pendingOrders: number;
  acceptedOrders: number;
  subscriptionPlan: string;
};

export async function getVendorOverview(): Promise<VendorOverview> {
  const { data, error } = await authSession();

  if (error || !data?.session?.token) {
    throw new Error("Please sign in again.");
  }

  const response = await fetch(`${BASE_URL}/api/vendor/overview`, {
    headers: {
      Authorization: `Bearer ${data.session.token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load vendor overview.");
  }

  return response.json();
}

async function authSession() {
  const { authClient } = await import("@/lib/auth-client");
  return authClient.getSession();
}


export async function addVendorMenuItem(formData: FormData) {
  const { data, error } = await authClient.getSession();

  const token = data?.session?.token;

  if (error || !token) {
    throw new Error("Please sign in again.");
  }

  const response = await fetch(`${BASE_URL}/api/vendor/menu-items`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.message || "Failed to add menu item."
    );
  }

  return result;
}