"use client";

import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  Clock,
  Clock3,
  Hourglass,
  LogIn,
  LogOut,
  TimerReset,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type AttendanceStatus =
  | "CHECKED_IN"
  | "CHECKED_OUT"
  | "ON_BREAK"
  | "NOT_CHECKED_IN";

type AttendanceBreak = {
  id: string;
  startTime: string;
  endTime: string | null;
  latitudeStart: number;
  longitudeStart: number;
  latitudeEnd: number | null;
  longitudeEnd: number | null;
  breakDuration: number | null;
};

type Attendance = {
  id: string;
  date: string;
  status: AttendanceStatus;

  start_time: string | null;
  end_time: string | null;

  checkin_latitude: string | null;
  checkin_longitude: string | null;

  check_out_latitude: string | null;
  check_out_longitude: string | null;

  accumulatedWorkedSeconds: number;
  lastCheckoutTime?: string | null;

  currentBreak?: AttendanceBreak | null;
  breaks: AttendanceBreak[];

  totalDuration: number;
  totalWorkedDuration: number;
  totalBreakDuration: number;
};

const shifts = [
  {
    id: 1,
    name: "General",
    start_time: "09:00:00",
    end_time: "18:00:00",
  },
  {
    id: 2,
    name: "Morning",
    start_time: "08:00:00",
    end_time: "17:00:00",
  },
  {
    id: 3,
    name: "Flexible",
    start_time: "10:00:00",
    end_time: "18:00:00",
  },
  {
    id: 4,
    name: "Evening",
    start_time: "11:00:00",
    end_time: "20:00:00",
  },
  {
    id: 5,
    name: "Flexible",
    start_time: "06:00:00",
    end_time: "14:00:00",
  },
  {
    id: 6,
    name: "Flexible",
    start_time: "12:00:00",
    end_time: "24:00:00",
  },
];

/* -------------------------------------------------------------------------- */
/*                                MOCK HELPERS                                */
/* -------------------------------------------------------------------------- */

const getCurrentLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });
  });
};

const mockApiDelay = () => new Promise((resolve) => setTimeout(resolve, 1000));

function calculateDurations(attendance: Attendance): Attendance {
  if (
    attendance.status === "CHECKED_OUT" ||
    attendance.status === "NOT_CHECKED_IN"
  ) {
    return attendance;
  }

  if (!attendance.start_time) return attendance;

  const now = Date.now();

  const start = new Date(attendance.start_time).getTime();

  const currentSessionSeconds = Math.max(0, Math.floor((now - start) / 1000));

  const completedBreakSeconds = attendance.breaks.reduce((acc, curr) => {
    return acc + (curr.breakDuration || 0);
  }, 0);

  let activeBreakSeconds = 0;

  if (
    attendance.currentBreak &&
    attendance.currentBreak.startTime &&
    !attendance.currentBreak.endTime
  ) {
    activeBreakSeconds = Math.floor(
      (now - new Date(attendance.currentBreak.startTime).getTime()) / 1000,
    );
  }

  const totalBreakDuration = completedBreakSeconds + activeBreakSeconds;

  const totalWorkedDuration =
    attendance.accumulatedWorkedSeconds +
    currentSessionSeconds -
    activeBreakSeconds;

  return {
    ...attendance,
    totalDuration: totalWorkedDuration + totalBreakDuration,
    totalWorkedDuration: Math.max(0, totalWorkedDuration),
    totalBreakDuration: Math.max(0, totalBreakDuration),
  };
}

/* -------------------------------------------------------------------------- */
/*                                MOCK STORAGE                                */
/* -------------------------------------------------------------------------- */

const initialAttendance: Attendance = {
  id: "att_001",
  date: new Date().toISOString(),

  status: "NOT_CHECKED_IN",

  start_time: null,
  end_time: null,

  checkin_latitude: null,
  checkin_longitude: null,

  check_out_latitude: null,
  check_out_longitude: null,
  accumulatedWorkedSeconds: 0,

  currentBreak: null,
  breaks: [],
  lastCheckoutTime: null,

  totalDuration: 0,
  totalWorkedDuration: 0,
  totalBreakDuration: 0,
};

