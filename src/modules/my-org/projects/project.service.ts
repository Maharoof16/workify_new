import axiosInstance from "@/lib/axios-instance";
import { mockApi } from "@/lib/mock-api";
import { Projects } from "./project.mock";
import { CreateProject, Project } from "./project";
import { Reference } from "../organization";

const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

export class ProjectService {
  static async CreateProject(data: CreateProject): Promise<Project> {
    const response = await axiosInstance.post("/projects", data);
    return response.data.data;
  }
  // static async getAll(page = 1, limit = 10) {
  //   const response = await axiosInstance.get(
  //     `/projects?page=${page}&limit=${limit}`,
  //   );

  //   return {
  //     data: response.data.data.projects,
  //     pagination: response.data.data.pagination,
  //   };
  // }
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

    const response = await axiosInstance.get(`/projects?page=${page}&limit=${limit}`);

    return response.data.data;
  }
  static async getById(id: string): Promise<Project> {
    const response = await axiosInstance.get(`/projects/${id}`);
    return response.data.data;
  }

  async getById(id: string): Promise<Project> {
    const response = await axiosInstance.get(`/projects/${id}`);
    return response.data.data;
  }

  static async getReferenceList(params?: {
    memberId?: string;
    departmentId?: string;
  }): Promise<Reference[]> {
    const query = new URLSearchParams();

    if (params?.memberId) query.append("memberId", params.memberId);
    if (params?.departmentId) query.append("departmentId", params.departmentId);

    const url = query.toString()
      ? `/projects/reference-list?${query.toString()}`
      : `/projects/reference-list`;

    const response = await axiosInstance.get(url);

    return response.data.data;
  }

  async getReferenceList(params?: {
    memberId?: string;
    departmentId?: string;
  }): Promise<Reference[]> {
    const query = new URLSearchParams();

    if (params?.memberId) query.append("memberId", params.memberId);
    if (params?.departmentId) query.append("departmentId", params.departmentId);

    const url = query.toString()
      ? `/projects/reference-list?${query.toString()}`
      : `/projects/reference-list`;

    const response = await axiosInstance.get(url);

    return response.data.data;
  }
  static async update(id: string, data: Partial<CreateProject>): Promise<Project> {
    const response = await axiosInstance.put(`/projects/${id}`, data);
    return response.data.data;
  }

  static async getUserList(): Promise<Reference[]> {
    const response = await axiosInstance.get(`/organizations/org-members/reference-list`);
    return response.data.data;
  }

  static async getUserListByProject(projectId: string): Promise<Reference[]> {
    const query = new URLSearchParams();
    if (projectId) query.append("projectId", projectId);

    const url = query.toString()
      ? `/organizations/org-members/reference-list?${query.toString()}`
      : `/organizations/org-members/reference-list`;

    const response = await axiosInstance.get(url);
    return response.data.data;
  }

  static async getAssignedProject(memberId: string): Promise<Reference[]> {
    const query = new URLSearchParams();
    if (memberId) query.append("memberId", memberId);

    const url = query.toString()
      ? `/projects/reference-list?${query.toString()}`
      : `/projects/reference-list`;

    const response = await axiosInstance.get(url);
    return response.data.data;
  }
}
