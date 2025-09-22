import { useState } from "react";
import DashboardTop from "./DashboardTop/DashboardTop";
import SideNav from "../SideNav/SideNav";
import BudgetPieChart from "./BudgetDoughnutChart";
import MoneyFlowChart from "./MoneyFlowChart";
import RecentTransactions from "./RecentTransactions";
import SavingGoals from "./SavingGoals";
import AI from "../../Support/AI";

function Dashboard() {
  const [activeComponent, setActiveComponent] = useState<string>("Dashboard");

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "ChatAgent":
        return <AI />;
      default:
        return (
          <div className="Charts mt-[-1.5rem]">
            <div className="flex gap-4">
              <MoneyFlowChart />
              <BudgetPieChart />
            </div>
            <div className="flex gap-4 mt-4">
              <RecentTransactions />
              <SavingGoals />
            </div>
          </div>
        );
    }
  };

  return (
  <section id="Admin" className="h-screen flex">
    <SideNav
      activeComponent={activeComponent}
      setActiveComponent={setActiveComponent}
    />

    <div className="flex-1 flex flex-col ml-60 me-8 !ms-[17rem]">
      <DashboardTop />
      <div className="p-4">{renderActiveComponent()}</div>
    </div>
  </section>
);

}

export default Dashboard;
