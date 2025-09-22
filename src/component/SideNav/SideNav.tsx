import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Receipt,
  Wallet,
  BarChart3,
  Layers,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";

interface AdminNavProps {
  setActiveComponent: (component: string) => void;
  activeComponent: string;
}

function SideNav({ setActiveComponent, activeComponent }: AdminNavProps) {
  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Transactions", icon: Receipt },
    { name: "Wallet", icon: Wallet },
    { name: "Analytics", icon: BarChart3 },
    { name: "Transverse", icon: Layers },
    { name: "Setting", icon: Settings, link: "/Profile" },
  ];

  const bottomNav = [
    { name: "Help", icon: HelpCircle, link: "/support" },
    { name: "Log out", icon: LogOut, link: "/" },
  ];

  const renderNavItem = (
    name: string,
    Icon: LucideIcon,
    link?: string
  ) => {
    const isActive = activeComponent === name;
    const classes = `flex items-center justify-center ms-3 lg:justify-start gap-3 
      px-3 py-3 cursor-pointer 
      w-full lg:w-[85%] h-12 
      rounded-2xl transition-colors
      ${
        isActive
          ? "bg-primary-600 text-white"
          : "text-black hover:bg-primary-600 hover:text-white"
      }`;

    const content = (
      <>
        <Icon size={20} className="shrink-0" />
        <span className="hidden lg:block">{name}</span>
      </>
    );

    return link ? (
      <Link
        key={name}
        to={link}
        onClick={() => setActiveComponent(name)}
        className={classes}
      >
        {content}
      </Link>
    ) : (
      <button
        key={name}
        onClick={() => setActiveComponent(name)}
        className={classes}
      >
        {content}
      </button>
    );
  };

  return (
    <aside className="fixed top-0 left-0 w-16 lg:w-60 h-screen z-[1030] bg-customBg flex flex-col items-center lg:items-start">
      {/* Logo */}
      <div className="mb-5 ms-3 w-10 lg:w-[60%] mt-4" data-aos="zoom-in" data-aos-once="true">
        <img
          src="/src/assets/black logo.png"
          alt="Logo"
          className="w-full object-cover"
        />
      </div>

      {/* Navigation */}
      <nav
        className="flex flex-col mb-5 space-y-2 w-full items-center lg:items-start"
        data-aos="fade-right"
        data-aos-once="true"
      >
        {navItems.map(({ name, icon, link }) =>
          renderNavItem(name, icon, link)
        )}
      </nav>

      {/* Bottom Navigation */}
      <div
        className="absolute bottom-12 w-full flex flex-col items-center lg:items-start space-y-2"
        data-aos="fade-up"
        data-aos-once="true"
      >
        {bottomNav.map(({ name, icon, link }) =>
          renderNavItem(name, icon, link)
        )}
      </div>
    </aside>
  );
}

export default SideNav;
