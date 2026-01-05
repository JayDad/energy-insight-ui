const SUPPORTED_SECTORS = {
  offshore: "offshore oil & gas",
  wind: "offshore wind",
  smr: "small modular reactors"
};

const MODEL = "llama-3.1-sonar-small-128k-chat";

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
    throw new Error(`Perplexity error ${response.status}`);
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
