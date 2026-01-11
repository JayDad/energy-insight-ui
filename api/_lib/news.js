const SUPPORTED_SECTORS = {
  offshore: "offshore oil & gas",
  wind: "offshore wind",
  smr: "small modular reactors"
};

// Use online model for real-time web search and latest news
const MODEL = "sonar";

function cleanJsonText(raw) {
  const trimmed = String(raw || "").trim();

  if (trimmed.startsWith("```") && trimmed.endsWith("```")) {
    return trimmed.replace(/^```\w*\n?/, "").replace(/```$/, "").trim();
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

async function fetchLatestNews(apiKey, sector) {
  const sectorLabel = SUPPORTED_SECTORS[sector];

  if (!sectorLabel) {
    throw new Error("Invalid sector");
  }

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
            "You are an energy market analyst with real-time web access. Search the web for the latest news and return ONLY valid JSON with an 'items' array. Each item must have: title (string), link (actual URL), source (news outlet name), and date (YYYY-MM-DD format). Focus on news from the last 7-14 days from reputable sources like Reuters, Bloomberg, Offshore Engineer, Energy Voice, etc. Return ONLY the JSON object, no markdown or explanation."
        },
        {
          role: "user",
          content: `Search the web for the latest ${sectorLabel} news and industry updates. Return 6 recent news items with actual links and dates. Response must be valid JSON only.`
        }
      ]
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Perplexity error details:", errorBody);
    throw new Error(`Perplexity error ${response.status}: ${errorBody}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("No content returned from Perplexity");
  }

  let parsed;

  try {
    parsed = JSON.parse(cleanJsonText(content));
  } catch (err) {
    throw new Error(`Failed to parse Perplexity response: ${err.message}`);
  }

  return normalizeItems(sector, parsed.items || parsed.results || []);
}

export { SUPPORTED_SECTORS, fetchLatestNews };
