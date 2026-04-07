import { Sparkles, TrendingDown, TrendingUp } from "lucide-react";
import type { TransactionsInsights } from "../../../application/transactions/transactions.selectors";
import { PanelCard, PanelHeader, Text } from "../../../shared/ui";

type AIInsightsCardProps = {
  insights: TransactionsInsights;
};

function AIInsightsCard({ insights }: AIInsightsCardProps) {
  const changeLabel = `${Math.abs(insights.spendingChange).toFixed(0)}%`;

  return (
    <PanelCard>
      <PanelHeader
        title="AI Insights"
        right={<Sparkles size={18} className="text-primary" />}
      />

      <div className="space-y-4 text-sm text-gray-700">
        <div className="flex items-start gap-3">
          <span
            className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full ${
              insights.isSpendingUp ? "bg-primary/10 text-primary" : "bg-primary/10 text-primary"
            }`}
          >
            {insights.isSpendingUp ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
          </span>
          <div>
            <Text variant="body" weight="bold" className="text-gray-900">
              You spent {changeLabel} {insights.isSpendingUp ? "more" : "less"} this month
            </Text>
            <Text variant="body" className="text-gray-500">
              Compared to last month.
            </Text>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            #
          </span>
          <div>
            <Text variant="body" weight="bold" className="text-gray-900">
              Top category
            </Text>
            <Text variant="body" className="text-gray-500">
              {insights.topCategory}
            </Text>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Sparkles size={16} />
          </span>
          <div>
            <Text variant="body" weight="bold" className="text-gray-900">
              Tip
            </Text>
            <Text variant="body" className="text-gray-500">
              {insights.tip}
            </Text>
          </div>
        </div>
      </div>

      <div className="mt-5 h-24 rounded-lg bg-gray-100" aria-hidden="true" />
    </PanelCard>
  );
}

export default AIInsightsCard;
