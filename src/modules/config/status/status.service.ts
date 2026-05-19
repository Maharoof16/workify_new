import axiosInstance from "@/lib/axios-instance";
import { mockApi } from "@/lib/mock-api";
import { statuses } from "../config.mock";

const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

export class StatusService {
  static async getAll(page = 1, limit = 50) {
    if (USE_MOCK_API) {
      const response = await mockApi(statuses);

      return {
        data: response.data,
        pagination: {
          page,
          limit,
          total: statuses.length,
          totalPages: 1,
        },
      };
    }

    const response = await axiosInstance.get(
      `/status-config?page=${page}&limit=${limit}`,
    );

    return {
      data: response.data.data.status,
      pagination: response.data.data.pagination,
    };
  }
}
