import {
  FiArrowDown,
  FiCreditCard,
  FiClock,
  FiCheckCircle,
//   FiXCircle,
} from "react-icons/fi"

const UserDeposits = () => {
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
                  ₦125,000.00
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
                  placeholder="0.00"
                  className="
                    w-full
                    pl-10 pr-4 py-3
                    rounded-xl
                    border border-gray-200
                    bg-gray-50
                    text-slate-800
                    outline-none
                    focus:border-amber-500
                    focus:ring-2
                    focus:ring-amber-100
                  "
                />
              </div>
            </div>

            {/* Quick Amounts */}
            <div className="mb-6">
              <p className="text-sm font-medium text-slate-700 mb-2">
                Quick Amount
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {["₦5,000", "₦10,000", "₦25,000", "₦50,000"].map(
                  (amount) => (
                    <button
                      key={amount}
                      className="
                        py-2.5
                        rounded-lg
                        border border-gray-200
                        text-sm
                        font-medium
                        text-slate-600
                        hover:border-amber-400
                        hover:bg-amber-50
                        hover:text-amber-600
                        transition
                      "
                    >
                      {amount}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Payment Method
              </label>

              <button
                className="
                  w-full
                  flex items-center gap-3
                  p-4
                  rounded-xl
                  border-2 border-amber-500
                  bg-amber-50
                  text-left
                "
              >
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
              </button>
            </div>

            {/* Deposit Button */}
            <button
              className="
                w-full
                py-3.5
                rounded-xl
                bg-amber-500
                hover:bg-amber-600
                text-white
                font-semibold
                transition
              "
            >
              Continue to Payment
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

        <div className="divide-y divide-gray-100">

          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                <FiCheckCircle />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-800">
                  Wallet Deposit
                </p>

                <p className="text-xs text-slate-500">
                  Today, 10:42 AM
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm font-semibold text-green-600">
                +₦25,000
              </p>

              <p className="text-xs text-slate-400">
                Successful
              </p>
            </div>
          </div>

          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                <FiClock />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-800">
                  Wallet Deposit
                </p>

                <p className="text-xs text-slate-500">
                  Yesterday, 4:15 PM
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm font-semibold text-slate-700">
                +₦10,000
              </p>

              <p className="text-xs text-amber-600">
                Pending
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default UserDeposits