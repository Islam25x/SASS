import { useEffect, useState } from "react"
import AOS from "aos";
import "aos/dist/aos.css";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    AOS.init({ duration: 1200, once: true });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const AppSkeleton = () => (
    <div className="min-h-screen w-screen bg-slate-100">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 p-6">
        <div className="h-10 w-64 rounded-2xl bg-slate-200 animate-pulse" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`skeleton-card-${index}`}
              className="h-28 rounded-2xl bg-slate-200 animate-pulse"
            />
          ))}
        </div>
        <div className="h-64 rounded-3xl bg-slate-200 animate-pulse" />
      </div>
    </div>
  );

  if (loading) {
    return <AppSkeleton />
  }

  return <AppRoutes />
}

export default App
