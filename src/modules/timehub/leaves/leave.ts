export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Leave {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  duration: number;
  status: LeaveStatus;
};

export interface LeaveBalance {
  id: string;
  title: string;
  used: number;
  total: number;
}