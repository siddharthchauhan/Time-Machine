
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { navItems } from './navItems';
import SidebarHeader from './SidebarHeader';
import UserMenu from './UserMenu';

interface SidebarProps {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (value: boolean) => void;
}

const Sidebar = ({ sidebarCollapsed, setSidebarCollapsed }: SidebarProps) => {
  const location = useLocation();

  return (
    <aside 
      className={cn(
        "bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300",
        sidebarCollapsed ? "w-16" : "w-64"
      )}
    >
      <SidebarHeader 
        sidebarCollapsed={sidebarCollapsed} 
        setSidebarCollapsed={setSidebarCollapsed} 
      />
      
      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center px-4 py-2 rounded-md transition-colors",
                  location.pathname === item.path 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                  sidebarCollapsed && "justify-center px-2"
                )}
              >
                <item.icon className={cn("h-5 w-5", sidebarCollapsed ? "h-6 w-6" : "")} />
                {!sidebarCollapsed && <span className="ml-3">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <UserMenu sidebarCollapsed={sidebarCollapsed} />
      
      {sidebarCollapsed && (
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground absolute top-16 -right-6 rounded-full bg-sidebar shadow-md"
        >
          <Menu className="h-4 w-4" />
        </Button>
      )}
    </aside>
  );
};

export default Sidebar;
