
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type TransactionVendor = {
  _id: string;
  name: string;
  email: string;
  image: string;
  businessName: string;
};

export type Transaction = {
  _id: string;
  vendorId: string;
  vendor: TransactionVendor | null;
  plan: string;
  amount: number;
  currency: string;
  stripeSessionId: string;
  stripeSubscriptionId?: string;
  status: string;
  createdAt: string;
};

export type TransactionStats = {
  totalTransactions: number;
  successfulPayments: number;
  failedPayments: number;
  pendingPayments: number;
  totalRevenue: number;
};

type AdminTransactionsResponse = {
  success: boolean;
  stats: TransactionStats;
  transactions: Transaction[];
};

export const getAdminTransactions = async (
  token: string
): Promise<AdminTransactionsResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/transactions`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch transactions");
  }

  return data;
};
