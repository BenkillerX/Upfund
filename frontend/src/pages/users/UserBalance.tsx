
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/useAuth";

const UserBalance = ({ balance: balanceOverride }: { balance?: number }) => {
  const [showBalance, setShowBalance] = useState(true);
  const [currency, setCurrency] = useState<"NGN" | "USD">("NGN");
  const { currentUser } = useAuth();
  const balance = Number(balanceOverride ?? currentUser?.balance ?? 0);
  const USD_TO_NGN = 1500;
  const convertedBalance = currency === "NGN" ? balance : balance / USD_TO_NGN;
  const formattedBalance = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(convertedBalance);

  return (
    <div className="rounded-2xl bg-slate-800 p-5 text-white shadow-sm sm:p-6 lg:p-7">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-300">
          Available Balance
        </p>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg bg-slate-700 p-1">
            <button
              type="button"
              onClick={() => setCurrency("NGN")}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
                currency === "NGN"
                  ? "bg-amber-500 text-white"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              NGN
            </button>

            <button
              type="button"
              onClick={() => setCurrency("USD")}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
                currency === "USD"
                  ? "bg-amber-500 text-white"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              USD
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowBalance((prev) => !prev)}
            aria-label={showBalance ? "Hide balance" : "Show balance"}
            className="rounded-full p-2 transition hover:bg-white/10"
          >
            {showBalance ? (
              <Eye size={19} />
            ) : (
              <EyeOff size={19} />
            )}
          </button>
        </div>
      </div>

      <div className="mt-2">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {showBalance ? formattedBalance : "••••••••"}
        </h2>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400">
            {currentUser?.username ?? "UpFund"} Wallet
          </p>

          <p className="mt-1 text-sm font-medium">
            Available funds
          </p>
        </div>

        <p className="text-xs text-slate-400">
          Wallet Balance
        </p>
      </div>
    </div>
  );
};

export default UserBalance;
