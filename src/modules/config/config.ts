import { ResourceType } from "../global";

export type GlobalOption = {
  id: string;
  organizationId: string;
  resource: ResourceType | "ALL";
  label: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
