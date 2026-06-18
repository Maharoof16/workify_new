import { ResourceType } from "../entity-label/entitylabel";
import { CreateFormMetaField, FieldType, Metafield } from "../meta-fields/metafields";

export type ExistingMetaValue = {
  fieldId?: string;
  label: string;
  value: string | string[];
  isRequired?: boolean;
  helpText?: string | null;
  resource: ResourceType;
  options?: string[];
};

export type NewMetaValue = {
  label: string;
  type: FieldType;
  value: string | number | string[];
  isRequired: boolean;
  helpText?: string | null;
  resource: ResourceType;
  options: string[];
};


export type MetadataPayload = Array<ExistingMetaValue | NewMetaValue>;

export type GetMetadata = Array<Metafield | NewMetaValue>;

export type ProjectMetadataMap = Record<
  string,
  {
    type: FieldType;
    label: string;
    value: string | string[];
    options: string[];
    helpText: string;
    resource: ResourceType;
    isRequired: boolean;
  }
>;

export type Project = {
  id: string;
  organizationId: string;
  clientId: string;
  departmentId: string;
  name: string;
  description: string;
  status: string;
  isActive?: boolean;
  metadata?: ProjectMetadataMap | null;
  startDate?:string;
  endDate?:string;
};


export interface CreateProject {
  name: string;
  clientId: string;
  description: string;
  departmentId:string;
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  metadata?: MetadataPayload;
  members?: string[];
  isActive?: boolean;
}

export type ProjectFormValues = {
  clientId: string;
  departmentId: string;
  name: string;
  description: string;
  startDate?: string | Date | null;
  endDate?: string | Date | null;
} & Record<string, string | string[] | number | boolean>;



export type ProjectFormMetaContext = {
  existingMetaFields: Metafield[];
  newMetaFields: CreateFormMetaField[];
  selectedUsers: string[];
};

type Assignee = {
  id: string;
  name: string;
  avatarUrl?: string;
};
 
export type ProjectCard = {
  id: string;
  title: string;
  status: string;
  priority: string;
  createdAt: string;
  assignees: Assignee[];
};