
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";

import ScrollToTop from "./components/common/ScrollToTop";
import NoIndex from "./components/common/NoIndex";

import PublicLayout from "./layout/PublicLayout";
import UsersLayout from "./layout/UsersLayout";
import AdminLayout from "./layout/AdminLayout";

import LandingPage from "./pages/public/LandingPage";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

import UserHome from "./pages/users/UserHome";
import UserWithdraw from "./pages/users/UserWithdraw";
import UserDeposits from "./pages/users/UserDeposits";
import UserSettings from "./pages/users/UserSettings";
import UserReferrals from "./pages/users/UserReferrals";

import AdminHome from "./pages/admin/AdminHome";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminWithdrawals from "./pages/admin/AdminWithdrawals";

function App() {
  return (
    <>
      <ScrollToTop />
      <Analytics />
      <Toaster position="top-right" />

      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>

        {/* Authentication routes */}
        <Route path="/login" element={<NoIndex><Login /></NoIndex>} />
        <Route path="/register" element={<NoIndex><Register /></NoIndex>} />
        <Route path="/forgot-password" element={<NoIndex><ForgotPassword /></NoIndex>} />

        {/* User dashboard */}
        <Route element={<NoIndex><UsersLayout /></NoIndex>}>
          <Route path="/user" element={<UserHome />} />
          <Route path="/user/withdraw" element={<UserWithdraw />} />
          <Route path="/user/deposit" element={<UserDeposits />} />
          <Route path="/user/settings" element={<UserSettings />} />
          <Route path="/user/referrals" element={<UserReferrals />} />
        </Route>

        {/* Admin dashboard */}
        <Route element={<NoIndex><AdminLayout /></NoIndex>}>
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/withdrawals" element={<AdminWithdrawals />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
