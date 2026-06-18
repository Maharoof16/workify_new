import axiosInstance from "@/lib/axios-instance";
import { CreateMetaField, Metafield } from "./metafields";

export class MetadataService {
  static async GetMetadata(page = 1, limit = 10) {
    const response = await axiosInstance.get(
      `/meta-data?page=${page}&limit=${limit}`,
    );

    return {
      data: response.data.data,
      pagination: response.data.data.pagination,
    };
  }

  static async forResource(
    resource: string,
    projectId?: string,
    departmentId?: string
  ) {
    const params: Record<string, string> = {};

    if (projectId) params.projectId = projectId;
    if (departmentId) params.departmentId = departmentId;

    const response = await axiosInstance.get(`/meta-data/for-resource/${resource}`, {
      params: Object.keys(params).length ? params : '',
    });

    return response.data.data;
  }

  static async create(data: CreateMetaField): Promise<Metafield> {
    const response = await axiosInstance.post("/meta-data", data);
    return response.data.data;
  }

  async getById(id: string): Promise<Metafield> {
    const response = await axiosInstance.get(`/meta-data/${id}`);
    return response.data.data;
  }

  static async update(id: string, data: Partial<CreateMetaField>
  ): Promise<Metafield> {
    const response = await axiosInstance.put(`/meta-data/${id}`, data);
    return response.data.data;
  }
}
