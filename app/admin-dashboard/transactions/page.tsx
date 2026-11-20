
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Search,
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  Receipt,
  RefreshCw,
  CalendarDays,
  Store,
  ShieldCheck,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

import {
  getAdminTransactions,
  type Transaction,
  type TransactionStats,
} from "@/lib/api/admin-transactions";

const initialStats: TransactionStats = {
  totalTransactions: 0,
  successfulPayments: 0,
  failedPayments: 0,
  pendingPayments: 0,
  totalRevenue: 0,
};

const getStatusStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case "success":
    case "succeeded":
    case "paid":
    case "completed":
      return "bg-green-50 text-green-700 border-green-200";

    case "failed":
      return "bg-red-50 text-red-700 border-red-200";

    case "pending":
      return "bg-amber-50 text-amber-700 border-amber-200";

    default:
      return "bg-gray-100 text-gray-600 border-gray-200";
  }
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "success":
    case "succeeded":
    case "paid":
    case "completed":
      return <CheckCircle2 size={14} />;

    case "failed":
      return <XCircle size={14} />;

    case "pending":
      return <Clock size={14} />;

    default:
      return <Receipt size={14} />;
  }
};

const formatAmount = (amount: number, currency: string) => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  } catch {
    return `${amount.toLocaleString()} ${currency.toUpperCase()}`;
  }
};

