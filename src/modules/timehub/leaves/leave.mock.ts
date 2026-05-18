import { Leave, LeaveBalance } from "./leave";

export const leaveData: Leave[] = [
  {
    id: "1",
    type: "Sick",
    startDate: "2026-04-12",
    endDate: "2026-04-15",
    reason: "Viral Fever",
    duration: 4,
    status: "PENDING",
  },
  {
    id: "2",
    type: "Paid",
    startDate: "2026-04-22",
    endDate: "2026-04-22",
    reason: "Family Function",
    duration: 1,
    status: "APPROVED",
  },
];

export const leaveBalanceData:LeaveBalance[] = [
  {
    id: "1",
    title: "Casual Leave",
    used: 8,
    total: 12,
  },
  {
    id: "2",
    title: "Sick Leave",
    used: 4,
    total: 12,
  },
  {
    id: "3",
    title: "Earned Leave",
    used: 15,
    total: 12,
  },
  {
    id: "4",
    title: "Comp - Off",
    used: 2,
    total: 3,
  },
  // {
  //   id: "5",
  //   title: "Maternity",
  //   used: 2,
  //   total: 3,
  // },
  // {
  //   id: "6",
  //   title: "Paternity",
  //   used: 2,
  //   total: 3,
  // },
];
