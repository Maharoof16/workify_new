import { ResourceType, ScopeType } from "../entity-label/entitylabel";
import { Pagination } from "../organization";
import { OptionItem } from "./components/option-editor";

export interface Metafield {
  id: string;
  organizationId: string;
  departmentId?: string;
  projectId?: string;
  resource: ResourceType;
  scope: ScopeType;
  label: string;
  type: FieldType
  isRequired: boolean
  options: string[]
  helpText: string
  isActive: boolean;
  value?: string | string[];
}


export interface TMetafields {
  metaDataFields: Metafield[];
  pagination: Pagination;
}

export interface CreateFormMetaField {
  resource: ResourceType,
  label: string,
  type: FieldType,
  isRequired: boolean,
  helpText: string  
  options: string[] | null,
}

export interface CreateMetaField{
  id?: string;
  organizationId: string;
  departmentId?: string;
  projectId?: string;
  resource: ResourceType;
  scope: ScopeType;
  label: string;
  type: FieldType
  isRequired?: boolean
  options?: string[]
  helpText?: string | null
  isActive?:boolean
}


export type FieldType =
  | "TEXT"
  | "NUMBER"
  | "DATE"
  | "BOOLEAN"
  | "SELECT"
  | "MULTI_SELECT";


export type MetaFieldDialogValues = {
  resource: ResourceType;
  label: string;
  type: FieldType;
  isRequired: boolean;
  helpText?: string;
  options?: OptionItem[];
}

