
import { UserProfile } from '@/lib/auth';

/**
 * Checks if a user has manager level permissions (admin or project manager)
 */
export const isManager = (profile: UserProfile | null): boolean => {
  if (!profile) return false;
  return profile.role === 'admin' || profile.role === 'manager' || profile.role === 'project_manager';
};

/**
 * Checks if a user is authenticated
 */
export const isAuthenticated = (profile: UserProfile | null): boolean => {
  return !!profile?.id;
};

/**
 * Checks if a user is an admin
 */
export const isAdmin = (profile: UserProfile | null): boolean => {
  if (!profile) return false;
  return profile.role === 'admin';
};