const formatDate = (date: string) => {
  if (!date) return "N/A";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "N/A";

  return parsedDate.toLocaleString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function VendorAvatar({
  image,
  name,
}: {
  image?: string;
  name?: string;
}) {
  const [imageError, setImageError] = useState(false);

  if (!image || imageError) {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-[#C93627]">
        {name?.charAt(0).toUpperCase() || "V"}
      </div>
    );
  }

  return (
    <Image
      src={image}
      alt={name || "Vendor"}
      width={40}
      height={40}
      unoptimized
      onError={() => setImageError(true)}
      className="h-10 w-10 shrink-0 rounded-full object-cover"
      loading="eager"
    />
  );
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<TransactionStats>(initialStats);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

 
  useEffect(() => {
    let ignore = false;

    const loadTransactions = async () => {
      try {
        const { data: session } = await authClient.getSession();

        const token = session?.session?.token;

        if (!token) {
          throw new Error("Authentication required. Please sign in again.");
        }

        const data = await getAdminTransactions(token);

        if (!ignore) {
          setTransactions(data.transactions || []);
          setStats(data.stats || initialStats);
          setError("");
        }
      } catch (err) {
        if (!ignore) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load transactions."
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadTransactions();

    return () => {
      ignore = true;
    };
  }, []);

 
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        transaction.vendor?.name?.toLowerCase().includes(searchValue) ||
        transaction.vendor?.email?.toLowerCase().includes(searchValue) ||
        transaction.vendor?.businessName?.toLowerCase().includes(searchValue) ||
        transaction.plan?.toLowerCase().includes(searchValue) ||
        transaction.stripeSessionId?.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        transaction.status?.toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [transactions, search, statusFilter]);

  const statCards = [
    {
      title: "Total Transactions",
      value: stats.totalTransactions,
      icon: Receipt,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Successful Payments",
      value: stats.successfulPayments,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Failed Payments",
      value: stats.failedPayments,
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      title: "Pending Payments",
      value: stats.pendingPayments,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="min-h-screen space-y-7 bg-[#FFFDF9] p-4 sm:p-6 lg:p-8">

      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-[#C93627]">
              <CreditCard size={23} />
            </div>

            <div>
              <h1 className="text-2xl font-black text-[#351A13] sm:text-3xl">
                Transactions
              </h1>
              <p className="mt-1 text-sm text-[#8A766B]">
                Monitor vendor subscription payments.
              </p>
            </div>
          </div>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-xs font-bold text-green-700">
          <ShieldCheck size={16} />
          READ ONLY
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#8A766B]">
                    {card.title}
                  </p>

                  <h2 className="mt-2 text-3xl font-black text-[#351A13]">
                    {loading ? "..." : card.value.toLocaleString()}
                  </h2>
                </div>

                <div className={`rounded-2xl p-3 ${card.bg} ${card.color}`}>
                  <Icon size={23} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Successful Payment Amount */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl bg-linear-to-r from-[#35100A] to-[#8F2B1F] p-6 text-white shadow-lg sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-orange-200">
            Total Successful Payment Amount
          </p>

          <h2 className="mt-2 text-3xl font-black sm:text-4xl">
            {loading
              ? "..."
              : stats.totalRevenue.toLocaleString("en-US")}
          </h2>

          <p className="mt-2 text-xs text-white/60">
            Sum of successful transactions only
          </p>
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
          <CreditCard size={28} className="text-orange-300" />
        </div>
      </div>

      {/* Transactions Table Section */}
      <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">

        {/* Table Header */}
        <div className="border-b border-orange-100 p-5">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-lg font-bold text-[#351A13]">
                All Transactions
              </h2>

              <p className="mt-1 text-xs text-[#8A766B]">
                View vendor payments and subscription details.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {/* Search */}
              <div className="relative">
                <Search
                  size={18}
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  placeholder="Search vendor or transaction..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-11 w-full rounded-xl border border-orange-100 bg-[#FFFCF8] pr-4 pl-10 text-sm outline-none transition focus:border-[#C93627] focus:ring-2 focus:ring-red-100 sm:w-72"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-11 rounded-xl border border-orange-100 bg-[#FFFCF8] px-4 text-sm font-medium text-[#49372C] outline-none focus:border-[#C93627]"
              >
                <option value="all">All Status</option>
                <option value="success">Success</option>
                <option value="succeeded">Succeeded</option>
                <option value="paid">Paid</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-4 p-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-16 animate-pulse rounded-xl bg-orange-50"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
            <XCircle size={42} className="text-red-400" />

            <h3 className="mt-4 text-lg font-bold text-gray-800">
              Unable to load transactions
            </h3>

            <p className="mt-2 max-w-md text-sm text-gray-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 flex items-center gap-2 rounded-xl bg-[#C93627] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#A92D21]"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredTransactions.length === 0 && (
          <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-[#C93627]">
              <Receipt size={30} />
            </div>

            <h3 className="mt-4 text-lg font-bold text-[#351A13]">
              No Transactions Found
            </h3>

            <p className="mt-2 text-sm text-[#8A766B]">
              {search || statusFilter !== "all"
                ? "Try changing your search or status filter."
                : "There are no payment records yet."}
            </p>
          </div>
        )}

        {/* Transactions Table */}
        {!loading && !error && filteredTransactions.length > 0 && (
          <>
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-262.5 text-left">
                <thead className="bg-[#FFFCF8]">
                  <tr className="text-xs font-bold tracking-wide text-[#8A766B] uppercase">
                    <th className="px-5 py-4">Vendor</th>
                    <th className="px-5 py-4">Subscription</th>
                    <th className="px-5 py-4">Payment Amount</th>
                    <th className="px-5 py-4">Payment Status</th>
                    <th className="px-5 py-4">Transaction Date</th>
                    <th className="px-5 py-4">Transaction ID</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-orange-50">
                  {filteredTransactions.map((transaction) => (
                    <tr
                      key={transaction._id}
                      className="transition hover:bg-[#FFFCF8]"
                    >
                      {/* Vendor */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <VendorAvatar
                            image={transaction.vendor?.image}
                            name={transaction.vendor?.name}
                          />

                          <div className="min-w-0">
                            <p className="max-w-48 truncate text-sm font-bold text-[#49372C]">
                              {transaction.vendor?.businessName ||
                                transaction.vendor?.name ||
                                "Unknown Vendor"}
                            </p>

                            <p className="max-w-48 truncate text-xs text-[#A8988C]">
                              {transaction.vendor?.email || "No email"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Subscription */}
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-bold capitalize text-[#C93627]">
                          <Store size={13} />
                          {transaction.plan || "N/A"}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-4">
                        <p className="text-sm font-black text-[#351A13]">
                          {formatAmount(
                            Number(transaction.amount || 0),
                            transaction.currency || "usd"
                          )}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold capitalize ${getStatusStyle(
                            transaction.status || ""
                          )}`}
                        >
                          {getStatusIcon(transaction.status || "")}
                          {transaction.status || "Unknown"}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-xs text-[#6F5D52]">
                          <CalendarDays
                            size={15}
                            className="shrink-0 text-[#C93627]"
                          />
                          {formatDate(transaction.createdAt)}
                        </div>
                      </td>

                      {/* Transaction ID */}
                      <td className="px-5 py-4">
                        <p
                          title={transaction.stripeSessionId}
                          className="max-w-36 truncate font-mono text-xs text-gray-500"
                        >
                          {transaction.stripeSessionId || "N/A"}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="flex flex-col justify-between gap-2 border-t border-orange-100 bg-[#FFFCF8] px-5 py-4 sm:flex-row sm:items-center">
              <p className="text-xs text-[#8A766B]">
                Showing{" "}
                <span className="font-bold text-[#49372C]">
                  {filteredTransactions.length}
                </span>{" "}
                of{" "}
                <span className="font-bold text-[#49372C]">
                  {transactions.length}
                </span>{" "}
                transactions
              </p>

              <div className="flex items-center gap-2 text-xs font-semibold text-green-700">
                <ShieldCheck size={15} />
                Payment records are protected
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
