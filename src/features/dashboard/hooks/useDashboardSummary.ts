import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { ApiError } from "../../../infrastructure/api/api-error";
import { useAuth } from "../../../shared/auth/AuthContext";
import { useDateRange } from "../../../shared/ui";
import { getDashboardApi } from "../api/get-dashboard.api";

type DashboardSummary = {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  totalSavings: number;
  incomeChangePercentage: number;
  expenseChangePercentage: number;
  savingsChangePercentage: number;
};

export const DASHBOARD_SUMMARY_QUERY_KEY = ["dashboard"] as const;

type DashboardApiResponse = {
  totalBalance?: unknown;
  totalIncome?: unknown;
  totalExpense?: unknown;
  totalSavings?: unknown;
  incomeChangePercentage?: unknown;
  expenseChangePercentage?: unknown;
  savingsChangePercentage?: unknown;
};

function toSafeNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function toSafePercentage(value: unknown): number {
  if (typeof value === "object" && value !== null && "value" in value) {
    return toSafeNumber(value.value);
  }

  return toSafeNumber(value);
}

function mapDashboardSummary(response: unknown): DashboardSummary {
  const payload = (response ?? {}) as DashboardApiResponse;

  return {
    totalBalance: toSafeNumber(payload.totalBalance),
    totalIncome: toSafeNumber(payload.totalIncome),
    totalExpense: toSafeNumber(payload.totalExpense),
    totalSavings: toSafeNumber(payload.totalSavings),
    incomeChangePercentage: toSafePercentage(payload.incomeChangePercentage),
    expenseChangePercentage: toSafePercentage(payload.expenseChangePercentage),
    savingsChangePercentage: toSafePercentage(payload.savingsChangePercentage),
  };
}

export function useDashboardSummary(): UseQueryResult<DashboardSummary, ApiError> {
  const { isAuthenticated } = useAuth();
  const { selectedRange } = useDateRange();

  return useQuery<DashboardSummary, ApiError>({
    queryKey: [...DASHBOARD_SUMMARY_QUERY_KEY, selectedRange],
    queryFn: async ({ signal }) => {
      const response = await getDashboardApi(selectedRange, {
        signal,
      });

      return mapDashboardSummary(response);
    },
    staleTime: 30_000,
    enabled: isAuthenticated,
  });
}
