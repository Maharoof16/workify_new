"use client";

import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Clock, Clock3, Hourglass, LogOut } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import TimehubClock from "@/assets/TimeHub-clock.png";
import {
  Attendance,
  BreakPayload,
  CheckInPayload,
  CheckOutPayload,
} from "@/modules/timehub/attendance/attendance";
import { Shift } from "@/modules/config/shifts/shift";
import { AttendanceService } from "@/modules/timehub/attendance/attendance.service";
import { ShiftService } from "@/modules/config/shifts/shift.service";
import { Skeleton } from "@/components/ui/skeleton";

const getCurrentLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });
  });
};

export default function TimeHub() {
  const [mounted, setMounted] = useState(false);
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const attendanceData = attendance?.attendance;

  const [loading, setLoading] = useState(true);
  const [shifts, setShifts] = useState<Shift[]>([]);

  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const isCheckedIn = !!attendanceData?.start_date && !attendanceData?.end_date;

  const isOnBreak = attendanceData?.action === "ON_BREAK";
  const [liveNow, setLiveNow] = useState(Date.now());

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);

      const [attendanceRes, shiftRes] = await Promise.all([
        AttendanceService.getCurrentAttendance(),
        ShiftService.getAll(),
      ]);

      setAttendance(attendanceRes);

      const shiftsData = shiftRes;

      setShifts(shiftsData);

      const attendanceShiftId = attendanceRes.attendance.shift_id;

      const matchedShift = (shiftsData || []).find(
        (shift: Shift) => String(shift.id) === String(attendanceShiftId),
      );

      setSelectedShift(matchedShift || shiftsData[0] || null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (!isCheckedIn) return;

    const interval = setInterval(() => {
      setLiveNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [isCheckedIn]);

  const [loadingAction, setLoadingAction] = useState<
    "checkin" | "checkout" | "breakStart" | "breakEnd" | null
  >(null);

  const getHourFromTime = (time: string) => {
    return Number(time.split(":")[0]);
  };

  const formatHour = (hour: number) => {
    const normalized = hour % 24;

    const h = normalized % 12 || 12;

    const suffix = normalized >= 12 ? "PM" : "AM";

    return `${h}:00 ${suffix}`;
  };
  const workedLabel = useMemo(() => {
    if (!attendanceData?.start_date) {
      return "0h 0m";
    }

    let workedMs = attendanceData.work_duration || 0;

    const shouldRunTimer =
      isCheckedIn && !attendanceData.end_date && !isOnBreak;

    if (shouldRunTimer) {
      const now = liveNow;

      const backendCalculatedUntil = new Date(
        attendanceData.attendance_date,
      ).getTime();

      const liveExtra = now - backendCalculatedUntil;

      workedMs += Math.max(0, liveExtra);
    }

    const hrs = Math.floor(workedMs / 3600000);

    const mins = Math.floor((workedMs % 3600000) / 60000);

    return `${hrs}h ${mins}m`;
  }, [attendanceData, isCheckedIn, isOnBreak, liveNow]);

  if (!mounted || loading || !selectedShift || !attendanceData) {
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
        <div className="flex flex-col gap-3">
          <Skeleton className="h-5 w-40" />

          <Skeleton className="h-11 w-full rounded-lg" />
        </div>

        {/* Ring */}
        <div className="flex items-center justify-center">
          <div className="relative h-[300px] w-[300px]">
            <Skeleton className="h-full w-full rounded-full" />

          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Skeleton className="h-10 flex-1 rounded-md" />

          <Skeleton className="h-10 flex-1 rounded-md" />
        </div>
      </div>
    );
  }

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

  const handleCheckIn = async () => {
    try {
      setLoadingAction("checkin");

      const position = await getCurrentLocation();

      const payload: CheckInPayload = {
        latitude: String(position.coords.latitude),

        longitude: String(position.coords.longitude),

        start_date: new Date().toISOString(),
      };

      const res = await AttendanceService.checkIn(payload);

      setAttendance(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleCheckOut = async () => {
    try {
      setLoadingAction("checkout");

      const position = await getCurrentLocation();

      const payload: CheckOutPayload = {
        end_date: new Date().toISOString(),

        check_out_latitude: String(position.coords.latitude),

        check_out_longitude: String(position.coords.longitude),
      };

      const res = await AttendanceService.checkOut(payload);

      setAttendance(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleBreakStart = async () => {
    try {
      setLoadingAction("breakStart");

      const position = await getCurrentLocation();

      const payload: BreakPayload = {
        date: new Date().toISOString(),

        flag: "start",

        break_start_latitude: String(position.coords.latitude),

        break_start_longitude: String(position.coords.longitude),
      };

      const res = await AttendanceService.break(payload);

      setAttendance(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingAction(null);
    }
  };
  const handleBreakEnd = async () => {
    try {
      setLoadingAction("breakEnd");

      const position = await getCurrentLocation();

      const payload: BreakPayload = {
        date: new Date().toISOString(),

        flag: "end",

        break_end_latitude: String(position.coords.latitude),

        break_end_longitude: String(position.coords.longitude),
      };

      const res = await AttendanceService.break(payload);

      setAttendance(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingAction(null);
    }
  };

  /* ------------------------------------------------------------------------ */
  /*                                   UI                                     */
  /* ------------------------------------------------------------------------ */

  const getCurrentProgressDegrees = () => {
    if (!attendanceData?.start_date) {
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
      var(--timehub-track) 0deg 360deg )`;
    }

    return `conic-gradient(
    from -90deg,

     var(--timehub-success) 0deg,
     var(--timehub-warning) ${Math.min(progressDeg, 180)}deg,
     var(--timehub-danger) ${progressDeg}deg,

     var(--timehub-track) ${progressDeg}deg,
     var(--timehub-track) 360deg
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
  const checkoutDegree = attendanceData?.end_date ? progressDeg : null;

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
            value={String(selectedShift.id)}
            options={shifts.map((shift) => ({
              id: shift.id,
              label: `${shift.name} (${formatHour(
                getHourFromTime(shift.start_time),
              )} - ${formatHour(getHourFromTime(shift.end_time))})`,
            }))}
            onChange={(val) => {
              const shift = shifts.find((s) => String(s.id) === String(val));
              if (shift) {
                setSelectedShift(shift);
              }
            }}
            trim={false}
            placeholder="Select shift"
            className="mt-2 h-11 rounded-lg border bg-card px-3 text-sm font-medium"
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
  bg-background
  px-1.5
  text-[12px]
  font-semibold
  text-foreground
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
            {/* ICON CIRCLE */}
            <div className="flex h-6 w-6 items-center justify-center rounded-full border bg-card shadow-md">
              <Clock3 className="h-4 w-4 text-timehub-success" />
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
              <div className="flex h-6 w-6 items-center justify-center rounded-full border bg-card shadow-md">
                <LogOut className="w-4 h-4 text-danger-foreground" />
              </div>
            </div>
          )}
          {(attendanceData?.breaks || []).map((breakItem) => {
            const breakDegree = getDegreeFromTime(breakItem.start_date);

            const start = new Date(breakItem.start_date);

            const end = breakItem.end_date
              ? new Date(breakItem.end_date)
              : null;

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
                {/* ICON */}
                <div className="flex h-5 w-5 items-center justify-center rounded-full border bg-card shadow-md">
                  <Hourglass className="h-3 w-3 text-timehub-warning" />
                </div>
              </div>
            );
          })}
          {/* INNER CIRCLE */}
          <div className="absolute left-1/2 top-1/2 flex h-53 w-53 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-timehub-ring-border bg-card text-center">
            <Image
              src={TimehubClock}
              alt={"clock"}
              width={24}
              height={24}
              className="mb-4"
            />

            <h3 className="text-[18px] font-bold text-foreground">
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </h3>

            <p className="text-sm text-foreground/70">
              {workedLabel},{attendanceData?.breaks?.length || 0} Breaks
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
            <Hourglass className=" h-4 w-4 " />
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
      </div>
    </div>
  );
}
