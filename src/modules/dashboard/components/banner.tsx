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

export default function GreetingBanner() {
  const [location, setLocation] = useState("");
  const [temp, setTemp] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
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
        }
      },
      () => {
        toast.error("Location blocked. Please allow access.");
        setLocation("Location blocked");
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
            <p className="text-[18px] font-medium text-[var(--banner-text)]">
              {greeting}!
            </p>

            <h1 className="text-xl md:text-3xl font-semibold text-primary">
              Maharoof Kakkidiparambil
            </h1>
          </div>

          <div className="bg-background/20 border-2 border-[var(--banner-card-border)] backdrop-blur-lg rounded-lg p-3 w-full">
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
            <div className="flex items-center gap-2 text-xs font-semibold">
              <Calendar size={14} />
              {formattedDate}
            </div>

            <div className="flex md:flex-col gap-2">
              <div
                className="
    rounded-lg p-3 w-full
    border-2 border-[var(--banner-card-border)]
    bg-[var(--banner-card-bg)]
    backdrop-blur-lg
  "
              >
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
              </div>

              <div    className="
    rounded-lg p-3 w-full
    border-2 border-[var(--banner-card-border)]
    bg-[var(--banner-card-bg)]
    backdrop-blur-lg
  ">
                    <div className="flex items-center gap-4">
                  <Image
                    src={timehubIcon}
                    alt="time"
                    className="w-7 h-7 object-contain"
                  />

                  <div>
                    <span className="font-medium text-[var(--banner-text)]">8h 12m</span>

                    <p className="text-xs text-[var(--banner-muted)]">
                      Worked Today
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
