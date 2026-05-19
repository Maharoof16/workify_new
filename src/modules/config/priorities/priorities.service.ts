import axiosInstance from "@/lib/axios-instance";
import { mockApi } from "@/lib/mock-api";
import { priorities } from "../config.mock";

const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

export class PriorityService {
  static async getAll(page = 1, limit = 100) {
    if (USE_MOCK_API) {
      const response = await mockApi(priorities);

      return {
        data: response.data,
        pagination: {
          page,
          limit,
          total: priorities.length,
          totalPages: 1,
        },
      };
    }

    const response = await axiosInstance.get(
      `/priority-config?page=${page}&limit=${limit}`,
    );

    return {
      data: response.data.data.priorities,
      pagination: response.data.data.pagination,
    };
  }
}
