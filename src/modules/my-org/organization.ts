import { ResourceType } from "./entity-label/entitylabel";
import { CreateFormMetaField, FieldType, Metafield } from "./meta-fields/metafields";
import { GetMetadata } from "./projects/project";

export interface OrgMember {
  id: string,
  organizationId: string,
  userId: string,
  isActive: true,
  metadata: GetMetadata | null
  orgMemberRoles: {
    role: OrgMemberRole
  }[];
  user: {
    id: string,
    firstName: string,
    lastName: string,
    email: string
  },
  roleIds: [
    {
      id: string,
      name: string,
      slug: string
    }
  ]

}



export interface OrgMemberRole {
  id: string;
  name: string;
  slug: string;
};

export interface Pagination {
  total: number,
  page: number,
  limit: number,
  totalPages: number
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  timezone: string;
  isActive: boolean;
  createdAt: string,
  updatedAt: string,
  createdBy: string
  updatedBy: string | null
}


export interface TOrganizations {
  organizations: Organization[];
  pagination: Pagination;
}

export interface Reference {
  id: string;
  name: string;
}





