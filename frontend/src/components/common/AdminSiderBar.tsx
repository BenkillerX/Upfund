import { NavLink, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiUsers,
  FiArrowDownCircle,
  FiLogOut,
  FiX,
  FiDollarSign,
} from "react-icons/fi";

interface AdminSiderBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSiderBar = ({
  isOpen,
  onClose,
}: AdminSiderBarProps) => {
  const navigate = useNavigate();

  const navigation = [
    {
      name: "Dashboard",
      path: "/admin",
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-72 flex-col
          bg-slate-950 text-white transition-transform duration-300
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-slate-950">
              <FiDollarSign size={23} />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight">
                Upfund
              </h1>

              <p className="text-xs text-slate-400">
                Administration
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close admin menu"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 lg:hidden"
          >
            <FiX size={21} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 py-8">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Main Menu
          </p>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={onClose}
                  className={({ isActive }) => `
                    flex items-center gap-3 rounded-xl px-4 py-3.5
                    text-sm font-medium transition-all duration-200
                    ${
                      isActive
                        ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/10"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }
                  `}
                >
                  <Icon size={19} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Admin Info */}
        <div className="border-t border-white/10 p-4">
          <div className="mb-4 flex items-center gap-3 rounded-xl bg-white/5 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/15 font-bold text-amber-400">
              A
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-white">
                Administrator
              </p>

              <p className="text-xs text-slate-500">
                Admin Account
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
          >
            <FiLogOut size={19} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSiderBar;