// "use client";

// import { Card, CardContent } from "@/components/ui/card";
// import { BookOpen, Award, Heart, ArrowRight } from "lucide-react";

// const suggestions = [
//   {
//     title: "Continue Your Learning",
//     description:
//       "You have 2 modules left in “Advanced React Patterns”. Keep up the good work!",
//     action: "Resume Course",
//     icon: BookOpen,
//     color: "text-blue-500",
//     bg: "bg-blue-100",
//   },
//   {
//     title: "New Suggested Skills",
//     description:
//       "Based on your profile, we recommend adding TypeScript and GraphQL to your skill set.",
//     action: "View Skills",
//     icon: Award,
//     color: "text-purple-500",
//     bg: "bg-purple-100",
//   },
//   {
//     title: "Recognize a Colleague",
//     description:
//       "It’s been a while since you gave a shoutout. Recognize someone for their help!",
//     action: "Give Recognition",
//     icon: Heart,
//     color: "text-pink-500",
//     bg: "bg-pink-100",
//   },
// ];

// export function SuggestionsCard() {
//   return (
//   <div
//       className="border border-dashboard-border
//   bg-linear-to-b
//   from-dashboard-card-from
//   to-dashboard-card-to rounded-xl  p-0"
//     >
//       <CardContent className="px-4 py-3 flex flex-col gap-4">
//         <h2 className="text-lg font-semibold text-muted-foreground">
//           Suggestions
//         </h2>

//         <div className="flex flex-col gap-6 flex-1 justify-between">
//           {suggestions.map((item, i) => {
//             const Icon = item.icon;
//             return (
//               <div
//                 key={i}
//                 className="flex flex-col sm:flex-row gap-3 rounded-md border bg-white/60 backdrop-blur-sm p-4 transition hover:shadow-sm"
//               >
//                 <div
//                   className={`flex h-10 w-10 items-center justify-center rounded-full ${item.bg}`}
//                 >
//                   <Icon className={`h-5 w-5 ${item.color}`} />
//                 </div>

//                 <div className="flex flex-1 flex-col gap-1">
//                   <h3 className="text-sm font-semibold text-foreground">
//                     {item.title}
//                   </h3>

//                   <p className="text-xs text-muted-foreground leading-relaxed">
//                     {item.description}
//                   </p>

//                   <button className="cursor-pointer flex items-center gap-1 text-xs font-medium text-primary hover:underline w-fit">
//                     {item.action}
//                     <ArrowRight className="h-3 w-3" />
//                   </button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </CardContent>
//     </div>
//   );
// }


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
    <div
      className="rounded-xl border border-dashboard-border
      bg-linear-to-b
      from-dashboard-card-from
      to-dashboard-card-to"
    >
      <CardContent className="px-4 py-3 flex flex-col gap-2">
          <h3 className="text-base font-semibold py-2">
          Suggestions
        </h3>

        <div className="space-y-5">
          {suggestions.map((item, i) => {
            const Icon = item.icon;

            return (
              <div
                key={i}
                className={`rounded-md border border-[#E5EDF5] p-4 min-h-[180px] flex flex-col justify-between ${item.cardBg}`}
              >
                <div className="flex gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${item.iconBg}`}
                  >
                    <Icon className={`h-5 w-5 ${item.iconColor}`} />
                  </div>

                  <div>
                    <h3 className="text-[15px] font-semibold text-[#001E4B]">
                      {item.title}
                    </h3>

                    <p className="max-w-[260px] text-xs text-[#6B7280]">
                      {item.description}
                    </p>
                  </div>
                </div>

                <button
                  className={`cursor-pointer flex items-center gap-2 text-sm font-medium ${item.buttonColor}`}
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