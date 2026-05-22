import { Attendance } from "./attendance";
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

export let currentAttendanceMock: Attendance = {
  attendance: {
    id: "1",

    attendance_date: new Date().toISOString(),

    start_date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),

    end_date: "",

    check_in_latitude: "17.438883",

    check_in_longitude: "78.365675",

    check_out_latitude: "",

    check_out_longitude: "",

    action: "CHECK_IN",

    shift_id: "1",

    shift: {
      id: 1,
      name: "General",
      start_time: "09:00:00",
      end_time: "18:00:00",
      noOfDays: 5,
      active: true,
      days: [
        {
          sunday: 0,
          monday: 1,
          tuesday: 1,
          wednesday: 1,
          thursday: 1,
          friday: 1,
          saturday: 0,
        },
      ],
    },

    breaks: [
      {
        id: "1",
        attendance_id: "154",

        start_date: new Date(Date.now() - 1000 * 60 * 40).toISOString(),

        end_date: new Date(Date.now() - 1000 * 60 * 25).toISOString(),

        break_start_longitude: "78.365667",

        break_start_latitude: "17.438868",

        break_end_longitude: "78.365679",

        break_end_latitude: "17.438880",

        createdAt: new Date().toISOString(),

        break_duration: "PT15M",
      },
    ],

    total_duration: "PT2H",

    work_duration: 6300000,

    total_break_duration: 900000,
  },
};

export const calculateWorkedDuration = () => {
  const attendance = currentAttendanceMock.attendance;

  const start = new Date(attendance.start_date).getTime();

  const now = Date.now();

  const totalDuration = now - start;

  const totalBreakMs = attendance.breaks.reduce((acc, item) => {
    const breakStart = new Date(item.start_date).getTime();

    const breakEnd = item.end_date ? new Date(item.end_date).getTime() : now;

    return acc + (breakEnd - breakStart);
  }, 0);

  return Math.max(0, totalDuration - totalBreakMs);
};
