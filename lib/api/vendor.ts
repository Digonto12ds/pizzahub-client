import { authClient } from "@/lib/auth-client"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export type VendorOverview = {
  totalMenuItems: number
  activeMenuItems: number
  pendingOrders: number
  acceptedOrders: number
  subscriptionPlan: string
}

export type VendorMenuItem = {
  _id: string
  itemName: string
  category: string
  description: string
  price: number
  location: string
  images: string[]
  status: "pending" | "approved" | "rejected"
  isActive: boolean
  createdAt: string
  updatedAt?: string
}

export type VendorOrder = {
  _id: string
  itemId: string
  vendorId: string
  customerId: string
  deliveryDate: string
  deliveryAddress: string
  message?: string
  status: "Pending" | "Accepted" | "Rejected" | "Cancelled"
  createdAt: string

  item: {
    itemName: string
    images: string[]
    price: number
    category: string
  } | null

  customer: {
    name: string
    email: string
    image: string
  } | null
}

export async function getVendorOverview(): Promise<VendorOverview> {
  const { data, error } = await authClient.getSession();

  if (error || !data?.session?.token) {
    throw new Error("Please sign in again.")
  }

  const response = await fetch(`${BASE_URL}/api/vendor/overview`, {
    headers: {
      Authorization: `Bearer ${data.session.token}`,
    },
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error("Failed to load vendor overview.")
  }

  return response.json()
}

export async function addVendorMenuItem(formData: FormData) {
  const { data, error } = await authClient.getSession()

  const token = data?.session?.token

  if (error || !token) {
    throw new Error("Please sign in again.")
  }

  const response = await fetch(`${BASE_URL}/api/vendor/menu-items`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  const result = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(result?.message || "Failed to add menu item.")
  }

  return result
}

async function getVendorToken() {
  const { data, error } = await authClient.getSession()
  const token = data?.session?.token

  if (error || !token) {
    throw new Error("Please sign in again.")
  }

  return token
}

export async function getMyMenuItems(): Promise<VendorMenuItem[]> {
  const token = await getVendorToken()

  const response = await fetch(`${BASE_URL}/api/vendor/menu-items`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  })

  const result = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(result?.message || "Failed to load menu items.")
  }

  return result
}

export async function updateVendorMenuItem(id: string, formData: FormData) {
  const token = await getVendorToken()

  const response = await fetch(`${BASE_URL}/api/vendor/menu-items/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  const result = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(result?.message || "Failed to update menu item.")
  }

  return result
}

export async function updateMenuItemAvailability(
  id: string,
  isActive: boolean
) {
  const token = await getVendorToken()

  const response = await fetch(
    `${BASE_URL}/api/vendor/menu-items/${id}/availability`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isActive }),
    }
  )

  const result = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(result?.message || "Failed to update availability.")
  }

  return result
}

export async function deleteVendorMenuItem(id: string) {
  const token = await getVendorToken()

  const response = await fetch(`${BASE_URL}/api/vendor/menu-items/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const result = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(result?.message || "Failed to delete menu item.")
  }

  return result
}

export async function getVendorOrders(): Promise<VendorOrder[]> {
  const { data, error } = await authClient.getSession()
  const token = data?.session?.token

  if (error || !token) {
    throw new Error("Please sign in again.")
  }

  const response = await fetch(`${BASE_URL}/api/vendor/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  })

  const result = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(result?.message || "Failed to load orders.")
  }

  return result
}

export async function updateVendorOrderStatus(
  id: string,
  status: "Accepted" | "Rejected"
) {
  const { data, error } = await authClient.getSession()
  const token = data?.session?.token

  if (error || !token) {
    throw new Error("Please sign in again.")
  }

  const response = await fetch(`${BASE_URL}/api/vendor/orders/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  })

  const result = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(result?.message || "Failed to update order.")
  }

  return result
}


