import { Resource } from "../global";

export type GlobalOption = {
  id: string;
  organizationId: string;
  resource: Resource | "ALL";
  label: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