/* -------------------------------------------------------------------------- */
/*                                MAIN COMPONENT                              */
/* -------------------------------------------------------------------------- */

export default function TimeHub() {
  const [mounted, setMounted] = useState(false);
  const [attendance, setAttendance] = useState<Attendance>(() => {
    if (typeof window === "undefined") {
      return initialAttendance;
    }

    const stored = localStorage.getItem("mock-attendance");

    if (stored) {
      return JSON.parse(stored);
    }

    return initialAttendance;
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const [loadingAction, setLoadingAction] = useState<
    "checkin" | "checkout" | "breakStart" | "breakEnd" | null
  >(null);
  const [selectedShift, setSelectedShift] = useState(shifts[0]);

  const getHourFromTime = (time: string) => {
    return Number(time.split(":")[0]);
  };

  const formatHour = (hour: number) => {
    const normalized = hour % 24;

    const h = normalized % 12 || 12;

    const suffix = normalized >= 12 ? "PM" : "AM";

    return `${h}:00 ${suffix}`;
  };

  const startHour = getHourFromTime(selectedShift.start_time);

  const endHour = getHourFromTime(selectedShift.end_time);

  const totalShiftHours = endHour - startHour;

  const firstSegmentHours = totalShiftHours * 0.25;

  const secondSegmentHours = totalShiftHours * 0.25;

  const shiftLabels = [
    formatHour(startHour),

    formatHour(Math.round(startHour + firstSegmentHours)),

    formatHour(Math.round(startHour + firstSegmentHours + secondSegmentHours)),

    formatHour(endHour),
  ];

  /* ------------------------------------------------------------------------ */
  /*                             LIVE TIMER UPDATE                            */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    const interval = setInterval(() => {
      setAttendance((prev) => calculateDurations(prev));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  /* ------------------------------------------------------------------------ */
  /*                               CHECK-IN                                   */
  /* ------------------------------------------------------------------------ */

  const handleCheckIn = async () => {
    try {
      setLoadingAction("checkin");
      const position = await getCurrentLocation();

      const now = new Date().toISOString();

      const payload = {
        type: "CHECK_IN",

        startTime: now,

        checkinLatitude: String(position.coords.latitude),
        checkinLongitude: String(position.coords.longitude),
      };

      console.log("CHECK-IN PAYLOAD", payload);

      await mockApiDelay();

      setAttendance((prev) => {
        let updatedBreaks = [...prev.breaks];

        // previous checkout -> current checkin becomes break
        if (prev.lastCheckoutTime) {
          const breakStart = new Date(prev.lastCheckoutTime).getTime();

          const breakEnd = new Date(now).getTime();

          const breakDuration = Math.floor((breakEnd - breakStart) / 1000);

          updatedBreaks.push({
            id: crypto.randomUUID(),

            startTime: prev.lastCheckoutTime,
            endTime: now,

            latitudeStart: Number(prev.check_out_latitude || 0),
            longitudeStart: Number(prev.check_out_longitude || 0),

            latitudeEnd: Number(payload.checkinLatitude),
            longitudeEnd: Number(payload.checkinLongitude),

            breakDuration,
          });
        }

        return calculateDurations({
          ...prev,

          status: "CHECKED_IN",

          start_time: now,
          end_time: null,

          lastCheckoutTime: null,

          checkin_latitude: payload.checkinLatitude,
          checkin_longitude: payload.checkinLongitude,

          breaks: updatedBreaks,
        });
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingAction(null);
    }
  };

  /* ------------------------------------------------------------------------ */
  /*                              CHECK-OUT                                   */
  /* ------------------------------------------------------------------------ */

  const handleCheckOut = async () => {
    try {
      setLoadingAction("checkout");
      const position = await getCurrentLocation();

      const now = new Date().toISOString();

      const payload = {
        type: "CHECK_OUT",

        endTime: now,

        checkoutLatitude: String(position.coords.latitude),
        checkoutLongitude: String(position.coords.longitude),
      };

      console.log("CHECK-OUT PAYLOAD", payload);

      await mockApiDelay();

      setAttendance((prev) => {
        if (!prev.start_time) return prev;

        let updatedBreaks = [...prev.breaks];

        let currentBreak = prev.currentBreak;

        // close active break automatically on checkout
        if (currentBreak && currentBreak.startTime && !currentBreak.endTime) {
          const breakDuration = Math.floor(
            (new Date(now).getTime() -
              new Date(currentBreak.startTime).getTime()) /
              1000,
          );

          updatedBreaks.push({
            ...currentBreak,

            endTime: now,

            latitudeEnd: Number(payload.checkoutLatitude),
            longitudeEnd: Number(payload.checkoutLongitude),

            breakDuration,
          });

          currentBreak = null;
        }

        const workedSeconds = Math.floor(
          (new Date(now).getTime() - new Date(prev.start_time).getTime()) /
            1000,
        );

        const totalBreakSeconds = updatedBreaks.reduce((acc, item) => {
          return acc + (item.breakDuration || 0);
        }, 0);

        return {
          ...prev,

          status: "CHECKED_OUT",

          end_time: now,

          lastCheckoutTime: now,

          currentBreak: null,

          breaks: updatedBreaks,

          accumulatedWorkedSeconds:
            prev.accumulatedWorkedSeconds + Math.max(0, workedSeconds),

          totalBreakDuration: totalBreakSeconds,

          start_time: null,

          check_out_latitude: payload.checkoutLatitude,
          check_out_longitude: payload.checkoutLongitude,
        };
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingAction(null);
    }
  };

  /* ------------------------------------------------------------------------ */
  /*                             BREAK START                                  */
  /* ------------------------------------------------------------------------ */

  const handleBreakStart = async () => {
    try {
      setLoadingAction("breakStart");
      const position = await getCurrentLocation();

      const payload = {
        type: "BREAK",

        action: "START",

        break_start_time: new Date().toISOString(),

        break_start_latitude: String(position.coords.latitude),
        break_start_longitude: String(position.coords.longitude),
      };

      console.log("BREAK START PAYLOAD", payload);

      await mockApiDelay();

      const newBreak: AttendanceBreak = {
        id: crypto.randomUUID(),

        startTime: payload.break_start_time,
        endTime: null,

        latitudeStart: Number(payload.break_start_latitude),
        longitudeStart: Number(payload.break_start_longitude),

        latitudeEnd: null,
        longitudeEnd: null,

        breakDuration: null,
      };

      setAttendance((prev) => ({
        ...prev,

        status: "ON_BREAK",

        currentBreak: newBreak,
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingAction(null);
    }
  };

  /* ------------------------------------------------------------------------ */
  /*                              BREAK END                                   */
  /* ------------------------------------------------------------------------ */

  const handleBreakEnd = async () => {
    try {
      if (!attendance.currentBreak) return;

      setLoadingAction("breakEnd");
      const position = await getCurrentLocation();

      const endTime = new Date().toISOString();

      const payload = {
        type: "BREAK",

        action: "END",

        break_end_time: endTime,

        break_end_latitude: String(position.coords.latitude),
        break_end_longitude: String(position.coords.longitude),
      };

      console.log("BREAK END PAYLOAD", payload);

      await mockApiDelay();

      const start = new Date(attendance.currentBreak.startTime).getTime();

      const end = new Date(endTime).getTime();

      const duration = Math.floor((end - start) / 1000);

      const completedBreak: AttendanceBreak = {
        ...attendance.currentBreak,

        endTime,

        latitudeEnd: Number(payload.break_end_latitude),
        longitudeEnd: Number(payload.break_end_longitude),

        breakDuration: duration,
      };

      setAttendance((prev) =>
        calculateDurations({
          ...prev,

          status: "CHECKED_IN",

          currentBreak: null,

          breaks: [...prev.breaks, completedBreak],
        }),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingAction(null);
    }
  };

  /* ------------------------------------------------------------------------ */
  /*                                  STATES                                  */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    localStorage.setItem("mock-attendance", JSON.stringify(attendance));
  }, [attendance]);

  const isCheckedIn =
    attendance.status === "CHECKED_IN" || attendance.status === "ON_BREAK";

  const isOnBreak = attendance.status === "ON_BREAK";

  const workedLabel = useMemo(() => {
    const hrs = Math.floor(attendance.totalWorkedDuration / 3600);

    const mins = Math.floor((attendance.totalWorkedDuration % 3600) / 60);

    return `${hrs}h ${mins}m`;
  }, [attendance.totalWorkedDuration]);

  const resetAttendance = () => {
    localStorage.removeItem("mock-attendance");

    setAttendance(initialAttendance);
  };

  /* ------------------------------------------------------------------------ */
  /*                                   UI                                     */
  /* ------------------------------------------------------------------------ */

  const getCurrentProgressDegrees = () => {
    if (attendance.status === "NOT_CHECKED_IN") {
      return 0;
    }
    const now = new Date();

    const currentHour = now.getHours() + now.getMinutes() / 60;

    const shiftStart = getHourFromTime(selectedShift.start_time);

    const shiftEnd = getHourFromTime(selectedShift.end_time);

    const totalShiftHours = shiftEnd - shiftStart;

    const elapsedHours = Math.max(0, currentHour - shiftStart);

    const firstSegmentHours = totalShiftHours * 0.25;

    const secondSegmentHours = totalShiftHours * 0.25;

    const thirdSegmentHours = totalShiftHours * 0.5;

    // FIRST ARC
    if (elapsedHours <= firstSegmentHours) {
      return (elapsedHours / firstSegmentHours) * 90;
    }

    // SECOND ARC
    if (elapsedHours <= firstSegmentHours + secondSegmentHours) {
      return (
        90 + ((elapsedHours - firstSegmentHours) / secondSegmentHours) * 90
      );
    }

    // THIRD ARC
    const thirdElapsed = elapsedHours - firstSegmentHours - secondSegmentHours;

    const baseProgress =
      180 +
      (Math.min(thirdElapsed, thirdSegmentHours) / thirdSegmentHours) * 90;

    // OVERTIME
    const overtimeHours = Math.max(0, thirdElapsed - thirdSegmentHours);

    const overtimeMaxHours = 12;

    const overtimeProgress =
      (Math.min(overtimeHours, overtimeMaxHours) / overtimeMaxHours) * 90;

    return baseProgress + overtimeProgress;
  };

  const progressDeg = Math.min(getCurrentProgressDegrees(), 360);

  const buildGradient = () => {
    if (progressDeg <= 0) {
      return `conic-gradient(
      from -90deg,
      #E2E8F0 0deg 360deg
    )`;
    }

    return `conic-gradient(
    from -90deg,

    #1CC188 0deg,
    #F3CE00 ${Math.min(progressDeg, 180)}deg,
    #EF4444 ${progressDeg}deg,

    #E2E8F0 ${progressDeg}deg,
    #E2E8F0 360deg
  )`;
  };
  const getPositionFromDegree = (degree: number) => {
    const size = 300;

    const ringThickness = 12;

    const radius = size / 2 - ringThickness / 2;

    const angle = (degree - 90) * (Math.PI / 180);

    const x = Math.cos(angle) * radius;

    const y = Math.sin(angle) * radius;

    return {
      left: `calc(50% + ${x}px)`,
      top: `calc(50% + ${y}px)`,
    };
  };
  const getDegreeFromTime = (dateString: string) => {
    const date = new Date(dateString);

    const currentHour = date.getHours() + date.getMinutes() / 60;

    const shiftStart = getHourFromTime(selectedShift.start_time);

    const shiftEnd = getHourFromTime(selectedShift.end_time);

    const totalShiftHours = shiftEnd - shiftStart;

    const elapsedHours = Math.max(0, currentHour - shiftStart);

    const firstSegmentHours = totalShiftHours * 0.25;

    const secondSegmentHours = totalShiftHours * 0.25;

    const thirdSegmentHours = totalShiftHours * 0.5;

    // FIRST ARC
    if (elapsedHours <= firstSegmentHours) {
      return (elapsedHours / firstSegmentHours) * 90;
    }

    // SECOND ARC
    if (elapsedHours <= firstSegmentHours + secondSegmentHours) {
      return (
        90 + ((elapsedHours - firstSegmentHours) / secondSegmentHours) * 90
      );
    }

    // THIRD ARC
    const thirdElapsed = elapsedHours - firstSegmentHours - secondSegmentHours;

    const baseProgress =
      180 +
      (Math.min(thirdElapsed, thirdSegmentHours) / thirdSegmentHours) * 90;

    // OVERTIME
    const overtimeHours = Math.max(0, thirdElapsed - thirdSegmentHours);

    const overtimeMaxHours = 12;

    const overtimeProgress =
      (Math.min(overtimeHours, overtimeMaxHours) / overtimeMaxHours) * 90;

    return baseProgress + overtimeProgress;
  };
  const checkoutDegree = attendance.end_time ? progressDeg : null;

  if (!mounted) {
    return null;
  }
  return (
    <div
      className="
  rounded-xl
  border border-dashboard-border
  bg-linear-to-b
  from-dashboard-card-from
  to-dashboard-card-to
  p-4
  flex flex-col
  gap-6
  overflow-hidden
"
    >
      {/* Header */}
      <div className="flex flex-col ">
        <h3 className="text-base font-semibold">Personal Time Hub</h3>
        <div>
          <SearchableSelect
            value={selectedShift.id}
            options={shifts.map((shift) => ({
              id: shift.id,
              label: `${shift.name} (${formatHour(
                getHourFromTime(shift.start_time),
              )} - ${formatHour(getHourFromTime(shift.end_time))})`,
            }))}
            onChange={(val) => {
              const shift = shifts.find((s) => s.id === Number(val));

              if (shift) {
                setSelectedShift(shift);
              }
            }}
            trim={false}
            placeholder="Select shift"
            className="mt-2 h-11 rounded-lg border bg-white px-3 text-sm font-medium"
            popOverWidthClass="w-[320px]"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex items-center justify-center">
        <div
          className="
    relative
    aspect-square
    w-full
    max-w-[300px]

  "
        >
          {/* OUTER RING */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: buildGradient(),
              transform: "rotate(90deg)",
              mask: "radial-gradient(farthest-side, transparent calc(100% - 12px), black 0)",
              WebkitMask:
                "radial-gradient(farthest-side, transparent calc(100% - 12px), black 0)",
            }}
          />
          {/* CLOCK LABELS */}
          {shiftLabels.map((label, index) => {
            const positions = [
              {
                left: "50%",
                top: "38px",
                transform: "translateX(-50%)",
              },
              {
                right: "18px",
                top: "50%",
                transform: "translateY(-50%) rotate(90deg)",
              },
              {
                left: "50%",
                bottom: "38px",
                transform: "translateX(-50%)",
              },
              {
                left: "18px",
                top: "50%",
                transform: "translateY(-50%) rotate(-90deg)",
              },
            ];

            const position = positions[index];

            return (
              <span
                key={label}
                className="
  absolute z-20 whitespace-nowrap
  bg-[#F8FAFC]
  px-1.5
  text-[12px]
  font-semibold
  text-slate-800
"
                style={{
                  ...position,
                  lineHeight: "16px",
                }}
              >
                {label}
              </span>
            );
          })}
          {/* CHECK-IN INDICATOR */}
          <div
            className="absolute z-30"
            style={{
              left: "50%",
              top: "8px",
              transform: "translate(-50%, -50%)",
            }}
          >
            {/* TOOLTIP */}
            {/* <div className="absolute -top-10 left-1/2 -translate-x-1/2 rounded-md bg-[#1CC188] px-3 py-1 text-[11px] font-medium text-white shadow">
    Check-in
  </div> */}

            {/* ICON CIRCLE */}
            <div className="flex h-6 w-6 items-center justify-center rounded-full border bg-white shadow-md">
              <Clock3 className="h-4 w-4 text-[#1CC188]" />
            </div>
          </div>
          {checkoutDegree !== null && (
            <div
              className="absolute z-50"
              style={{
                ...getPositionFromDegree(checkoutDegree),
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full border bg-white shadow-md">
                <LogOut className="w-4 h-4 text-red-500" />
              </div>
            </div>
          )}
          {[
            ...attendance.breaks,
            ...(attendance.currentBreak ? [attendance.currentBreak] : []),
          ].map((breakItem) => {
            const breakDegree = getDegreeFromTime(breakItem.startTime);

            const start = new Date(breakItem.startTime);

            const end = breakItem.endTime ? new Date(breakItem.endTime) : null;

            const formatTime = (date: Date) =>
              date.toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              });

            const tooltipPosition =
              breakDegree >= 315 || breakDegree <= 45
                ? {
                    bottom: "36px",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }
                : breakDegree > 45 && breakDegree <= 135
                  ? {
                      left: "36px",
                      top: "50%",
                      transform: "translateY(-50%)",
                    }
                  : breakDegree > 135 && breakDegree <= 225
                    ? {
                        top: "36px",
                        left: "50%",
                        transform: "translateX(-50%)",
                      }
                    : {
                        right: "36px",
                        top: "50%",
                        transform: "translateY(-50%)",
                      };

            return (
              <div
                key={breakItem.id}
                className="group absolute z-40"
                style={{
                  ...getPositionFromDegree(breakDegree),
                  transform: "translate(-50%, -50%)",
                }}
              >
                {/* TOOLTIP */}
                {/* <div
                  className="
    pointer-events-none
    absolute
    hidden
    min-w-max
    rounded-md
    border
    border-red-100
    bg-[#FFE9E9]
    p-1.5
    text-[10px]
    font-medium
    leading-4
    text-[#FF5A5A]
    shadow-sm
    group-hover:block
  "
                  style={tooltipPosition}
                >
                  <div className="flex gap-1">
                    <span className="text-[#FF6B6B]">from</span>

                    <span className="font-semibold">{formatTime(start)}</span>
                  </div>

                  {end && (
                    <div className="flex gap-1">
                      <span className="text-[#FF6B6B]">to</span>

                      <span className="font-semibold">{formatTime(end)}</span>
                    </div>
                  )}
                </div> */}

                {/* ICON */}
                <div className="flex h-5 w-5 items-center justify-center rounded-full border bg-white shadow-md">
                  <Hourglass className="h-3 w-3 text-amber-500" />
                </div>
              </div>
            );
          })}
          {/* INNER CIRCLE */}
          <div className="absolute left-1/2 top-1/2 flex h-53 w-53 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-[#5084BB] bg-white text-center">
            <Clock3 className="mb-4 h-8 w-6 text-[#2F80ED]" />

            <h3 className="text-[18px] font-bold text-slate-900">
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </h3>

            <p className="text-sm text-slate-400">
              {workedLabel}, {attendance.breaks.length} Breaks
            </p>
          </div>
        </div>
      </div>

      <div className="flex w-full gap-3">
        {!isCheckedIn ? (
          <Button
            onClick={handleCheckIn}
            variant={"default"}
            disabled={loadingAction !== null}
            className="flex-1 flex gap-4 "
          >
            <Clock className="h-4 w-4 " />
            {loadingAction === "checkin" ? "Checking In..." : "Check-In"}
          </Button>
        ) : (
          <Button
            onClick={handleCheckOut}
            variant={"destructive"}
            disabled={loadingAction !== null || isOnBreak}
            className="flex-1 flex gap-4  "
          >
            <LogOut className="h-4 w-4 " />
            {loadingAction === "checkout" ? "Checking Out..." : "Check-Out"}
          </Button>
        )}

        {!isOnBreak ? (
          <Button
            variant={"outline"}
            onClick={handleBreakStart}
            disabled={!isCheckedIn || loadingAction !== null}
            className="flex-1 flex gap-4 "
          >
            <Hourglass className=" h-4 w-4" />
            {loadingAction === "breakStart" ? "Starting..." : "Start Break"}
          </Button>
        ) : (
          <Button
            variant={"outline"}
            onClick={handleBreakEnd}
            disabled={loadingAction !== null}
            className=" flex-1 flex gap-4"
          >
            <Hourglass className="h-4 w-4" />
            {loadingAction === "breakEnd" ? "Stopping..." : "Stop Break"}
          </Button>
        )}

        <Button
          onClick={resetAttendance}
          variant="outline"
          className=" flex-1 flex gap-4"
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
