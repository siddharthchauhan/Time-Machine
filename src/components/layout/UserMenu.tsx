
import React from 'react';
import { Link } from 'react-router-dom';
import { Settings, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface UserMenuProps {
  sidebarCollapsed: boolean;
}

const UserMenu = ({ sidebarCollapsed }: UserMenuProps) => {
  return (
    <div className="p-4 border-t border-sidebar-border">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className={cn(
              "w-full text-left flex items-center space-x-3 hover:bg-sidebar-accent hover:text-sidebar-foreground p-2",
              sidebarCollapsed && "justify-center p-0 space-x-0"
            )}
          >
            <Avatar className="h-8 w-8 border border-sidebar-border">
              <AvatarImage src="" />
              <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
                GU
              </AvatarFallback>
            </Avatar>
            {!sidebarCollapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">Guest User</p>
                <p className="text-xs text-sidebar-foreground/70 truncate capitalize">employee</p>
              </div>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link to="/profile" className="flex items-center w-full">
              <UserIcon className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to="/settings" className="flex items-center w-full">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link to="/auth" className="flex items-center w-full">
              <span>Login/Signup (Disabled)</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserMenu;
