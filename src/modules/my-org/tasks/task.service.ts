import axiosInstance from "@/lib/axios-instance";
import { CreateTaskPayload, Task, TaskFormFields, TaskReferenceList, } from "./task";
import { Reference } from "../organization";


export class TaskService {
  static async createTask(data: CreateTaskPayload): Promise<Task> {
    const response = await axiosInstance.post("/task", data);
    return response.data.data;
  }
  static async getAll(projectId: string, page = 1, limit = 10) {
    const response = await axiosInstance.get(
      `/task?projectId=${projectId}&page=${page}&limit=${limit}`
    );

    return {
      data: response.data.data.tasks,
      pagination: response.data.data.pagination,
    };
  }

  static async getById(id: string) {
    const response = await axiosInstance.get(`/task/${id}`);
    return response.data.data;
  }

  async getById(id: string) {
    const response = await axiosInstance.get(`/task/${id}`);
    return response.data.data;
  }

  static async Update(id: string, data: Partial<TaskFormFields>): Promise<Task> {
    const response = await axiosInstance.put(`/task/${id}`, data);
    return response.data.data;
  }

  static async getReferenceList(projectId: string, memberId?: string): Promise<TaskReferenceList[]> {
    const query = new URLSearchParams();
    if (projectId) query.append("projectId", projectId);
    if (memberId) query.append("memberId", memberId);

    const url = query.toString()
      ? `/task/reference-list?${query.toString()}`
      : `/task/reference-list`;

    const response = await axiosInstance.get(url);
    return response.data.data;
  }


  static async getAssignedTasks(memberId: string): Promise<Reference[]> {
    const query = new URLSearchParams();
    if (memberId) query.append("memberId", memberId);

    const url = query.toString()
      ? `/task/reference-list?${query.toString()}`
      : `/task/reference-list`;

    const response = await axiosInstance.get(url);
    return response.data.data;
  }

  static async getAssignedTask(memberId: string) {
    const query = new URLSearchParams();
    if (memberId) query.append("memberId", memberId);

    const url = query.toString()
      ? `/task?${query.toString()}`
      : `/task`;

    const response = await axiosInstance.get(url);
    return response.data?.data?.tasks ?? [];
  }
}