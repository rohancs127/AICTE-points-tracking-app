import { supabase } from "../Utils/supabaseClient";

// Sign up a new user
export const signUp = async (
  email: string,
  password: string
): Promise<{ error?: string }> => {
  const { error } = await supabase.auth.signUp({ email, password });
  return error ? { error: error.message } : {};
};

// Log in a user
export const signIn = async (email: string, password: string) => {
  try {
    // Attempt to sign in with email and password
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return { success: false, error: authError.message };
    }

    // Get user details from the auth session
    const user = authData?.user;
    if (!user) {
      return { success: false, error: "No user found after login." };
    }

    // Fetch the user's role from the `users` table
    const { data: userDetails, error: fetchError } = await supabase
      .from("users")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (fetchError) {
      return { success: false, error: "Failed to fetch user role: " + fetchError.message };
    }

    // Validate the role
    const validRoles = ["student", "coordinator"]; // Add more roles as needed
    if (!validRoles.includes(userDetails.role)) {
      return { success: false, error: "Invalid role assigned to the user." };
    }

    // Return success with user and role
    return { success: true, data: { user, role: userDetails.role } };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error occurred.",
    };
  }
};

// Log out the current user
export const signOut = async (): Promise<void> => {
  await supabase.auth.signOut();
};
