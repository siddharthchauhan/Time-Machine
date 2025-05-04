
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/lib/auth';

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
    console.log("Attempting to create profile for user:", user.id);
    
    // Create a profile with public RLS policy using the service role client
    const { data: newProfile, error } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.email,
        role: 'employee'
      })
      .select('*')
      .single();
      
    if (error) {
      console.error("Error creating profile:", error);
      
      // If profile already exists, try to fetch it
      if (error.code === '23505') { // Unique violation
        console.log("Profile already exists, fetching instead");
        return fetchProfile(user.id);
      }
      
      return null;
    }
    
    console.log("Successfully created profile:", newProfile);
    return newProfile;
  } catch (error) {
    console.error("Exception creating profile:", error);
    return null;
  }
};
