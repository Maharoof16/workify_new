"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Award, Heart, ArrowRight } from "lucide-react";

const suggestions = [
  {
    title: "Continue Your Learning",
    description:
      "You have 2 modules left in “Advanced React Patterns”. Keep up the good work!",
    action: "Resume Course",
    icon: BookOpen,
    color: "text-blue-500",
    bg: "bg-blue-100",
  },
  {
    title: "New Suggested Skills",
    description:
      "Based on your profile, we recommend adding TypeScript and GraphQL to your skill set.",
    action: "View Skills",
    icon: Award,
    color: "text-purple-500",
    bg: "bg-purple-100",
  },
  {
    title: "Recognize a Colleague",
    description:
      "It’s been a while since you gave a shoutout. Recognize someone for their help!",
    action: "Give Recognition",
    icon: Heart,
    color: "text-pink-500",
    bg: "bg-pink-100",
  },
];

export function SuggestionsCard() {
  return (
    <Card className="w-full h-full rounded-2xl border bg-linear-to-b from-[#F6FAFE] to-white">
      
      <CardContent className="p-4 flex flex-col h-full">
        
        {/* Header */}
        <h2 className="text-lg font-semibold text-muted-foreground mb-4">
          Suggestions
        </h2>

        {/* List */}
        <div className="flex flex-col gap-6 flex-1 justify-between">
          {suggestions.map((item, i) => {
            const Icon = item.icon;

            return (
              <div
                key={i}
                className="flex flex-col sm:flex-row gap-3 rounded-xl border bg-white/60 backdrop-blur-sm p-4 transition hover:shadow-sm"
              >
                {/* Icon */}
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${item.bg}`}
                >
                  <Icon className={`h-5 w-5 ${item.color}`} />
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col gap-1">
                  <h3 className="text-sm font-semibold text-foreground">
                    {item.title}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>

                  <button className="mt-2 flex items-center gap-1 text-xs font-medium text-primary hover:underline w-fit">
                    {item.action}
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </CardContent>
    </Card>
  );
}