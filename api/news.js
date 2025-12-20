import Parser from "rss-parser";

const parser = new Parser({
  timeout: 10000,
  headers: {
    // 일부 RSS는 UA 없으면 403/이상 응답을 주기도 해서 넣어둠
    "User-Agent": "Mozilla/5.0 (EnergyInsightBot/1.0)"
  }
});

const FEEDS = {
  offshore: "https://feeds.feedburner.com/rigzone",
  wind: "https://www.rechargenews.com/rss",
  smr: "https://world-nuclear-news.org/rss.aspx"
};

// XML에서 "잘못된 &"만 &amp;로 보정 (이미 정상 엔티티는 건드리지 않음)
function fixBadAmpersands(xml) {
  return xml.replace(/&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[0-9a-fA-F]+;)/g, "&amp;");
}

// 날짜 정리(isoDate/pubDate가 없을 때도 방어)
function toDateString(item) {
  return item.isoDate || item.pubDate || item.published || item.date || "";
}

export default async function handler(req, res) {
  const sector = String(req.query?.sector || "offshore").toLowerCase();
  const feedUrl = FEEDS[sector];

  if (!feedUrl) {
    return res.status(400).json({ error: "Invalid sector" });
  }

  try {
    // 1) 원문 RSS(XML) fetch
    const r = await fetch(feedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (EnergyInsightBot/1.0)",
        "Accept": "application/rss+xml, application/xml;q=0.9, */*;q=0.8"
      }
    });

    if (!r.ok) {
      return res.status(502).json({
        error: "Failed to fetch RSS",
        detail: `RSS responded ${r.status} ${r.statusText}`
      });
    }

    const xmlRaw = await r.text();

    // 2) 깨진 엔티티(& 등) 최소 보정
    const xmlFixed = fixBadAmpersands(xmlRaw);

    // 3) 문자열 파싱
    const feed = await parser.parseString(xmlFixed);

    const items = (feed.items || []).slice(0, 10).map((item, idx) => ({
      id: `${sector}-${idx}-${String(item.guid || item.link || "").slice(-10)}`,
      sector,
      title: item.title || "(no title)",
      link: item.link || "#",
      date: toDateString(item),
      source: feed.title || "RSS"
    }));

    // (선택) 5분 캐시 힌트: 같은 요청이 자주 오면 RSS 재호출을 줄임
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");

    return res.status(200).json(items);
  } catch (e) {
    return res.status(500).json({
      error: "Failed to fetch RSS",
      detail: String(e?.message || e)
    });
  }
}
