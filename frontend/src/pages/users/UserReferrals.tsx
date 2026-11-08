import { FiUsers, FiCopy, FiCheckCircle, FiClock, FiShare2, } from "react-icons/fi";
import { useAuth } from "../../context/useAuth";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import api from "../../services/api";
const UserReferrals = () => {
  const { currentUser } = useAuth();
  const [copied, setCopied] = useState(false);
  
  const balance = currentUser?.balance ?? 0;
  const isReferralDisabled = balance <= 0;
  const referralLink = `${window.location.origin}/register?ref=${currentUser?.referralCode}`;

  const handleCopyLink = async () => {
  if (isReferralDisabled) {
    toast.error("Deposit to enable your referral link.");
    return;
  }

  try {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  } catch (error) {
    console.error("Failed to copy referral link:", error);
  }
};
const [referralStats, setReferralStats] = useState({
  totalReferrals: 0,
  qualified: 0,
  pending: 0,
});
const [referrals, setReferrals] = useState<
  {
    _id: string;
    username: string;
    createdAt: string;
    referralStatus: "pending" | "qualified";
  }[]
>([]);

useEffect(() => {
  const fetchReferralStats = async () => {
    try {
      const response = await api.get("/api/auth/referrals/stats");
      setReferralStats(response.data);
      const historyResponse = await api.get("/api/auth/referrals/history");
setReferrals(historyResponse.data.referrals);
    } catch (error) {
      console.error("Failed to fetch referral stats:", error);
    }
  };

  fetchReferralStats();
}, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Referrals
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Invite people to UpFund and get your reward of $1.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
            <FiUsers />
          </div>

          <p className="text-sm text-slate-500">
            Total Referrals
          </p>

          <h3 className="text-2xl font-bold text-slate-800 mt-1">
            {referralStats.totalReferrals}
          </h3>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mb-4">
            <FiCheckCircle />
          </div>

          <p className="text-sm text-slate-500">
            Qualified
          </p>

          <h3 className="text-2xl font-bold text-slate-800 mt-1">
            {referralStats.qualified}
          </h3>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
            <FiClock />
          </div>

          <p className="text-sm text-slate-500">
            Pending
          </p>

          <h3 className="text-2xl font-bold text-slate-800 mt-1">
            {referralStats.pending}
          </h3>
        </div>

      </div>

      {/* Referral Link */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6 mb-6">

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <FiShare2 />
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">
              Invite people
            </h2>

            <p className="text-sm text-slate-500">
              Share your referral link with friends.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">

          <div className="flex-1 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm text-slate-600 truncate">
            {referralLink}
          </div>

       <button
  onClick={handleCopyLink}
  disabled={isReferralDisabled}
  className={`
    flex items-center justify-center gap-2
    px-5 py-3 rounded-xl
    text-white text-sm font-semibold transition
    ${
      isReferralDisabled
        ? "bg-gray-300 cursor-not-allowed"
        : "bg-amber-500 hover:bg-amber-600"
    }
  `}
>
  {copied ? <FiCheckCircle /> : <FiCopy />}
  {isReferralDisabled ? "Fund wallet to refer" : copied ? "Copied!" : "Copy Link"}
</button>

        </div>

      </div>
      {isReferralDisabled && (
  <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
        <FiClock />
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-amber-800">
          Activate Your Referral Account
        </h3>

        <p className="mt-1 text-sm leading-relaxed text-amber-700">
          Make your first deposit to unlock your referral link.
          Once your wallet is funded, you'll be able to invite
          friends and earn $1 for every qualified referral.
        </p>

        <button
          onClick={() => window.location.assign("/user/deposit")}
          className="mt-3 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
        >
          Make a Deposit
        </button>
      </div>
    </div>
  </div>
)}

      {/* Referral History */}
     <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">

  <div className="p-5 border-b border-gray-100">
    <h2 className="font-semibold text-slate-800">
      Referral History
    </h2>

    <p className="text-sm text-slate-500 mt-1">
      Track the people you've referred.
    </p>
  </div>

  <div className="divide-y divide-gray-100">

    {referrals.length === 0 ? (
      <div className="p-8 text-center">
        <FiUsers className="mx-auto text-3xl text-slate-300 mb-3" />

        <p className="text-sm font-medium text-slate-600">
          No referrals yet
        </p>

        <p className="text-xs text-slate-400 mt-1">
          Your invited users will appear here.
        </p>
      </div>
    ) : (
      referrals.map((referral) => {
        const qualified = referral.referralStatus === "qualified";

        return (
          <div
            key={referral._id}
            className="p-5 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3 min-w-0">

              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-semibold shrink-0">
                {referral.username.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800">
                  {referral.username}
                </p>

                <p className="text-xs text-slate-500">
                  Joined{" "}
                  {new Date(referral.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </p>
              </div>

            </div>

            <span
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                qualified
                  ? "bg-green-100 text-green-600"
                  : "bg-amber-100 text-amber-600"
              }`}
            >
              {qualified ? <FiCheckCircle /> : <FiClock />}
              {qualified ? "Qualified" : "Pending"}
            </span>

          </div>
        );
      })
    )}

  </div>
</div>

    </div>
  )
}

export default UserReferrals