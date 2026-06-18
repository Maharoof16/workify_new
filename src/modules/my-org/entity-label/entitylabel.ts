export interface TEntityLabel {
  id: string;
  organizationId?: string;
  resource: ResourceType;
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

export type ResourceType =
  | "DEPARTMENT"
  | "LOCATION"
  | "CLIENT"
  | "PROJECT"
  | "USER"
  | "TASK"
  | "TIMESHEET"
  | "ASSET"
  | "METADATA"
  |"PERFORMANCE_REVIEW"
  | "RESOURCE_ALLOCATION"
  | "COMPETENCY";

export type ScopeType = "ORGANIZATION" | "DEPARTMENT" | "PROJECT";
