import { User } from "@/modules/members/users/users";

export const currentUserMock: User = {
  id: "1",
  organization_id: "1",
  first_name: "Maharoof",
  last_name: "Kakkidiparambil",
  email: "maharoof@workify.ai",
  shift: {
    id: 1,
    name: "General",
    start_time: "09:00:00",
    end_time: "18:00:00",
  },
  active: true,
  worked_duration: 29520000,
};
