import { useState } from "react";
import DashboardTop from "./DashboardTop";
import SideNav from "./SideNav";
import BudgetPieChart from "../../goals/charts/BudgetDoughnutChart";
import MoneyFlowChart from "../charts/MoneyFlowChart";
import RecentTransactions from "../../transactions/components/RecentTransactions";
import SavingGoals from "../../goals/components/SavingGoals";
import AI from "../../ai/components/AIPanel";
import ChatIcon from "../../ai/components/ChatIcon";

function DashboardView() {
  const [activeComponent, setActiveComponent] = useState<string>("Dashboard");

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "ChatAgent":
        return <AI />;
      default:
        return (
          <div className="Charts mt-[-1.5rem] space-y-6 px-2 md:px-0">
            {/* 🔹 الصف الأول */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="lg:w-[65%] w-full">
                <MoneyFlowChart />
              </div>
              <div className="lg:w-[35%] w-full">
                <BudgetPieChart />
              </div>
            </div>

            {/* 🔹 الصف الثاني */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 basis-[65%] min-w-0">
                <RecentTransactions />
              </div>
              <div className="flex-1 basis-[35%] min-w-0">
                <SavingGoals />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <section
      id="Admin"
      className="min-h-screen flex bg-gray-50 overflow-x-hidden overflow-y-auto relative"
    >
      {/* 🧭 الشريط الجانبي */}
      <SideNav
        activeComponent={activeComponent}
        setActiveComponent={setActiveComponent}
      />

      {/* 📊 المحتوى الرئيسي */}
      <div className="flex-1 flex flex-col lg:ml-60 md:ml-20 sm:ml-16 transition-all duration-300">
        <DashboardTop />
        <div className="p-4">{renderActiveComponent()}</div>
      </div>
      <div className="fixed bottom-8 right-8 z-1111">
        <ChatIcon />
      </div>
    </section>
  );
}

export default DashboardView;
