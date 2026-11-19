"use client"

import { useEffect, useState } from "react"
import { Search, ShieldBan, ShieldCheck, Users, RefreshCw } from "lucide-react"
import { toast } from "react-hot-toast"

import { authClient } from "@/lib/auth-client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Image from "next/image"

type UserRole = "admin" | "vendor" | "customer"

type User = {
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

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState("")
  const [role, setRole] = useState("all")

  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [imageErrors, setImageErrors] = useState<string[]>([])

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await authClient.getSession()
        const token = data?.session?.token

        if (error || !token) {
          throw new Error("Please sign in again.")
        }

        const params = new URLSearchParams({
          search,
          role,
        })

        const response = await fetch(
          `${API_URL}/api/admin/users?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.message || "Failed to load users.")
        }

        setUsers(result.users || [])
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong."
        )
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [search, role])

  // Block or Unblock user
  const handleUserStatus = async (user: User) => {
    try {
      setUpdatingId(user._id)

      const { data, error } = await authClient.getSession()
      const token = data?.session?.token

      if (error || !token) {
        throw new Error("Please sign in again.")
      }

      const response = await fetch(
        `${API_URL}/api/admin/users/${user._id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            isBlocked: !user.isBlocked,
          }),
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to update user.")
      }

      setUsers((previousUsers) =>
        previousUsers.map((item) =>
          item._id === user._id ? { ...item, isBlocked: !user.isBlocked } : item
        )
      )

      toast.success(result.message)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update user."
      )
    } finally {
      setUpdatingId(null)
    }
  }

  const getRoleBadge = (userRole: UserRole) => {
    switch (userRole) {
      case "admin":
        return (
          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
            Admin
          </Badge>
        )

      case "vendor":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
            Vendor
          </Badge>
        )

      default:
        return (
          <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
            Customer
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manage Users</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            View, search, and manage all registered users.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border bg-card px-4 py-2">
          <Users className="size-5 text-muted-foreground" />
          <span className="text-sm font-medium">
            {users.length} Users Found
          </span>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
          />
        </div>

        <select
          value={role}
          onChange={(event) => setRole(event.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="vendor">Vendor</option>
          <option value="customer">Customer</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-32 text-center text-muted-foreground"
                  >
                    <RefreshCw className="mx-auto mb-2 size-5 animate-spin" />
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-32 text-center text-muted-foreground"
                  >
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user._id}>
                    {/* User Info */}
                    <TableCell>
                      <div className="flex min-w-52 items-center gap-3">
                        {user.image && !imageErrors.includes(user._id) ? (
                          <Image
                            src={user.image}
                            alt={user.name}
                            width={40}
                            height={40}
                            unoptimized
                            className="size-10 rounded-full object-cover"
                            onError={() => {
                              setImageErrors((prev: string[]) => [
                                ...prev,
                                user._id,
                              ])
                            }}
                          />
                        ) : (
                          <div className="flex size-10 items-center justify-center rounded-full bg-muted font-semibold">
                            {user.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="truncate font-medium">{user.name}</p>
                          <p className="max-w-52 truncate text-xs text-muted-foreground">
                            {user.email}
                          </p>
                          {user.businessName && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              {user.businessName}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Role */}
                    <TableCell>{getRoleBadge(user.role)}</TableCell>

                    {/* Subscription */}
                    <TableCell>
                      {user.role === "vendor" ? (
                        <Badge variant="outline">
                          {user.subscriptionPlan || "Free"}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>

                    {/* Account Status */}
                    <TableCell>
                      {user.isBlocked ? (
                        <Badge variant="destructive">Blocked</Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                          Active
                        </Badge>
                      )}
                    </TableCell>

                    {/* Join Date */}
                    <TableCell className="text-sm whitespace-nowrap text-muted-foreground">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "—"}
                    </TableCell>

                    {/* Action */}
                    <TableCell className="text-right">
                      {user.role === "admin" ? (
                        <span className="text-xs text-muted-foreground">
                          Protected
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          variant={user.isBlocked ? "outline" : "destructive"}
                          disabled={updatingId === user._id}
                          onClick={() => handleUserStatus(user)}
                        >
                          {user.isBlocked ? (
                            <>
                              <ShieldCheck className="mr-1 size-4" />
                              Unblock
                            </>
                          ) : (
                            <>
                              <ShieldBan className="mr-1 size-4" />
                              Block
                            </>
                          )}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
