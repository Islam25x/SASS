import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faChartColumn,
  faBell,
  faCircle,
  faArrowUp,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import DashboardSummaryCard from "./DashboardSummaryCard";
import { PageHeader, Text } from "../../../shared/ui";
import { useUserProfile } from "../../../hooks/useUserProfile";
import { getUserDisplayName } from "../../../features/user/application/user.selectors";

const DashboardTop = () => {
  const { data: profile } = useUserProfile();
  const displayName = profile ? getUserDisplayName(profile) : "Finexa User";

  const dashboardItems = [
    {
      titleKey: "Available Balance",
      icon: <FontAwesomeIcon icon={faCircle} className="text-green-500" />,
      value: 5000,
      pev: "12.5% vs last month",
      isIncrease: true,
    },
    {
      titleKey: "Income",
      icon: <FontAwesomeIcon icon={faClock} className="text-primary" />,
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
      titleKey: "savings for this month",
      icon: <FontAwesomeIcon icon={faBell} className="text-yellow-500" />,
      value: 1800,
      pev: "3.2% vs last month",
      isIncrease: true,
      arrow: true
    },
  ];

  return (
    <section id="DashboardTop" className="container mt-5 px-3 pb-8 space-y-5">
      <PageHeader
        title={`Welcome back, ${displayName}`}
        subtitle="Welcome to your dashboard"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardItems.map((item, index) => (
          <DashboardSummaryCard
            key={index}
            title={item.titleKey}
            icon={item.icon}
            value={item.value}
            changeLabel={
              <>
                <FontAwesomeIcon
                  icon={item.isIncrease ? faArrowUp : faArrowDown}
                />
                <Text as="span" variant="body">
                  {item.pev}
                </Text>
              </>
            }
            isIncrease={item.isIncrease}
            showArrow={item.arrow}
          />
        ))}
      </div>
    </section>
  );
};

export default DashboardTop;

