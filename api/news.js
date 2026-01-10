import { getRecentNews, getAllRecentNews } from "./_lib/supabase.js";
import { SUPPORTED_SECTORS } from "./_lib/news.js";

/**
 * GET /api/news
 * Returns recent news (last 72 hours)
 * Query params:
 *   - sector: "offshore", "wind", or "smr" (optional, returns all if not specified)
 */
export default async function handler(req, res) {
  const sector = req.query?.sector ? String(req.query.sector).toLowerCase() : null;

  // If sector is specified, validate it
  if (sector && !SUPPORTED_SECTORS[sector]) {
    return res.status(400).json({ error: "Invalid sector" });
  }

  try {
    let items;

    if (sector) {
      // Get news for specific sector
      items = await getRecentNews(sector);
    } else {
      // Get all recent news grouped by sector
      items = await getAllRecentNews();
    }

    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    return res.status(200).json(items);
  } catch (e) {
    return res.status(500).json({
      error: "Failed to fetch news",
      detail: String(e?.message || e)
    });
  }
}
