import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FiHome, FiDownload, FiUpload, FiSettings, FiLogOut, FiChevronLeft, FiChevronRight, FiUsers } from "react-icons/fi"

import SidebarLink from "./SidebarLink"
import { useAuth } from "../../context/useAuth"

const UserSiderBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const { logout, currentUser } = useAuth()
  const navigate = useNavigate()

  const userInitial =
  currentUser?.username?.charAt(0).toUpperCase() || "?"
  console.log(userInitial);
  
  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <aside
      className={` hidden md:flex h-screen sticky top-0 flex-col bg-white border-r border-gray-200 transition-all duration-300 shrink-0 ${isCollapsed ? "w-20" : "w-64"} `}
    >
      {/* Header */}
   <div
  className={` relative flex items-center h-18 px-4 border-b border-gray-100 ${isCollapsed ? "justify-center" : "justify-between"} `}
>
  {/* Logo */}
  <div
    className={` flex items-center ${isCollapsed ? "justify-center" : "gap-2"} `}
  >
    <img
      src="/logo2.png"
      alt="UpFund"
      className="w-10 h-10 rounded-lg object-contain shrink-0"
    />

    {!isCollapsed && (
      <h1 className="text-lg font-bold text-slate-800 whitespace-nowrap">
        UpF<span className="text-amber-500">u</span>nd
      </h1>
    )}
  </div>

  {/* Collapse Button */}
  <button
    onClick={() => setIsCollapsed((prev) => !prev)}
    className={` p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition ${isCollapsed ? "absolute right-2" : ""} `}
    aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
  >
    {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
  </button>
</div>
      {/* Profile */}
      <div
        className={`
          p-5
          border-b border-gray-100
          ${isCollapsed ? "flex justify-center" : ""}
        `}
      >
        <div
          className={`
            flex items-center
            ${isCollapsed ? "justify-center" : "gap-3"}
          `}
        >
          {/* User Initial */}
          <div
            className=" w-11 h-11 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-semibold text-lg shrink-0 "
          >
            {userInitial}
          </div>

          {!isCollapsed && (
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-slate-800 truncate">
                {currentUser?.username || "User"}
              </h2>
            </div>
          )}

          {!isCollapsed && (
            <button
              className=" ml-auto p-1 text-slate-400 hover:text-slate-700 transition "
            >
              <FiChevronRight />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <SidebarLink
          icon={<FiHome />}
          label="Home"
          to="/user/"
          collapsed={isCollapsed}
        />

        <SidebarLink
          icon={<FiDownload />}
          label="Deposit"
          to="/user/deposit"
          collapsed={isCollapsed}
        />

        <SidebarLink
          icon={<FiUpload />}
          label="Withdraw"
          to="/user/withdraw"
          collapsed={isCollapsed}
        />
        <SidebarLink
        icon={<FiUsers />}
        label="Referrals"
        to="/user/referrals"
        collapsed={isCollapsed}
        />
        <SidebarLink
          icon={<FiSettings />}
          label="Settings"
          to="/user/settings"
          collapsed={isCollapsed}
        />
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className={`
            w-full
            flex items-center
            rounded-xl
            text-slate-600
            hover:bg-red-50
            hover:text-red-500
            transition
            ${
              isCollapsed
                ? "justify-center p-3"
                : "gap-3 px-4 py-3"
            }
          `}
        >
          <FiLogOut className="text-lg shrink-0" />

          {!isCollapsed && (
            <span className="text-sm font-medium">
              Logout
            </span>
          )}
        </button>
      </div>
    </aside>
  )
}

export default UserSiderBar