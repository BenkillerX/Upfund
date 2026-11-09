import { useState } from "react";
import { Outlet } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import AdminSiderBar from "../components/common/AdminSiderBar";
import AdminButtomNav from "../components/common/AdminButtomNav";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        <AdminSiderBar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
        />

        <div className="min-w-0 flex-1 lg:ml-72">
          {/* Mobile Header */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:hidden">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="rounded-lg p-2 text-slate-700 transition hover:bg-gray-100"
                aria-label="Open admin menu"
              >
                <FiMenu size={23} />
              </button>

              <h1 className="text-lg font-bold text-slate-900">
                Upfund Admin
              </h1>
            </div>

            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600">
              Admin
            </span>
          </header>

          {/* Page Content */}
          <main className="min-w-0 pb-24 lg:pb-6">
            <Outlet />
          </main>
        </div>

        {/* Mobile Bottom Navigation */}
        <AdminButtomNav />
      </div>
    </div>
  );
};

export default AdminLayout;