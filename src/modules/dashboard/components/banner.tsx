"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, CircleUserRound, Users } from "lucide-react";
import Image from "next/image";
import HomeArrows from "@/assets/Arrows.png";
import { useEffect, useState } from "react";
import weatherIcon from "@/assets/Weather.png";
import timehubIcon from "@/assets/TimeHub-clock.png";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DashboardService } from "@/modules/dashboard/dashboard.service";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { formatDuration } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function GreetingBanner() {
  const [location, setLocation] = useState("");
  const [temp, setTemp] = useState<number | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const user = useSelector((state: RootState) => state.auth?.userData);

  useEffect(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;

          const data = await DashboardService.getLocationAndWeather(
            latitude,
            longitude,
          );

          setLocation(data.location);
          setTemp(data.temperature);
        } catch {
          toast.error("Failed to fetch weather data");
        } finally {
          setLoading(false);
        }
      },
      () => {
        toast.error("Location blocked. Please allow access.");
        setLocation("Location blocked");
        setLoading(false);
      },
    );
  }, []);

  const now = new Date();
  const hours = now.getHours();

  const greeting =
    hours < 12
      ? "Good Morning"
      : hours < 18
        ? "Good Afternoon"
        : "Good Evening";

  const formattedDate = now.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const actions = [
    {
      label: "User Profile",
      icon: CircleUserRound,
      route: "/profile/user",
    },
    {
      label: "CreateTask",
      icon: Plus,
      route: "/projects",
    },
    {
      label: "Go to Team",
      icon: Users,
    },
  ];

  const isUserLoading = !user?.firstName;
  const isLoading = loading || isUserLoading;

  const actionBtn =
    "flex items-center gap-2 rounded-full " +
    "bg-[var(--banner-button-bg)] " +
    "hover:bg-[var(--banner-button-hover)] " +
    "text-[var(--banner-button-text)] " +
    "border border-[var(--banner-card-border)] " +
    "shadow-sm px-3 py-1 text-xs sm:text-sm transition-all duration-300";

  return (
    <Card className="relative overflow-hidden rounded-xl border-[var(--banner-card-border)] bg-linear-to-r from-[var(--banner-from)] to-[var(--banner-to)] px-4 md:px-6">
      <div className="relative z-10 grid grid-cols-12 gap-4 items-center">
        <div className="col-span-12 lg:col-span-5 space-y-8">
          <div>
            {isLoading ? (
              <>
                <Skeleton className="h-5 w-36 mb-3" />
                <Skeleton className="h-8 w-52" />
              </>
            ) : (
              <>
                <p className="text-[18px] font-medium text-[var(--banner-text)]">
                  {greeting}!
                </p>

                <h1 className="text-xl md:text-3xl font-semibold text-primary">
                  {user?.firstName} {user?.lastName}
                </h1>
              </>
            )}
          </div>

          <div className="bg-background/20 border-2 border-[var(--banner-card-border)] backdrop-blur-lg rounded-lg p-3 w-full">
            {loading ? (
              <>
                <Skeleton className="h-5 w-52 mb-4" />

                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-9 w-28 rounded-full" />
                  <Skeleton className="h-9 w-28 rounded-full" />
                  <Skeleton className="h-9 w-28 rounded-full" />
                </div>
              </>
            ) : (
              <>
                <p className="mb-3 font-medium text-sm md:text-[16px]">
                  Ready to make today impactful?
                </p>

                <div className="flex flex-wrap gap-2 md:gap-3">
                  {actions.map(({ label, icon: Icon, route }) => (
                    <Button key={label} className={actionBtn}>
                      <Icon size={14} />
                      {label}
                    </Button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="hidden lg:flex lg:col-span-3 justify-center items-center">
          <div className="opacity-90">
            <Image
              src={HomeArrows}
              alt="bg"
              className="object-contain w-full h-full"
            />
          </div>
        </div>
        <div className="col-span-1" />

        <div className="col-span-12 lg:col-span-3 flex justify-start lg:justify-end">
          <div className="flex flex-col gap-4 justify-center items-center">
            {loading ? (
              <Skeleton className="h-4 w-32" />
            ) : (
              <div className="flex items-center gap-2 text-xs font-semibold">
                <Calendar size={14} />
                {formattedDate}
              </div>
            )}

            <div className="flex md:flex-col gap-2">
              <div
                className="
    rounded-lg p-3 w-full
    border-2 border-[var(--banner-card-border)]
    bg-[var(--banner-card-bg)]
    backdrop-blur-lg
  "
              >
                {loading ? (
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-7 h-7 rounded-full" />

                     <div className="space-y-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <Image
                      src={weatherIcon}
                      alt="weather"
                      className="w-7 h-7 object-contain"
                    />

                    <div>
                      <span className="font-medium text-[var(--banner-text)]">
                        {temp !== null ? `${temp}°C` : "--"}
                      </span>

                      <p className="text-xs text-[var(--banner-muted)]">
                        {location}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div
                className="
    rounded-lg p-3 w-full
    border-2 border-[var(--banner-card-border)]
    bg-[var(--banner-card-bg)]
    backdrop-blur-lg
  "
              >
                {loading ? (
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-7 h-7 rounded-full" />

                    <div className="space-y-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <Image
                      src={timehubIcon}
                      alt="time"
                      className="w-7 h-7 object-contain"
                    />

                    <div>
                      <span className="font-medium text-[var(--banner-text)]">
                        {/* {formatDuration(user?.worked_duration)} */}
                        03h 44m
                      </span>

                      <p className="text-xs text-[var(--banner-muted)]">
                        Worked Today
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
