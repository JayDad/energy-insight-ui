/* global process */

const SUPPORTED_SECTORS = {
  offshore: "offshore oil & gas",
  wind: "offshore wind",
  smr: "small modular reactors"
};

const MODEL = "llama-3.1-sonar-small-128k-chat";

function cleanJsonText(raw) {
  const trimmed = raw.trim();

  if (trimmed.startsWith("```") && trimmed.endsWith("```")) {
    const withoutFence = trimmed.replace(/^```\w*\n?/, "").replace(/```$/, "").trim();
    return withoutFence;
  }

  return trimmed;
}

function normalizeItems(sector, items) {
  return (items || []).map((item, idx) => ({
    id: `${sector}-${idx}-${String(item.link || item.title || idx).slice(-12)}`,
    sector,
    title: item.title || "(no title)",
    link: item.link || "#",
    date: item.date || item.published || "",
    source: item.source || "Perplexity"
  }));
}

export default async function handler(req, res) {
  const sector = String(req.query?.sector || "offshore").toLowerCase();
  const sectorLabel = SUPPORTED_SECTORS[sector];

  if (!sectorLabel) {
    return res.status(400).json({ error: "Invalid sector" });
  }

  const apiKey = process.env.PERPLEXITY_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Missing PERPLEXITY_API_KEY" });
  }

  try {
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 800,
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content:
              "You are an energy market analyst. Return ONLY compact JSON with an 'items' array. Each item must have title, link (if available), source, and date (ISO or human-readable). Keep items recent (last ~14 days)."
          },
          {
            role: "user",
            content: `List the latest ${sectorLabel} sector updates with source and date. Provide 6 concise items.`
          }
        ],
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      return res.status(502).json({
        error: "Failed to query Perplexity",
        detail: `${response.status} ${response.statusText}`
      });
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      return res.status(502).json({ error: "No content returned from Perplexity" });
    }

    let parsed;

    try {
      parsed = JSON.parse(cleanJsonText(content));
    } catch (err) {
      return res.status(502).json({ error: "Failed to parse Perplexity response", detail: err.message });
    }

    const items = normalizeItems(sector, parsed.items || parsed.results || []);

    res.setHeader("Cache-Control", "s-maxage=120, stale-while-revalidate=300");
    return res.status(200).json(items);
  } catch (e) {
    return res.status(500).json({ error: "Failed to fetch news", detail: String(e?.message || e) });
  }
}
