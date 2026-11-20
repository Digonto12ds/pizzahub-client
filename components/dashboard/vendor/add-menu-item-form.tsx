"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { addVendorMenuItem } from "@/lib/api/vendor"
import { toast } from "react-hot-toast";

const categories = [
  "Classic Pizzas",
  "Vegetarian Pizzas",
  "Meat Lovers",
  "Specialty / Gourmet Pizzas",
  "Sides & Appetizers",
  "Beverages & Desserts",
]

export default function AddMenuItemPage() {
  const router = useRouter()

  const [itemName, setItemName] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [location, setLocation] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!itemName || !category || !description || !price || !location || !image) {
    toast.error("Please fill in all fields.");
    return;
  }

  if (Number(price) <= 0 || Number.isNaN(Number(price))) {
    toast.error("Please enter a valid price.");
    return;
  }

  if (image.size > 5 * 1024 * 1024) {
    toast.error("Image size must be less than 5 MB.");
    return;
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(image.type)) {
    toast.error("Only JPG, PNG, and WEBP images are allowed.");
    return;
  }

  const formData = new FormData();
  formData.append("itemName", itemName);
  formData.append("category", category);
  formData.append("description", description);
  formData.append("price", price);
  formData.append("location", location);
  formData.append("image", image);

  try {
    setIsSubmitting(true);

    const result = await addVendorMenuItem(formData);

    if (result) {
      toast.success("Menu item added successfully!");

      router.push("/vendor-dashboard/menu");
      router.refresh();
    } else {
      toast.error("Failed to add menu item. Please try again.");
    }
  } catch (error) {
    console.error("Failed to add menu item:", error);

    toast.error(
      error instanceof Error
        ? error.message
        : "Failed to add menu item. Please try again."
    );
  } finally {
    setIsSubmitting(false);
  }
};

  const inputClass =
    "w-full rounded-xl border border-[#e9e2da] bg-[#fffdfa] px-4 py-3.5 text-sm text-[#29231f] outline-none transition placeholder:text-[#aaa19a] hover:border-[#d9c9bb] focus:border-[#e94b35] focus:ring-4 focus:ring-[#e94b35]/10"

  const labelClass = "mb-2.5 block text-sm font-semibold text-[#39312c]"

  return (
    <main className="min-h-screen bg-[#faf7f2] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#fff0eb] px-3.5 py-1.5 text-xs font-bold text-[#e94b35]">
            <span className="h-2 w-2 rounded-full bg-[#e94b35]" />
            MENU MANAGEMENT
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-[#29231f] sm:text-4xl">
            Add New Menu Item
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[#8b8179] sm:text-base">
            Add something delicious to your menu and let customers discover
            their next favorite meal.
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-3xl border border-[#eee6dd] bg-white shadow-[0_12px_45px_rgba(64,42,24,0.06)]"
        >
          {/* Card Header */}
          <div className="border-b border-[#f0eae3] bg-gradient-to-r from-[#fff8f3] to-[#fffdf9] px-5 py-6 sm:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffe9df] text-2xl">
                🍕
              </div>

              <div>
                <h2 className="font-bold text-[#29231f]">Food Information</h2>
                <p className="mt-1 text-xs text-[#968a80]">
                  Enter the details of your food item below.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-7 p-5 sm:p-8">
            {/* Item Name */}
            <div>
              <label htmlFor="itemName" className={labelClass}>
                Item Name <span className="text-[#e94b35]">*</span>
              </label>
              <input
                id="itemName"
                name="itemName"
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. Pepperoni Pizza"
                required
                className={inputClass}
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className={labelClass}>
                Category <span className="text-[#e94b35]">*</span>
              </label>

              <select
                id="category"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className={inputClass}
              >
                <option value="">Choose a category</option>

                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className={labelClass}>
                Description <span className="text-[#e94b35]">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell customers what makes this dish special..."
                rows={5}
                required
                className={`${inputClass} resize-y`}
              />
              <p className="mt-2 text-xs text-[#a69b92]">
                Write a short and attractive description of your food.
              </p>
            </div>

            {/* Price & Location */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="price" className={labelClass}>
                  Price ($) <span className="text-[#e94b35]">*</span>
                </label>
                <div className="relative">
                  <span className="absolute top-1/2 left-4 -translate-y-1/2 font-semibold text-[#9b8d82]">
                    $
                  </span>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="12.99"
                    required
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="location" className={labelClass}>
                  Location <span className="text-[#e94b35]">*</span>
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. New York"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label htmlFor="image" className={labelClass}>
                Food Image <span className="text-[#e94b35]">*</span>
              </label>

              <label
                htmlFor="image"
                className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#e9d9cd] bg-[#fffaf6] px-5 py-9 text-center transition hover:border-[#e94b35] hover:bg-[#fff5ef]"
              >
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffe9df] text-2xl">
                  📸
                </div>

                <p className="text-sm font-bold text-[#39312c]">
                  {image ? image.name : "Click to upload your food image"}
                </p>

                <p className="mt-2 text-xs text-[#a69b92]">
                  JPG, PNG or WEBP · Maximum 5 MB
                </p>

                <span className="mt-4 rounded-lg bg-[#e94b35] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#cf3828]">
                  Browse Image
                </span>
              </label>

              <input
                id="image"
                name="image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                required
                className="sr-only"
              />

              {image && (
                <p className="mt-3 text-xs font-medium text-green-700">
                  ✓ {image.name} selected
                </p>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-[#f0eae3] bg-[#fffdfb] px-5 py-5 sm:flex-row sm:justify-end sm:px-8">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="rounded-xl border border-[#e8dfd7] px-7 py-3.5 text-sm font-bold text-[#6f6259] transition hover:bg-[#f8f3ee] disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[#e94b35] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#e94b35]/20 transition hover:-translate-y-0.5 hover:bg-[#d63e2b] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Adding Item..." : "+ Add Menu Item"}
            </button>
          </div>
        </form>

        <p className="mt-5 text-center text-xs text-[#a69b92]">
          Make every dish count. Good food deserves a great presentation. ❤️
        </p>
      </div>
    </main>
  )
}
