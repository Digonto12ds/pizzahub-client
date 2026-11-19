const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export type MenuItem = {
  _id: string;
  itemName: string;
  category: string;
  price: number;
  location?: string;
  images?: string[];
  vendorId?: string;
  status: "pending" | "approved" | "rejected";
  isActive: boolean;
  createdAt?: string;
};

type MenuResponse = {
  success: boolean;
  items?: MenuItem[];
  message?: string;
};

const getHeaders = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

// Get all menu items
export const getAdminMenuItems = async (
  token: string,
  search = "",
  status = "all",
  category = "all"
): Promise<MenuResponse> => {
  const params = new URLSearchParams({
    search,
    status,
    category,
  });

  const res = await fetch(
    `${API_URL}/api/admin/menu-items?${params.toString()}`,
    {
      headers: getHeaders(token),
      cache: "no-store",
    }
  );

  return res.json();
};

// Approve or reject
export const updateMenuStatus = async (
  token: string,
  id: string,
  status: "approved" | "rejected"
) => {
  const res = await fetch(
    `${API_URL}/api/admin/menu-items/${id}/status`,
    {
      method: "PATCH",
      headers: getHeaders(token),
      body: JSON.stringify({ status }),
    }
  );

  return res.json();
};

// Activate or deactivate
export const updateMenuActiveStatus = async (
  token: string,
  id: string,
  isActive: boolean
) => {
  const res = await fetch(
    `${API_URL}/api/admin/menu-items/${id}/active`,
    {
      method: "PATCH",
      headers: getHeaders(token),
      body: JSON.stringify({ isActive }),
    }
  );

  return res.json();
};

// Delete menu item
export const deleteMenuItem = async (
  token: string,
  id: string
) => {
  const res = await fetch(`${API_URL}/api/admin/menu-items/${id}`, {
    method: "DELETE",
    headers: getHeaders(token),
  });

  return res.json();
};