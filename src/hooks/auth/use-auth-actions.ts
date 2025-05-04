
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { fetchProfile, tryCreateProfile } from '@/lib/auth-utils';
import { UserProfile } from '@/lib/auth';

/**
 * Custom hook to handle authentication actions like sign-in, sign-up, and sign-out
 */
export const useAuthActions = (
  user: User | null, 
  setProfile: (profile: UserProfile | null) => void
) => {
  const { toast } = useToast();
  
  /**
   * Handles user sign in with email and password
   */
  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting sign in for email:", email);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error("Sign in error:", error);
        return { error };
      }
      
      console.log("Sign in successful for user:", data.user?.id);
      return { data, error: null };
    } catch (error: any) {
      console.error("Exception in signIn:", error);
      return { 
        data: null, 
        error: { 
          message: error.message || "Could not connect to authentication service. Please try again." 
        } 
      };
    }
  };

  /**
   * Handles user sign up with email, password, and optional metadata
   */
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      console.log("Attempting sign up for email:", email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });
      
      if (error) {
        console.error("Sign up error:", error);
        return { error };
      }
      
      console.log("Sign up successful for user:", data.user?.id);
      
      // After successful signup, try to create a profile immediately
      if (data.user) {
        console.log("Creating profile for new user");
        setTimeout(async () => {
          const profile = await tryCreateProfile(data.user!);
          if (profile) {
            console.log("Profile created successfully", profile);
            setProfile(profile);
          } else {
            console.warn("Could not create profile immediately after signup");
            // Set minimal profile as fallback
            setProfile({ 
              id: data.user!.id, 
              email: data.user!.email!,
              full_name: data.user!.user_metadata?.full_name || data.user!.email
            });
          }
        }, 500);
      }
      
      return { data, error: null };
    } catch (error: any) {
      console.error("Exception in signUp:", error);
      return { 
        data: null, 
        error: { 
          message: error.message || "Could not connect to authentication service. Please try again." 
        } 
      };
    }
  };

  /**
   * Handles user sign out
   */
  const signOut = async () => {
    try {
      console.log("Signing out user");
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Sign out failed",
        description: "Could not sign out. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    signIn,
    signUp,
    signOut
  };
};
