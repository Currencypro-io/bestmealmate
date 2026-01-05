import { getSupabaseClient } from './supabase';

export type MealPlan = Record<string, Record<string, string>>;

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  return getSupabaseClient() !== null;
};

// Get anonymous user ID (stored in localStorage for simplicity)
const getAnonymousUserId = (): string => {
  if (typeof window === 'undefined') return '';
  
  let userId = localStorage.getItem('anonymous_user_id');
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem('anonymous_user_id', userId);
  }
  return userId;
};

// Fetch meal plans from Supabase
export async function fetchMealPlans(): Promise<MealPlan> {
  if (typeof window === 'undefined') {
    return {}; // Server-side rendering
  }
  
  if (!isSupabaseConfigured()) {
    // Fallback to localStorage
    const saved = localStorage.getItem('mealPlan');
    return saved ? JSON.parse(saved) : {};
  }

  const userId = getAnonymousUserId();
  const supabase = getSupabaseClient();
  
  if (!supabase) {
    const saved = localStorage.getItem('mealPlan');
    return saved ? JSON.parse(saved) : {};
  }
  
  const { data, error } = await supabase
    .from('meal_plans')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching meal plans:', error);
    // Fallback to localStorage
    const saved = localStorage.getItem('mealPlan');
    return saved ? JSON.parse(saved) : {};
  }

  // Convert array to nested object structure
  const mealPlan: MealPlan = {};
  data?.forEach((row) => {
    if (!mealPlan[row.day]) {
      mealPlan[row.day] = {};
    }
    mealPlan[row.day][row.meal_type] = row.meal_name;
  });

  return mealPlan;
}

// Save/update a meal in Supabase
export async function saveMeal(day: string, mealType: string, mealName: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    // Fallback handled by component
    return false;
  }

  const userId = getAnonymousUserId();
  const supabase = getSupabaseClient();
  
  if (!supabase) return false;

  // Upsert (insert or update)
  const { error } = await supabase
    .from('meal_plans')
    .upsert(
      {
        user_id: userId,
        day,
        meal_type: mealType,
        meal_name: mealName,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id,day,meal_type',
      }
    );

  if (error) {
    console.error('Error saving meal:', error);
    return false;
  }

  return true;
}

// Remove a meal from Supabase
export async function removeMeal(day: string, mealType: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false;
  }

  const userId = getAnonymousUserId();
  const supabase = getSupabaseClient();
  
  if (!supabase) return false;

  const { error } = await supabase
    .from('meal_plans')
    .delete()
    .eq('user_id', userId)
    .eq('day', day)
    .eq('meal_type', mealType);

  if (error) {
    console.error('Error removing meal:', error);
    return false;
  }

  return true;
}

// Sync entire meal plan to Supabase (for bulk updates)
export async function syncMealPlan(mealPlan: MealPlan): Promise<boolean> {
  if (typeof window === 'undefined') {
    return false; // Server-side
  }
  
  // Always save to localStorage
  localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
  
  if (!isSupabaseConfigured()) {
    return true;
  }

  const userId = getAnonymousUserId();
  const supabase = getSupabaseClient();
  
  if (!supabase) return true; // Already saved to localStorage

  // Convert nested object to array of rows
  const rows: Array<{
    user_id: string;
    day: string;
    meal_type: string;
    meal_name: string;
    updated_at: string;
  }> = [];

  Object.entries(mealPlan).forEach(([day, meals]) => {
    Object.entries(meals).forEach(([mealType, mealName]) => {
      if (mealName) {
        rows.push({
          user_id: userId,
          day,
          meal_type: mealType,
          meal_name: mealName,
          updated_at: new Date().toISOString(),
        });
      }
    });
  });

  // Delete all existing and insert new
  const { error: deleteError } = await supabase
    .from('meal_plans')
    .delete()
    .eq('user_id', userId);

  if (deleteError) {
    console.error('Error deleting old meals:', deleteError);
    return false;
  }

  if (rows.length > 0) {
    const { error: insertError } = await supabase
      .from('meal_plans')
      .insert(rows);

    if (insertError) {
      console.error('Error inserting meals:', insertError);
      return false;
    }
  }

  return true;
}
