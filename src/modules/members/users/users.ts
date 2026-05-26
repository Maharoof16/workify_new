
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  timezone: string;
  preferredTimezone: string | null;
  createdAt: string;
  updatedAt: string;
  isActive?: boolean;
  memberId?: string;
  roles: string[];
  orgMemberId?: string;
  employeeNo?: string;
  phone?: string;
  gender?: string;
  address?: string;

  dateOfBirth?: string;
  joinedOn?: string | null;
  leftOn?: string | null;

  reportingMemberId?: string;

  departmentId?: string;
  locationId?: string;

  metadata?: any;

  isProfileSetupCompleted?: boolean;

  department?: {
    id: string;
    name: string;
  };

  location?: {
    id: string;
    name: string;
  };

  reportingManager?: {
    firstName: string;
    lastName: string;
  };
}
