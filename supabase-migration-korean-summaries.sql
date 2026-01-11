-- Migration: Add Korean/English summaries and citations support
-- Created: 2026-01-11
-- Description: Adds summary_ko, summary_en, and citations columns to news table

-- Add new columns for Korean/English summaries and citations
ALTER TABLE news
  ADD COLUMN IF NOT EXISTS summary_ko TEXT,
  ADD COLUMN IF NOT EXISTS summary_en TEXT,
  ADD COLUMN IF NOT EXISTS citations JSONB;

-- Add index for citations JSONB column (for faster queries)
CREATE INDEX IF NOT EXISTS idx_news_citations ON news USING GIN (citations);

-- Add comments for documentation
COMMENT ON COLUMN news.summary_ko IS 'Korean summary of the news article (2-3 sentences)';
COMMENT ON COLUMN news.summary_en IS 'English summary of the news article (2-3 sentences)';
COMMENT ON COLUMN news.citations IS 'Array of citation objects from Perplexity Search API: [{"title": "...", "url": "...", "snippet": "..."}]';

-- Example citations structure:
-- [
--   {"title": "Reuters", "url": "https://...", "snippet": "..."},
--   {"title": "Bloomberg", "url": "https://...", "snippet": "..."}
-- ]
