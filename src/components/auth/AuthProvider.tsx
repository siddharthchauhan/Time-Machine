
import { createContext } from 'react';
import { AuthState } from '@/lib/auth';
import { useAuthProvider } from '@/hooks/use-auth-provider';

export const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const authState = useAuthProvider();

  return <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>;
};

export { RequireAuth } from './RequireAuth';
