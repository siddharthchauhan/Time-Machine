
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

export const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    console.log("Fetching profile for user ID:", userId);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
      
    if (error) {
      console.error("Error fetching profile:", error);
      
      // Check if it's a "not found" error and create a new profile
      if (error.code === 'PGRST116') {
        console.log("Profile not found, attempting to create one");
        
        // Get user details to create a new profile
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (!userError && userData.user) {
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              email: userData.user.email,
              full_name: userData.user.user_metadata?.full_name || userData.user.email,
              role: 'employee'
            })
            .select('*')
            .single();
            
          if (!createError && newProfile) {
            console.log("Created new profile:", newProfile);
            return newProfile;
          } else {
            console.error("Error creating new profile:", createError);
          }
        }
      }
      
      return null;
    }
    
    console.log("Profile fetched:", data ? "success" : "not found");
    return data;
  } catch (error) {
    console.error("Exception fetching profile:", error);
    return null;
  }
};

export const tryCreateProfile = async (user: User): Promise<UserProfile | null> => {
  if (!user.email) return null;
  
  try {
    const { data: newProfile, error: createError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.email,
        role: 'employee'
      })
      .select('*')
      .single();
      
    if (!createError && newProfile) {
      console.log("Created new profile as last resort:", newProfile);
      return newProfile;
    }
    
    return null;
  } catch (error) {
    console.error("Error creating profile:", error);
    return null;
  }
};
