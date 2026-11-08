import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FiArrowDown, FiCreditCard, FiClock, FiCheckCircle, } from "react-icons/fi";
import { useAuth } from "../../context/useAuth";
import api from "../../services/api";



const UserDeposits = () => {
  const { currentUser } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();

  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const balance = currentUser?.balance ?? 0;

  const formattedBalance = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(balance);

  const quickAmounts = [7000, 10000, 15000, 20000];

  // Verify payment after Paystack redirects back
  useEffect(() => {
    const reference = searchParams.get("reference");

    if (!reference) return;

    const verifyPayment = async () => {
      setVerifying(true);

      try {
      await api.get(
      `/api/payments/deposit/verify/${encodeURIComponent(reference)}`
    );

        toast.success("Deposit successful!");

        setSearchParams({}, { replace: true });

        // Reload to fetch the updated wallet balance.
        window.location.reload();
      } catch (error: unknown) {
        let message = "Payment verification failed.";

        if (axios.isAxiosError(error)) {
          message =
            error.response?.data?.message || message;
        }

        toast.error(message);
        setSearchParams({}, { replace: true });
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams, setSearchParams]);

  // Initialize deposit
 const handleDeposit = async () => {
  const depositAmount = Number(amount);

  if (
    !Number.isSafeInteger(depositAmount) ||
    depositAmount < 7000 ||
    depositAmount > 20000
  ) {
    toast.error("Deposit must be between ₦7,000 and ₦20,000.");
    return;
  }

  try {
    setLoading(true);

    const response = await api.post("/api/payments/deposit", {
      amount: depositAmount,
    });

    const authorizationUrl = response.data.authorization_url;

    if (!authorizationUrl) {
      throw new Error("Payment URL was not returned.");
    }

    window.location.assign(authorizationUrl);
  } catch (error: unknown) {
    let message = "Unable to initialize deposit.";

    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    toast.error(message);
    setLoading(false);
  }
};

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-amber-500 border-t-transparent mx-auto" />

          <p className="mt-4 text-slate-600 font-medium">
            Verifying your payment...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Deposit
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Add money to your UpFund wallet.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Deposit Form */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6">

            {/* Balance */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-slate-500">
                  Available Balance
                </p>

                <h2 className="text-2xl font-bold text-slate-800 mt-1">
                  {formattedBalance}
                </h2>
              </div>

              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <FiArrowDown className="text-xl" />
              </div>
            </div>

            {/* Amount */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Deposit Amount
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                  ₦
                </span>

                <input
                  type="number"
                  min="100"
                  max="20000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-slate-800 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                />
              </div>

              <p className="text-xs text-slate-400 mt-2">
                Minimum deposit: ₦100. Maximum deposit: ₦20,000.
              </p>
            </div>

            {/* Quick Amounts */}
            <div className="mb-6">
              <p className="text-sm font-medium text-slate-700 mb-2">
                Quick Amount
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {quickAmounts.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setAmount(String(value))}
                    className={`py-2.5 rounded-lg border text-sm font-medium transition ${
                      amount === String(value)
                        ? "border-amber-500 bg-amber-50 text-amber-600"
                        : "border-gray-200 text-slate-600 hover:border-amber-400 hover:bg-amber-50"
                    }`}
                  >
                    ₦{value.toLocaleString("en-NG")}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Payment Method
              </label>

              <div className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-amber-500 bg-amber-50 text-left">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-amber-600">
                  <FiCreditCard />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Bank Card
                  </p>

                  <p className="text-xs text-slate-500">
                    Visa or Mastercard
                  </p>
                </div>
              </div>
            </div>

            {/* Deposit Button */}
            <button
              type="button"
              onClick={handleDeposit}
              disabled={loading || !amount}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Initializing Payment..." : "Continue to Payment"}
            </button>

          </div>
        </div>

        {/* Deposit Information */}
        <div>
          <div className="bg-slate-800 rounded-2xl p-6 text-white">

            <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
              <FiArrowDown className="text-xl" />
            </div>

            <h2 className="text-lg font-semibold">
              Fund your wallet
            </h2>

            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Add money to your UpFund wallet securely and use your
              balance for transactions within the platform.
            </p>

            <div className="mt-6 space-y-4">

              <div className="flex gap-3">
                <FiCheckCircle className="text-amber-400 mt-0.5 shrink-0" />
                <p className="text-sm text-slate-300">
                  Secure payment processing
                </p>
              </div>

              <div className="flex gap-3">
                <FiCheckCircle className="text-amber-400 mt-0.5 shrink-0" />
                <p className="text-sm text-slate-300">
                  Instant wallet updates
                </p>
              </div>

              <div className="flex gap-3">
                <FiCheckCircle className="text-amber-400 mt-0.5 shrink-0" />
                <p className="text-sm text-slate-300">
                  Track all your deposits
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Recent Deposits */}
      <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm">

        <div className="p-5 border-b border-gray-100">
          <h2 className="font-semibold text-slate-800">
            Recent Deposits
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Your recent wallet funding activity.
          </p>
        </div>

        <div className="p-8 text-center">
          <FiClock className="mx-auto text-3xl text-slate-300" />

          <p className="mt-3 text-sm text-slate-500">
            Deposit history will appear here.
          </p>
        </div>

      </div>
    </div>
  );
};

export default UserDeposits;
