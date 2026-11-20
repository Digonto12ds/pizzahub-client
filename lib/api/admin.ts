
import { authClient } from "@/lib/auth-client"

const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

  
export type DashboardStats = {
  totalUsers: number
  totalVendors: number
  totalCustomers: number
  totalMenuItems: number
  pendingMenuItems: number
  totalTransactions: number
}

export type UserRole = "admin" | "vendor" | "customer"

export type AdminUser = {
  _id: string
  name: string
  email: string
  image?: string
  role: UserRole
  isBlocked: boolean
  businessName?: string
  subscriptionPlan?: string
  createdAt?: string
}

type AdminOverviewResponse = {
  success?: boolean
  message?: string
  stats: DashboardStats
}

type AdminUsersResponse = {
  success?: boolean
  message?: string
  users: AdminUser[]
}

type AdminActionResponse = {
  success?: boolean
  message?: string
}

// Helper: Get Auth Token
async function getAdminToken() {
  const { data, error } = await authClient.getSession()
  const token = data?.session?.token

  if (error || !token) {
    throw new Error("Please sign in again.")
  }

  return token
}


// Admin Overview API
export async function getAdminOverview(): Promise<DashboardStats> {
  const token = await getAdminToken()

  const response = await fetch(`${API_URL}/api/admin/overview`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  })

  const result: AdminOverviewResponse = await response.json()

  if (!response.ok) {
    throw new Error(result.message || "Failed to load dashboard.")
  }

  if (!result.stats) {
    throw new Error("Invalid dashboard response.")
  }

  return result.stats
}


// Get All Admin Users
export async function getAdminUsers(
  search: string,
  role: string,
  signal?: AbortSignal
): Promise<AdminUser[]> {
  const token = await getAdminToken()

  const params = new URLSearchParams({
    search,
    role,
  })

  const response = await fetch(
    `${API_URL}/api/admin/users?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
      signal,
    }
  )

  const result: AdminUsersResponse = await response.json()

  if (!response.ok) {
    throw new Error(result.message || "Failed to load users.")
  }

  return result.users || []
}


// Block / Unblock User
export async function updateAdminUserStatus(
  userId: string,
  isBlocked: boolean
): Promise<string> {
  const token = await getAdminToken()

  const response = await fetch(
    `${API_URL}/api/admin/users/${userId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isBlocked }),
    }
  )

  const result: AdminActionResponse = await response.json()

  if (!response.ok) {
    throw new Error(result.message || "Failed to update user.")
  }

  return result.message || "User status updated successfully."
}
