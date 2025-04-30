
import { createContext } from 'react';

export type UserRole = 'admin' | 'project_manager' | 'employee';

export interface UserProfile {
  id?: string;
  email?: string;
  full_name?: string | null;
  role?: UserRole;
  manager_id?: string | null;
  department_id?: string | null;
}

export interface AuthState {
  user?: any;
  session?: any;
  profile: UserProfile | null;
}

// This context is now implemented in components/auth/AuthProvider.tsx
export const AuthContext = createContext<AuthState>({
  profile: null
});
