import { NavLink } from "react-router-dom"
interface SidebarLinkProps {
  icon: React.ReactNode
  label: string
  to: string
  collapsed: boolean
}
const SidebarLink = ({
  icon,
  label,
  to,
  collapsed,
}: SidebarLinkProps) => {
  return (
    <NavLink
      to={to}
      end={to === "/user/"}
      className={({ isActive }) =>
        `
        group
        flex items-center
        rounded-xl
        transition-all duration-200
        ${
          collapsed
            ? "justify-center p-3"
            : "gap-3 px-4 py-3"
        }
        ${
          isActive
            ? "bg-slate-800 text-white"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }
        `
      }
    >
      <span className="text-lg shrink-0">
        {icon}
      </span>

      {!collapsed && (
        <span className="text-sm font-medium">
          {label}
        </span>
      )}
    </NavLink>
  )
}

export default SidebarLink