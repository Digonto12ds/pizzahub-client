
"use client"

import { useEffect, useState } from "react"
import {
  Search,
  ShieldBan,
  ShieldCheck,
  Users,
  RefreshCw,
} from "lucide-react"
import Image from "next/image"
import { toast } from "react-hot-toast"

import {
  getAdminUsers,
  updateAdminUserStatus,
  type AdminUser,
  type UserRole,
} from "@/lib/api/admin"

export default function ManageUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [search, setSearch] = useState("")
  const [role, setRole] = useState("all")

  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [imageErrors, setImageErrors] = useState<string[]>([])

  // Fetch users whenever search or role changes
  useEffect(() => {
    const controller = new AbortController()

    const fetchUsers = async () => {
      try {
        setLoading(true)

        const data = await getAdminUsers(
          search.trim(),
          role,
          controller.signal
        )

        setUsers(data)
        setImageErrors([])
      } catch (error) {
        if (controller.signal.aborted) return

        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load users."
        )
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    // Small delay prevents an API request on every keystroke
    const timeoutId = setTimeout(fetchUsers, 300)

    return () => {
      clearTimeout(timeoutId)
      controller.abort()
    }
  }, [search, role])

  // Block or unblock a user
  const handleUserStatus = async (user: AdminUser) => {
    try {
      setUpdatingId(user._id)

      const message = await updateAdminUserStatus(
        user._id,
        !user.isBlocked
      )

      setUsers((previousUsers) =>
        previousUsers.map((item) =>
          item._id === user._id
            ? { ...item, isBlocked: !user.isBlocked }
            : item
        )
      )

      toast.success(message)
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update user."
      )
    } finally {
      setUpdatingId(null)
    }
  }

  // Role badge styles
  const getRoleStyle = (userRole: UserRole) => {
    switch (userRole) {
      case "admin":
        return {
          backgroundColor: "#F3E8FF",
          color: "#7E22CE",
        }

      case "vendor":
        return {
          backgroundColor: "#DBEAFE",
          color: "#1D4ED8",
        }

      default:
        return {
          backgroundColor: "#F3F4F6",
          color: "#374151",
        }
    }
  }

  return (
    <div
      className="min-h-full space-y-6 p-4 sm:p-6"
      style={{
        backgroundColor: "#FFF9F0",
        color: "#35100A",
      }}
    >
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p
            className="mb-2 text-sm font-semibold"
            style={{ color: "#C93627" }}
          >
            USER MANAGEMENT
          </p>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Manage Users
          </h1>

          <p
            className="mt-2 text-sm"
            style={{ color: "#786B62" }}
          >
            View, search, and manage all registered users.
          </p>
        </div>

        {/* Users Count */}
        <div
          className="flex w-fit items-center gap-3 rounded-xl border px-4 py-3"
          style={{
            backgroundColor: "#FFFFFF",
            borderColor: "#F0E3D8",
          }}
        >
          <div
            className="flex size-10 items-center justify-center rounded-lg"
            style={{
              backgroundColor: "#FCE7E3",
              color: "#C93627",
            }}
          >
            <Users className="size-5" />
          </div>

          <div>
            <p className="text-xl font-bold">
              {users.length.toLocaleString()}
            </p>

            <p
              className="text-xs"
              style={{ color: "#786B62" }}
            >
              Users Found
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div
        className="flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row"
        style={{
          backgroundColor: "#FFFFFF",
          borderColor: "#F0E3D8",
        }}
      >
        {/* Search Input */}
        <div className="relative min-w-0 flex-1">
          <Search
            className="absolute top-1/2 left-3 size-4 -translate-y-1/2"
            style={{ color: "#9A8B80" }}
          />

          <input
            id="user-search"
            name="search"
            type="search"
            placeholder="Search by name or email..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-11 w-full rounded-lg border py-2 pr-4 pl-10 text-sm outline-none transition focus:ring-2"
            style={{
              backgroundColor: "#FFFFFF",
              borderColor: "#E8DCD2",
              color: "#35100A",
              outlineColor: "#C93627",
            }}
          />
        </div>

        {/* Role Filter */}
        <select
          id="user-role"
          name="role"
          value={role}
          onChange={(event) => setRole(event.target.value)}
          className="h-11 w-full rounded-lg border px-3 text-sm outline-none sm:w-48"
          style={{
            backgroundColor: "#FFFFFF",
            borderColor: "#E8DCD2",
            color: "#35100A",
          }}
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="vendor">Vendor</option>
          <option value="customer">Customer</option>
        </select>
      </div>

      {/* Users Table */}
      <div
        className="overflow-hidden rounded-2xl border shadow-sm"
        style={{
          backgroundColor: "#FFFFFF",
          borderColor: "#F0E3D8",
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] border-collapse text-left text-sm">
            <thead>
              <tr style={{ backgroundColor: "#FFF5EA" }}>
                {[
                  "User",
                  "Role",
                  "Subscription",
                  "Status",
                  "Joined",
                  "Action",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-5 py-4 font-semibold whitespace-nowrap"
                    style={{
                      color: "#786B62",
                      borderBottom: "1px solid #F0E3D8",
                    }}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <RefreshCw
                      className="mx-auto mb-3 size-6 animate-spin"
                      style={{ color: "#C93627" }}
                    />

                    <p
                      className="text-sm font-medium"
                      style={{ color: "#786B62" }}
                    >
                      Loading users...
                    </p>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <Users
                      className="mx-auto mb-3 size-8"
                      style={{ color: "#C8B8AC" }}
                    />

                    <p
                      className="font-medium"
                      style={{ color: "#786B62" }}
                    >
                      No users found.
                    </p>

                    <p
                      className="mt-1 text-xs"
                      style={{ color: "#9A8B80" }}
                    >
                      Try changing your search or role filter.
                    </p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user._id}
                    className="transition-colors hover:bg-[#FFFCF8]"
                    style={{
                      borderBottom: "1px solid #F5EEE8",
                    }}
                  >
                    {/* User Information */}
                    <td className="px-5 py-4">
                      <div className="flex min-w-52 items-center gap-3">
                        {user.image && !imageErrors.includes(user._id) ? (
                          <Image
                            src={user.image}
                            alt={user.name || "User"}
                            width={40}
                            height={40}
                            unoptimized
                            className="size-10 shrink-0 rounded-full object-cover"
                            onError={() => {
                              setImageErrors((previous) =>
                                previous.includes(user._id)
                                  ? previous
                                  : [...previous, user._id]
                              )
                            }}
                          />
                        ) : (
                          <div
                            className="flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                            style={{
                              backgroundColor: "#FCE7E3",
                              color: "#C93627",
                            }}
                          >
                            {user.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="truncate font-semibold">
                            {user.name || "Unnamed User"}
                          </p>

                          <p
                            className="max-w-52 truncate text-xs"
                            style={{ color: "#786B62" }}
                          >
                            {user.email}
                          </p>

                          {user.businessName && (
                            <p
                              className="mt-1 max-w-52 truncate text-xs"
                              style={{ color: "#9A8B80" }}
                            >
                              {user.businessName}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-5 py-4">
                      <span
                        className="inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize"
                        style={getRoleStyle(user.role)}
                      >
                        {user.role}
                      </span>
                    </td>

                    {/* Subscription */}
                    <td className="px-5 py-4">
                      {user.role === "vendor" ? (
                        <span
                          className="inline-flex rounded-full border px-3 py-1 text-xs font-medium"
                          style={{
                            backgroundColor: "#FFFBEB",
                            borderColor: "#FDE68A",
                            color: "#92400E",
                          }}
                        >
                          {user.subscriptionPlan || "Free"}
                        </span>
                      ) : (
                        <span style={{ color: "#9A8B80" }}>—</span>
                      )}
                    </td>

                    {/* Account Status */}
                    <td className="px-5 py-4">
                      {user.isBlocked ? (
                        <span
                          className="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                          style={{
                            backgroundColor: "#FEE2E2",
                            color: "#B91C1C",
                          }}
                        >
                          Blocked
                        </span>
                      ) : (
                        <span
                          className="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                          style={{
                            backgroundColor: "#DCFCE7",
                            color: "#15803D",
                          }}
                        >
                          Active
                        </span>
                      )}
                    </td>

                    {/* Joined Date */}
                    <td
                      className="px-5 py-4 whitespace-nowrap"
                      style={{ color: "#786B62" }}
                    >
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "—"}
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4">
                      <div className="flex justify-end">
                        {user.role === "admin" ? (
                          <span
                            className="text-xs font-medium"
                            style={{ color: "#9A8B80" }}
                          >
                            Protected
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleUserStatus(user)}
                            disabled={updatingId === user._id}
                            className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
                            style={
                              user.isBlocked
                                ? {
                                    backgroundColor: "#DCFCE7",
                                    color: "#15803D",
                                  }
                                : {
                                    backgroundColor: "#FEE2E2",
                                    color: "#B91C1C",
                                  }
                            }
                          >
                            {updatingId === user._id ? (
                              <RefreshCw className="size-4 animate-spin" />
                            ) : user.isBlocked ? (
                              <ShieldCheck className="size-4" />
                            ) : (
                              <ShieldBan className="size-4" />
                            )}

                            {updatingId === user._id
                              ? "Updating..."
                              : user.isBlocked
                                ? "Unblock"
                                : "Block"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        {!loading && users.length > 0 && (
          <div
            className="flex flex-col gap-2 px-5 py-4 text-xs sm:flex-row sm:items-center sm:justify-between"
            style={{
              backgroundColor: "#FFFCF8",
              color: "#786B62",
              borderTop: "1px solid #F0E3D8",
            }}
          >
            <p>
              Showing {users.length.toLocaleString()} users
            </p>

            <p>PizzaHub Admin Management</p>
          </div>
        )}
      </div>
    </div>
  )
}
