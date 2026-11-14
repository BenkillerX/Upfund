
import { useAuth } from "../../context/useAuth";

const UserDashboardHeader = () => {
  const { currentUser } = useAuth();

  const username = currentUser?.username || "User";
  const email = currentUser?.email || "";

  const userInitial = username.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200">
      <div className="h-18 px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        {/* Dashboard Welcome */}
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-bold text-slate-800">
            Welcome back, {username}!
          </h2>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 shrink-0">

          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-slate-800">
              {username}
            </p>

            <p className="text-xs text-slate-400">
              {email}
            </p>
          </div>

          <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center">
            <span className="text-amber-700 font-bold text-sm">
              {userInitial}
            </span>
          </div>

        </div>

      </div>
    </header>
  );
};

export default UserDashboardHeader;
