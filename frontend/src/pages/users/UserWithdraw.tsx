import { FiArrowUp, FiCreditCard, FiCheckCircle, FiAlertCircle, } from "react-icons/fi"
import { useAuth } from "../../context/useAuth";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import api from "../../services/api";
import WithdrawMarquee from "../../components/common/WithdrawMarquee";

const UserWithdraw = () => {
  const { currentUser } = useAuth();
  const [accountBalance, setAccountBalance] = useState(currentUser?.balance ?? 0);
  const [withdrawalUsed, setWithdrawalUsed] = useState(currentUser?.withdrawalUsed === true);
  const [loadingAccount, setLoadingAccount] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const balance = accountBalance;
  const withdrawalFee = 0;
const amountToReceive = Math.max(0, balance - withdrawalFee);
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

useEffect(() => {
  let cancelled = false;

  const refreshAccount = async () => {
    try {
      const response = await api.get("/api/auth/me");
      if (!cancelled) {
        setAccountBalance(Number(response.data.user.balance) || 0);
        setWithdrawalUsed(response.data.user.withdrawalUsed === true);
      }
    } catch (error) {
      if (!cancelled) {
        console.error("Failed to refresh withdrawal eligibility:", error);
      }
    } finally {
      if (!cancelled) {
        setLoadingAccount(false);
      }
    }
  };

  void refreshAccount();
  const intervalId = window.setInterval(() => {
    void refreshAccount();
  }, 60_000);

  return () => {
    cancelled = true;
    window.clearInterval(intervalId);
  };
}, []);

const availableBalance = balance;
const withdrawalAmount = availableBalance;

const handleWithdraw = async () => {
  if (!Number.isFinite(withdrawalAmount) || withdrawalAmount <= 0) {
    return toast.error("There is no wallet balance to withdraw.");
  }

  if (withdrawalUsed) {
    return toast.error("Make a new successful deposit before withdrawing again.");
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
      setAccountBalance(response.data.balance);
    }
    setWithdrawalUsed(true);

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
      <WithdrawMarquee/>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Withdraw
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Withdraw your full wallet balance once per deposit cycle.
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
                  value={availableBalance}
                  readOnly
                  aria-label="Full wallet balance to withdraw"
                  className="w-full rounded-xl border border-gray-200 bg-gray-100 py-3 pl-10 pr-4 text-slate-800 outline-none"
                />
              </div>

              <p className="text-xs text-slate-400 mt-2">
                The full balance must be withdrawn in one request.
              </p>
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

{withdrawalUsed && (
  <p role="status" className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
    You have used your withdrawal for this cycle. Make a new successful deposit to unlock another withdrawal.
  </p>
)}

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
          disabled={loadingAccount || isSubmitting || withdrawalUsed || !hasBankAccount || withdrawalAmount <= 0}
          className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold transition"
        >
          {loadingAccount
            ? "Loading Wallet..."
            : isSubmitting
              ? "Submitting Request..."
              : withdrawalUsed
                ? "Deposit to Withdraw Again"
                : "Withdraw Full Balance"}
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