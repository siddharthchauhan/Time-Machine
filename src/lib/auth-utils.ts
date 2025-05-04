
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
    
    // First check if profile already exists
    const existingProfile = await fetchProfile(user.id);
    if (existingProfile) {
      console.log("Profile already exists, returning existing profile");
      return existingProfile;
    }
    
    // Create a profile via an insert operation
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
      
      // If the error is not a duplicate key violation, return null
      if (error.code !== '23505') { // 23505 is the Postgres error code for unique_violation
        console.error("Cannot create profile due to permission issues. This is likely a Row Level Security (RLS) policy restriction.");
        
        // Return a minimal profile object to prevent errors in the UI
        return {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email
        };
      }
      
      // If it's a duplicate key error, try to fetch the profile again
      return fetchProfile(user.id);
    }
    
    console.log("Successfully created profile:", newProfile);
    return newProfile;
  } catch (error) {
    console.error("Exception creating profile:", error);
    return null;
  }
};
