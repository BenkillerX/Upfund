import { NavLink } from "react-router-dom"
import {
  House,
  ArrowDownToLine,
  ArrowUpFromLine,
  Settings,
} from "lucide-react"

const UserBottomNav = () => {
  const navItems = [
    {
      name: "Home",
      path: "/user/",
      icon: House,
    },
    {
      name: "Deposit",
      path: "/user/deposit",
      icon: ArrowDownToLine,
    },
    {
      name: "Withdraw",
      path: "/user/withdraw",
      icon: ArrowUpFromLine,
    },
    {
      name: "Referrals",
      path: "/user/referrals",
      icon: ArrowUpFromLine,
    },
    {
      name: "Settings",
      path: "/user/Settings",
      icon: Settings,
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white md:hidden">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-2">
        {navItems.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={name}
            to={path}
            className={({ isActive }) =>
              `flex h-full min-w-16 flex-col items-center justify-center gap-1 text-xs font-medium transition-colors ${
                isActive
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={21}
                  strokeWidth={isActive ? 2.5 : 2}
                />

                <span>{name}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default UserBottomNav