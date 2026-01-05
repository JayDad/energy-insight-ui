import { kv } from "@vercel/kv";
import { SUPPORTED_SECTORS } from "./_lib/news.js";

export default async function handler(req, res) {
  const sector = String(req.query?.sector || "offshore").toLowerCase();
  const sectorLabel = SUPPORTED_SECTORS[sector];

  if (!sectorLabel) {
    return res.status(400).json({ error: "Invalid sector" });
  }

  try {
    const cached = await kv.get(`news:${sector}`);
    const items = Array.isArray(cached) ? cached : [];

    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    return res.status(200).json(items);
  } catch (e) {
    return res.status(500).json({ error: "Failed to read cached news", detail: String(e?.message || e) });
  }
}
