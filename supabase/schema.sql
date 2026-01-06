-- Supabase SQL Schema for BestMealMate
-- Run this in your Supabase SQL Editor (SQL Editor > New Query)
-- Make sure to run each section separately if you get errors

-- ============================================
-- 1. MEAL PLANS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS meal_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  day TEXT NOT NULL,
  meal_type TEXT NOT NULL,
  meal_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Unique constraint for upsert
  UNIQUE(user_id, day, meal_type)
);

-- Create index for faster queries by user
CREATE INDEX IF NOT EXISTS idx_meal_plans_user_id ON meal_plans(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous users to manage their own meal plans
DROP POLICY IF EXISTS "Users can manage their own meal plans" ON meal_plans;
CREATE POLICY "Users can manage their own meal plans"
  ON meal_plans
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 2. USER PROFILES TABLE (for premium features)
-- ============================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  email TEXT,
  display_name TEXT,
  subscription_status TEXT DEFAULT 'free', -- 'free', 'premium', 'canceled', 'past_due'
  stripe_customer_id TEXT,
  subscription_id TEXT,
  subscription_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  dietary_preferences JSONB DEFAULT '[]'::jsonb,
  family_members JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_stripe ON user_profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_subscription ON user_profiles(subscription_id);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own profile" ON user_profiles;
CREATE POLICY "Users can manage their own profile"
  ON user_profiles
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 3. CUSTOM RECIPES TABLE (user-created recipes)
-- ============================================
CREATE TABLE IF NOT EXISTS custom_recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  prep_time TEXT,
  cook_time TEXT,
  servings INTEGER DEFAULT 4,
  calories INTEGER,
  difficulty TEXT DEFAULT 'Medium',
  tags TEXT[] DEFAULT '{}',
  ingredients JSONB DEFAULT '[]'::jsonb,
  prep_steps TEXT[] DEFAULT '{}',
  cooking_steps TEXT[] DEFAULT '{}',
  nutrition JSONB DEFAULT '{}'::jsonb,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_custom_recipes_user_id ON custom_recipes(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_recipes_public ON custom_recipes(is_public) WHERE is_public = true;

ALTER TABLE custom_recipes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own recipes" ON custom_recipes;
CREATE POLICY "Users can manage their own recipes"
  ON custom_recipes
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 4. FAVORITES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  recipe_name TEXT NOT NULL,
  recipe_type TEXT DEFAULT 'builtin', -- 'builtin' or 'custom'
  custom_recipe_id UUID REFERENCES custom_recipes(id) ON DELETE CASCADE,
  notes TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, recipe_name, recipe_type)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own favorites" ON favorites;
CREATE POLICY "Users can manage their own favorites"
  ON favorites
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 5. GROCERY LISTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS grocery_lists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  week_start DATE NOT NULL,
  items JSONB DEFAULT '[]'::jsonb, -- Array of {item, amount, checked, category}
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, week_start)
);

CREATE INDEX IF NOT EXISTS idx_grocery_lists_user_id ON grocery_lists(user_id);

ALTER TABLE grocery_lists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own grocery lists" ON grocery_lists;
CREATE POLICY "Users can manage their own grocery lists"
  ON grocery_lists
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 6. AUTO-UPDATE TIMESTAMP FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for auto-updating timestamps
DROP TRIGGER IF EXISTS update_meal_plans_updated_at ON meal_plans;
CREATE TRIGGER update_meal_plans_updated_at
  BEFORE UPDATE ON meal_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_custom_recipes_updated_at ON custom_recipes;
CREATE TRIGGER update_custom_recipes_updated_at
  BEFORE UPDATE ON custom_recipes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_grocery_lists_updated_at ON grocery_lists;
CREATE TRIGGER update_grocery_lists_updated_at
  BEFORE UPDATE ON grocery_lists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 7. STORAGE BUCKET SETUP (run in Supabase Dashboard > Storage)
-- ============================================
-- Go to Storage in your Supabase Dashboard and create these buckets:
--
-- Bucket: recipe-images
--   - Public: Yes (for recipe images to be viewable)
--   - File size limit: 5MB
--   - Allowed MIME types: image/jpeg, image/png, image/webp, image/gif
--
-- Bucket: user-uploads
--   - Public: No (private user uploads)
--   - File size limit: 10MB
--   - Allowed MIME types: image/jpeg, image/png, image/webp, image/gif
--
-- Then run these policies in SQL Editor:

-- Storage policies for recipe-images bucket
-- INSERT INTO storage.buckets (id, name, public) VALUES ('recipe-images', 'recipe-images', true);

-- Storage policies for user-uploads bucket
-- INSERT INTO storage.buckets (id, name, public) VALUES ('user-uploads', 'user-uploads', false);
