import { FiArrowUp, FiCreditCard, FiCheckCircle, FiAlertCircle, } from "react-icons/fi"
import { useAuth } from "../../context/useAuth";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import api from "../../services/api";

const UserWithdraw = () => {
  const { currentUser } = useAuth();
  const [amount, setAmount] = useState("");
  const balance = currentUser?.balance ?? 0;
  const withdrawalAmount = Number(amount) || 0;
  const withdrawalFee = 0;
const amountToReceive = Math.max(0, withdrawalAmount - withdrawalFee);
const bankAccount = currentUser?.bankAccount;

const hasBankAccount = Boolean(
  bankAccount?.accountName &&
  bankAccount?.accountNumber &&
  bankAccount?.bankName
);
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(value);
const quickAmounts = [7000, 10000, 15000, 20000];

// real logic

const [isSubmitting, setIsSubmitting] = useState(false);
const [balanceAdjustment, setBalanceAdjustment] = useState(0);

const availableBalance = balance + balanceAdjustment;

const handleWithdraw = async () => {
  if (!amount.trim()) {
    return toast.error("Please enter a withdrawal amount.");
  }

  if (!Number.isFinite(withdrawalAmount) || withdrawalAmount <= 0) {
    return toast.error("Please enter a valid amount.");
  }

  if (withdrawalAmount > availableBalance) {
    return toast.error("Insufficient wallet balance.");
  }

  if (!hasBankAccount) {
    return toast.error("Please add your bank account in Settings.");
  }

  try {
    setIsSubmitting(true);

    const response = await api.post("/api/payments/withdraw", {
      amount: withdrawalAmount,
    });

   if (typeof response.data.balance === "number") {
  setBalanceAdjustment(response.data.balance - balance);
}

    setAmount("");

    toast.success(
      response.data.message || "Withdrawal request submitted successfully."
    );
  } catch (error: unknown) {
    if (axios.isAxiosError<{ message?: string }>(error)) {
      toast.error(
        error.response?.data?.message || "Unable to submit withdrawal request."
      );
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  } finally {
    setIsSubmitting(false);
  }
};
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Withdraw
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Withdraw money from your UpFund wallet.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Withdrawal Form */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6">

            {/* Available Balance */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-slate-500">
                  Available Balance
                </p>

                <h2 className="text-2xl font-bold text-slate-800 mt-1">
                  {formatCurrency(availableBalance)}
                </h2>
              </div>

              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <FiArrowUp className="text-xl" />
              </div>
            </div>

            {/* Amount */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Withdrawal Amount
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                  ₦
                </span>

                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className=" w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-slate-800 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 "
                />
              </div>

              <p className="text-xs text-slate-400 mt-2">
                Available: {formatCurrency(balance)}
              </p>
            </div>

            {/* Quick Amounts */}
            <div className="mb-6">
              <p className="text-sm font-medium text-slate-700 mb-2">
                Quick Amount
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {quickAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setAmount(String(amount))}
                    className=" py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-slate-600 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-600 transition "
                  >
                    ₦{amount.toLocaleString("en-NG")}
                  </button>
                ))}
              </div>
            </div>
            {/* Bank Account */}
           
{/* Bank Account */}
<div className="mb-6">
  <div className="flex items-center justify-between mb-2">
    <label className="text-sm font-medium text-slate-700">
      Withdrawal Account
    </label>
  </div>

  {hasBankAccount ? (
    <div className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-amber-500 bg-amber-50 text-left">
      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-amber-600">
        <FiCreditCard />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800">
          {bankAccount?.bankName}
        </p>

        <p className="text-xs text-slate-500">
          **** **** {bankAccount?.accountNumber?.slice(-4)}
        </p>

        <p className="text-xs text-slate-500 mt-1">
          {bankAccount?.accountName}
        </p>
      </div>

      <FiCheckCircle className="text-amber-500 shrink-0" />
    </div>
  ) : (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-amber-600 shrink-0">
          <FiAlertCircle />
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-800">
            No withdrawal account found
          </p>

          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            You haven't added a bank account yet. Please visit your
            Settings page and add your bank details before making
            a withdrawal.
          </p>
        </div>
      </div>
    </div>
  )}
</div>


            {/* Withdrawal Summary */}
            
<div className="rounded-xl bg-slate-50 border border-gray-100 p-4 mb-6">
  <div className="flex items-center justify-between mb-3">
    <span className="text-sm text-slate-500">
      Withdrawal amount
    </span>

    <span className="text-sm font-medium text-slate-800">
      {formatCurrency(withdrawalAmount)}
    </span>
  </div>

  <div className="flex items-center justify-between mb-3">
    <span className="text-sm text-slate-500">
      Withdrawal fee
    </span>

    <span className="text-sm font-medium text-slate-800">
      {formatCurrency(withdrawalFee)}
    </span>
  </div>

  <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
    <span className="text-sm font-semibold text-slate-700">
      You'll receive
    </span>

    <span className="font-bold text-slate-800">
      {formatCurrency(amountToReceive)}
    </span>
  </div>
</div>

            {/* Withdraw Button */}
           <button
          onClick={handleWithdraw}
          disabled={isSubmitting || !hasBankAccount || withdrawalAmount <= 0}
          className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold transition"
        >
          {isSubmitting ? "Submitting Request..." : "Withdraw Funds"}
        </button>
          </div>
        </div>

        {/* Information Card */}
        <div>
          <div className="bg-slate-800 rounded-2xl p-6 text-white">

            <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
              <FiArrowUp className="text-xl" />
            </div>

            <h2 className="text-lg font-semibold">
              Withdraw securely
            </h2>

            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Withdraw your available funds directly to your
              registered bank account.
            </p>

            <div className="mt-6 space-y-4">

              <div className="flex gap-3">
                <FiCheckCircle className="text-amber-400 mt-0.5 shrink-0" />

                <p className="text-sm text-slate-300">
                  Only verified accounts can receive withdrawals
                </p>
              </div>

              <div className="flex gap-3">
                <FiCheckCircle className="text-amber-400 mt-0.5 shrink-0" />

                <p className="text-sm text-slate-300">
                  Your withdrawal history is recorded
                </p>
              </div>

              <div className="flex gap-3">
                <FiCheckCircle className="text-amber-400 mt-0.5 shrink-0" />

                <p className="text-sm text-slate-300">
                  You'll receive a notification when it's processed
                </p>
              </div>

            </div>

            {/* Notice */}
            <div className="mt-6 flex gap-3 p-3 rounded-xl bg-white/5">
              <FiAlertCircle className="text-amber-400 mt-0.5 shrink-0" />

              <p className="text-xs text-slate-300 leading-relaxed">
                Withdrawals may take some time to reflect in your
                bank account depending on your bank.
              </p>
            </div>

          </div>
        </div>
      </div>

   
      
    </div>
  )
}

export default UserWithdraw