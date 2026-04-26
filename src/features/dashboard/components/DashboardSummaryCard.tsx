import { MoveUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { Card, Text } from "../../../shared/ui";

type DashboardSummaryCardProps = {
  title: string;
  icon: ReactNode;
  value: number | string;
  changeLabel: ReactNode;
  isIncrease: boolean;
  showArrow?: boolean;
  onArrowClick?: () => void;
};

function DashboardSummaryCard({
  title,
  icon,
  value,
  changeLabel,
  isIncrease,
  showArrow = false,
  onArrowClick,
}: DashboardSummaryCardProps) {
  return (
    <Card variant="default" padding="md" className="pt-4 rounded-4xl text-black">
      <div className="flex justify-between">
        <Text as="h6" variant="subtitle" weight="medium" className="text-black mb-4">
          {title}
        </Text>
        {showArrow && (
          <button
            type="button"
            onClick={onArrowClick}
            className="rounded-full border-gray-300 justify-items-center content-center me-[-1rem] mt-[-.8rem] solid border-1 h-10 w-10 cursor-pointer hover:bg-primary hover:text-white duration-150"
            aria-label={`Open ${title} transaction modal`}
          >
            <MoveUpRight />
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 mb-2">
        {icon}
        <Text as="span" variant="title" weight="bold" className="text-2xl">
          {value}
        </Text>
      </div>

      <div
        className={`flex items-center gap-2 text-sm font-medium ${
          isIncrease ? "text-green-600" : "text-red-600"
        }`}
      >
        {changeLabel}
      </div>
    </Card>
  );
}

export default DashboardSummaryCard;
