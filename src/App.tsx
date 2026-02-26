import { useState , useEffect } from "react"
import Loader from "./layouts/AppLoader"
import AOS from "aos";
import "aos/dist/aos.css";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    AOS.init({ duration: 1200, once: true });
  }, []);

  if (loading) {
    return <Loader onFinish={() => setLoading(false)} />
  }

  return <AppRoutes />
}

export default App
