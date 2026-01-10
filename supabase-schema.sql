-- Energy Insight UI Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Create news table
CREATE TABLE IF NOT EXISTS news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sector VARCHAR(50) NOT NULL,
  title TEXT NOT NULL,
  link TEXT,
  content TEXT,
  source VARCHAR(100),
  published_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent duplicate news from same link per sector
  CONSTRAINT unique_link_per_sector UNIQUE(sector, link)
);

-- Create indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_news_sector ON news(sector);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_published_date ON news(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_news_sector_created ON news(sector, created_at DESC);

-- Enable Row Level Security (optional, but recommended)
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Allow anonymous reads (public access)
CREATE POLICY "Allow public read access" ON news
  FOR SELECT
  USING (true);

-- Allow service role to insert/update (for cron job)
CREATE POLICY "Allow service role full access" ON news
  FOR ALL
  USING (auth.role() = 'service_role');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON news
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Optional: Function to clean up old news (6+ months)
CREATE OR REPLACE FUNCTION delete_old_news()
RETURNS void AS $$
BEGIN
  DELETE FROM news
  WHERE created_at < NOW() - INTERVAL '6 months';
END;
$$ LANGUAGE plpgsql;

-- Optional: Schedule automatic cleanup (requires pg_cron extension)
-- SELECT cron.schedule('cleanup-old-news', '0 2 * * 0', 'SELECT delete_old_news()');
