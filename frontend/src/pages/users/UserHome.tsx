import { ArrowDownToLine, ArrowUpFromLine, Plus,} from "lucide-react"
import LiveTradingChart from "./LiveTradingChart"
import UserHeader from "./UserHeader"
import UserBalance from "./UserBalance"
import {Link} from 'react-router-dom'
import api from "../../services/api"
import { useEffect, useState } from "react"
const UserHome = () => {

    const [dashboardData, setDashboardData] = useState({
  transactions: [] as {
    _id: string;
    amount: number;
    reference: string;
    paidAt: string | null;
    createdAt: string;
  }[],
  totalDeposits: 0,
  totalWithdrawals: 0,
  currentBalance: 0,
});

useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const response = await api.get("/api/auth/dashboard/transactions");
      setDashboardData(response.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  };

  fetchDashboardData();
}, []);
  return (
 <div className="min-h-screen bg-gray-50">
  <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">

    {/* Header */}
    <UserHeader />

    {/* Balance Card */}
    <UserBalance/>
    <LiveTradingChart/>
{/* Quick Actions */}
<div className="mt-6 grid grid-cols-3 gap-3 sm:max-w-xl">

  {/* Deposit */}
  <Link
    to="/user/deposit"
    className="min-w-0"
  >
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-4 shadow-sm transition hover:border-amber-300 hover:shadow-md">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
        <ArrowDownToLine size={21} />
      </div>

      <span className="text-sm font-medium text-slate-700">
        Deposit
      </span>
    </div>
  </Link>

  {/* Withdraw */}
  <Link to="/user/withdraw" className="min-w-0">
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-4 shadow-sm transition hover:border-amber-300 hover:shadow-md">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700">
        <ArrowUpFromLine size={21} />
      </div>

      <span className="text-sm font-medium text-slate-700">
        Withdraw
      </span>
    </div>
  </Link>

  {/* Fund Wallet */}
  <Link to="/user/deposit" className="min-w-0">
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-4 shadow-sm transition hover:border-amber-300 hover:shadow-md">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
        <Plus size={21} />
      </div>

      <span className="text-sm font-medium text-slate-700">
        Fund Wallet
      </span>
    </div>
  </Link>

</div>

    {/* Dashboard Content */}
    <div className="divide-y divide-gray-100">
  {dashboardData.transactions.length === 0 ? (
    <div className="p-8 text-center text-sm text-gray-400">
      No deposits yet.
    </div>
  ) : (
    dashboardData.transactions.map((transaction) => (
      <div
        key={transaction._id}
        className="flex items-center justify-between gap-3 p-5"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600">
            <ArrowDownToLine size={18} />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-900">
              Wallet Deposit
            </p>

            <p className="text-xs text-gray-500">
              {new Date(
                transaction.paidAt || transaction.createdAt
              ).toLocaleString("en-NG")}
            </p>
          </div>
        </div>

        <p className="shrink-0 text-sm font-semibold text-green-600">
          +₦{transaction.amount.toLocaleString("en-NG")}
        </p>
      </div>
    ))
  )}
</div>
  </div>
</div>
  )
}

export default UserHome