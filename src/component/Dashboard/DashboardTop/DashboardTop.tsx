import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faChartColumn,
  faBell,
  faCircle,
  faArrowUp,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import { MoveUpRight } from 'lucide-react';
import Header from "./Header";

const DashboardTop = () => {
  const dashboardItems = [
    {
      titleKey: "Total balance",
      icon: <FontAwesomeIcon icon={faCircle} className="text-green-500" />,
      value: 5000,
      pev: "12.5% vs last month",
      isIncrease: true,
    },
    {
      titleKey: "Income",
      icon: <FontAwesomeIcon icon={faClock} className="text-blue-500" />,
      value: 3500,
      pev: "8% vs last month",
      isIncrease: true,
      arrow: true
    },
    {
      titleKey: "Expenses",
      icon: <FontAwesomeIcon icon={faChartColumn} className="text-purple-500" />,
      value: 2200,
      pev: "5% vs last month",
      isIncrease: false,
      arrow: true
    },
    {
      titleKey: "Total savings",
      icon: <FontAwesomeIcon icon={faBell} className="text-yellow-500" />,
      value: 1800,
      pev: "3.2% vs last month",
      isIncrease: true,
    },
  ];

  return (
    <>
      <Header />
      <section id="DashboardTop" className="container mx-auto mt-5 px-3 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {dashboardItems.map((item, index) => (
            <div
              key={index}
              className="p-6 pt-4 rounded-4xl box text-black"
            >
              <div className="flex justify-between">
                <h6 className="text-black text-lg mb-4">{item.titleKey}</h6>
                {
                  item.arrow &&
                  <div className="rounded-full border-gray-300 justify-items-center content-center me-[-1rem] mt-[-.8rem] solid border-1 h-10 w-10 cursor-pointer hover:bg-primary hover:text-white duration-150">
                    <MoveUpRight />
                  </div>
                }
              </div>

              <div className="flex items-center gap-3 mb-2">
                {item.icon}
                <span className="text-2xl font-bold">{item.value}</span>
              </div>

              <div
                className={`flex items-center gap-2 text-sm font-medium ${item.isIncrease ? "text-green-600" : "text-red-600"
                  }`}
              >
                <FontAwesomeIcon
                  icon={item.isIncrease ? faArrowUp : faArrowDown}
                />
                <span>{item.pev}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>

  );
};

export default DashboardTop;
