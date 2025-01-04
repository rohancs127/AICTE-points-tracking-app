import { supabase } from '../Utils/supabaseClient';

export interface Theme {
  id: number;
  title: string;
}

// Fetch all themes
export const fetchThemes = async (): Promise<{ data?: Theme[]; error?: string }> => {
  const { data, error } = await supabase.from('theme').select('*');
  return error ? { error: error.message } : { data: data || [] };
};
