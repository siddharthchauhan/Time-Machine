
import { createContext, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'project_manager' | 'employee';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
}

export interface AuthState {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthState>({
  session: null,
  user: null,
  profile: null,
  isLoading: true,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
