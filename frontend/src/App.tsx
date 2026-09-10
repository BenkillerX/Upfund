import { Route, Routes } from "react-router-dom"
import PublicLayout from "./layout/PublicLayout"
import LandingPage from "./pages/public/LandingPage"
import HowItWorks from "./pages/public/HowItWorks"
import About from "./pages/public/About"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"

function App() {

  return (
    <>
      <Routes>
        <Route element={<PublicLayout/>}>
          <Route path="/" element={<LandingPage/>}/>
          <Route path="/how-it-works" element={<HowItWorks/>}/>
          <Route path="/about" element={<About/>}/>
        </Route>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
      </Routes>
    </>
  )
}

export default App
