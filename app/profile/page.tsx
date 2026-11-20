
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Camera,
  CheckCircle2,
  Loader2,
  Mail,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { updateProfile } from "@/lib/api/profile";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function ProfileForm({
  user,
}: {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
}) {
  const [name, setName] = useState(user.name || "");
  const [email] = useState(user.email || "");
  const [image, setImage] = useState(user.image || "");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setMessage({
        type: "error",
        text: "Please select a JPG, PNG or WEBP image.",
      });
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({
        type: "error",
        text: "Image size must be less than 5 MB.",
      });
      event.target.value = "";
      return;
    }

    setSelectedImage(file);
    setImage(URL.createObjectURL(file));
    setImageError(false);
    setMessage(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    if (!name.trim()) {
      setMessage({
        type: "error",
        text: "Please enter your name.",
      });
      return;
    }

    try {
      setIsSaving(true);

      const result = await updateProfile({
        name: name.trim(),
        image: selectedImage,
      });

      setName(result.user?.name || name.trim());
      setImage(result.user?.image || image);
      setSelectedImage(null);

      setMessage({
        type: "success",
        text: result.message || "Profile updated successfully!",
      });

      // Reload to get the updated Better Auth session and Navbar information.
      window.setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      {/* Page Heading */}
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[2px] text-[#C93627]">
          Account Settings
        </p>

        <h1 className="text-3xl font-black tracking-tight text-[#49372C] sm:text-4xl">
          My Profile
        </h1>

        <p className="mt-2 text-sm text-[#9A8270] sm:text-base">
          Manage your personal information and profile picture.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* Profile Preview Card */}
        <Card className="h-fit overflow-hidden rounded-2xl border-orange-100 bg-white shadow-sm">
          <div className="h-24 bg-linear-to-r from-[#C93627] to-[#F2A43A]" />

          <CardContent className="-mt-12 flex flex-col items-center px-6 pb-7 text-center">
            <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-orange-100 shadow-md">
              {image && !imageError ? (
                <Image
                  src={image}
                  alt={name || "Profile"}
                  fill
                  unoptimized
                  onError={() => setImageError(true)}
                  className="object-cover"
                  sizes="112px"
                />
              ) : (
                <span className="text-4xl font-bold text-[#C93627]">
                  {name?.charAt(0).toUpperCase() || "U"}
                </span>
              )}
            </div>

            <h2 className="mt-4 max-w-full truncate text-xl font-bold text-[#49372C]">
              {name || "Your Name"}
            </h2>

            <p className="mt-1 max-w-full truncate text-sm text-[#9A8270]">
              {email}
            </p>

            <div className="mt-5 flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-xs font-semibold text-green-700">
              <ShieldCheck size={15} />
              Account Protected
            </div>

            <p className="mt-5 text-xs leading-5 text-[#9A8270]">
              Your profile information helps other PizzaHub users recognize
              you.
            </p>
          </CardContent>
        </Card>

        {/* Edit Profile Form */}
        <Card className="rounded-2xl border-orange-100 bg-white shadow-sm">
          <CardHeader className="border-b border-orange-50 px-6 py-5 sm:px-8">
            <CardTitle className="text-xl font-bold text-[#49372C]">
              Personal Information
            </CardTitle>

            <CardDescription className="text-[#9A8270]">
              Update your name and profile picture.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 py-7 sm:px-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Image */}
              <div className="space-y-3">
                <Label className="font-semibold text-[#49372C]">
                  Profile Picture
                </Label>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-orange-100">
                    {image && !imageError ? (
                      <Image
                        src={image}
                        alt="Profile preview"
                        fill
                        unoptimized
                        onError={() => setImageError(true)}
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <UserRound size={28} className="text-[#C93627]" />
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="profile-image"
                      className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-orange-200 px-4 py-2.5 text-sm font-semibold text-[#C93627] transition hover:bg-orange-50"
                    >
                      <Camera size={16} />
                      Choose Image
                    </Label>

                    <Input
                      id="profile-image"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                    />

                    <p className="mt-2 text-xs text-[#9A8270]">
                      JPG, PNG or WEBP. Maximum 5 MB.
                    </p>
                  </div>
                </div>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="font-semibold text-[#49372C]"
                >
                  Full Name
                </Label>

                <div className="relative">
                  <UserRound
                    size={18}
                    className="absolute top-1/2 left-3 -translate-y-1/2 text-[#B49A86]"
                  />

                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    maxLength={60}
                    className="h-12 rounded-xl border-orange-100 pl-10 focus-visible:ring-[#C93627]"
                  />
                </div>
              </div>

              {/* Email - Read Only */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="font-semibold text-[#49372C]"
                >
                  Email Address
                </Label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute top-1/2 left-3 -translate-y-1/2 text-[#B49A86]"
                  />

                  <Input
                    id="email"
                    type="email"
                    value={email}
                    readOnly
                    disabled
                    className="h-12 rounded-xl border-orange-100 bg-orange-50/60 pl-10 text-gray-500"
                  />
                </div>

                <p className="text-xs text-[#9A8270]">
                  Your email address cannot be changed.
                </p>
              </div>

              {/* Success / Error Message */}
              {message && (
                <div
                  className={`flex items-start gap-2 rounded-xl px-4 py-3 text-sm ${
                    message.type === "success"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {message.type === "success" ? (
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                  ) : (
                    <ShieldCheck size={18} className="mt-0.5 shrink-0" />
                  )}

                  <p>{message.text}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end border-t border-orange-50 pt-5">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="h-12 w-full rounded-xl bg-[#C93627] px-7 font-bold text-white shadow-md shadow-red-100 transition hover:bg-[#A92D21] sm:w-auto"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;

  useEffect(() => {
    if (!isPending && !user) {
      router.replace("/sign-in");
    }
  }, [isPending, user, router]);

  if (isPending || !user) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#FFFDF9] px-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#C93627]" />
          <p className="text-sm font-medium text-[#9A8270]">
            Loading your profile...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFFDF9] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <ProfileForm
        key={user.id}
        user={{
          id: user.id,
          name: user.name || "",
          email: user.email || "",
          image: user.image,
        }}
      />
    </main>
  );
}
