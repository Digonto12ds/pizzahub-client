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

export type MenuItem = {
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

type MenuFilters = {
  search?: string;
  category?: string;
  location?: string;
};

export async function getFeaturedMenuItems(): Promise<FeaturedMenuItem[]> {
  const response = await fetch(`${BASE_URL}/menu/featured`);

  if (!response.ok) {
    throw new Error("Failed to fetch featured menu items");
  }

  return response.json();
}


export async function getMenuItems(
  filters: MenuFilters = {},
  signal?: AbortSignal
): Promise<MenuItem[]> {
  const params = new URLSearchParams();

  if (filters.search) {
    params.set("search", filters.search);
  }

  if (filters.category && filters.category !== "all") {
    params.set("category", filters.category);
  }

  if (filters.location) {
    params.set("location", filters.location);
  }

  const response = await fetch(
    `${BASE_URL}/menu?${params.toString()}`,
    { signal }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch menu items");
  }

  return response.json();
}