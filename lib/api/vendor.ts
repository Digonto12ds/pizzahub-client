
import { authClient } from "@/lib/auth-client"

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"


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


// Get logged-in vendor token
async function getVendorToken() {
  const { data, error } = await authClient.getSession()

  const token = data?.session?.token

  if (error || !token) {
    throw new Error("Please sign in again.")
  }

  return token
}

// Handle API response
async function getApiResult(response: Response) {
  const result = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(result?.message || "Something went wrong.")
  }

  return result
}



export async function getVendorOverview(): Promise<VendorOverview> {
  const token = await getVendorToken()

  const response = await fetch(`${BASE_URL}/api/vendor/overview`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  })

  return getApiResult(response)
}

// Add menu item
export async function addVendorMenuItem(formData: FormData) {
  const token = await getVendorToken()

  const response = await fetch(`${BASE_URL}/api/vendor/menu-items`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  return getApiResult(response)
}

// Get logged-in vendor's menu items
export async function getMyMenuItems(): Promise<VendorMenuItem[]> {
  const token = await getVendorToken()

  const response = await fetch(`${BASE_URL}/api/vendor/menu-items`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  })

  return getApiResult(response)
}

// Update menu item
export async function updateVendorMenuItem(
  id: string,
  formData: FormData
) {
  const token = await getVendorToken()

  const response = await fetch(`${BASE_URL}/api/vendor/menu-items/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  return getApiResult(response)
}

// Update menu item availability
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

  return getApiResult(response)
}

// Delete menu item
export async function deleteVendorMenuItem(id: string) {
  const token = await getVendorToken()

  const response = await fetch(`${BASE_URL}/api/vendor/menu-items/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return getApiResult(response)
}

// Get vendor orders
export async function getVendorOrders(): Promise<VendorOrder[]> {
  const token = await getVendorToken()

  const response = await fetch(`${BASE_URL}/api/vendor/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  })

  return getApiResult(response)
}

// Update order status
export async function updateVendorOrderStatus(
  id: string,
  status: "Accepted" | "Rejected"
) {
  const token = await getVendorToken()

  const response = await fetch(`${BASE_URL}/api/vendor/orders/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  })

  return getApiResult(response)
}
