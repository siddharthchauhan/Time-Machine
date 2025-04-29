
import { 
  Clock, 
  LayoutDashboard, 
  ClipboardCheck, 
  Users, 
  BarChart4, 
  Settings
} from 'lucide-react';

export const navItems = [
  {
    path: '/',
    label: 'Dashboard',
    icon: LayoutDashboard
  },
  {
    path: '/time-tracker',
    label: 'Time Tracker',
    icon: Clock
  },
  {
    path: '/approvals',
    label: 'Approvals',
    icon: ClipboardCheck
  },
  {
    path: '/team',
    label: 'Team',
    icon: Users
  },
  {
    path: '/reports',
    label: 'Reports',
    icon: BarChart4
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: Settings
  }
];
