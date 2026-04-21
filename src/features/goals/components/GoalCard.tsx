import type { ReactNode } from "react";
import { CalendarDays } from "lucide-react";
import { Card, Text } from "../../../shared/ui";
import type { Goal } from "../types/goal.types";

type GoalCardProps = {
  goal: Goal;
  variant?: "default" | "compact" | "dashboard";
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "EGP",
  maximumFractionDigits: 0,
});

function formatCurrency(value: number): string {
  return currencyFormatter.format(value).replace(/\s+/g, " ");
}

function formatDuration(value: number): string {
  return `${value.toFixed(2)} mo`;
}

function clampProgress(value: number): number {
  return Math.max(0, Math.min(value, 100));
}

function formatProgress(value: number): string {
  return `${Math.round(value)}%`;
}

function getTargetDateLabel(goal: Goal): string | null {
  if (!Number.isFinite(goal.durationValue) || goal.durationValue <= 0) {
    return null;
  }

  const targetDate = new Date();
  const wholeMonths = Math.round(goal.durationValue);
  targetDate.setMonth(targetDate.getMonth() + wholeMonths);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(targetDate);
}

export function getGoalIcon(title: string): ReactNode {
  const normalizedTitle = title.trim().toLowerCase();

  let icon = "🎯";

  if (normalizedTitle.includes("car")) {
    icon = "🚗";
  } else if (
    normalizedTitle.includes("iphone") ||
    normalizedTitle.includes("ipad") ||
    normalizedTitle.includes("laptop")
  ) {
    icon = "📱";
  } else if (
    normalizedTitle.includes("travel") ||
    normalizedTitle.includes("trip")
  ) {
    icon = "✈️";
  } else if (normalizedTitle.includes("house")) {
    icon = "🏠";
  }

  return <span aria-hidden="true">{icon}</span>;
}

function GoalCard({ goal, variant = "default" }: GoalCardProps) {
  const isDashboard = variant === "dashboard";
  const isSmall = variant === "dashboard" || variant === "compact";
  const title = goal.title.trim();
  const description = goal.description.trim() || "No description provided";
  const monthlySaving = formatCurrency(goal.monthlyAmount);
  const targetAmount = formatCurrency(goal.targetAmount);
  const progressValue = clampProgress((goal.monthlyAmount / goal.targetAmount) * 100);
  const progressLabel = formatProgress(progressValue);
  const durationLabel = formatDuration(goal.durationValue);
  const targetDateLabel = getTargetDateLabel(goal);
  const icon = getGoalIcon(title);
  const titleVariant = isSmall ? "body" : "subtitle";
  const statsTextVariant = isSmall ? "body" : "subtitle";
  const targetDatePrefix = isSmall ? "" : "Target date: ";
  const showTargetDate = Boolean(targetDateLabel) && !isDashboard;
  const showStatLabels = !isDashboard;

  return (
    <Card
      variant="outline"
      padding="sm"
      className={`rounded-2xl border-border bg-surface shadow-sm ${
        isSmall ? "p-2" : "p-3"
      }`}
    >
      <div className={isDashboard ? "space-y-1.5" : isSmall ? "space-y-2" : "space-y-3"}>
        <div
          className={
            isDashboard
              ? "flex items-center justify-between gap-1.5"
              : `flex flex-col md:flex-row md:items-start md:justify-between ${
                  variant === "compact" ? "gap-2" : "gap-3"
                }`
          }
        >
          <div
            className={`flex min-w-0 items-start ${
              isDashboard ? "gap-1.5" : variant === "compact" ? "gap-2" : "gap-3"
            }`}
          >
            <span
              className={`flex shrink-0 items-center justify-center rounded-full bg-primary/10 leading-none text-primary ${
                isDashboard
                  ? "h-8 w-8 text-[1rem]"
                  : variant === "compact"
                    ? "h-9 w-9 text-[1.1rem]"
                    : "h-11 w-11 text-[1.35rem]"
              }`}
            >
              {icon}
            </span>
            <div className="min-w-0 ms-1 mt-1">
              <Text
                as="h3"
                variant={titleVariant}
                weight="bold"
                className={`truncate text-text-primary ${
                  isDashboard ? "text-sm" : variant === "compact" ? "text-base" : "text-text-primary"
                }`}
              >
                {title}
              </Text>
              <Text
                variant="body"
                className={isSmall ? "hidden" : "line-clamp-1 text-text-secondary"}
              >
                {description}
              </Text>
            </div>
          </div>

          <div
            className={`flex flex-col items-start md:items-end ${
              isDashboard ? "gap-0" : variant === "compact" ? "gap-1" : "gap-1.5"
            }`}
          >
            <div
              className={`inline-flex items-center rounded-full bg-primary/10 font-semibold text-primary ${
                isDashboard
                  ? "gap-1 px-2 py-0.5 text-[11px]"
                  : variant === "compact"
                    ? "gap-1.5 px-2.5 py-1 text-xs"
                    : "gap-2 px-3 py-1.5 text-sm"
              }`}
            >
              <span>{durationLabel}</span>
              <CalendarDays size={isDashboard ? 12 : variant === "compact" ? 14 : 16} />
            </div>
            {showTargetDate && (
              <div
                className={`inline-flex items-center gap-1.5 text-text-secondary ${
                  isSmall ? "text-xs" : "text-sm"
                }`}
              >
                <CalendarDays size={variant === "compact" ? 12 : 13} className="text-primary" />
                <span>{targetDatePrefix}{targetDateLabel}</span>
              </div>
            )}
          </div>
        </div>

        <div
          className={
            isDashboard
              ? "flex items-center gap-1.5 text-xs"
              : variant === "compact"
                ? "flex flex-wrap items-center gap-2 text-xs"
                : "flex flex-wrap items-center gap-3 text-sm"
          }
        >
          <div className="flex items-baseline gap-1.5">
            <Text as="p" variant={statsTextVariant} weight="bold" className="text-primary">
              {monthlySaving}
            </Text>
            {showStatLabels && (
              <Text variant="caption" className="text-text-secondary">
                Saved / mo
              </Text>
            )}
          </div>

          <span className="text-border">|</span>

          <div className="flex items-baseline gap-1.5">
            <Text as="p" variant={statsTextVariant} weight="bold" className="text-text-primary">
              {targetAmount}
            </Text>
            {showStatLabels && (
              <Text variant="caption" className="text-text-secondary">
                Target amount
              </Text>
            )}
          </div>

          <span className="text-border">|</span>

          <div className="flex items-baseline gap-1.5">
            <Text as="p" variant={statsTextVariant} weight="bold" className="text-primary">
              {progressLabel}
            </Text>
            {showStatLabels && (
              <Text variant="caption" className="text-text-secondary">
                Completed
              </Text>
            )}
          </div>
        </div>

        <div
          className={`overflow-hidden rounded-full bg-slate-100 ${
            isDashboard ? "h-1.5 mt-1" : variant === "compact" ? "h-2 mt-2" : "h-2 mt-1"
          }`}
        >
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-300"
            style={{ width: `${progressValue}%` }}
          />
        </div>
      </div>
    </Card>
  );
}

export default GoalCard;
