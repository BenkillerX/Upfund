import { useEffect, useState } from "react";
import axios from "axios";
import { FiUsers, FiDollarSign, FiArrowUpRight, FiClock, FiRefreshCw, } from "react-icons/fi";
import api from "../../services/api";

interface DashboardStats {
  totalUsers: number;
  totalDeposits: number;
  totalDepositTransactions: number;
  totalSuccessfulWithdrawals: number;
  successfulWithdrawalCount: number;
  pendingWithdrawalAmount: number;
  pendingWithdrawalCount: number;
}

const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 2,
});

const AdminHome = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get<DashboardStats>(
        "/api/admin/dashboard"
      );

      setStats(response.data);
      setError("");
    } catch (error: unknown) {
      console.error("Dashboard fetch error:", error);

      if (axios.isAxiosError<{ message?: string }>(error)) {
        setError(
          error.response?.data?.message ||
            "Unable to load dashboard statistics."
        );
      } else {
        setError("Something went wrong while loading the dashboard.");
      }
    } finally {
      setLoading(false);
    }
  };
useEffect(() => {
  let isMounted = true;

  api
    .get<DashboardStats>("/api/admin/dashboard")
    .then((response) => {
      if (isMounted) {
        setStats(response.data);
      }
    })
    .catch((error: unknown) => {
      if (!isMounted) return;

      if (axios.isAxiosError<{ message?: string }>(error)) {
        setError(
          error.response?.data?.message ||
            "Unable to load dashboard statistics."
        );
      } else {
        setError("Something went wrong while loading the dashboard.");
      }
    })
    .finally(() => {
      if (isMounted) {
        setLoading(false);
      }
    });

  return () => {
    isMounted = false;
  };
}, []);
  const handleRefresh = () => {
    setLoading(true);
    setError("");
    void fetchDashboardStats();
  };

  const cards = [
    {
      title: "Total Deposits",
      value: currencyFormatter.format(stats?.totalDeposits ?? 0),
      description: `${stats?.totalDepositTransactions ?? 0} successful transactions`,
      icon: FiDollarSign,
      iconStyle: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Total Users",
      value: (stats?.totalUsers ?? 0).toLocaleString(),
      description: "Registered accounts",
      icon: FiUsers,
      iconStyle: "bg-blue-50 text-blue-600",
    },
    {
      title: "Successful Withdrawals",
      value: currencyFormatter.format(
        stats?.totalSuccessfulWithdrawals ?? 0
      ),
      description: `${stats?.successfulWithdrawalCount ?? 0} completed requests`,
      icon: FiArrowUpRight,
      iconStyle: "bg-purple-50 text-purple-600",
    },
    {
      title: "Pending Withdrawals",
      value: currencyFormatter.format(
        stats?.pendingWithdrawalAmount ?? 0
      ),
      description: `${stats?.pendingWithdrawalCount ?? 0} requests awaiting processing`,
      icon: FiClock,
      iconStyle: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div className="min-h-screen px-5 py-8 sm:px-8 lg:px-10">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-1 text-sm font-medium text-amber-600">
            Upfund Administration
          </p>

          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Dashboard Overview
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Monitor your platform's deposits, users and withdrawals.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiRefreshCw
            className={loading ? "animate-spin" : ""}
            size={16}
          />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}

          <button
            onClick={handleRefresh}
            className="ml-2 font-semibold underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
            >
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  {card.title}
                </p>

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconStyle}`}
                >
                  <Icon size={21} />
                </div>
              </div>

              <h2 className="wrap-break-word text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {loading ? "..." : card.value}
              </h2>

              <p className="mt-2 text-xs text-slate-400">
                {loading ? "Loading statistics..." : card.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Additional information */}
      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <FiDollarSign size={21} />
            </div>

            <div>
              <h3 className="font-semibold text-slate-900">
                Deposit Overview
              </h3>
              <p className="text-xs text-slate-500">
                Successful deposits across all users
              </p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm text-slate-500">
              Total deposited
            </p>

            <h2 className="mt-1 text-3xl font-bold text-slate-900">
              {loading
                ? "..."
                : currencyFormatter.format(stats?.totalDeposits ?? 0)}
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              {stats?.totalDepositTransactions ?? 0} successful deposit transactions
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <FiClock size={21} />
            </div>

            <div>
              <h3 className="font-semibold text-slate-900">
                Withdrawal Attention
              </h3>
              <p className="text-xs text-slate-500">
                Requests requiring admin action
              </p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm text-slate-500">
              Pending requests
            </p>

            <h2 className="mt-1 text-3xl font-bold text-slate-900">
              {loading ? "..." : stats?.pendingWithdrawalCount ?? 0}
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              {loading
                ? "Loading..."
                : `${currencyFormatter.format(stats?.pendingWithdrawalAmount ?? 0)} awaiting processing`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
