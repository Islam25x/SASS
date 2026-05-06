import { useEffect, useState } from "react";
import DashboardTop from "./DashboardTop";
import SideNav from "./SideNav";
import BudgetPieChart from "../charts/BudgetDoughnutChart";
import MoneyFlowChart from "../charts/MoneyFlowChart";
import RecentTransactions from "../../transactions/components/RecentTransactions";
import SavingGoals from "../../goals/components/SavingGoals";
import AI from "../../ai/components/AIPanel";
import ChatIcon from "../../ai/components/ChatIcon";
import ProfilePanel from "../../user/components/ProfilePanel";
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
            <div className="flex flex-col gap-4 lg:flex-row">
              <div className="w-full lg:w-[65%]">
                <MoneyFlowChart />
              </div>

              <div className="w-full lg:w-[35%]">
                <BudgetPieChart />
              </div>
            </div>

            {/* 🔹 الصف الثاني */}
            <div className="flex flex-col gap-4 lg:flex-row">
              <div className="min-w-0 flex-1 basis-[65%]">
                <RecentTransactions />
              </div>

              <div className="min-w-0 flex-1 basis-[35%]">
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
      className="relative flex min-h-screen overflow-x-hidden overflow-y-auto bg-gray-50"
    >
      {/* 🧭 الشريط الجانبي */}
      <SideNav
        activeComponent={activeComponent}
        setActiveComponent={setActiveComponent}
      />

      {/* 📊 المحتوى الرئيسي */}
      <div className="flex flex-1 flex-col transition-all duration-300 sm:ml-16 md:ml-20 lg:ml-60">
        {activeComponent !== "Setting" &&
          activeComponent !== "Transactions" &&
          activeComponent !== "Goals" && (
            <DashboardTop />
          )}

        <div className="p-4">
          {renderActiveComponent()}
        </div>
      </div>

      <div className="fixed bottom-8 right-8 z-[1111]">
        <ChatIcon />
      </div>
    </section>
  );
}

export default DashboardView;