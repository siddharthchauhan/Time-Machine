
import { Clock, FileCheck, BarChart3, Users, Settings, User, Timer, Home, Briefcase, FolderKanban } from "lucide-react";

export const navItems = [
  {
    label: "Dashboard",
    path: "/",
    icon: Home,
  },
  {
    label: "Time Tracker",
    path: "/time-tracker",
    icon: Timer,
  },
  {
    label: "Projects",
    path: "/projects",
    icon: FolderKanban,
  },
  {
    label: "Clients",
    path: "/clients",
    icon: Briefcase,
  },
  {
    label: "Approvals",
    path: "/approvals",
    icon: FileCheck,
  },
  {
    label: "Team",
    path: "/team",
    icon: Users,
  },
  {
    label: "Reports",
    path: "/reports",
    icon: BarChart3,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
  {
    label: "Profile",
    path: "/profile",
    icon: User,
  },
];
