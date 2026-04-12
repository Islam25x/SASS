import { useEffect } from "react"
import AOS from "aos";
import "aos/dist/aos.css";
import AppRoutes from "./routes/AppRoutes";
import { DateRangeProvider } from "./shared/ui";

function App() {
  useEffect(() => {
    AOS.init({ duration: 1200, once: true });
  }, []);

  return (
    <DateRangeProvider>
      <AppRoutes />
    </DateRangeProvider>
  );
}

export default App
