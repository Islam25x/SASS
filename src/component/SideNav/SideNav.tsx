import { Link } from "react-router-dom";

interface AdminNavProps {
  setActiveComponent: (component: string) => void;
  activeComponent: string;
}

function SideNav({ setActiveComponent, activeComponent }: AdminNavProps) {
  return (
    <aside className="fixed top-0 left-0 w-60 h-screen border-r border-gray-700 z-[1030] bg-white">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 px-4">
        <img src="imgs\logo.png" alt="Logo" className=" w-12 h-12 object-cover mt-4" />
        <h2 className="hidden lg:block mt-2 font-normal text-lg text-black">
          finexa
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col mb-5">
        <p
          className={`flex items-center gap-3 px-3 py-3 cursor-pointer transition-colors ${activeComponent === "Dashboard"
            ? "bg-blue-600 text-white"
            : "text-black hover:bg-blue-600 hover:text-white"
            }`}
          onClick={() => setActiveComponent("Dashboard")}
        >
          <i className="fa-solid fa-chart-simple ms-1"></i>
          <span className="hidden lg:block">Dashboard</span>
        </p>
        <p
          className={`flex items-center gap-3 px-3 py-3 cursor-pointer transition-colors ${activeComponent === "Transactions"
            ? "bg-blue-600 text-white"
            : "text-black hover:bg-blue-600 hover:text-white"
            }`}
          onClick={() => setActiveComponent("Transactions")}
        >
          <i className="fa-solid fa-user ms-1"></i>
          <span className="hidden lg:block">Transactions</span>
        </p>
        <p
          className={`flex items-center gap-3 px-3 py-3 cursor-pointer transition-colors ${activeComponent === "Wallet"
            ? "bg-blue-600 text-white"
            : "text-black hover:bg-blue-600 hover:text-white"
            }`}
          onClick={() => setActiveComponent("Wallet")}
        >
          <i className="fa-solid fa-user ms-1"></i>
          <span className="hidden lg:block">Wallet</span>
        </p>
        <p
          className={`flex items-center gap-3 px-3 py-3 cursor-pointer transition-colors ${activeComponent === "Analytics"
            ? "bg-blue-600 text-white"
            : "text-black hover:bg-blue-600 hover:text-white"
            }`}
          onClick={() => setActiveComponent("Analytics")}
        >
          <i className="fa-solid fa-user ms-1"></i>
          <span className="hidden lg:block">Analytics</span>
        </p>
        <p
          className={`flex items-center gap-3 px-3 py-3 cursor-pointer transition-colors ${activeComponent === "Transverse"
            ? "bg-blue-600 text-white"
            : "text-black hover:bg-blue-600 hover:text-white"
            }`}
          onClick={() => setActiveComponent("Transverse")}
        >
          <i className="fa-solid fa-user ms-1"></i>
          <span className="hidden lg:block">Transverse</span>
        </p>
        <p
          className={`flex items-center gap-3 px-3 py-3 cursor-pointer transition-colors ${activeComponent === "ChatAgent"
            ? "bg-blue-600 text-white"
            : "text-black hover:bg-blue-600 hover:text-white"
            }`}
          onClick={() => setActiveComponent("ChatAgent")}
        >
          <i className="fa-solid fa-user ms-1"></i>
          <span className="hidden lg:block">Chat Agent</span>
        </p>
        <Link to={"/Profile"}>
          <p
            className={`flex items-center gap-3 px-3 py-3 cursor-pointer transition-colors ${activeComponent === "Setting"
              ? "bg-blue-600 text-white"
              : "text-black hover:bg-blue-600 hover:text-white"
              }`}
            onClick={() => setActiveComponent("Setting")}
          >
            <i className="fa-solid fa-building ms-1"></i>
            <span className="hidden lg:block">Setting</span>
          </p>
        </Link>
      </nav>

      {/* Bottom Logout */}
      <div className="absolute bottom-12 w-full grid">
        <Link
          to="/support"
          className="flex items-center gap-2 px-4 py-3 text-black hover:bg-blue-600 hover:text-white transition-colors"
        >
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
          <span className="hidden lg:inline">Help</span>
        </Link>
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-3 text-black hover:bg-blue-600 hover:text-white transition-colors"
        >
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
          <span className="hidden lg:inline">Log out</span>
        </Link>
      </div>
    </aside>
  );
}

export default SideNav;
