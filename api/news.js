import Parser from "rss-parser";

const parser = new Parser({ timeout: 10000 });

export default async function handler(req, res) {
  const sector = (req.query?.sector || "offshore").toLowerCase();

  const FEEDS = {
    offshore: "https://www.upstreamonline.com/rss",
    wind: "https://www.rechargenews.com/rss",
    smr: "https://world-nuclear-news.org/rss.aspx"
  };

  const feedUrl = FEEDS[sector];
  if (!feedUrl) return res.status(400).json({ error: "Invalid sector" });

  try {
    const feed = await parser.parseURL(feedUrl);

    const items = (feed.items || []).slice(0, 10).map((item, idx) => ({
      id: `${sector}-${idx}-${(item.guid || item.link || "").slice(-8)}`,
      sector,
      title: item.title || "(no title)",
      link: item.link || "#",
      date: item.isoDate || item.pubDate || "",
      source: feed.title || "RSS"
    }));

    return res.status(200).json(items);
  } catch (e) {
    return res.status(500).json({
      error: "Failed to fetch RSS",
      detail: String(e?.message || e)
    });
  }
}
