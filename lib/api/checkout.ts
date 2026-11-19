
import { authClient } from "@/lib/auth-client";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

type CreateOrderData = {
  menuItemId: string;
  quantity: number;
  deliveryAddress: string;
  deliveryDate: string;
};

export const createCustomerOrder = async (orderData: CreateOrderData) => {
  
  const sessionResult = await authClient.getSession();

  const token = sessionResult.data?.session?.token;

  if (!token) {
    throw new Error("Please sign in to place an order.");
  }


  const response = await fetch(`${BASE_URL}/api/customer/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to place order.");
  }

  return result;
};
