import {
  FiUsers,
  FiCopy,
  FiCheckCircle,
  FiClock,
  FiShare2,
} from "react-icons/fi"

const UserReferrals = () => {
  const referralLink = "https://upfund.com/register?ref=BEN123"

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Referrals
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Invite people to UpFund and complete your referral requirement.
        </p>
      </div>

      {/* Referral Progress */}
      <div className="bg-slate-800 rounded-2xl p-6 md:p-8 text-white mb-6">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <FiUsers className="text-xl" />
              </div>

              <span className="text-sm text-slate-300">
                Withdrawal Requirement
              </span>
            </div>

            <h2 className="text-2xl font-bold">
              3 of 5 referrals
            </h2>

            <p className="text-sm text-slate-300 mt-2">
              You need 2 more qualified referrals before you can withdraw.
            </p>
          </div>

          <div className="text-left md:text-right">
            <p className="text-3xl font-bold text-amber-400">
              60%
            </p>

            <p className="text-xs text-slate-400">
              Completed
            </p>
          </div>

        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full"
              style={{ width: "60%" }}
            />
          </div>
        </div>

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
            8
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
            3
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
            5
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
            className="
              flex items-center justify-center gap-2
              px-5 py-3
              rounded-xl
              bg-amber-500
              hover:bg-amber-600
              text-white
              text-sm
              font-semibold
              transition
            "
          >
            <FiCopy />
            Copy Link
          </button>

        </div>

      </div>

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

          {/* Qualified */}
          <div className="p-5 flex items-center justify-between gap-4">

            <div className="flex items-center gap-3 min-w-0">

              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-semibold shrink-0">
                J
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800">
                  John Doe
                </p>

                <p className="text-xs text-slate-500">
                  Joined Sept 10, 2026
                </p>
              </div>

            </div>

            <span className="
              flex items-center gap-1
              px-2.5 py-1
              rounded-full
              bg-green-100
              text-green-600
              text-xs
              font-medium
            ">
              <FiCheckCircle />
              Qualified
            </span>

          </div>

          {/* Pending */}
          <div className="p-5 flex items-center justify-between gap-4">

            <div className="flex items-center gap-3 min-w-0">

              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-semibold shrink-0">
                M
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800">
                  Michael Smith
                </p>

                <p className="text-xs text-slate-500">
                  Joined Sept 9, 2026
                </p>
              </div>

            </div>

            <span className="
              flex items-center gap-1
              px-2.5 py-1
              rounded-full
              bg-amber-100
              text-amber-600
              text-xs
              font-medium
            ">
              <FiClock />
              Pending
            </span>

          </div>

        </div>

      </div>

    </div>
  )
}

export default UserReferrals