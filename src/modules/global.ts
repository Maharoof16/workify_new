export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type Resource =
  | "DEPARTMENT"
  | "LOCATION"
  | "CLIENT"
  | "PROJECT"
  | "USER"
  | "TASK"
  | "TIMESHEET"
  | "ASSET"
  | "METADATA"
  | "PERFORMANCE_REVIEW"
  | "RESOURCE_ALLOCATION"
  | "COMPETENCY";