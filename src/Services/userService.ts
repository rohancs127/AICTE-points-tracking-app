import { supabase } from '../Utils/supabaseClient';

export interface UserDetails {
  name: string;
  usn: string;
  role: 'student' | 'coordinator';
}

// Add user details to the `public.users` table
export const addUserDetails = async (
  userId: string,
  userDetails: UserDetails
): Promise<{ error?: string }> => {
  const { error } = await supabase
    .from('users')
    .update(userDetails)
    .eq('user_id', userId);

  return error ? { error: error.message } : {};
};

// Get the current user's ID
export const getCurrentUserId = async (): Promise<string | null> => {
  const { data } = await supabase.auth.getUser();
  return data?.user?.id ?? null;
};
