
import { Outlet } from "react-router-dom";
import UserSiderBar from "../components/common/UserSiderBar";
import UserBottomNav from "../components/common/UserBottomNav";
import UserDashboardHeader from "../components/common/UserDashboardHeader";

const UsersLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">

      <div className="flex min-h-screen">

        {/* Sidebar */}
        <UserSiderBar />

        {/* Dashboard Content */}
        <main className="min-w-0 flex-1 pb-20 md:pb-0">

          <UserDashboardHeader />

          <Outlet />

        </main>

      </div>

      {/* Mobile Navigation */}
      <UserBottomNav />

    </div>
  );
};

export default UsersLayout;
