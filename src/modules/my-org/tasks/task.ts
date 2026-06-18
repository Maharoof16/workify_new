import { ResourceType } from "../entity-label/entitylabel";
import { FieldType } from "../meta-fields/metafields";
import { MetadataPayload } from "../projects/project";

export type TaskMetadataMap = Record<
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

export interface TaskMetadata {
  type: FieldType;
  label: string;
  value: string | string[];
  options: string[];
  helpText: string;
  resource: ResourceType;
  isRequired: boolean;
  scope?: string;
}

export interface CreateTaskPayload {
  projectId: string;
  parentTaskId?: string | null;
  title: string;
  description?: string | null;
  assignedTo?: string | null;
  reportedTo?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  estimateInMilliSeconds?: number | null;
  members?: string[];
  metadata?: MetadataPayload | null;
}

export interface TaskRef {
  id: string;
  title: string;
}

export interface Task {
  id: string;
  projectId?: string;
  parentTaskId?: string;
  title: string;
  description: string;
  assignedTo?: string;
  reportedTo?: string;
  startDate?: string;
  endDate?: string;
  estimateInMilliSeconds?: number | null;
  createdById?: string;
  updatedById?: string;
  isActive?: boolean;
  parentTask?: TaskRef;
  subtasks?: TaskRef[];
  metadata?: TaskMetadataMap | null;
  taskAssignees?: TaskAssignee[];
  project?: TProject;
}

export type TProject = {
  id: string;
  name: string;
};

export interface TaskReference {
  id: string;
  name: string;
  first_name?: string;
  last_name?: string;
  label?: string;
}

export type TaskAssignee = {
  id: string;
  firstName?: string;
  lastName?: string;
};

export type TaskFormFields = {
  title: string;
  description: string;
  projectId: string;
  parentTaskId?: string;
  assignedTo?: string;
  reportedTo?: string;
  startDate?: Date;
  endDate?: Date;
  estimateInMilliSeconds?: string;
  members?: string[];
  metadata?: {
    type: FieldType;
    label: string;
    value: string | string[];
    options: string[];
    helpText: string;
    resource: ResourceType;
    isRequired: boolean;
  }[];
};


export interface TaskReferenceList {
  id: string
  title: string
}