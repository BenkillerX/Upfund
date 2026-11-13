import { FiUser, FiMail, FiPhone, FiLock, FiCreditCard, FiBell, FiChevronRight, FiLogOut, FiEye, FiEyeOff } from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/useAuth"
import { useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"

const UserSettings = () => {
    const { logout, updateBankAccount, updateProfile, changePassword, currentUser } = useAuth();
    const [showBankForm, setShowBankForm] = useState(false);
const [accountName, setAccountName] = useState("");
const [accountNumber, setAccountNumber] = useState("");
const [bankName, setBankName] = useState("");
const [saving, setSaving] = useState(false);


const [showProfileForm, setShowProfileForm] = useState(false);
const [username, setUsername] = useState("");
const [phoneNumber, setPhoneNumber] = useState("");
const [savingProfile, setSavingProfile] = useState(false);
const [currentPassword, setCurrentPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [showCurrentPassword, setShowCurrentPassword] = useState(false);
const [showNewPassword, setShowNewPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [savingPassword, setSavingPassword] = useState(false);
  const navigate = useNavigate()
    const handleLogout = () => {
    logout()
    navigate("/")
  }
  const handleEditProfile = () => {
  setUsername(currentUser?.username ?? "");
  setPhoneNumber(currentUser?.phoneNumber ?? "");
  setShowProfileForm(true);
};
const handleProfileSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSavingProfile(true);

  try {
    await updateProfile({ username, phoneNumber });
    setShowProfileForm(false);
  } catch (error) {
    console.error("Failed to update profile:", error);
  } finally {
    setSavingProfile(false);
  }
};
const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (newPassword !== confirmPassword) {
    toast.error("New passwords do not match.");
    return;
  }

  if (newPassword === currentPassword) {
    toast.error("Your new password must be different from your current password.");
    return;
  }

  setSavingPassword(true);

  try {
    const response = await changePassword({ currentPassword, newPassword });
    toast.success(response.message || "Password changed successfully.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  } catch (error: unknown) {
    if (axios.isAxiosError<{ message?: string }>(error)) {
      toast.error(error.response?.data?.message || "Unable to change your password.");
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  } finally {
    setSavingPassword(false);
  }
};

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
      <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xl font-bold">
        {currentUser?.username?.charAt(0).toUpperCase() || "U"}
      </div>

      <div>
        <h3 className="font-semibold text-slate-800">
          {currentUser?.username}
        </h3>

        <p className="text-sm text-slate-500">
          UpFund User
        </p>
      </div>
    </div>

    {/* Information */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Username
        </label>

        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200">
          <FiUser className="text-slate-400" />
          <span className="text-sm text-slate-700">
            {currentUser?.username}
          </span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Email
        </label>

        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200">
          <FiMail className="text-slate-400" />
          <span className="text-sm text-slate-700 truncate">
            {currentUser?.email}
          </span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Phone Number
        </label>

        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200">
          <FiPhone className="text-slate-400" />
          <span className="text-sm text-slate-700">
            {currentUser?.phoneNumber || "Not added"}
          </span>
        </div>
      </div>
    </div>

    <button
      onClick={handleEditProfile}
      className="mt-5 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition"
    >
      Edit Profile
    </button>

    {/* Edit Form */}
    {showProfileForm && (
      <form
        onSubmit={handleProfileSubmit}
        className="mt-6 pt-5 border-t border-gray-100 space-y-4"
      >
        <h3 className="font-semibold text-slate-800">
          Edit Profile
        </h3>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Username
          </label>

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Phone Number
          </label>

          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter your phone number"
            className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={savingProfile}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium disabled:opacity-50"
          >
            {savingProfile ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={() => setShowProfileForm(false)}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-slate-600 text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    )}
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

            <div className="
              w-full
              flex items-center gap-4
              p-5
              text-left
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

            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4 p-5">
                <div>
                  <label htmlFor="current-password" className="mb-2 block text-sm font-medium text-slate-700">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      id="current-password"
                      type={showCurrentPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      className="w-full rounded-xl border border-gray-200 p-3 pr-11 text-sm outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      aria-label={showCurrentPassword ? "Hide current password" : "Show current password"}
                      onClick={() => setShowCurrentPassword((shown) => !shown)}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-slate-700"
                    >
                      {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="new-password" className="mb-2 block text-sm font-medium text-slate-700">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      minLength={8}
                      required
                      className="w-full rounded-xl border border-gray-200 p-3 pr-11 text-sm outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                      onClick={() => setShowNewPassword((shown) => !shown)}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-slate-700"
                    >
                      {showNewPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Use at least 8 characters.</p>
                </div>

                <div>
                  <label htmlFor="confirm-password" className="mb-2 block text-sm font-medium text-slate-700">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      minLength={8}
                      required
                      className="w-full rounded-xl border border-gray-200 p-3 pr-11 text-sm outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"}
                      onClick={() => setShowConfirmPassword((shown) => !shown)}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-slate-700"
                    >
                      {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={savingPassword}
                    className="rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-amber-600 disabled:opacity-50"
                  >
                    {savingPassword ? "Updating..." : "Update Password"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                    }}
                    className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-slate-600"
                  >
                    Cancel
                  </button>
                </div>
            </form>

            <button 
            className=" w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 transition "
            >
              <div 
              className=" w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center "
              >
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
    <h2 className="font-semibold text-slate-800">Bank Accounts</h2>
    <p className="text-sm text-slate-500 mt-1">
      Manage accounts used for withdrawals.
    </p>
  </div>

  <div className="p-5">
    {currentUser?.bankAccount?.accountNumber ? (
      <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-200">
        <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
          <FiCreditCard />
        </div>

        <div className="flex-1">
          <h3 className="text-sm font-semibold text-slate-800">
            {currentUser.bankAccount.bankName}
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            {currentUser.bankAccount.accountName}
          </p>

          <p className="text-xs text-slate-500 mt-1">
            **** **** {currentUser.bankAccount.accountNumber.slice(-4)}
          </p>
        </div>
      </div>
    ) : (
      <p className="text-sm text-slate-500">
        You haven't added a bank account yet.
      </p>
    )}

    <button
      onClick={() => setShowBankForm(!showBankForm)}
      className="mt-4 text-sm font-medium text-amber-600 hover:text-amber-700"
    >
      {showBankForm ? "Cancel" : currentUser?.bankAccount?.accountNumber ? "Update Bank Account" : "+ Add Bank Account"}
    </button>

    {showBankForm && (
      <form
       onSubmit={async (e) => {
  e.preventDefault();
  setSaving(true);

  try {
    await updateBankAccount({
      accountName,
      accountNumber,
      bankName,
    });

    setShowBankForm(false);
    setAccountName("");
    setAccountNumber("");
    setBankName("");
  } catch (error) {
    console.error("Failed to save bank account:", error);
  } finally {
    setSaving(false);
  }
}}
        className="mt-5 space-y-4"
      >
        <input
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          placeholder="Account Name"
          required
          className="w-full border rounded-lg p-3 text-sm"
        />

        <input
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          placeholder="Account Number"
          inputMode="numeric"
          type="number"
          maxLength={10}
          required
          className="w-full border rounded-lg p-3 text-sm"
        />

        <input
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
          placeholder="Bank Name"
          required
          className="w-full border rounded-lg p-3 text-sm"
        />

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-amber-500 text-white rounded-lg p-3 text-sm font-medium disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Bank Account"}
        </button>
      </form>
    )}
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

            <button 
            className=" flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium transition"
            onClick={handleLogout}
            >
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