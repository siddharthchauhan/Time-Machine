
import React, { ReactNode, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  LayoutDashboard, 
  ClipboardCheck, 
  Users, 
  BarChart4, 
  Settings, 
  LogOut, 
  Menu, 
  ChevronRight
} from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

// Define the navigation items array
const navItems = [
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

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const { toast } = useToast();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();

  console.log('MainLayout: Rendering with state', { 
    isLoading, 
    hasUser: !!user, 
    hasProfile: !!profile,
    currentLocation: location.pathname 
  });

  useEffect(() => {
    console.log('MainLayout: useEffect auth check', { isLoading, hasUser: !!user });
    
    if (!isLoading && !user) {
      console.log('MainLayout: No user detected, redirecting to auth');
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  const handleLogout = async () => {
    console.log('MainLayout: Logging out');
    
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      navigate('/auth');
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: "Error logging out",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    console.log('MainLayout: Showing loading state');
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="w-full max-w-md space-y-6 p-6">
          <div className="space-y-2 text-center">
            <Skeleton className="mx-auto h-12 w-12 rounded-full" />
            <Skeleton className="mx-auto h-6 w-48" />
            <Skeleton className="mx-auto h-4 w-36" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    console.log('MainLayout: No user or profile, redirecting to auth');
    navigate('/auth');
    return null;
  }

  console.log('MainLayout: Rendering content for authenticated user');

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300",
          sidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Sidebar Header */}
        <div className="p-4 flex items-center justify-between h-16 border-b border-sidebar-border">
          <div className={cn("flex items-center", sidebarCollapsed ? "justify-center w-full" : "")}>
            <Clock className="h-6 w-6 text-white" />
            {!sidebarCollapsed && <h1 className="text-xl font-bold ml-2">Tempo Focus</h1>}
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={cn(
              "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
              sidebarCollapsed && "hidden"
            )}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
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
        </div>
        
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
        
        {/* User Menu */}
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
                    {profile.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                {!sidebarCollapsed && (
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium truncate">{profile.full_name || 'User'}</p>
                    <p className="text-xs text-sidebar-foreground/70 truncate capitalize">{profile.role}</p>
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/profile" className="flex items-center w-full">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/settings" className="flex items-center w-full">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
