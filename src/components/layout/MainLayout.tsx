
import React, { ReactNode, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Skeleton } from '@/components/ui/skeleton';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
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
      <Sidebar 
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />

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
