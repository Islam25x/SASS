import { Link, useNavigate } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Receipt,
  BarChart3,
  Layers,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";
import logoSrc from "../../../assets/logo.png";
import mobileLogoSrc from "../../../assets/mobile view logo.png";
import { Button, Text, cn } from "../../../shared/ui";
import { useAuth } from "../../../shared/auth/AuthContext";

interface AdminNavProps {
  setActiveComponent: (component: string) => void;
  activeComponent: string;
}

function SideNav({ setActiveComponent, activeComponent }: AdminNavProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const navItems: { name: string; icon: LucideIcon; link?: string }[] = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Transactions", icon: Receipt },
    { name: "Goals", icon: BarChart3 },
    { name: "Setting", icon: Settings },
  ];

  const bottomNav: {
    name: string;
    icon: LucideIcon;
    link?: string;
    onClick?: () => void;
  }[] = [
    { name: "Help", icon: HelpCircle, link: "/support" },
    {
      name: "Log out",
      icon: LogOut,
      onClick: () => {
        logout();
        navigate("/welcome", { replace: true });
      },
    },
  ];

  const renderNavItem = (
    name: string,
    Icon: LucideIcon,
    link?: string,
    onClick?: () => void,
  ) => {
    const isActive = activeComponent === name;
    const baseClasses =
      "flex items-center justify-center lg:justify-start gap-3 px-3 py-3 cursor-pointer w-full lg:w-[85%] h-12 rounded-2xl transition-colors duration-200 lg:ms-4 font-normal";
    const activeClasses = "!bg-primary-600 text-white";
    const hoverClasses = "hover:bg-primary-600 hover:text-white";
    const classes = cn(
      baseClasses,
      isActive ? activeClasses : cn("text-black", hoverClasses)
    );

    const content = (
      <>
        <Icon size={20} className="shrink-0" />
        <Text as="span" variant="body" className="hidden lg:block">
          {name}
        </Text>
      </>
    );

    return link ? (
      <Link
        key={name}
        to={link}
        onClick={() => {
          setActiveComponent(name);
          onClick?.();
        }}
        className={classes}
      >
        {content}
      </Link>
    ) : (
      <Button
        key={name}
        onClick={() => {
          setActiveComponent(name);
          onClick?.();
        }}
        className={classes}
        variant="ghost"
        size="md"
      >
        {content}
      </Button>
    );
  };

  return (
    <aside className="fixed top-0 left-0 w-16 md:w-20 lg:w-60 h-screen z-[1030] bg-customBg flex flex-col items-center lg:items-start shadow-md">
      {/* 🔹 اللوجو */}
      <div
        className="mb-5 ms-3 w-10 lg:w-[60%] mt-4 flex flex-col items-center lg:items-start"
        data-aos="zoom-in"
        data-aos-once="true"
      >
        <img src={logoSrc} alt="Finexa" className="hidden w-full object-cover md:block" />
        <img
          src={mobileLogoSrc}
          alt="Finexa mobile"
          className="block w-full object-contain md:hidden"
        />
      </div>

      {/* 🔹 القائمة الرئيسية */}
      <nav
        className="flex flex-col mb-5 space-y-2 w-full items-center lg:items-start"
        data-aos="fade-right"
        data-aos-once="true"
      >
        {navItems.map(({ name, icon, link }) =>
          renderNavItem(name, icon, link)
        )}
      </nav>

      {/* 🔹 الروابط السفلية */}
      <div
        className="absolute bottom-12 w-full flex flex-col items-center lg:items-start space-y-2"
        data-aos="fade-up"
        data-aos-once="true"
      >
        {bottomNav.map(({ name, icon, link, onClick }) =>
          renderNavItem(name, icon, link, onClick)
        )}
      </div>
    </aside>
  );
}

export default SideNav;
