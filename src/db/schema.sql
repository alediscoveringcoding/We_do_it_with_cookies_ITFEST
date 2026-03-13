-- Users (managed by Supabase Auth, no manual creation needed)

CREATE TABLE assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  riasec_scores JSONB NOT NULL,  -- { R: 12, I: 18, A: 8, S: 15, E: 20, C: 10 }
  top_traits TEXT[] NOT NULL,    -- ['E', 'S', 'I']
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE careers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  riasec_tags TEXT[] NOT NULL,   -- ['E', 'C', 'S']
  description TEXT,
  salary_min INT,
  salary_max INT,
  daily_tasks TEXT[],
  education_path TEXT,
  testimonials JSONB             -- [{ name, role, quote }]
);

CREATE TABLE skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,        -- 'Technical' | 'Creative' | 'Social' | 'Analytical' | 'Leadership' | 'Trades'
  description TEXT,
  testimonials JSONB             -- [{ name, role, quote }]
);

CREATE TABLE skills_careers (
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  career_id UUID REFERENCES careers(id) ON DELETE CASCADE,
  PRIMARY KEY (skill_id, career_id)
);

CREATE TABLE questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  career_id UUID REFERENCES careers(id) ON DELETE SET NULL,
  question TEXT NOT NULL,
  ai_answer TEXT,
  upvotes INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id UUID NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('career', 'skill')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security on all user-data tables
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- RLS Policies (users can only read/write their own data)
CREATE POLICY "Users own assessments" ON assessments FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own questions" ON questions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own bookmarks" ON bookmarks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Questions readable by all" ON questions FOR SELECT USING (true);
