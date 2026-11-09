import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Users, RefreshCw, Eye, X, Mail, Phone, Wallet, CalendarDays, UserRound, ShieldCheck, UsersRound, AlertCircle, ChevronLeft, ChevronRight, } from "lucide-react";
import api from "../../services/api";
import axios from "axios";
const ITEMS_PER_PAGE = 10;
interface User {
  _id: string;
  username: string;
  email: string;
  phoneNumber?: string;
  role: string;
  balance: number;
  referralCode?: string;
  referralStatus?: string;
  firstDepositAt?: string;
  createdAt: string;
}
interface UsersResponse {
  count: number;
  users: User[];
}
const AdminUsers = () => {

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [referralFilter, setReferralFilter] = useState("all");

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

const [users, setUsers] = useState<User[]>([]);
const [totalUsers, setTotalUsers] = useState(0);

const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const fetchUsers = useCallback(() => {
  return api.get<UsersResponse>("/api/admin/users");
}, []);

useEffect(() => {
  let cancelled = false;

  fetchUsers()
    .then(({ data }) => {
      if (cancelled) return;

      setUsers(data.users);
      setTotalUsers(data.count);
      setError("");
    })
    .catch((err: unknown) => {
      if (cancelled) return;

      if (axios.isAxiosError<{ message?: string }>(err)) {
        setError(
          err.response?.data?.message || "Failed to fetch users."
        );
      } else {
        setError("An unexpected error occurred.");
      }
    })
    .finally(() => {
      if (!cancelled) {
        setLoading(false);
      }
    });

  return () => {
    cancelled = true;
  };
}, [fetchUsers]);

const handleRefresh = async () => {
  setLoading(true);
  setError("");

  try {
    const { data } = await fetchUsers();

    setUsers(data.users);
    setTotalUsers(data.count);
  } catch (err: unknown) {
    if (axios.isAxiosError<{ message?: string }>(err)) {
      setError(
        err.response?.data?.message || "Failed to fetch users."
      );
    } else {
      setError("An unexpected error occurred.");
    }
  } finally {
    setLoading(false);
  }
};
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        user.username?.toLowerCase().includes(searchValue) ||
        user.email?.toLowerCase().includes(searchValue) ||
        user.phoneNumber?.toLowerCase().includes(searchValue);

      const matchesRole =
        roleFilter === "all" || user.role === roleFilter;

      const matchesReferral =
        referralFilter === "all" ||
        user.referralStatus === referralFilter;

      return matchesSearch && matchesRole && matchesReferral;
    });
  }, [users, search, roleFilter, referralFilter]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 2,
    }).format(Number(amount) || 0);
  };

  const formatDate = (date?: string): string => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "N/A";

    return parsedDate.toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

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

 const getRoleStyle = (role?: string): string => {
    switch (role) {
      case "admin":
        return "bg-purple-50 text-purple-700";

      case "user":
        return "bg-blue-50 text-blue-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getReferralStyle = (status?: string): string => {
    switch (status) {
      case "qualified":
        return "bg-green-50 text-green-700";

      case "pending":
        return "bg-amber-50 text-amber-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const resetFilters = () => {
    setSearch("");
    setRoleFilter("all");
    setReferralFilter("all");
    setCurrentPage(1);
  };

const handleSearch = (value: string): void => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleRoleFilter = (value: string): void => {
    setRoleFilter(value);
    setCurrentPage(1);
  };

 const handleReferralFilter = (value: string): void => {
    setReferralFilter(value);
    setCurrentPage(1);
  };
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            User Management
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage and monitor all registered Upfund users.
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
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                {totalUsers.toLocaleString()}
              </h2>
            </div>

            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <Users size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Regular Users</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                {users.filter((user) => user.role === "user").length}
              </h2>
            </div>

            <div className="rounded-xl bg-green-50 p-3 text-green-600">
              <UserRound size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Qualified Referrals</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                {
                  users.filter(
                    (user) => user.referralStatus === "qualified"
                  ).length
                }
              </h2>
            </div>

            <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
              <UsersRound size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {/* Filters */}
        <div className="flex flex-col gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">
              All Users
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              {filteredUsers.length} users found
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
                placeholder="Search users..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 sm:w-56"
              />
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => handleRoleFilter(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-600 outline-none focus:border-slate-400"
            >
              <option value="all">All Roles</option>
              <option value="user">Users</option>
              <option value="admin">Admins</option>
            </select>

            {/* Referral Filter */}
            <select
              value={referralFilter}
              onChange={(e) => handleReferralFilter(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-600 outline-none focus:border-slate-400"
            >
              <option value="all">All Referrals</option>
              <option value="pending">Pending</option>
              <option value="qualified">Qualified</option>
            </select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="m-5 flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
            <AlertCircle size={18} />
            <span>{error}</span>

            <button
              onClick={fetchUsers}
              className="ml-auto font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-slate-900" />

            <p className="text-sm text-gray-500">
              Loading users...
            </p>
          </div>
        ) : !error && paginatedUsers.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-4 text-center">
            <Users size={36} className="mb-3 text-gray-300" />

            <h3 className="font-semibold text-slate-800">
              No users found
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
        ) : !error ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-212.5 text-left">
                <thead className="bg-gray-50">
                  <tr className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Balance</th>
                    <th className="px-6 py-4">Referral</th>
                    <th className="px-6 py-4">Joined</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {paginatedUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="transition hover:bg-gray-50/70"
                    >
                      {/* User */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">
                            {getInitials(user.username)}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-800">
                              {user.username || "Unknown"}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getRoleStyle(user.role)}`}
                        >
                          {user.role || "N/A"}
                        </span>
                      </td>

                      {/* Balance */}
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-slate-800">
                          {formatCurrency(user.balance)}
                        </p>
                      </td>

                      {/* Referral */}
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getReferralStyle(user.referralStatus)}`}
                        >
                          {user.referralStatus || "None"}
                        </span>
                      </td>

                      {/* Joined */}
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(user.createdAt)}
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedUser(user)}
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
                {filteredUsers.length === 0
                  ? 0
                  : (currentPage - 1) * ITEMS_PER_PAGE + 1}
                {" "}to{" "}
                {Math.min(
                  currentPage * ITEMS_PER_PAGE,
                  filteredUsers.length
                )}{" "}
                of {filteredUsers.length} users
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
        ) : null}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 p-5">
              <div>
                <h2 className="font-bold text-slate-900">
                  User Details
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Account information and activity
                </p>
              </div>

              <button
                onClick={() => setSelectedUser(null)}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Profile */}
            <div className="flex flex-col items-center border-b border-gray-100 p-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-xl font-bold text-slate-700">
                {getInitials(selectedUser.username)}
              </div>

              <h3 className="mt-3 text-lg font-bold text-slate-900">
                {selectedUser.username || "Unknown User"}
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {selectedUser.email}
              </p>

              <span
                className={`mt-3 rounded-full px-3 py-1 text-xs font-semibold capitalize ${getRoleStyle(selectedUser.role)}`}
              >
                {selectedUser.role || "N/A"}
              </span>
            </div>

            {/* Account Information */}
            <div className="space-y-5 p-5">
              <div>
                <h4 className="mb-3 text-sm font-bold text-slate-800">
                  Account Information
                </h4>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-gray-100 p-2 text-gray-600">
                      <Mail size={17} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="break-all text-sm font-medium text-slate-800">
                        {selectedUser.email || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-gray-100 p-2 text-gray-600">
                      <Phone size={17} />
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Phone Number</p>
                      <p className="text-sm font-medium text-slate-800">
                        {selectedUser.phoneNumber || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-gray-100 p-2 text-gray-600">
                      <Wallet size={17} />
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Wallet Balance</p>
                      <p className="text-sm font-semibold text-slate-900">
                        {formatCurrency(selectedUser.balance)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-gray-100 p-2 text-gray-600">
                      <CalendarDays size={17} />
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Registration Date</p>
                      <p className="text-sm font-medium text-slate-800">
                        {formatDate(selectedUser.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-5">
                <h4 className="mb-3 text-sm font-bold text-slate-800">
                  Referral Information
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">
                      Referral Code
                    </p>

                    <p className="mt-1 break-all text-sm font-semibold text-slate-800">
                      {selectedUser.referralCode || "N/A"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">
                      Referral Status
                    </p>

                    <p className="mt-1 text-sm font-semibold capitalize text-slate-800">
                      {selectedUser.referralStatus || "None"}
                    </p>
                  </div>

                  <div className="col-span-2 rounded-xl bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">
                      First Deposit Date
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {formatDate(selectedUser.firstDepositAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <ShieldCheck size={15} />
                  User ID: {selectedUser._id}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 p-5">
              <button
                onClick={() => setSelectedUser(null)}
                className="w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
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

export default AdminUsers;
