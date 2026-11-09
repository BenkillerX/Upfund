import { NavLink } from "react-router-dom";
import { FiGrid, FiUsers, FiArrowDownCircle, } from "react-icons/fi";

const AdminButtomNav = () => {
  const navigation = [
    {
      name: "Dashboard",
      path: "/admin/",
      icon: FiGrid,
      end: true,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: FiUsers,
      end: false,
    },
    {
      name: "Withdrawals",
      path: "/admin/withdrawals",
      icon: FiArrowDownCircle,
      end: false,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_15px_rgba(0,0,0,0.04)] lg:hidden">
      <div className="grid grid-cols-3">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => `
                flex flex-col items-center justify-center gap-1
                py-3 text-[11px] font-medium transition-colors
                ${
                  isActive
                    ? "text-amber-500"
                    : "text-gray-400 hover:text-slate-700"
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={21}
                    strokeWidth={isActive ? 2.5 : 1.8}
                  />

                  <span>{item.name}</span>

                  <span
                    className={`h-1 w-1 rounded-full ${
                      isActive ? "bg-amber-500" : "bg-transparent"
                    }`}
                  />
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default AdminButtomNav;