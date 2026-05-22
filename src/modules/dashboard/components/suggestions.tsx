"use client";

import { CardContent } from "@/components/ui/card";
import { BookOpen, Award, Heart, ArrowRight } from "lucide-react";

const suggestions = [
  {
    title: "Continue Your Learning",
    description:
      "You have 2 modules left in “Advanced React Patterns”. Keep up the good work!",
    action: "Resume Course",
    icon: BookOpen,
    iconColor: "text-[#2563EB]",
    iconBg: "bg-[#EAF2FF]",
    buttonColor: "text-[#2563EB]",
    cardBg: "bg-[#F8FBFF]",
  },
  {
    title: "New Suggested Skills",
    description:
      "Based on your profile, we recommend adding TypeScript and GraphQL to your skill set.",
    action: "View Skills",
    icon: Award,
    iconColor: "text-[#9333EA]",
    iconBg: "bg-[#F3E8FF]",
    buttonColor: "text-[#9333EA]",
    cardBg: "bg-[#FCFAFF]",
  },
  {
    title: "Recognize a Colleague",
    description:
      "It’s been a while since you gave a shoutout. Recognize someone for their help!",
    action: "Give Recognition",
    icon: Heart,
    iconColor: "text-[#EC4899]",
    iconBg: "bg-[#FCE7F3]",
    buttonColor: "text-[#EC4899]",
    cardBg: "bg-[#FFF9FC]",
  },
];

export function SuggestionsCard() {
  return (
    <div className="rounded-xl border border-dashboard-border bg-linear-to-b from-dashboard-card-from to-dashboard-card-to">
      <CardContent className="p-4 flex flex-col gap-2">
        <h3 className="py-2 text-base font-semibold text-foreground">
          Suggestions
        </h3>

        <div className="space-y-6">
          {suggestions.map((item, i) => {
            const Icon = item.icon;

            return (
              <div
                key={i}
                className={`rounded-md border border-border bg-card p-4 min-h-44 flex flex-col justify-between ${item.cardBg}`}
              >
                <div className="flex gap-5">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${item.iconBg}`}
                  >
                    <Icon className={`h-5 w-5 ${item.iconColor}`} />
                  </div>

                  <div>
                    <h3 className="text-[15px] font-semibold text-foreground">
                      {item.title}
                    </h3>

                    <p className="max-w-[260px] text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>

                <button
                  className={`group cursor-pointer flex items-center gap-2 text-sm font-medium transition-all ${item.buttonColor}`}
                >
                  {item.action}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </div>
  );
}
