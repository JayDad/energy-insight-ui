import { getHistoricalNews } from "./_lib/supabase.js";
import { SUPPORTED_SECTORS } from "./_lib/news.js";

/**
 * GET /api/news-history
 * Returns historical news (up to 6 months) with pagination
 * Query params:
 *   - sector: "offshore", "wind", or "smr" (required)
 *   - page: page number (default: 1)
 *   - limit: items per page (default: 20, max: 100)
 */
export default async function handler(req, res) {
  const sector = String(req.query?.sector || "").toLowerCase();
  const page = Math.max(1, parseInt(req.query?.page || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(req.query?.limit || "20", 10)));

  if (!sector || !SUPPORTED_SECTORS[sector]) {
    return res.status(400).json({ error: "Invalid or missing sector parameter" });
  }

  try {
    const result = await getHistoricalNews(sector, page, limit);

    res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=1200");
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({
      error: "Failed to fetch historical news",
      detail: String(e?.message || e)
    });
  }
}
