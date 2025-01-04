import { supabase } from '../Utils/supabaseClient';

export const deleteUser = async(
    userId: string
): Promise <void> =>{
    await supabase.auth.admin.deleteUser(userId);
}