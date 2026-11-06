import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/useAuth";

const UserBalance = () => {
  const [showBalance, setShowBalance] = useState(true);
  const { currentUser } = useAuth();

  const balance = currentUser?.balance ?? 10;
  console.log("Current user:", currentUser);
console.log("Balance:", currentUser?.balance);
  const formattedBalance = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(balance);

  return (
    <div className="rounded-2xl bg-slate-800 p-5 text-white shadow-sm sm:p-6 lg:p-7">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-300">
          Available Balance
        </p>

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