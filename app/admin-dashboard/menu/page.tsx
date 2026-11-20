"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  Search,
  UtensilsCrossed,
  Clock,
  CheckCircle2,
  XCircle,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  MapPin,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

import {
  type MenuItem,
  getAdminMenuItems,
  updateMenuStatus,
  updateMenuActiveStatus,
  deleteMenuItem,
} from "@/lib/api/admin-menu";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ManageMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);

      const { data: session } = await authClient.getSession();
      const token = session?.session?.token;

      if (!token) {
        setNotice("Your session has expired. Please sign in again.");
        setItems([]);
        return;
      }

      const result = await getAdminMenuItems(
        token,
        search,
        status,
        category
      );

      if (!result.success) {
        throw new Error(result.message || "Failed to load menu items.");
      }

      setItems(result.items || []);
      setNotice("");
    } catch (error) {
      console.error("Fetch menu items error:", error);
      setNotice(
        error instanceof Error
          ? error.message
          : "Something went wrong while loading menu items."
      );
    } finally {
      setLoading(false);
    }
  }, [search, status, category]);

useEffect(() => {
  let ignore = false;

  const loadItems = async () => {
    try {
      const { data: session } = await authClient.getSession();
      const token = session?.session?.token;

      if (!token) {
        if (!ignore) {
          setNotice("Your session has expired. Please sign in again.");
          setItems([]);
          setLoading(false);
        }
        return;
      }

      const result = await getAdminMenuItems(
        token,
        search,
        status,
        category
      );

      if (!ignore) {
        if (!result.success) {
          throw new Error(result.message || "Failed to load menu items.");
        }

        setItems(result.items || []);
        setNotice("");
      }
    } catch (error) {
      if (!ignore) {
        console.error("Fetch menu items error:", error);
        setNotice(
          error instanceof Error
            ? error.message
            : "Something went wrong while loading menu items."
        );
      }
    } finally {
      if (!ignore) {
        setLoading(false);
      }
    }
  };

  loadItems();

  return () => {
    ignore = true;
  };
}, [search, status, category]);

  // Approve or reject an item
  const handleStatusChange = async (
    id: string,
    newStatus: "approved" | "rejected"
  ) => {
    try {
      setUpdatingId(id);

      const { data: session } = await authClient.getSession();
      const token = session?.session?.token;

      if (!token) {
        setNotice("Please sign in again.");
        return;
      }

      const result = await updateMenuStatus(token, id, newStatus);

      if (!result.success) {
        throw new Error(result.message || "Failed to update item.");
      }

      setNotice(result.message);
      await fetchItems();
    } catch (error) {
      console.error("Update menu status error:", error);
      setNotice(
        error instanceof Error ? error.message : "Failed to update item."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Activate or deactivate an item
  const handleActiveChange = async (item: MenuItem) => {
    try {
      setUpdatingId(item._id);

      const { data: session } = await authClient.getSession();
      const token = session?.session?.token;

      if (!token) {
        setNotice("Please sign in again.");
        return;
      }

      const result = await updateMenuActiveStatus(
        token,
        item._id,
        !item.isActive
      );

      if (!result.success) {
        throw new Error(result.message || "Failed to update item.");
      }

      setNotice(result.message);
      await fetchItems();
    } catch (error) {
      console.error("Update active status error:", error);
      setNotice(
        error instanceof Error ? error.message : "Failed to update item."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete an item
  const handleDelete = async (id: string) => {
   
try {
      setUpdatingId(id);

      const { data: session } = await authClient.getSession();
      const token = session?.session?.token;

      if (!token) {
        setNotice("Please sign in again.");
        return;
      }

      const result = await deleteMenuItem(token, id);

      if (!result.success) {
        throw new Error(result.message || "Failed to delete item.");
      }

      setNotice(result.message);
      await fetchItems();
    } catch (error) {
      console.error("Delete menu item error:", error);
      setNotice(
        error instanceof Error ? error.message : "Failed to delete item."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Summary counts for the currently loaded results
  const totalItems = items.length;
  const pendingItems = items.filter(
    (item) => item.status === "pending"
  ).length;
  const approvedItems = items.filter(
    (item) => item.status === "approved"
  ).length;
  const rejectedItems = items.filter(
    (item) => item.status === "rejected"
  ).length;

  // Get unique categories for the category filter
  const categories = Array.from(
    new Set(items.map((item) => item.category).filter(Boolean))
  );

  const getStatusBadge = (item: MenuItem) => {
    if (item.status === "pending") {
      return (
        <Badge className="border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50">
          Pending
        </Badge>
      );
    }

    if (item.status === "approved") {
      return (
        <Badge className="border-green-200 bg-green-50 text-green-700 hover:bg-green-50">
          Approved
        </Badge>
      );
    }

    return (
      <Badge className="border-red-200 bg-red-50 text-red-700 hover:bg-red-50">
        Rejected
      </Badge>
    );
  };

  return (
    <div className="space-y-7">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[#C93627]">
            <UtensilsCrossed className="size-4" />
            Admin / Menu Management
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Manage Menu Items
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Review submissions and manage your restaurant menu.
          </p>
        </div>

        <Button
          onClick={fetchItems}
          disabled={loading}
          variant="outline"
          className="w-fit border-gray-200 bg-white"
        >
          <RefreshCw className={`mr-2 size-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Notice */}
      {notice && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-[#F2D3A5] bg-[#FFF5E7] px-4 py-3 text-sm text-[#8A4B13]">
          <span>{notice}</span>

          <button
            onClick={() => setNotice("")}
            className="font-semibold"
            aria-label="Dismiss message"
          >
            ×
          </button>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Items
              </p>
              <h2 className="mt-2 text-3xl font-bold text-gray-900">
                {totalItems}
              </h2>
            </div>

            <div className="flex size-12 items-center justify-center rounded-xl bg-orange-50 text-[#C93627]">
              <UtensilsCrossed className="size-6" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Pending Review
              </p>
              <h2 className="mt-2 text-3xl font-bold text-amber-600">
                {pendingItems}
              </h2>
            </div>

            <div className="flex size-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Clock className="size-6" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Approved Items
              </p>
              <h2 className="mt-2 text-3xl font-bold text-green-600">
                {approvedItems}
              </h2>
            </div>

            <div className="flex size-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <CheckCircle2 className="size-6" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Rejected Items
              </p>
              <h2 className="mt-2 text-3xl font-bold text-red-600">
                {rejectedItems}
              </h2>
            </div>

            <div className="flex size-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <XCircle className="size-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Menu items section */}
      <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-5 sm:p-6">
          <h2 className="text-lg font-bold text-gray-900">
            All Menu Items
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Search, filter, approve, and manage submitted items.
          </p>

          {/* Search and filters */}
          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="relative md:col-span-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />

              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search menu items..."
                className="h-11 border-gray-200 pl-10 focus-visible:ring-[#C93627]"
              />
            </div>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-11 rounded-md border border-gray-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-[#C93627]"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-11 rounded-md border border-gray-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-[#C93627]"
            >
              <option value="all">All Categories</option>

              {categories.map((itemCategory) => (
                <option key={itemCategory} value={itemCategory}>
                  {itemCategory}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#FFFAF5] hover:bg-[#FFFAF5]">
                <TableHead className="min-w-62.5">Menu Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Visibility</TableHead>
                <TableHead className="min-w-70 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-40 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-500">
                      <RefreshCw className="size-5 animate-spin" />
                      Loading menu items...
                    </div>
                  </TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <UtensilsCrossed className="mb-3 size-10 text-gray-300" />

                      <p className="font-semibold text-gray-700">
                        No menu items found
                      </p>

                      <p className="mt-1 text-sm text-gray-400">
                        Try changing your search or filters.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={item._id} className="hover:bg-orange-50/40">
                    {/* Item information */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {item.images?.[0] ? (
                          <Image
                            src={item.images[0]}
                            alt={item.itemName}
                            width={56}
                            height={56}
                            unoptimized
                            className="size-14 rounded-xl border border-gray-100 object-cover"
                            loading="eager"
                          />
                        ) : (
                          <div className="flex size-14 items-center justify-center rounded-xl bg-orange-50 text-[#C93627]">
                            <UtensilsCrossed className="size-6" />
                          </div>
                        )}

                        <div>
                          <p className="font-semibold text-gray-900">
                            {item.itemName}
                          </p>

                          {item.location && (
                            <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                              <MapPin className="size-3" />
                              {item.location}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="rounded-lg bg-orange-50 px-2.5 py-1 text-xs font-medium capitalize text-[#C93627]">
                        {item.category}
                      </span>
                    </TableCell>

                    <TableCell className="font-semibold text-gray-700">
                      ${Number(item.price).toFixed(2)}
                    </TableCell>

                    <TableCell>{getStatusBadge(item)}</TableCell>

                    <TableCell>
                      {item.status !== "approved" ? (
                        <span className="text-xs text-gray-400">—</span>
                      ) : item.isActive ? (
                        <Badge className="border-green-200 bg-green-50 text-green-700 hover:bg-green-50">
                          Active
                        </Badge>
                      ) : (
                        <Badge className="border-gray-200 bg-gray-100 text-gray-600 hover:bg-gray-100">
                          Inactive
                        </Badge>
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        {item.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              disabled={updatingId === item._id}
                              onClick={() =>
                                handleStatusChange(item._id, "approved")
                              }
                              className="bg-green-600 text-white hover:bg-green-700"
                            >
                              <CheckCircle2 className="mr-1 size-4" />
                              Approve
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              disabled={updatingId === item._id}
                              onClick={() =>
                                handleStatusChange(item._id, "rejected")
                              }
                              className="border-red-200 text-red-600 hover:bg-red-50"
                            >
                              <XCircle className="mr-1 size-4" />
                              Reject
                            </Button>
                          </>
                        )}

                        {item.status === "approved" && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={updatingId === item._id}
                            onClick={() => handleActiveChange(item)}
                            className="border-gray-200"
                          >
                            {item.isActive ? (
                              <>
                                <EyeOff className="mr-1 size-4" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <Eye className="mr-1 size-4" />
                                Activate
                              </>
                            )}
                          </Button>
                        )}

                        <AlertDialog>
 <AlertDialogTrigger
  disabled={updatingId === item._id}
  className="flex size-9 items-center justify-center rounded-md border border-red-200 text-red-600 transition hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
  aria-label={`Delete ${item.itemName}`}
>
  <Trash2 className="size-4" />
</AlertDialogTrigger>

  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>
        Are you absolutely sure?
      </AlertDialogTitle>

      <AlertDialogDescription>
        This will permanently delete &quot;{item.itemName}&quot;.
This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>

    <AlertDialogFooter>
      <AlertDialogCancel>
        Cancel
      </AlertDialogCancel>

      <AlertDialogAction
        onClick={() => handleDelete(item._id)}
        className="bg-red-600 text-white hover:bg-red-700"
      >
        Delete
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="border-t border-gray-100 px-5 py-4">
          <p className="text-xs text-gray-400">
            Showing {items.length} menu item{items.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </div>
  );
}