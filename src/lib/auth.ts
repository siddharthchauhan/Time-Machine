
import { createContext, useContext } from 'react';

export type UserRole = 'admin' | 'project_manager' | 'employee';

export interface UserProfile {
  id?: string;
  email?: string;
  full_name?: string | null;
  role?: UserRole;
}

export interface AuthState {
  profile: UserProfile | null;
}

export const AuthContext = createContext<AuthState>({
  profile: {
    full_name: 'Demo User',
    role: 'employee'
  }
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
