import axiosInstance from "@/lib/axios-instance";
import { CreateEntityPayload, TEntityLabel } from "./entitylabel";

export class EntityLabelService {
  async getAll(): Promise<TEntityLabel[]> {
    const response = await axiosInstance.get("/organizations/entity-label");
    return response.data.data;
  }

  async updateMany(
    entities: { id: string; singularLabel: string; pluralLabel: string }[],
  ): Promise<TEntityLabel[]> {
    const payload = { entities };
    const response = await axiosInstance.put(
      "/organizations/entity-label",
      payload,
    );
    return response.data.data;
  }
}
