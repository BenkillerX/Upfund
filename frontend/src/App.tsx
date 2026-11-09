import { Route, Routes } from "react-router-dom"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import UsersLayout from "./layout/UsersLayout"
import UserHome from "./pages/users/UserHome"
import UserWithdraw from "./pages/users/UserWithdraw"
import UserDeposits from "./pages/users/UserDeposits"
import UserSettings from "./pages/users/UserSettings"
import UserReferrals from "./pages/users/UserReferrals"
import  { Toaster } from "react-hot-toast";
import ScrollToTop from "./components/common/ScrollToTop"
import ForgotPassword from "./pages/auth/ForgotPassword"
import AdminLayout from "./layout/AdminLayout"
import AdminHome from "./pages/admin/AdminHome"
import AdminUsers from "./pages/admin/AdminUsers"
import AdminWithdrawals from "./pages/admin/AdminWithdrawals"
function App() {

  return (
    <>
    <ScrollToTop />
    <Toaster position="top-right" />
      <Routes>
        <Route element={<UsersLayout/>}>
          <Route path="/user/" element={<UserHome/>}/>
          <Route path="/user/withdraw" element={<UserWithdraw/>}/>
          <Route path="/user/deposit" element={<UserDeposits/>}/>
          <Route path="/user/Settings" element={<UserSettings/>}/>
          <Route path="/user/referrals" element={<UserReferrals />} />
        </Route>
         <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminHome />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="withdrawals" element={<AdminWithdrawals />} />
  </Route>
        <Route path="/" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
      </Routes>
    </>
  )
}

export default App
