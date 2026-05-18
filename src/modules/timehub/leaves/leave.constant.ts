import casualLeaveIcon from "@/assets/casual-leave.png";
import sickLeaveIcon from "@/assets/sick-leave.png";
import earnedLeaveIcon from "@/assets/earned-leave.png";
import compOffIcon from "@/assets/comp-off.png";



export const LEAVE_THEMES = [
  {
    icon: casualLeaveIcon,
    color: "#1482DD",
  },
  {
    icon: sickLeaveIcon,
    color: "#10B981",
  },
  {
    icon: earnedLeaveIcon,
    color: "#7C3AED",
  },
  {
    icon: compOffIcon,
    color: "#F59E0B",
  },
];

export const LEAVE_TYPE_CONFIG: Record<
  string,
  {
    icon: any;
    color: string;
  }
> = {
  "Casual Leave": LEAVE_THEMES[0],
  "Sick Leave": LEAVE_THEMES[1],
  "Earned Leave": LEAVE_THEMES[2],
  "Comp - Off": LEAVE_THEMES[3],
};



export const DEFAULT_LEAVE_CONFIG = {
  icon: earnedLeaveIcon,
  color: "#7C3AED",
};

export const getLeaveTheme = (
  title: string,
  index: number,
) => {
  return (
    LEAVE_TYPE_CONFIG[title] ??
    LEAVE_THEMES[index % LEAVE_THEMES.length]
  );
};