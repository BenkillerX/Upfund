import { Outlet } from "react-router-dom"
import UserSiderBar from "../components/common/UserSiderBar"
import UserBottomNav from "../components/common/UserBottomNav"

const UsersLayout = () => {
  return (
       <div className="min-h-screen bg-gray-50">
      {/* Desktop / Tablet */}
      <div className="flex min-h-screen">
        <UserSiderBar />

        <main className="min-w-0 flex-1 pb-16 md:pb-0">
          <Outlet />
        </main>
      </div>

      {/* Mobile */}
      <UserBottomNav />
    </div>
  
  )
}

export default UsersLayout