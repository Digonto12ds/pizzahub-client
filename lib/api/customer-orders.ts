import { authClient } from "@/lib/auth-client"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export interface CustomerOrder {
  _id: string
  customerId: string
  vendorId: string
  itemId: string

  quantity: number
  totalPrice: number

  deliveryDate: string
  deliveryAddress: string

  status: "pending" | "accepted" | "rejected" | "cancelled"

  createdAt: string
  updatedAt: string
  requestDate: string

  item: {
    _id: string
    itemName: string
    images: string[]
    price: number
    category: string
    description: string
  } | null

  vendor: {
    _id: string
    name: string
    businessName: string
    email: string
    image: string
  } | null
}

export interface CustomerOverview {
  totalOrders: number
  pendingOrders: number
  acceptedOrders: number
  rejectedOrders: number
}

const getAuthToken = async () => {
  const session = await authClient.getSession()

  const token = session.data?.session?.token

  if (!token) {
    throw new Error("Please sign in to continue.")
  }

  return token
}

const getAuthHeaders = async () => {
  const session = await authClient.getSession()

  const token = session.data?.session?.token

  if (!token) {
    throw new Error("Please sign in to continue.")
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }
}

const handleResponse = async (response: Response) => {
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.")
  }

  return data
}

// Customer dashboard overview
export const getCustomerOverview = async (): Promise<CustomerOverview> => {
  const token = await getAuthToken()
  const response = await fetch(`${BASE_URL}/api/customer/overview`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || "Failed to load overview.")
  }

  return result.data
}

export const getCustomerOrders = async (): Promise<CustomerOrder[]> => {
  const token = await getAuthToken()
  const response = await fetch(`${BASE_URL}/api/customer/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || "Failed to load orders.")
  }

  return Array.isArray(result.data) ? result.data : []
}
// Get single order details
export const getCustomerOrderDetails = async (id: string) => {
  const headers = await getAuthHeaders()

  const response = await fetch(`${BASE_URL}/api/customer/orders/${id}`, {
    headers,
    cache: "no-store",
  })

  return handleResponse(response)
}

// Cancel pending order
export const cancelCustomerOrder = async (id: string) => {
  const headers = await getAuthHeaders()

  const response = await fetch(`${BASE_URL}/api/customer/orders/${id}/cancel`, {
    method: "PATCH",
    headers,
  })

  return handleResponse(response)
}
