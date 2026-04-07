import { useEffect, useState } from "react";
import DashboardTop from "./DashboardTop";
import SideNav from "./SideNav";
import BudgetPieChart from "../../goals/charts/BudgetDoughnutChart";
import MoneyFlowChart from "../charts/MoneyFlowChart";
import RecentTransactions from "../../transactions/components/RecentTransactions";
import SavingGoals from "../../goals/components/SavingGoals";
import AI from "../../ai/components/AIPanel";
import ChatIcon from "../../ai/components/ChatIcon";
import ProfilePanel from "../../../routes/pages/ProfilePanel";
import TransactionsPage from "../../transactions/components/TransactionsPage";
import GoalsPage from "../../goals/components/GoalsPage";

type DashboardViewProps = {
  initialActiveComponent?: string;
};

function DashboardView({
  initialActiveComponent = "Dashboard",
}: DashboardViewProps) {
  const [activeComponent, setActiveComponent] = useState<string>(
    initialActiveComponent
  );
  const isSettingView = activeComponent === "Setting";

  useEffect(() => {
    if (!isSettingView) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isSettingView]);

  useEffect(() => {
    setActiveComponent(initialActiveComponent);
  }, [initialActiveComponent]);

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "ChatAgent":
        return <AI />;
      case "Setting":
        return <ProfilePanel />;
      case "Transactions":
        return <TransactionsPage />;
      case "Goals":
        return <GoalsPage />;
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
      className={`h-screen flex bg-gray-50 overflow-x-hidden ${
        isSettingView ? "overflow-hidden" : "overflow-y-auto"
      } relative`}
    >
      {/* 🧭 الشريط الجانبي */}
      <SideNav
        activeComponent={activeComponent}
        setActiveComponent={setActiveComponent}
      />

      {/* 📊 المحتوى الرئيسي */}
      <div className="flex-1 flex flex-col lg:ml-60 md:ml-20 sm:ml-16 transition-all duration-300">
        {activeComponent !== "Setting" &&
          activeComponent !== "Transactions" &&
          activeComponent !== "Goals" && (
          <DashboardTop />
        )}
        <div className={isSettingView ? "p-4 overflow-hidden" : "p-4"}>
          {renderActiveComponent()}
        </div>
      </div>
      <div className="fixed bottom-8 right-8 z-1111">
        <ChatIcon />
      </div>
    </section>
  );
}

export default DashboardView;
