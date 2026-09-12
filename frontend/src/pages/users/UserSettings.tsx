import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiCreditCard,
  FiBell,
  FiChevronRight,
  FiLogOut,
} from "react-icons/fi"

const UserSettings = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Settings
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your UpFund account and preferences.
        </p>
      </div>

      <div className="max-w-4xl space-y-6">

        {/* Profile */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm">

          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-slate-800">
              Profile Information
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Your personal account information.
            </p>
          </div>

          <div className="p-5">

            {/* Avatar */}
            <div className="flex items-center gap-4 mb-6">
              <div className="
                w-14 h-14
                rounded-full
                bg-amber-100
                text-amber-600
                flex items-center justify-center
                text-xl
                font-bold
              ">
                B
              </div>

              <div>
                <h3 className="font-semibold text-slate-800">
                  Benedict
                </h3>

                <p className="text-sm text-slate-500">
                  UpFund User
                </p>
              </div>

              <button className="
                ml-auto
                px-4 py-2
                rounded-lg
                border border-gray-200
                text-sm font-medium
                text-slate-600
                hover:bg-slate-50
                transition
              ">
                Change
              </button>
            </div>

            {/* Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  First Name
                </label>

                <div className="
                  flex items-center gap-3
                  px-4 py-3
                  rounded-xl
                  bg-gray-50
                  border border-gray-200
                ">
                  <FiUser className="text-slate-400" />

                  <span className="text-sm text-slate-700">
                    Benedict
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Last Name
                </label>

                <div className="
                  flex items-center gap-3
                  px-4 py-3
                  rounded-xl
                  bg-gray-50
                  border border-gray-200
                ">
                  <FiUser className="text-slate-400" />

                  <span className="text-sm text-slate-700">
                    Akhere
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>

                <div className="
                  flex items-center gap-3
                  px-4 py-3
                  rounded-xl
                  bg-gray-50
                  border border-gray-200
                ">
                  <FiMail className="text-slate-400" />

                  <span className="text-sm text-slate-700 truncate">
                    user@example.com
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number
                </label>

                <div className="
                  flex items-center gap-3
                  px-4 py-3
                  rounded-xl
                  bg-gray-50
                  border border-gray-200
                ">
                  <FiPhone className="text-slate-400" />

                  <span className="text-sm text-slate-700">
                    +234 800 000 0000
                  </span>
                </div>
              </div>

            </div>

            <button className="
              mt-5
              px-5 py-2.5
              rounded-xl
              bg-slate-800
              hover:bg-slate-700
              text-white
              text-sm
              font-medium
              transition
            ">
              Edit Profile
            </button>

          </div>
        </section>

        {/* Account & Security */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm">

          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-slate-800">
              Account & Security
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Manage your account security.
            </p>
          </div>

          <div className="divide-y divide-gray-100">

            <button className="
              w-full
              flex items-center gap-4
              p-5
              text-left
              hover:bg-gray-50
              transition
            ">
              <div className="
                w-10 h-10
                rounded-xl
                bg-slate-100
                text-slate-600
                flex items-center justify-center
              ">
                <FiLock />
              </div>

              <div className="flex-1">
                <h3 className="text-sm font-medium text-slate-800">
                  Change Password
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  Update your account password
                </p>
              </div>

              <FiChevronRight className="text-slate-400" />
            </button>

            <button className="
              w-full
              flex items-center gap-4
              p-5
              text-left
              hover:bg-gray-50
              transition
            ">
              <div className="
                w-10 h-10
                rounded-xl
                bg-amber-100
                text-amber-600
                flex items-center justify-center
              ">
                <FiBell />
              </div>

              <div className="flex-1">
                <h3 className="text-sm font-medium text-slate-800">
                  Notifications
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  Manage transaction and account notifications
                </p>
              </div>

              <FiChevronRight className="text-slate-400" />
            </button>

          </div>
        </section>

        {/* Bank Accounts */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm">

          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-slate-800">
              Bank Accounts
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Manage accounts used for withdrawals.
            </p>
          </div>

          <div className="p-5">

            <div className="
              flex items-center gap-4
              p-4
              rounded-xl
              border border-gray-200
            ">

              <div className="
                w-11 h-11
                rounded-xl
                bg-amber-100
                text-amber-600
                flex items-center justify-center
              ">
                <FiCreditCard />
              </div>

              <div className="flex-1">
                <h3 className="text-sm font-semibold text-slate-800">
                  Access Bank
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  **** **** 4821
                </p>
              </div>

              <span className="
                px-2.5 py-1
                rounded-full
                bg-green-100
                text-green-600
                text-xs
                font-medium
              ">
                Verified
              </span>

            </div>

            <button className="
              mt-4
              text-sm
              font-medium
              text-amber-600
              hover:text-amber-700
            ">
              + Add Bank Account
            </button>

          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-white rounded-2xl border border-red-100 shadow-sm">

          <div className="p-5 border-b border-red-100">
            <h2 className="font-semibold text-red-600">
              Account Actions
            </h2>
          </div>

          <div className="p-5">

            <button className="
              flex items-center gap-3
              px-4 py-3
              rounded-xl
              bg-red-50
              text-red-600
              hover:bg-red-100
              text-sm
              font-medium
              transition
            ">
              <FiLogOut />

              Log out of all devices
            </button>

          </div>
        </section>

      </div>
    </div>
  )
}

export default UserSettings