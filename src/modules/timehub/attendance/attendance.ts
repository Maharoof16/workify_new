import { Shift } from "@/modules/config/shifts/shift";

export type LogStatus = "PRESENT" | "LATE" | "ABSENT";

export type Action = "CHECK_IN" | "ON-BREAK" | "CHECK_OUT";
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

export interface Break {
  id: string;
  attendance_id: string;
  start_date: string;
  end_date: string;
  break_start_longitude: string;
  break_start_latitude: string;
  break_end_longitude: string;
  break_end_latitude: string;
  createdAt: string;
  break_duration: string;
}
export interface Attendance {
  attendance: {
    id: string;
    attendance_date: string;
    start_date: string;
    end_date: string;
    check_in_latitude: string;
    check_in_longitude: string;
    check_out_latitude: string;
    check_out_longitude: string;
    action: string;
    shift_id: string;
    breaks: Break[];
    shift: Shift;
    total_duration: string;
    work_duration: number;
    total_break_duration: number;
  };
}

export interface CheckInPayload {
  latitude: string;
  longitude: string;
  start_date: string;
}

export interface CheckOutPayload {
  end_date: string;
  check_out_latitude: string;
  check_out_longitude: string;
}

export interface BreakPayload {
  date: string;
  flag: "start" | "end";
  break_start_latitude?: string;
  break_start_longitude?: string;
  break_end_latitude?: string;
  break_end_longitude?: string;
}
