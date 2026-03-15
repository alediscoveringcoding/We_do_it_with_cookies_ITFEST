-- ============================================
-- Supabase Row Level Security (RLS) Setup
-- for Skills Page and University Relationships
-- ============================================
-- 
-- Run these SQL commands in your Supabase SQL Editor
-- to enable public read access to skills and universities

-- Enable RLS on skill_universities junction table
ALTER TABLE skill_universities ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access on skill_universities
CREATE POLICY "Public read skill_universities"
  ON skill_universities FOR SELECT USING (true);

-- Enable RLS on skills table
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access on skills
CREATE POLICY "Public read skills"
  ON skills FOR SELECT USING (true);

-- Enable RLS on universities table (if not already enabled)
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access on universities
CREATE POLICY "Public read universities"
  ON universities FOR SELECT USING (true);

-- ============================================
-- Notes:
-- - These policies allow anyone to READ the data
-- - No authentication required for SELECT
-- - INSERT/UPDATE/DELETE remain restricted
-- - Adjust USING conditions if you need more security
-- ============================================
