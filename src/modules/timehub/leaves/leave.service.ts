import axiosInstance from "@/lib/axios-instance";
import { mockApi } from "@/lib/mock-api";

import { Leave, LeaveBalance } from "./leave";
import { leaveBalanceData, leaveData } from "./leave.mock";
import { Pagination } from "@/modules/global";

const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

export class LeaveService {
  static async getAll(
    page = 1,
    limit = 10,
  ): Promise<{ data: Leave[]; pagination: Pagination }> {
    if (USE_MOCK_API) {
      const response = await mockApi({
        leaves: leaveData,
        pagination: {
          total: leaveData.length,
          totalPages: 1,
          page,
          limit,
        },
      });

      return {
        data: response.data.data.leaves,
        pagination: response.data.data.pagination,
      };
    }

    const response = await axiosInstance.get(
      `/timehub/leaves?page=${page}&limit=${limit}`,
    );

    return {
      data: response.data.data.leaves,
      pagination: response.data.data.pagination,
    };
  }

  static async getLeaveBalance(): Promise<LeaveBalance[]> {
    if (USE_MOCK_API) {
      const response = await mockApi(leaveBalanceData);
      return response.data.data;
    }

    const response = await axiosInstance.get(`/timehub/leaves/balance`);

    return response.data.data;
  }
}
