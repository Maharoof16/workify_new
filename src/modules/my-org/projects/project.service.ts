import axiosInstance from "@/lib/axios-instance";
import { mockApi } from "@/lib/mock-api";
import { Projects } from "./project.mock";

const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

export class ProjectService {
  static async getAll(page = 1, limit = 50) {
    if (USE_MOCK_API) {
      const response = await mockApi(Projects);

      return {
        data: response.data,
        pagination: {
          page,
          limit,
          total: Projects.length,
          totalPages: Math.ceil(Projects.length / limit),
        },
      };
    }

    const response = await axiosInstance.get(
      `/projects?page=${page}&limit=${limit}`,
    );

    return {
      data: response.data.data.projects,
      pagination: response.data.data.pagination,
    };
  }
}
