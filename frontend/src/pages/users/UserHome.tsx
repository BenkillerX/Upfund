import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Eye,
  EyeOff,
  Plus,
  Clock3,
  Hand 
} from "lucide-react"
import { useState } from "react"
import LiveTradingChart from "./LiveTradingChart"

const UserHome = () => {
  const [showBalance, setShowBalance] = useState(true)

  const balance = "₦250,000.00"

  return (
 <div className="min-h-screen bg-gray-50">
  <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">

    {/* Header */}
    <div className="mb-6 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">Good afternoon,</p>

        <h1 className="flex items-center gap-2 text-xl font-bold text-slate-900">
        Benedict
        <Hand className="h-5 w-5 text-amber-500" />
        </h1>
      </div>

      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 font-semibold text-amber-600">
        B
      </div>
    </div>

    {/* Balance Card */}
    <div className="rounded-2xl bg-slate-800 p-5 text-white shadow-sm sm:p-6 lg:p-7">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-300">
          Available Balance
        </p>

        <button
          onClick={() => setShowBalance(!showBalance)}
          className="rounded-full p-2 transition hover:bg-white/10"
        >
          {showBalance ? (
            <Eye size={19} />
          ) : (
            <EyeOff size={19} />
          )}
        </button>
      </div>

      <div className="mt-2">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {showBalance ? balance : "••••••••"}
        </h2>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400">
            UpFund Wallet
          </p>

          <p className="mt-1 text-sm font-medium">
            **** 4821
          </p>
        </div>

        <p className="text-xs text-slate-400">
          Last updated just now
        </p>
      </div>
    </div>
    <LiveTradingChart/>

    {/* Quick Actions */}
    <div className="mt-6 grid grid-cols-3 gap-3 sm:max-w-xl">

      {/* Deposit */}
      <button className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-4 shadow-sm transition hover:border-amber-300 hover:shadow-md">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 text-amber-600">
          <ArrowDownToLine size={21} />
        </div>

        <span className="text-sm font-medium text-slate-700">
          Deposit
        </span>
      </button>

      {/* Withdraw */}
      <button className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-4 shadow-sm transition hover:border-amber-300 hover:shadow-md">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-700">
          <ArrowUpFromLine size={21} />
        </div>

        <span className="text-sm font-medium text-slate-700">
          Withdraw
        </span>
      </button>

      {/* Fund Wallet */}
      <button className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-4 shadow-sm transition hover:border-amber-300 hover:shadow-md">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-50 text-amber-600">
          <Plus size={21} />
        </div>

        <span className="text-sm font-medium text-slate-700">
          Fund Wallet
        </span>
      </button>

    </div>

    {/* Dashboard Content */}
    <div className="mt-8 grid gap-6 lg:grid-cols-3">

      {/* Recent Transactions */}
      <div className="rounded-2xl border border-gray-200 bg-white lg:col-span-2">

        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <div>
            <h2 className="font-semibold text-slate-900">
              Recent Transactions
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Your latest wallet activity
            </p>
          </div>

          <button className="text-sm font-medium text-amber-600 transition hover:text-amber-700">
            View all
          </button>
        </div>

        <div className="divide-y divide-gray-100">

          {/* Deposit Transaction */}
          <div className="flex items-center justify-between p-5">
            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-600">
                <ArrowDownToLine size={18} />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-900">
                  Wallet Deposit
                </p>

                <p className="text-xs text-gray-500">
                  Today, 10:42 AM
                </p>
              </div>

            </div>

            <p className="text-sm font-semibold text-green-600">
              +₦50,000
            </p>
          </div>

          {/* Withdrawal Transaction */}
          <div className="flex items-center justify-between p-5">
            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-500">
                <ArrowUpFromLine size={18} />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-900">
                  Withdrawal
                </p>

                <p className="text-xs text-gray-500">
                  Yesterday, 4:18 PM
                </p>
              </div>

            </div>

            <p className="text-sm font-semibold text-slate-900">
              -₦20,000
            </p>
          </div>

          {/* Empty / More */}
          <div className="flex items-center justify-center gap-2 p-6 text-sm text-gray-400">
            <Clock3 size={16} />
            No more recent transactions
          </div>

        </div>
      </div>

      {/* Account Summary */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5">

        <h2 className="font-semibold text-slate-900">
          Account Summary
        </h2>

        <div className="mt-5 space-y-4">

          {/* Total Deposits */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Total Deposits
            </span>

            <span className="text-sm font-semibold text-slate-900">
              ₦350,000
            </span>
          </div>

          {/* Total Withdrawals */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Total Withdrawals
            </span>

            <span className="text-sm font-semibold text-slate-900">
              ₦100,000
            </span>
          </div>

          {/* Current Balance */}
          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Current Balance
              </span>

              <span className="text-lg font-bold text-amber-600">
                ₦250,000
              </span>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</div>
  )
}

export default UserHome