const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export type FeaturedMenuItem = {
  _id: string;
  itemName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: string;
  isActive: boolean;

  vendor: {
    name: string;
    businessName: string;
    image: string;
  };
};

export async function getFeaturedMenuItems(): Promise<FeaturedMenuItem[]> {
  const response = await fetch(`${BASE_URL}/menu/featured`);

  if (!response.ok) {
    throw new Error("Failed to fetch featured menu items");
  }

  return response.json();
}