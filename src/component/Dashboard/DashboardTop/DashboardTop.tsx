import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faChartColumn,
  faBell,
  faCircle,
  faArrowUp,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import Header from "./header";

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
    },
    {
      titleKey: "Expenses",
      icon: <FontAwesomeIcon icon={faChartColumn} className="text-purple-500" />,
      value: 2200,
      pev: "5% vs last month",
      isIncrease: false,
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
      <section id="DashboardTop" className="container mx-auto mt-5 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {dashboardItems.map((item, index) => (
            <div
              key={index}
              className="p-6 pt-4 rounded-lg border border-gray-400 text-black"
            >
              <h6 className="text-black text-lg mb-4">{item.titleKey}</h6>

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
