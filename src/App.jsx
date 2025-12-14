import Parser from "rss-parser";
import { fetch } from "undici";

const parser = new Parser({
  headers: { "User-Agent": "Mozilla/5.0 (EnergyInsightBot/1.0)" },
  timeout: 10000
});

const FEEDS = {
  offshore: "https://feeds.feedburner.com/rigzone",
  // wind/smr도 같은 방식으로 계속 사용 가능
  wind: "https://www.rechargenews.com/rss",
  smr: "https://world-nuclear-news.org/rss.aspx"
};

// 아주 보수적인 XML 클린업: "명백히 잘못된 &"만 &amp;로 치환
function fixBadAmpersands(xml) {
  // 이미 &amp; &lt; &gt; &quot; &apos; 또는 &#123; &#x1A; 같은 엔티티는 건드리지 않음
  return xml.replace(/&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[0-9a-fA-F]+;)/g, "&amp;");
}

export default async function handler(req, res) {
  const sector = (req.query?.sector || "offshore").toLowerCase();
  const feedUrl = FEEDS[sector];

  if (!feedUrl) return res.status(400).json({ error: "Invalid sector" });

  try {
    const r = await fetch(feedUrl);
    if (!r.ok) {
      return res.status(502).json({
        error: "Failed to fetch RSS",
        detail: `Upstream RSS returned ${r.status}`
      });
    }

    const xmlRaw = await r.text();
    const xmlFixed = fixBadAmpersands(xmlRaw);

    const feed = await parser.parseString(xmlFixed);

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
