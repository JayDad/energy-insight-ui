/* global process */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables");
}

// Create Supabase client with service role key for server-side operations
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

/**
 * Get recent news (last 72 hours) for a specific sector
 */
export async function getRecentNews(sector) {
  const hoursAgo72 = new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("sector", sector)
    .gte("created_at", hoursAgo72)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch recent news: ${error.message}`);
  }

  return data || [];
}

/**
 * Get historical news (up to 6 months) with pagination
 */
export async function getHistoricalNews(sector, page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  const sixMonthsAgo = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString();

  const { data, error, count } = await supabase
    .from("news")
    .select("*", { count: "exact" })
    .eq("sector", sector)
    .gte("created_at", sixMonthsAgo)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error(`Failed to fetch historical news: ${error.message}`);
  }

  return {
    news: data || [],
    total: count || 0,
    pages: Math.ceil((count || 0) / limit),
    currentPage: page
  };
}

/**
 * Save news items to database
 * Handles duplicates gracefully (upsert)
 */
export async function saveNews(newsItems) {
  if (!Array.isArray(newsItems) || newsItems.length === 0) {
    return { saved: 0, skipped: 0 };
  }

  // Transform items to match database schema
  const items = newsItems.map((item) => ({
    sector: item.sector,
    title: item.title,
    link: item.link || null,
    content: item.content || null,
    source: item.source,
    published_date: item.date ? new Date(item.date).toISOString() : null
  }));

  // Use upsert to handle duplicates
  const { data, error } = await supabase
    .from("news")
    .upsert(items, {
      onConflict: "sector,link",
      ignoreDuplicates: true
    })
    .select();

  if (error) {
    throw new Error(`Failed to save news: ${error.message}`);
  }

  return {
    saved: data?.length || 0,
    skipped: items.length - (data?.length || 0)
  };
}

/**
 * Get all recent news for all sectors (for main dashboard)
 */
export async function getAllRecentNews() {
  const hoursAgo72 = new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("news")
    .select("*")
    .gte("created_at", hoursAgo72)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch all recent news: ${error.message}`);
  }

  // Group by sector
  const grouped = {};
  for (const item of data || []) {
    if (!grouped[item.sector]) {
      grouped[item.sector] = [];
    }
    grouped[item.sector].push(item);
  }

  return grouped;
}

/**
 * Delete news older than 6 months (cleanup function)
 */
export async function deleteOldNews() {
  const sixMonthsAgo = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString();

  const { error } = await supabase
    .from("news")
    .delete()
    .lt("created_at", sixMonthsAgo);

  if (error) {
    throw new Error(`Failed to delete old news: ${error.message}`);
  }

  return { success: true };
}
