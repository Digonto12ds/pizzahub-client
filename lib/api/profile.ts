
import { authClient } from "@/lib/auth-client";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

type UpdateProfileData = {
  name: string;
  image?: File | null;
};

export const updateProfile = async ({
  name,
  image,
}: UpdateProfileData) => {
  const sessionResult = await authClient.getSession();
  const token = sessionResult.data?.session?.token;

  if (!token) {
    throw new Error("Please sign in to update your profile.");
  }

  const formData = new FormData();

  formData.append("name", name);

  if (image) {
    formData.append("image", image);
  }

  const response = await fetch(`${BASE_URL}/api/profile`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update profile.");
  }

  return result;
};
