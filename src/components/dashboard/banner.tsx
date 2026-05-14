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
import { DashboardService } from "@/services/dashboard.service";

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
    "flex items-center gap-2 rounded-full bg-background/40 dark:bg-background/10 hover:bg-background/60 dark:hover:bg-background/20 text-primary border border-border shadow-sm px-3 py-1 text-xs sm:text-sm";

  return (
    <Card
      className="w-full rounded-xl 
bg-linear-to-r from-accent to-secondary
  px-4 sm:px-6 py-3 relative overflow-hidden"
    >
      <div className="hidden md:block absolute inset-0 pointer-events-none z-0">
        <div className="absolute right-[25vw] top-1/2 -translate-y-1/2 w-80 h-[calc(100%-4rem)] opacity-60">
          <Image src={HomeArrows} alt="bg" className="object-contain" />
        </div>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-4">
        <div className="space-y-3 w-full">
          <div>
            <p className="text-[18px] font-medium text-foreground">
              {greeting}!
            </p>

            <h1 className="text-xl sm:text-3xl font-semibold text-primary">
              Maharoof Kakkidiparambil
            </h1>
          </div>

          <div className="bg-background/30 dark:bg-background/5 border border-border backdrop-blur-lg rounded-lg p-3 w-full lg:max-w-lg shadow-sm">
            <p className=" mb-3 font-medium text-sm sm:text-base">
              Ready to make today impactful?
            </p>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              {actions.map(({ label, icon: Icon, route }) => (
                <Button
                  key={label}
                  className={actionBtn}
                  // onClick={() => router.push(route)}
                >
                  <Icon size={14} />
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-xs">
              <Calendar size={14} />
              {formattedDate}
            </div>

            <div className="flex md:flex-col gap-2">
              <div className="bg-background backdrop-blur-md rounded-xl px-3 py-2 w-40 border border-background shadow-sm">
                <div className="flex items-center gap-4">
                  <Image
                    src={weatherIcon}
                    alt="weather"
                    className="w-7 h-7 object-contain"
                  />
                  
                <div>
                    <span className="text-regular ">
                    {temp !== null ? `${temp}°C` : "--"}
                  </span>
                <p className="text-xs text-muted-foreground">{location}</p>
                </div>
                </div>
              </div>

              <div className="bg-secondary backdrop-blur-md rounded-xl px-3 py-2 w-40 border border-background shadow-sm">
                <div className="flex items-center gap-2">
                  <Image
                    src={timehubIcon}
                    alt="time"
                    className="w-7 h-6 object-contain"
                  />
                  <span className="text-regular">8h 12m</span>
                </div>
                <p className="text-xs text-muted-foreground">Worked Today</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
