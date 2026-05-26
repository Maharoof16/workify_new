import { Resource } from "@/modules/global";

export interface TEntityLabel {
  id: string;
  organizationId?: string;
  resource: Resource;
  singularLabel: string;
  pluralLabel: string;
  createdAt: string;
  updatedAt: string;
}

export interface EntityLabelValue {
  singular: string;
  plural: string;
}

export type CreateEntityPayload = {
  id: string;
  resource: string;
  singularLabel: string;
  pluralLabel: string;
  // icon?: string;
  // visible: boolean;
};

