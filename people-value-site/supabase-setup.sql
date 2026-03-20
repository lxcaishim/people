-- Run this in your Supabase project: SQL Editor
-- Creates the visitors table for the "Our people" dot counter

CREATE TABLE IF NOT EXISTS visitors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (new visitors)
DROP POLICY IF EXISTS "Allow anonymous insert" ON visitors;
CREATE POLICY "Allow anonymous insert" ON visitors
  FOR INSERT WITH CHECK (true);

-- Allow anonymous select (for count)
DROP POLICY IF EXISTS "Allow anonymous select" ON visitors;
CREATE POLICY "Allow anonymous select" ON visitors
  FOR SELECT USING (true);
