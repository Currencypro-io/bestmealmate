import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Lazy initialization - only create client when credentials are available
let _supabase: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your-supabase-url') {
    return null;
  }
  
  if (!_supabase) {
    _supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  
  return _supabase;
}

// For backwards compatibility
export const supabase = {
  from: (table: string) => {
    const client = getSupabaseClient();
    if (!client) {
      // Return a mock that does nothing
      return {
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: null, error: null }),
        upsert: () => Promise.resolve({ data: null, error: null }),
        delete: () => ({ eq: () => ({ eq: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }) }) }),
      };
    }
    return client.from(table);
  }
};

// Database types for meal plans
export interface MealPlanRow {
  id: string;
  user_id: string;
  day: string;
  meal_type: string;
  meal_name: string;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      meal_plans: {
        Row: MealPlanRow;
        Insert: Omit<MealPlanRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<MealPlanRow, 'id'>>;
      };
    };
  };
}
