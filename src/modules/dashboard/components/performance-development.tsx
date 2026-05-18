"use client";

import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import training from "@/assets/traininggoals.png";
import React from "@/assets/reactjs.png";

const performanceCards = [
  {
    title: "Training Goals",
    completed: "5 / 7 Completed",
    progress: 70,
    image: training,
    items: [
      {
        name: "Javascript Basics",
        status: "In Progress",
      },
      {
        name: "Advanced CSS",
        status: "Completed",
      },
    ],
  },
  {
    title: "React JS Certification",
    completed: "1 / 3 Achieved",
    progress: 35,
    image: React,
    items: [
      {
        name: "React Fundamentals",
        status: "Certified",
      },
      {
        name: "React Hooks",
        status: "In Progress",
      },
    ],
  },
];

export default function PerformanceDevelopment() {
  return (
    <div
      className="border border-dashboard-border
  bg-linear-to-b
  from-dashboard-card-from
  to-dashboard-card-to rounded-xl  p-0"
    >
      <CardContent className="px-4 py-5">
        <h3 className="text-base font-semibold py-2">
          Performance & Development
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {performanceCards.map((card, index) => {
            return (
              <div
                key={index}
                className="rounded-md border border-[#E2EAF3] bg-white/70 backdrop-blur-sm p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="relative h-11 w-11 overflow-hidden rounded-full bg-[#EAF6FF]">
                    <Image
                      src={card.image || ""}
                      alt={card.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-[18px] font-semibold text-[#16315C]">
                      {card.title}
                    </h3>

                    <p className="mt-1 text-sm text-[#7D8CA1]">
                      {card.completed}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex gap-[2px]">
                  {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                    <div
                      key={item}
                      className={`h-3 flex-1 rounded-sm ${
                        item <= Math.round(card.progress / 14)
                          ? "bg-linear-to-b from-[#47BD47] to-[#08A749]"
                          : "bg-[#E8F0F8]"
                      }`}
                    />
                  ))}
                </div>

                <div className="mt-5 space-y-2">
                  {card.items.map((item, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between">
                        <p className="text-[15px] text-[#2E3C54]">
                          {item.name}
                        </p>

                        <span className="text-sm text-[#98A4B5]">
                          {item.status}
                        </span>
                      </div>

                      {idx !== card.items.length - 1 && (
                        <div className="mt-2 border-b border-[#EEF2F6]" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-center">
                  <Button
                    variant="outline"
                    className="h-8 rounded-sm border border-[#D9E5F2] bg-[#F6FAFE] px-5 py-4 text-xs font-medium text-[#1683E2] hover:bg-[#EEF6FF]"
                  >
                    View Goals
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </div>
  );
}
