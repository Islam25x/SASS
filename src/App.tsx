import { useState , useEffect } from "react"
import { Route, Routes } from "react-router-dom"
import Dashboard from "./component/Dashboard/Dashboard"
import Login from "./component/AuthSystem/Login/Login"
import Register from "./component/AuthSystem/Register/Register"
import Support from "./Support/Support"
import AI from "./Support/AI"
import Profile from "./component/Profile/Profile"
import Loader from "./component/Loader/Loader"
import AOS from "aos";
import "aos/dist/aos.css";
import Welcome from "./component/Welcome/Welcome"

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    AOS.init({ duration: 1200, once: true });
  }, []);

  if (loading) {
    return <Loader onFinish={() => setLoading(false)} />
  }

  return (
    <Routes>
      <Route path="/Profile" element={<Profile />} />
      <Route path="/AI" element={<AI />} />
      <Route path="/Support" element={<Support />} />
      <Route path="/Welcome" element={<Welcome />}></Route>
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path="/" element={<Login />} />
      <Route path="/Register" element={<Register />} />
    </Routes>
  )
}

export default App
