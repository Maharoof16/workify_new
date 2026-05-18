"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import leaveImg from "@/assets/Leave-Banner.png";

export default function CompOffPolicyCard() {
  return (
    <div
      className="px-3 py-4 flex flex-col justify-between  w-full h-full bg-[#F8FBFF]
          border border-dashboard-border
          bg-linear-to-b
          from-dashboard-card-from
          to-dashboard-card-to rounded-xl"
    >
      <div className="flex flex-col gap-3">
        <h2 className="font-semibold text-[18px]">
          Comp Off Policy Highlights
        </h2>

        <div className="flex flex-col gap-2 text-sm">
          <div className="flex gap-2">
            <ArrowUpRight className="w-4 h-4 text-primary shrink-0" />
            <p className="text-sm">
              Comp Offs must be claimed within 60 days of working on a holiday.
            </p>
          </div>

          <div className="flex gap-2">
            <ArrowUpRight className="w-4 h-4 text-primary  shrink-0" />
            <p className="text-sm">
              Minimum 4 hours work required for Half Day, 8 hours for Full Day
              credit.
            </p>
          </div>
          <div className="flex gap-2">
            <ArrowUpRight className="w-4 h-4 text-primary  shrink-0" />
            <p className="text-sm">
              Manager approval is required for all compensatory leave requests.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Image src={leaveImg} alt="Comp Off Policy" />
      </div>
    </div>
  );
}
