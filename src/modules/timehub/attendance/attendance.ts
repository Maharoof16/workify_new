export type LogStatus = "PRESENT" | "LATE" | "ABSENT";

export interface DailyLog {
  id: string;
  date: string;
  punchIn?: string;
  punchOut?: string;
  breakDuration?: number;
  workedDuration?: number;
  status: LogStatus;
}

export interface AttendanceMetrics {
  consistency: number;
  presentDays: number;
  lateLogins: number;
  totalDuration: number;
  extraDuration: number;
  shortDuration: number;
  regularizationPending: number;
}

export interface AttendanceResponse {
  attendanceMetrics: AttendanceMetrics;
  attendance: DailyLog[];
}
