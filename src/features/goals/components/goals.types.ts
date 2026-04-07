import type { ReactNode } from "react";

export type GoalStatus = "In Progress" | "Completed" | "Not Started";

export type Goal = {
  id: string;
  title: string;
  saved: number;
  target: number;
  deadline: string;
  status: GoalStatus;
  icon: ReactNode;
};
