import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, RefreshCw, Eye, X, Wallet, CalendarDays, UserRound, Building2, CheckCircle2, XCircle, Clock, AlertCircle, ChevronLeft, ChevronRight, ArrowDownToLine, Copy, Check, } from "lucide-react";
import axios from "axios";
import api from "../../services/api";

const ITEMS_PER_PAGE = 10;

type WithdrawalStatus = "pending" | "successful" | "failed";

interface WithdrawalUser {
  _id: string;
  username: string;
  email: string;
}

interface AccountDetails {
  accountName: string;
  accountNumber: string;
  bankName: string;
}

interface Withdrawal {
  _id: string;
  user: WithdrawalUser;
  accountDetails: AccountDetails;
  amount: number;
  status: WithdrawalStatus;
  adminNote?: string | null;
  processedAt?: string | null;
  createdAt: string;
  updatedAt?: string;
}

interface WithdrawalsResponse {
  count: number;
  withdrawals: Withdrawal[];
}

const AdminWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [totalWithdrawals, setTotalWithdrawals] = useState(0);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedWithdrawal, setSelectedWithdrawal] =
    useState<Withdrawal | null>(null);

  const [adminNote, setAdminNote] = useState("");
  const [processing, setProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch withdrawals
  const fetchWithdrawals = useCallback(async () => {
    const { data } = await api.get<WithdrawalsResponse>(
      "/api/admin/withdrawals"
    );

    setWithdrawals(data.withdrawals);
    setTotalWithdrawals(data.count);
  }, []);

  // Initial fetch
  useEffect(() => {
    let cancelled = false;

    const loadWithdrawals = async () => {
      try {
        const { data } = await api.get<WithdrawalsResponse>(
          "/api/admin/withdrawals"
        );

        if (cancelled) return;

        setWithdrawals(data.withdrawals);
        setTotalWithdrawals(data.count);
        setError("");
      } catch (err: unknown) {
        if (cancelled) return;

        if (axios.isAxiosError<{ message?: string }>(err)) {
          setError(
            err.response?.data?.message ||
              "Failed to fetch withdrawals."
          );
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadWithdrawals();

    return () => {
      cancelled = true;
    };
  }, []);

  // Refresh
  const handleRefresh = async () => {
    setLoading(true);
    setError("");

    try {
      await fetchWithdrawals();
    } catch (err: unknown) {
      if (axios.isAxiosError<{ message?: string }>(err)) {
        setError(
          err.response?.data?.message ||
            "Failed to refresh withdrawals."
        );
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Currency formatter
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 2,
    }).format(Number(amount) || 0);
  };

  // Date formatter
  const formatDate = (date?: string | null): string => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "N/A";

    return parsedDate.toLocaleString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Initials
  const getInitials = (username?: string): string => {
    return (
      username
        ?.split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "U"
    );
  };

  // Status styling
  const getStatusStyle = (status: WithdrawalStatus): string => {
    switch (status) {
      case "pending":
        return "bg-amber-50 text-amber-700";

      case "successful":
        return "bg-green-50 text-green-700";

      case "failed":
        return "bg-red-50 text-red-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusIcon = (status: WithdrawalStatus) => {
    switch (status) {
      case "pending":
        return <Clock size={14} />;

      case "successful":
        return <CheckCircle2 size={14} />;

      case "failed":
        return <XCircle size={14} />;
    }
  };

  // Search and filter
  const filteredWithdrawals = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return withdrawals.filter((withdrawal) => {
      const matchesSearch =
        !searchValue ||
        withdrawal.user?.username?.toLowerCase().includes(searchValue) ||
        withdrawal.user?.email?.toLowerCase().includes(searchValue) ||
        withdrawal.accountDetails?.accountName
          ?.toLowerCase()
          .includes(searchValue) ||
        withdrawal.accountDetails?.accountNumber
          ?.includes(searchValue) ||
        withdrawal.accountDetails?.bankName
          ?.toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        withdrawal.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [withdrawals, search, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(
    filteredWithdrawals.length / ITEMS_PER_PAGE
  );

  const paginatedWithdrawals = filteredWithdrawals.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Statistics
  const pendingCount = withdrawals.filter(
    (item) => item.status === "pending"
  ).length;

  const successfulCount = withdrawals.filter(
    (item) => item.status === "successful"
  ).length;

  const failedCount = withdrawals.filter(
    (item) => item.status === "failed"
  ).length;

  const totalPendingAmount = withdrawals
    .filter((item) => item.status === "pending")
    .reduce((total, item) => total + Number(item.amount), 0);

  // Search handler
  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  // Status filter handler
  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  // Reset filters
  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  // Open details
  const handleViewWithdrawal = (withdrawal: Withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setAdminNote(withdrawal.adminNote || "");
  };

  // Process withdrawal
  const handleProcessWithdrawal = async (
    status: "successful" | "failed"
  ) => {
    if (!selectedWithdrawal || processing) return;

    const confirmed = window.confirm(
      status === "successful"
        ? "Have you completed the bank transfer? Mark this withdrawal as successful?"
        : "Are you sure you want to reject this withdrawal? The user's wallet will be refunded."
    );

    if (!confirmed) return;

    setProcessing(true);
    setError("");

    try {
      await api.patch(
        `/api/admin/withdrawals/${selectedWithdrawal._id}`,
        {
          status,
          adminNote: adminNote.trim(),
        }
      );

      await fetchWithdrawals();

      setSelectedWithdrawal(null);
      setAdminNote("");
    } catch (err: unknown) {
      if (axios.isAxiosError<{ message?: string }>(err)) {
        setError(
          err.response?.data?.message ||
            "Failed to process withdrawal."
        );
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setProcessing(false);
    }
  };

  // Copy account number
  const handleCopyAccount = async () => {
    if (!selectedWithdrawal) return;

    try {
      await navigator.clipboard.writeText(
        selectedWithdrawal.accountDetails.accountNumber
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setError("Unable to copy account number.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Withdrawal Management
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Review, process and monitor user withdrawal requests.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Total */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Requests
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                {totalWithdrawals.toLocaleString()}
              </h2>
            </div>

            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <ArrowDownToLine size={22} />
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Pending Requests
              </p>

              <h2 className="mt-2 text-2xl font-bold text-amber-600">
                {pendingCount}
              </h2>
            </div>

            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <Clock size={22} />
            </div>
          </div>
        </div>

        {/* Successful */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Successful
              </p>

              <h2 className="mt-2 text-2xl font-bold text-green-600">
                {successfulCount}
              </h2>
            </div>

            <div className="rounded-xl bg-green-50 p-3 text-green-600">
              <CheckCircle2 size={22} />
            </div>
          </div>
        </div>

        {/* Failed */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Failed / Rejected
              </p>

              <h2 className="mt-2 text-2xl font-bold text-red-600">
                {failedCount}
              </h2>
            </div>

            <div className="rounded-xl bg-red-50 p-3 text-red-600">
              <XCircle size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Pending Amount */}
      <div className="mb-8 rounded-2xl border border-amber-100 bg-amber-50 p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-white p-3 text-amber-600">
            <Wallet size={22} />
          </div>

          <div>
            <p className="text-sm font-medium text-amber-800">
              Total Pending Withdrawal Amount
            </p>

            <h2 className="mt-1 text-2xl font-bold text-amber-900">
              {formatCurrency(totalPendingAmount)}
            </h2>
          </div>
        </div>
      </div>

      {/* Withdrawals Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

        {/* Filters */}
        <div className="flex flex-col gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <h2 className="font-semibold text-slate-900">
              All Withdrawals
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              {filteredWithdrawals.length} requests found
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">

            {/* Search */}
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search withdrawals..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 sm:w-64"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-600 outline-none focus:border-slate-400"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="successful">Successful</option>
              <option value="failed">Failed</option>
            </select>

          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="m-5 flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
            <AlertCircle size={18} />

            <span>{error}</span>

            <button
              onClick={() => setError("")}
              className="ml-auto font-semibold underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-slate-900" />

            <p className="text-sm text-gray-500">
              Loading withdrawals...
            </p>
          </div>
        ) : filteredWithdrawals.length === 0 ? (

          /* Empty State */
          <div className="flex min-h-64 flex-col items-center justify-center px-4 text-center">
            <Wallet size={36} className="mb-3 text-gray-300" />

            <h3 className="font-semibold text-slate-800">
              No withdrawals found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Try changing your search or filters.
            </p>

            <button
              onClick={resetFilters}
              className="mt-4 text-sm font-semibold text-slate-900 underline"
            >
              Clear filters
            </button>
          </div>

        ) : (

          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-225 text-left">

                <thead className="bg-gray-50">
                  <tr className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Bank Details</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Requested</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">

                  {paginatedWithdrawals.map((withdrawal) => (

                    <tr
                      key={withdrawal._id}
                      className="transition hover:bg-gray-50/70"
                    >

                      {/* User */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">
                            {getInitials(withdrawal.user?.username)}
                          </div>

                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800">
                              {withdrawal.user?.username || "Unknown"}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {withdrawal.user?.email || "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-800">
                          {formatCurrency(withdrawal.amount)}
                        </p>
                      </td>

                      {/* Bank */}
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-slate-800">
                          {withdrawal.accountDetails?.bankName || "N/A"}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {withdrawal.accountDetails?.accountNumber || "N/A"}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(withdrawal.status)}`}
                        >
                          {getStatusIcon(withdrawal.status)}
                          {withdrawal.status}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(withdrawal.createdAt)}
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleViewWithdrawal(withdrawal)}
                          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-900 hover:bg-slate-900 hover:text-white"
                        >
                          <Eye size={15} />
                          View
                        </button>
                      </td>

                    </tr>
                  ))}

                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 px-5 py-4 sm:flex-row">

              <p className="text-sm text-gray-500">
                Showing{" "}
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                {" "}to{" "}
                {Math.min(
                  currentPage * ITEMS_PER_PAGE,
                  filteredWithdrawals.length
                )}
                {" "}of {filteredWithdrawals.length} withdrawals
              </p>

              <div className="flex items-center gap-2">

                <button
                  onClick={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }
                  disabled={currentPage === 1}
                  className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={17} />
                </button>

                <span className="px-3 text-sm font-medium text-slate-700">
                  Page {currentPage} of {Math.max(totalPages, 1)}
                </span>

                <button
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.min(totalPages, page + 1)
                    )
                  }
                  disabled={currentPage >= totalPages}
                  className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight size={17} />
                </button>

              </div>
            </div>
          </>
        )}
      </div>

      {/* Withdrawal Details Modal */}
      {selectedWithdrawal && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => {
            if (!processing) {
              setSelectedWithdrawal(null);
            }
          }}
        >

          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 p-5">

              <div>
                <h2 className="font-bold text-slate-900">
                  Withdrawal Details
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Review request and process payment.
                </p>
              </div>

              <button
                disabled={processing}
                onClick={() => setSelectedWithdrawal(null)}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 disabled:opacity-50"
              >
                <X size={20} />
              </button>

            </div>

            {/* Amount */}
            <div className="border-b border-gray-100 p-6 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Wallet size={26} />
              </div>

              <p className="mt-4 text-sm text-gray-500">
                Requested Amount
              </p>

              <h2 className="mt-1 text-3xl font-bold text-slate-900">
                {formatCurrency(selectedWithdrawal.amount)}
              </h2>

              <span
                className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(selectedWithdrawal.status)}`}
              >
                {getStatusIcon(selectedWithdrawal.status)}
                {selectedWithdrawal.status}
              </span>

            </div>

            {/* Details */}
            <div className="space-y-6 p-5">

              {/* User Information */}
              <div>
                <h4 className="mb-4 text-sm font-bold text-slate-800">
                  User Information
                </h4>

                <div className="space-y-4">

                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-gray-100 p-2 text-gray-600">
                      <UserRound size={17} />
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Username
                      </p>

                      <p className="text-sm font-medium text-slate-800">
                        {selectedWithdrawal.user?.username || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-gray-100 p-2 text-gray-600">
                      <Building2 size={17} />
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Email Address
                      </p>

                      <p className="break-all text-sm font-medium text-slate-800">
                        {selectedWithdrawal.user?.email || "N/A"}
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Bank Details */}
              <div className="border-t border-gray-100 pt-5">

                <h4 className="mb-4 text-sm font-bold text-slate-800">
                  Bank Account Details
                </h4>

                <div className="space-y-4">

                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs text-gray-500">
                      Account Name
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {selectedWithdrawal.accountDetails?.accountName || "N/A"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs text-gray-500">
                      Bank Name
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {selectedWithdrawal.accountDetails?.bankName || "N/A"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 p-4">

                    <div>
                      <p className="text-xs text-gray-500">
                        Account Number
                      </p>

                      <p className="mt-1 text-sm font-semibold tracking-wider text-slate-800">
                        {selectedWithdrawal.accountDetails?.accountNumber || "N/A"}
                      </p>
                    </div>

                    <button
                      onClick={handleCopyAccount}
                      className="rounded-lg border border-gray-200 bg-white p-2 text-gray-600 transition hover:bg-gray-100"
                      title="Copy account number"
                    >
                      {copied ? (
                        <Check size={16} className="text-green-600" />
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>

                  </div>

                </div>
              </div>

              {/* Request Information */}
              <div className="border-t border-gray-100 pt-5">

                <h4 className="mb-4 text-sm font-bold text-slate-800">
                  Request Information
                </h4>

                <div className="space-y-4">

                  <div className="flex items-center gap-3">
                    <CalendarDays size={17} className="text-gray-500" />

                    <div>
                      <p className="text-xs text-gray-500">
                        Request Date
                      </p>

                      <p className="text-sm font-medium text-slate-800">
                        {formatDate(selectedWithdrawal.createdAt)}
                      </p>
                    </div>
                  </div>

                  {selectedWithdrawal.processedAt && (
                    <div className="flex items-center gap-3">
                      <CheckCircle2 size={17} className="text-gray-500" />

                      <div>
                        <p className="text-xs text-gray-500">
                          Processed Date
                        </p>

                        <p className="text-sm font-medium text-slate-800">
                          {formatDate(selectedWithdrawal.processedAt)}
                        </p>
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-xs text-gray-500">
                      Withdrawal ID
                    </p>

                    <p className="mt-1 break-all font-mono text-xs text-slate-700">
                      {selectedWithdrawal._id}
                    </p>
                  </div>

                </div>
              </div>

              {/* Existing Admin Note */}
              {selectedWithdrawal.adminNote && (
                <div className="border-t border-gray-100 pt-5">
                  <h4 className="mb-2 text-sm font-bold text-slate-800">
                    Previous Admin Note
                  </h4>

                  <p className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                    {selectedWithdrawal.adminNote}
                  </p>
                </div>
              )}

              {/* Admin Processing */}
              {selectedWithdrawal.status === "pending" && (

                <div className="border-t border-gray-100 pt-5">

                  <h4 className="mb-2 text-sm font-bold text-slate-800">
                    Process Withdrawal
                  </h4>

                  <p className="mb-4 text-xs text-gray-500">
                    Add an optional note before completing this request.
                  </p>

                  <textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Enter an admin note..."
                    rows={3}
                    disabled={processing}
                    className="w-full resize-none rounded-xl border border-gray-200 p-3 text-sm outline-none transition focus:border-slate-400 disabled:bg-gray-50"
                  />

                  <div className="mt-4 space-y-3">

                    <button
                      onClick={() =>
                        handleProcessWithdrawal("successful")
                      }
                      disabled={processing}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <CheckCircle2 size={17} />

                      {processing
                        ? "Processing..."
                        : "Mark as Successful"}
                    </button>

                    <button
                      onClick={() =>
                        handleProcessWithdrawal("failed")
                      }
                      disabled={processing}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <XCircle size={17} />

                      {processing
                        ? "Processing..."
                        : "Reject Withdrawal"}
                    </button>

                  </div>

                  <p className="mt-3 text-xs leading-5 text-gray-400">
                    Rejecting a withdrawal automatically refunds the
                    user's wallet through the backend. Only mark a
                    request successful after completing the bank transfer.
                  </p>

                </div>
              )}

              {/* Completed Withdrawal */}
              {selectedWithdrawal.status !== "pending" && (
                <div className="border-t border-gray-100 pt-5">
                  <div
                    className={`rounded-xl p-4 ${
                      selectedWithdrawal.status === "successful"
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {selectedWithdrawal.status === "successful" ? (
                        <CheckCircle2 size={18} />
                      ) : (
                        <XCircle size={18} />
                      )}

                      <p className="text-sm font-semibold">
                        This withdrawal has been {selectedWithdrawal.status}.
                      </p>
                    </div>

                    <p className="mt-2 text-xs">
                      This request can no longer be processed.
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-100 p-5">

              <button
                onClick={() => setSelectedWithdrawal(null)}
                disabled={processing}
                className="w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50"
              >
                Close Details
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminWithdrawals;
