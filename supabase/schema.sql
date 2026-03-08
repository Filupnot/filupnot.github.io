-- Run this in the Supabase SQL Editor to set up the workout tracker tables.

-- Stores per-user customized exercise lists (overrides the hardcoded defaults).
CREATE TABLE IF NOT EXISTS workout_defs (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type        text NOT NULL,  -- 'push' | 'pull' | 'legs'
  exercises   jsonb NOT NULL,
  updated_at  timestamptz DEFAULT now(),
  UNIQUE (user_id, type)
);

-- Stores completed workout sessions.
CREATE TABLE IF NOT EXISTS workout_sessions (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type         text NOT NULL,  -- 'push' | 'pull' | 'legs'
  date         date NOT NULL,
  started_at   timestamptz NOT NULL,
  completed_at timestamptz,
  exercises    jsonb NOT NULL, -- array of { exerciseId, sets: [{ value, pr }] }
  created_at   timestamptz DEFAULT now()
);

-- Row Level Security: users can only access their own data.
ALTER TABLE workout_defs    ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own their workout defs"
  ON workout_defs FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users own their sessions"
  ON workout_sessions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
