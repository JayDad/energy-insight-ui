import { searchNews } from './perplexitySearch.js';
import { summarizeNewsInKorean } from './perplexitySummarize.js';

const SUPPORTED_SECTORS = {
  offshore: "offshore oil & gas",
  wind: "offshore wind",
  smr: "small modular reactors"
};

/**
 * Fetch latest news using 2-stage pipeline:
 * 1. Search API - Get raw news results from trusted sources
 * 2. Chat API (Sonar Pro) - Generate Korean/English summaries
 *
 * @param {string} apiKey - Perplexity API key
 * @param {string} sector - Sector identifier (offshore, wind, smr)
 * @returns {Promise<Array>} Array of news items with summaries
 */
async function fetchLatestNews(apiKey, sector) {
  const sectorLabel = SUPPORTED_SECTORS[sector];

  if (!sectorLabel) {
    throw new Error("Invalid sector");
  }

  console.log(`\n=== Fetching news for ${sector} (${sectorLabel}) ===`);

  // Step 1: Search API - Get raw news results
  console.log(`[${sector}] Step 1/2: Searching for news...`);
  const searchResults = await searchNews(apiKey, sector, sectorLabel);

  if (!searchResults || searchResults.length === 0) {
    console.warn(`[${sector}] No search results found`);
    return [];
  }

  console.log(`[${sector}] Found ${searchResults.length} news items`);

  // Step 2: Chat API - Generate Korean/English summaries
  console.log(`[${sector}] Step 2/2: Generating Korean/English summaries...`);
  const summarizedNews = await summarizeNewsInKorean(
    apiKey,
    searchResults,
    sectorLabel
  );

  if (!summarizedNews || summarizedNews.length === 0) {
    console.warn(`[${sector}] No summaries generated, falling back to search results`);
    // Fallback: Return search results without summaries
    return searchResults.slice(0, 6).map((item, idx) => ({
      id: `${sector}-${idx}-${String(item.url || item.title || idx).slice(-12)}`,
      sector,
      title: item.title || "(no title)",
      link: item.url || "#",
      source: item.source || "Unknown",
      date: item.published_date || "",
      summary_ko: null,
      summary_en: null,
      citations: []
    }));
  }

  // Normalize and enrich items with citations
  const enrichedNews = summarizedNews.map((item, idx) => {
    // Find matching search results for citations
    const citations = searchResults
      .filter(searchItem => {
        // Match by URL or title similarity
        if (item.url && searchItem.url) {
          return searchItem.url.includes(item.url) || item.url.includes(searchItem.url);
        }
        return false;
      })
      .slice(0, 3) // Max 3 citations per item
      .map(cite => ({
        title: cite.source || 'Unknown',
        url: cite.url,
        snippet: cite.snippet || ''
      }));

    return {
      id: `${sector}-${idx}-${String(item.url || item.title || idx).slice(-12)}`,
      sector,
      title: item.title || "(no title)",
      link: item.url || "#",
      source: item.source || "Unknown",
      date: item.date || "",
      summary_ko: item.summary_ko || null,
      summary_en: item.summary_en || null,
      citations: citations.length > 0 ? citations : []
    };
  });

  console.log(`[${sector}] ✓ Successfully processed ${enrichedNews.length} news items with summaries\n`);

  return enrichedNews;
}

export { SUPPORTED_SECTORS, fetchLatestNews };
