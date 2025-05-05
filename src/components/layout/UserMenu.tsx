
import React from 'react';
import { Link } from 'react-router-dom';
import { Settings, User as UserIcon, LogOut } from 'lucide-react';
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
import { useAuth } from '@/hooks/use-auth';

interface UserMenuProps {
  sidebarCollapsed: boolean;
}

const UserMenu = ({ sidebarCollapsed }: UserMenuProps) => {
  const { user, profile, signOut } = useAuth();
  
  // Get initials for avatar
  const getInitials = () => {
    if (!profile) return 'GU';
    
    if (profile.full_name) {
      const names = profile.full_name.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      }
      return profile.full_name.substring(0, 2).toUpperCase();
    }
    
    if (profile.email) {
      return profile.email.substring(0, 2).toUpperCase();
    }
    
    return 'GU';
  };
  
  // Get display name
  const getDisplayName = () => {
    if (!profile) return 'Guest User';
    return profile.full_name || profile.email || 'User';
  };
  
  // Get role to display
  const getRole = () => {
    if (!profile) return 'guest';
    return profile.role || 'employee';
  };
  
  const handleSignOut = async () => {
    await signOut();
  };
  
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
              <AvatarImage src={profile?.avatar_url || ""} />
              <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            {!sidebarCollapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">{getDisplayName()}</p>
                <p className="text-xs text-sidebar-foreground/70 truncate capitalize">{getRole()}</p>
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
          {user ? (
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem>
              <Link to="/auth" className="flex items-center w-full">
                <span>Login/Signup</span>
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserMenu;
