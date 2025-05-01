
import { createContext } from 'react';
import { SupabaseClient, User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  role?: string;
  avatar_url?: string;
  department_id?: string;
  manager_id?: string;
}

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  signIn: (email: string, password: string) => Promise<{ error: any } | null>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any } | null>;
  signOut: () => Promise<void>;
  setAuthFlowState: (state: string) => void;
  authFlowState: string;
  refreshProfile: () => Promise<UserProfile | null>;
}

// Create AuthContext with default values
export const AuthContext = createContext<AuthState>({
  user: null,
  profile: null,
  signIn: async () => null,
  signUp: async () => null,
  signOut: async () => {},
  setAuthFlowState: () => {},
  authFlowState: 'signIn',
  refreshProfile: async () => null,
});
