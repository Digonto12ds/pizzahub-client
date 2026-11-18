"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "react-hot-toast"
import {
  Edit,
  Loader2,
  Plus,
  Search,
  Trash2,
  UtensilsCrossed,
} from "lucide-react"

import {
  deleteVendorMenuItem,
  getMyMenuItems,
  updateMenuItemAvailability,
  updateVendorMenuItem,
  type VendorMenuItem,
} from "@/lib/api/vendor"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const categories = [
  "Classic Pizzas",
  "Vegetarian Pizzas",
  "Meat Lovers",
  "Specialty / Gourmet Pizzas",
  "Sides & Appetizers",
  "Beverages & Desserts",
]

const statusStyles = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  approved: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
}

export default function MyMenuItems() {
  const [items, setItems] = useState<VendorMenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [editingItem, setEditingItem] = useState<VendorMenuItem | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const [editForm, setEditForm] = useState({
    itemName: "",
    category: "",
    description: "",
    price: "",
    location: "",
    image: null as File | null,
  })

  const loadItems = useCallback(async () => {
    try {
      setError("")
      const result = await getMyMenuItems()
      setItems(result)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load menu items."
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true

    const fetchItems = async () => {
      try {
        const result = await getMyMenuItems()
        if (active) setItems(result)
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Failed to load menu items."
          )
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchItems()

    return () => {
      active = false
    }
  }, [])

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item.itemName.toLowerCase().includes(search.toLowerCase())
    )
  }, [items, search])

  const openEditDialog = (item: VendorMenuItem) => {
    setEditingItem(item)

    setEditForm({
      itemName: item.itemName,
      category: item.category,
      description: item.description,
      price: String(item.price),
      location: item.location,
      image: null,
    })
  }

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!editingItem) return

    if (
      !editForm.itemName.trim() ||
      !editForm.category ||
      !editForm.description.trim() ||
      !editForm.price ||
      !editForm.location.trim()
    ) {
      toast.error("Please complete all required fields.")
      return
    }

    const price = Number(editForm.price)

    if (!Number.isFinite(price) || price <= 0) {
      toast.error("Please enter a valid price.")
      return
    }

    if (editForm.image && editForm.image.size > 5 * 1024 * 1024) {
      toast.error("Image must be 5 MB or less.")
      return
    }

    if (
      editForm.image &&
      !["image/jpeg", "image/png", "image/webp"].includes(editForm.image.type)
    ) {
      toast.error("Only JPG, PNG and WEBP images are allowed.")
      return
    }

    try {
      setSaving(true)

      const formData = new FormData()
      formData.append("itemName", editForm.itemName.trim())
      formData.append("category", editForm.category)
      formData.append("description", editForm.description.trim())
      formData.append("price", editForm.price)
      formData.append("location", editForm.location.trim())

      if (editForm.image) {
        formData.append("image", editForm.image)
      }

      await updateVendorMenuItem(editingItem._id, formData)

      toast.success("Item updated and submitted for admin approval.")
      setEditingItem(null)
      await loadItems()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update item.")
    } finally {
      setSaving(false)
    }
  }

  const handleAvailability = async (item: VendorMenuItem) => {
    try {
      setUpdatingId(item._id)

      await updateMenuItemAvailability(item._id, !item.isActive)

      toast.success(item.isActive ? "Item deactivated." : "Item activated.")

      await loadItems()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update availability."
      )
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async () => {
    if (!confirmDeleteId) return

    try {
      setDeletingId(confirmDeleteId)

      await deleteVendorMenuItem(confirmDeleteId)

      setItems((current) =>
        current.filter((item) => item._id !== confirmDeleteId)
      )

      toast.success("Menu item deleted successfully.")
      setConfirmDeleteId(null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete item.")
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-56 animate-pulse rounded bg-orange-100" />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-80 animate-pulse rounded-xl bg-orange-100"
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-7">
      {/* Heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#35100A] sm:text-3xl">
            My Menu Items
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            View and manage your restaurant menu items.
          </p>
        </div>

        <Link
          href="/vendor-dashboard/menu/add"
          className="inline-flex h-10 items-center justify-center rounded-md bg-[#C93627] px-4 text-sm font-medium text-white transition hover:bg-[#a92d21]"
        >
          <Plus className="mr-2 size-4" />
          Add Menu Item
        </Link>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total Items", value: items.length },
          {
            label: "Approved",
            value: items.filter((i) => i.status === "approved").length,
          },
          {
            label: "Pending",
            value: items.filter((i) => i.status === "pending").length,
          },
          {
            label: "Rejected",
            value: items.filter((i) => i.status === "rejected").length,
          },
        ].map((stat) => (
          <Card key={stat.label} className="border-[#f0e3d8] shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs text-gray-500">{stat.label}</p>
              <p className="mt-2 text-2xl font-bold text-[#35100A]">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search your menu items..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="pl-10"
        />
      </div>

      {/* Error */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-red-700">{error}</p>
            <Button variant="outline" onClick={loadItems}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Items */}
      {!error && filteredItems.length === 0 ? (
        <Card className="border-dashed border-[#e8d5c9] shadow-none">
          <CardContent className="flex flex-col items-center px-5 py-14 text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-orange-50 text-[#C93627]">
              <UtensilsCrossed className="size-7" />
            </div>

            <h2 className="text-lg font-semibold text-[#35100A]">
              {search ? "No matching items found" : "No menu items yet"}
            </h2>

            <p className="mt-2 max-w-sm text-sm text-gray-500">
              {search
                ? "Try searching with another item name."
                : "Start building your restaurant menu by adding your first item."}
            </p>

            {!search && (
              <Link
                href="/vendor-dashboard/menu/add"
                className="mt-5 inline-flex h-10 items-center justify-center rounded-md bg-[#C93627] px-4 text-sm font-medium text-white hover:bg-[#a92d21]"
              >
                <Plus className="mr-2 size-4" />
                Add Your First Item
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => (
            <Card
              key={item._id}
              className="overflow-hidden border-[#f0e3d8] shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative h-48 bg-orange-50">
                {item.images?.[0] ? (
                  <Image
                    src={item.images[0]}
                    alt={item.itemName}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400">
                    <UtensilsCrossed className="size-10" />
                  </div>
                )}

                <Badge
                  className={`absolute top-3 right-3 border capitalize ${statusStyles[item.status] || "bg-gray-100 text-gray-700"}`}
                >
                  {item.status}
                </Badge>
              </div>

              <CardContent className="space-y-4 p-5">
                <div>
                  <p className="text-xs font-medium text-[#C93627]">
                    {item.category}
                  </p>

                  <h2 className="mt-1 line-clamp-1 text-lg font-bold text-[#35100A]">
                    {item.itemName}
                  </h2>

                  <p className="mt-1 line-clamp-2 min-h-10 text-sm text-gray-500">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between border-y border-[#f5ece5] py-3">
                  <span className="text-sm text-gray-500">{item.location}</span>

                  <span className="text-lg font-bold text-[#C93627]">
                    ৳{item.price.toLocaleString("en-BD")}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`text-xs font-medium ${item.isActive ? "text-green-700" : "text-gray-500"}`}
                  >
                    {item.isActive ? "Active" : "Inactive"}
                  </span>

                  <Button
                    size="sm"
                    variant="outline"
                    disabled={updatingId === item._id}
                    onClick={() => handleAvailability(item)}
                  >
                    {updatingId === item._id ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : item.isActive ? (
                      "Deactivate"
                    ) : (
                      "Activate"
                    )}
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => openEditDialog(item)}
                  >
                    <Edit className="mr-2 size-4" />
                    Edit
                  </Button>

                  <Button
                    variant="destructive"
                    className="w-full"
                    disabled={deletingId === item._id}
                    onClick={() => setConfirmDeleteId(item._id)}
                  >
                    {deletingId === item._id ? (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : (
                      <Trash2 className="mr-2 size-4" />
                    )}
                    Delete
                  </Button>
                </div>

                {item.status === "rejected" && (
                  <p className="rounded-md bg-red-50 p-3 text-xs leading-5 text-red-700">
                    This item was rejected by the admin and is not visible to
                    customers. Edit it to submit it for review again.
                  </p>
                )}

                {item.status === "pending" && (
                  <p className="rounded-md bg-amber-50 p-3 text-xs leading-5 text-amber-800">
                    Waiting for admin approval. Customers cannot see this item
                    yet.
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit dialog */}
      <Dialog
        open={!!editingItem}
        onOpenChange={(open) => {
          if (!open && !saving) setEditingItem(null)
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-[#35100A]">Edit Menu Item</DialogTitle>
            <DialogDescription>
              Update the details. Changes will require admin approval again.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Item Name</Label>
              <Input
                id="edit-name"
                value={editForm.itemName}
                onChange={(e) =>
                  setEditForm({ ...editForm, itemName: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <select
                id="edit-category"
                value={editForm.category}
                onChange={(e) =>
                  setEditForm({ ...editForm, category: e.target.value })
                }
                required
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                rows={4}
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price (৳)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  min="1"
                  step="0.01"
                  value={editForm.price}
                  onChange={(e) =>
                    setEditForm({ ...editForm, price: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  value={editForm.location}
                  onChange={(e) =>
                    setEditForm({ ...editForm, location: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-image">Replace Image (Optional)</Label>
              <Input
                id="edit-image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    image: e.target.files?.[0] || null,
                  })
                }
              />
              <p className="text-xs text-gray-500">
                Leave empty to keep the existing image. Maximum 5 MB.
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={saving}
                onClick={() => setEditingItem(null)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={saving}
                className="bg-[#C93627] text-white hover:bg-[#a92d21]"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!confirmDeleteId}
        onOpenChange={(open) => {
          if (!open && !deletingId) {
            setConfirmDeleteId(null)
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#35100A]">
              Delete Menu Item?
            </DialogTitle>

            <DialogDescription className="text-gray-500">
              Are you sure you want to permanently delete this menu item? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={!!deletingId}
              onClick={() => setConfirmDeleteId(null)}
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="destructive"
              disabled={!!deletingId}
              onClick={handleDelete}
            >
              {deletingId ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 size-4" />
                  Delete Item
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
