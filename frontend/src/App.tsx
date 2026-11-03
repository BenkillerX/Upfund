import { Route, Routes } from "react-router-dom"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import UsersLayout from "./layout/UsersLayout"
import UserHome from "./pages/users/UserHome"
import UserWithdraw from "./pages/users/UserWithdraw"
import UserDeposits from "./pages/users/UserDeposits"
import UserSettings from "./pages/users/UserSettings"
import UserReferrals from "./pages/users/UserReferrals"

function App() {

  return (
    <>
      <Routes>
        <Route element={<UsersLayout/>}>
          <Route path="/user/" element={<UserHome/>}/>
          <Route path="/user/withdraw" element={<UserWithdraw/>}/>
          <Route path="/user/deposit" element={<UserDeposits/>}/>
          <Route path="/user/Settings" element={<UserSettings/>}/>
          <Route path="/user/referrals" element={<UserReferrals />} />
        </Route>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
      </Routes>
    </>
  )
}

export default App
