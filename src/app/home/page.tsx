import GreetingBanner from "@/components/dashboard/banner";
import ProjectCards, { Project } from "@/components/dashboard/project-cards";
import TimeHub from "@/components/dashboard/timehub";
import { HolidaysCard } from "@/components/holidays/holiday-card";
import { LeaveBalanceCard } from "@/components/leaves/leave-card";
import Image from "next/image";
import FooterImg from "@/assets/footer.png";

export const dummyProjects: Project[] = [
  {
    id: "1",
    title: "Workify HRMS Dashboard",
    status: "In Progress",
    priority: "Low",
    createdAt: "2026-05-08T10:00:00Z",
    assignees: [
      {
        id: "u1",
        name: "Maharoof Kp",
      },
      {
        id: "u2",
        name: "Arjun S",
      },
      {
        id: "u3",
        name: "Rahul P",
      },
    ],
  },
  {
    id: "2",
    title: "Attendance Tracking System ",
    status: "Open",
    priority: "Medium",
    createdAt: "2026-05-05T09:30:00Z",
    assignees: [
      {
        id: "u4",
        name: "Akhil R",
      },
      {
        id: "u5",
        name: "Nihal M",
      },
    ],
  },
  {
    id: "3",
    title: "Employee Analytics Portal",
    status: "Completed",
    priority: "High",
    createdAt: "2026-05-01T14:15:00Z",
    assignees: [
      {
        id: "u6",
        name: "Sneha T",
      },
      {
        id: "u7",
        name: "Vishnu K",
      },
      {
        id: "u8",
        name: "Anjali P",
      },
      {
        id: "u9",
        name: "Rohan D",
      },
    ],
  },
  {
    id: "4",
    title: "Timesheet Management",
    status: "On Hold",
    priority: "Low",
    createdAt: "2026-04-28T11:45:00Z",
    assignees: [
      {
        id: "u10",
        name: "Faris A",
      },
      {
        id: "u11",
        name: "Diya S",
      },
    ],
  },
];

export default function Page() {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
      <div className="xl:col-span-12">
        <GreetingBanner />
      </div>
      
      <div className="xl:col-span-4">
        <TimeHub />
      </div>

      <div className="xl:col-span-8">
      </div>


      <div className="xl:col-span-4">
        <ProjectCards projects={dummyProjects} />
      </div>

       <div className="xl:col-span-8">
      </div>


      <div className="xl:col-span-4">
        <HolidaysCard />
      </div>

      <div className="xl:col-span-4">
        <LeaveBalanceCard />
      </div>
      <div className="xl:col-span-4">
      </div>

      <div className="xl:col-span-12">
        <Image src={FooterImg} alt="Leave Policy" />
      </div>
    </div>
  );
}
