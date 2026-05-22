import axiosInstance from "@/lib/axios-instance";

import { mockApi } from "@/lib/mock-api";

import {
  Attendance,
  AttendanceResponse,
  BreakPayload,
  CheckInPayload,
  CheckOutPayload,
} from "./attendance";

import { Pagination } from "@/modules/global";

import {
  attendanceData,
  calculateWorkedDuration,
  currentAttendanceMock,
} from "./attendance.mock";

const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

export class AttendanceService {
  static async getAll(
    periodStart?: string,
    periodEnd?: string,
    page = 1,
    limit = 10,
    signal?: AbortSignal,
  ): Promise<{
    data: AttendanceResponse;
    pagination: Pagination;
  }> {
    if (USE_MOCK_API) {
      const response = await mockApi({
        attendance: attendanceData,

        pagination: {
          total: attendanceData.attendance.length,
          totalPages: 1,
          page,
          limit,
        },
      });

      return {
        data: response.data.data.attendance,

        pagination: response.data.data.pagination,
      };
    }

    const response = await axiosInstance.get(
      `/timehub/attendance?periodStart=${periodStart}&periodEnd=${periodEnd}&page=${page}&limit=${limit}`,
      { signal },
    );

    return {
      data: response.data.data.attendance,

      pagination: response.data.data.pagination,
    };
  }

  static async getCurrentAttendance(): Promise<Attendance> {
    if (USE_MOCK_API) {
      const response = await mockApi(currentAttendanceMock);

      return response.data.data;
    }

    const response = await axiosInstance.get(`/timehub/attendance/current`);

    return response.data.data;
  }

  static async checkIn(data: CheckInPayload): Promise<Attendance> {
    if (USE_MOCK_API) {
      const workedMs = calculateWorkedDuration();

      currentAttendanceMock.attendance.work_duration = workedMs;

      currentAttendanceMock.attendance.attendance_date = data.start_date;
      currentAttendanceMock.attendance.end_date = "";
      currentAttendanceMock.attendance.action = "CHECK_IN";
      const response = await mockApi({
        attendance: {
          ...currentAttendanceMock.attendance,

          start_date: data.start_date,

          check_in_latitude: data.latitude,

          check_in_longitude: data.longitude,

          action: "CHECK_IN",
        },
      });

      return response.data.data;
    }

    const response = await axiosInstance.post(
      `/timehub/attendance/check-in`,
      data,
    );

    return response.data.data;
  }

  static async checkOut(data: CheckOutPayload): Promise<Attendance> {
    if (USE_MOCK_API) {
      const workedMs = calculateWorkedDuration();

      currentAttendanceMock.attendance.work_duration = workedMs;

      currentAttendanceMock.attendance.attendance_date = data.end_date;

      currentAttendanceMock.attendance.end_date = data.end_date;

      currentAttendanceMock.attendance.check_out_latitude =
        data.check_out_latitude;

      currentAttendanceMock.attendance.check_out_longitude =
        data.check_out_longitude;

      currentAttendanceMock.attendance.action = "CHECK_OUT";

      // close active break automatically
      const activeBreak = currentAttendanceMock.attendance.breaks.find(
        (b) => !b.end_date,
      );

      if (activeBreak) {
        activeBreak.end_date = data.end_date;

        activeBreak.break_end_latitude = data.check_out_latitude;

        activeBreak.break_end_longitude = data.check_out_longitude;
      }

      return structuredClone(currentAttendanceMock);
    }

    const response = await axiosInstance.post(
      `/timehub/attendance/check-out`,
      data,
    );

    return response.data.data;
  }

  static async break(data: BreakPayload): Promise<Attendance> {
    await mockApi(null);

    if (data.flag === "start") {
      const newBreak = {
        id: crypto.randomUUID(),

        attendance_id: currentAttendanceMock.attendance.id,

        start_date: data.date,

        end_date: "",

        break_start_latitude: data.break_start_latitude || "",

        break_start_longitude: data.break_start_longitude || "",

        break_end_latitude: "",

        break_end_longitude: "",

        createdAt: new Date().toISOString(),

        break_duration: "",
      };
      const workedMs = calculateWorkedDuration();

      currentAttendanceMock.attendance.work_duration = workedMs;

      currentAttendanceMock.attendance.attendance_date = data.date;

      currentAttendanceMock.attendance.action = "ON_BREAK";

      currentAttendanceMock.attendance.breaks.push(newBreak);
    }

    if (data.flag === "end") {
      const activeBreak = currentAttendanceMock.attendance.breaks.find(
        (b) => !b.end_date,
      );

      if (activeBreak) {
        activeBreak.end_date = data.date;

        activeBreak.break_end_latitude = data.break_end_latitude || "";

        activeBreak.break_end_longitude = data.break_end_longitude || "";
      }

      currentAttendanceMock.attendance.action = "CHECK_IN";
      currentAttendanceMock.attendance.attendance_date = data.date;
    }

    return structuredClone(currentAttendanceMock);
  }
}
