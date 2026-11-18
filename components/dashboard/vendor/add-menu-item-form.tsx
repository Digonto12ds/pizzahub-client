"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  ImagePlus,
  Loader2,
  Upload,
} from "lucide-react";

import { addVendorMenuItem } from "@/lib/api/vendor";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const categories = [
  "Classic Pizzas",
  "Vegetarian Pizzas",
  "Meat Lovers",
  "Specialty / Gourmet Pizzas",
  "Sides & Appetizers",
  "Beverages & Desserts",
];

export default function AddMenuItemForm() {
  const router = useRouter();

  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !itemName.trim() ||
      !category ||
      !description.trim() ||
      !price ||
      !location.trim() ||
      !image
    ) {
      toast.error("Please complete all fields and select an image.");
      return;
    }

    if (!Number.isFinite(Number(price)) || Number(price) <= 0) {
      toast.error("Please enter a valid price.");
      return;
    }

    if (image.size > 5 * 1024 * 1024) {
      toast.error("Image size must be 5 MB or less.");
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(image.type)) {
      toast.error("Only JPG, PNG and WEBP images are allowed.");
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();

      formData.append("itemName", itemName.trim());
      formData.append("category", category);
      formData.append("description", description.trim());
      formData.append("price", price);
      formData.append("location", location.trim());
      formData.append("image", image);

      await addVendorMenuItem(formData);

      toast.success("Menu item submitted for admin approval!");

      router.push("/vendor-dashboard/menu");
      router.refresh();

    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">

      {/* Page heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-3 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-[#C93627]"
          >
            <ArrowLeft className="size-4" />
            Back
          </button>

          <h1 className="text-2xl font-bold text-[#35100A] sm:text-3xl">
            Add Menu Item
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Add a new item to your restaurant menu.
          </p>
        </div>
      </div>

      {/* Form card */}
      <Card className="border-[#f0e3d8] bg-white shadow-sm">
        <CardHeader className="border-b border-[#f5ece5]">
          <CardTitle className="text-xl text-[#35100A]">
            Menu Item Information
          </CardTitle>

          <CardDescription>
            Fill in the details below. Your item will be reviewed by an admin
            before appearing on the public menu.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Item name */}
            <div className="space-y-2">
              <Label htmlFor="itemName">
                Item Name <span className="text-red-500">*</span>
              </Label>

              <Input
                id="itemName"
                placeholder="e.g. Margherita Classic Pizza"
                value={itemName}
                onChange={(event) => setItemName(event.target.value)}
                maxLength={100}
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-red-500">*</span>
              </Label>

              <select
                id="category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[#C93627]"
              >
                <option value="" disabled>
                  Select a category
                </option>

                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-red-500">*</span>
              </Label>

              <Textarea
                id="description"
                placeholder="Describe the ingredients, taste and details of your menu item..."
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={5}
                maxLength={1000}
                required
              />

              <p className="text-right text-xs text-gray-400">
                {description.length}/1000
              </p>
            </div>

            {/* Price and location */}
            <div className="grid gap-5 sm:grid-cols-2">

              <div className="space-y-2">
                <Label htmlFor="price">
                  Price (৳) <span className="text-red-500">*</span>
                </Label>

                <Input
                  id="price"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="450"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">
                  Location (Area / City){" "}
                  <span className="text-red-500">*</span>
                </Label>

                <Input
                  id="location"
                  placeholder="e.g. Dhanmondi, Dhaka"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  maxLength={150}
                  required
                />
              </div>

            </div>

            {/* Image upload */}
            <div className="space-y-3">
              <Label htmlFor="image">
                Item Image <span className="text-red-500">*</span>
              </Label>

              <label
                htmlFor="image"
                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#e8d5c9] bg-[#fffaf5] px-5 py-10 text-center transition hover:border-[#C93627] hover:bg-[#fff5ec]"
              >
                <div className="mb-3 flex size-14 items-center justify-center rounded-full bg-[#C93627]/10 text-[#C93627]">
                  {image ? (
                    <ImagePlus className="size-7" />
                  ) : (
                    <Upload className="size-7" />
                  )}
                </div>

                {image ? (
                  <>
                    <span className="text-sm font-semibold text-[#35100A]">
                      {image.name}
                    </span>

                    <span className="mt-1 text-xs text-gray-500">
                      {(image.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-sm font-semibold text-[#35100A]">
                      Click to upload an image
                    </span>

                    <span className="mt-1 text-xs text-gray-500">
                      JPG, PNG or WEBP (Maximum 5 MB)
                    </span>
                  </>
                )}
              </label>

              <input
                id="image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(event) =>
                  setImage(event.target.files?.[0] || null)
                }
                required
              />

              {image && (
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="text-sm font-medium text-red-600 hover:underline"
                >
                  Remove selected image
                </button>
              )}

              <p className="text-xs text-gray-500">
                Your image will be uploaded to ImgBB when you submit this form.
              </p>
            </div>

            {/* Approval notice */}
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
              <p className="text-sm font-semibold text-orange-900">
                Admin approval required
              </p>

              <p className="mt-1 text-xs leading-5 text-orange-800">
                After submission, your menu item will have Pending status.
                It will appear on the public menu only after an admin approves it.
              </p>
            </div>

            {/* Submit */}
            <div className="flex flex-col-reverse gap-3 border-t border-[#f5ece5] pt-5 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => router.back()}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#C93627] text-white hover:bg-[#a92d21]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Menu Item"
                )}
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}