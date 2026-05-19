import axiosInstance from "@/lib/axios-instance";
import { mockApi } from "@/lib/mock-api";
import { AttendanceResponse } from "./attendance";

import { Pagination } from "@/modules/global";
import { attendanceData } from "./attendance.mock";

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
        filters: {
          periodStart,
          periodEnd,
        },
      });

      return {
        data: response.data.data.attendance,
        pagination: response.data.data.pagination,
      };
    }

    const response = await axiosInstance.get(
      `/timehub/attendance?periodStart=${periodStart}&periodEnd=${periodEnd}&page=${page}&limit=${limit}`,
      {
        signal,
      },
    );

    return {
      data: response.data.data.attendance,
      pagination: response.data.data.pagination,
    };
  }
}
