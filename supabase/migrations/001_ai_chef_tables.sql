-- BestMealMate Database Schema
-- Project: qxtglvmboupjfjjuocui
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/qxtglvmboupjfjjuocui/sql

-- ============================================
-- HELPER FUNCTION: Auto-update timestamps
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================
-- 1. FAMILY PROFILES (stores family members, allergies, preferences)
-- ============================================
CREATE TABLE IF NOT EXISTS family_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  family_name TEXT DEFAULT 'My Family',
  members JSONB DEFAULT '[]'::jsonb,
  skill_level TEXT DEFAULT 'intermediate',
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_family_profiles_user_id ON family_profiles(user_id);
ALTER TABLE family_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "family_profiles_policy" ON family_profiles;
CREATE POLICY "family_profiles_policy" ON family_profiles FOR ALL USING (true) WITH CHECK (true);
DROP TRIGGER IF EXISTS update_family_profiles_updated_at ON family_profiles;
CREATE TRIGGER update_family_profiles_updated_at BEFORE UPDATE ON family_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 2. CHEF CONVERSATIONS (AI Chef chat history)
-- ============================================
CREATE TABLE IF NOT EXISTS chef_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  messages JSONB DEFAULT '[]'::jsonb,
  family_profile JSONB,
  scanned_ingredients JSONB DEFAULT '[]'::jsonb,
  current_meal_plan JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chef_conversations_user_id ON chef_conversations(user_id);
ALTER TABLE chef_conversations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "chef_conversations_policy" ON chef_conversations;
CREATE POLICY "chef_conversations_policy" ON chef_conversations FOR ALL USING (true) WITH CHECK (true);
DROP TRIGGER IF EXISTS update_chef_conversations_updated_at ON chef_conversations;
CREATE TRIGGER update_chef_conversations_updated_at BEFORE UPDATE ON chef_conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 3. PANTRY INVENTORY (scanned ingredients)
-- ============================================
CREATE TABLE IF NOT EXISTS pantry_inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  quantity TEXT,
  category TEXT,
  freshness TEXT,
  expiry_date DATE,
  scanned_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name)
);

CREATE INDEX IF NOT EXISTS idx_pantry_inventory_user_id ON pantry_inventory(user_id);
CREATE INDEX IF NOT EXISTS idx_pantry_inventory_expiry ON pantry_inventory(expiry_date);
ALTER TABLE pantry_inventory ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "pantry_inventory_policy" ON pantry_inventory;
CREATE POLICY "pantry_inventory_policy" ON pantry_inventory FOR ALL USING (true) WITH CHECK (true);
DROP TRIGGER IF EXISTS update_pantry_inventory_updated_at ON pantry_inventory;
CREATE TRIGGER update_pantry_inventory_updated_at BEFORE UPDATE ON pantry_inventory FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 4. MEAL PLANS (weekly meal schedule)
-- ============================================
CREATE TABLE IF NOT EXISTS meal_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  day TEXT NOT NULL,
  meal_type TEXT NOT NULL,
  meal_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, day, meal_type)
);

CREATE INDEX IF NOT EXISTS idx_meal_plans_user_id ON meal_plans(user_id);
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "meal_plans_policy" ON meal_plans;
CREATE POLICY "meal_plans_policy" ON meal_plans FOR ALL USING (true) WITH CHECK (true);
DROP TRIGGER IF EXISTS update_meal_plans_updated_at ON meal_plans;
CREATE TRIGGER update_meal_plans_updated_at BEFORE UPDATE ON meal_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. SCANNER JOBS (for image processing queue)
-- ============================================
CREATE TABLE IF NOT EXISTS scanner_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  bucket TEXT NOT NULL,
  object_path TEXT NOT NULL,
  status TEXT DEFAULT 'uploaded',
  result JSONB,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scanner_jobs_user_id ON scanner_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_scanner_jobs_status ON scanner_jobs(status);
ALTER TABLE scanner_jobs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "scanner_jobs_policy" ON scanner_jobs;
CREATE POLICY "scanner_jobs_policy" ON scanner_jobs FOR ALL USING (true) WITH CHECK (true);
DROP TRIGGER IF EXISTS update_scanner_jobs_updated_at ON scanner_jobs;
CREATE TRIGGER update_scanner_jobs_updated_at BEFORE UPDATE ON scanner_jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 6. STORAGE BUCKET for scanner images
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('scanner', 'scanner', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policy for scanner bucket
DROP POLICY IF EXISTS "scanner_bucket_policy" ON storage.objects;
CREATE POLICY "scanner_bucket_policy" ON storage.objects FOR ALL USING (bucket_id = 'scanner') WITH CHECK (bucket_id = 'scanner');

-- ============================================
-- DONE!
-- ============================================
SELECT 'BestMealMate tables created successfully!' as status;
