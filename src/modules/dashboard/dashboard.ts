import { LucideIcon } from "lucide-react";
import { StaticImageData } from "next/image";

export type FocusAction = "leave" | "priority" | "meeting";
export type TActivityType = "leave" | "payslip" | "timesheet";

export type TActivityItem = {
  title: string;
  description: string;
  icon: LucideIcon;
  type: TActivityType;
};
export interface TFocusItem {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string | StaticImageData;
  actions: FocusAction;
}

export type EmployeeFeed = {
  id: string;
  title: string;
  tag?: string;
  description: string;
  imageUrl: string | StaticImageData;
  createdAt: string;
};

export type PerformanceItem = {
  id: string;
  title: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
};

export type PerformanceCard = {
  id: string;
  type: "TRAINING" | "CERTIFICATION";
  title: string;
  completedModules: number;
  totalModules: number;
  imageUrl: string | StaticImageData;
  items: PerformanceItem[];
};

export type PerformanceDevelopmentProps = {
  data: PerformanceCard[];
};