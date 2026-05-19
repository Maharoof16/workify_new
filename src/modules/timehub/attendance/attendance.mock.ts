import { AttendanceResponse } from "./attendance";

export const attendanceData: AttendanceResponse = {
  attendanceMetrics: {
    consistency: 92,
    presentDays: 22,
    lateLogins: 3,
    totalDuration: 635400,
    extraDuration: 45900,
    shortDuration: 11700,
    regularizationPending: 2,
  },

  attendance: [
    {
      id: "1",
      date: "2024-05-15",
      punchIn: "2024-05-15T03:30:00Z",
      punchOut: "2024-05-15T12:30:00Z",
      breakDuration: 3600,
      workedDuration: 28800,
      status: "PRESENT",
    },
    {
      id: "2",
      date: "2024-05-14",
      punchIn: "2024-05-14T03:45:00Z",
      punchOut: "2024-05-14T13:00:00Z",
      breakDuration: 3600,
      workedDuration: 29700,
      status: "LATE",
    },
    {
      id: "3",
      date: "2024-05-13",
      punchIn: "2024-05-13T03:25:00Z",
      punchOut: "2024-05-13T12:30:00Z",
      breakDuration: 3600,
      workedDuration: 29100,
      status: "PRESENT",
    },
    {
      id: "4",
      date: "2024-05-10",
      status: "ABSENT",
    },
  ],
};
