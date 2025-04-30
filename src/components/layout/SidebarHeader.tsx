import React from 'react';
import { Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
interface SidebarHeaderProps {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (value: boolean) => void;
}
const SidebarHeader = ({
  sidebarCollapsed,
  setSidebarCollapsed
}: SidebarHeaderProps) => {
  return <div className="p-4 flex items-center justify-between h-16 border-b border-sidebar-border">
      <div className={cn("flex items-center", sidebarCollapsed ? "justify-center w-full" : "")}>
        <Clock className="h-6 w-6 text-white" />
        {!sidebarCollapsed && <h1 className="text-xl font-bold ml-2">Time Machine</h1>}
      </div>
      <Button variant="ghost" size="icon" onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className={cn("text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground", sidebarCollapsed && "hidden")}>
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>;
};
export default SidebarHeader;