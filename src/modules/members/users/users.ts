import { Shift } from "@/modules/config/shifts/shift";

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  organization_id: string;
  worked_duration: number;
  shift: Shift;
  active: boolean;
}
