/**
 * Perplexity Search API Integration
 * Uses Search API to get raw news results without LLM processing
 */

// Trusted news sources for each sector
const NEWS_SOURCES = {
  offshore: [
    'reuters.com',
    'bloomberg.com',
    'offshoreenergytoday.com',
    'offshore-mag.com',
    'energyvoice.com',
    'upstreamonline.com',
    'worldoil.com',
    'rigzone.com'
  ],
  wind: [
    'reuters.com',
    'bloomberg.com',
    'offshorewind.biz',
    'renews.biz',
    'windpowermonthly.com',
    'rechargenews.com',
    'offshorewindus.org',
    'windpowerengineering.com'
  ],
  smr: [
    'reuters.com',
    'bloomberg.com',
    'world-nuclear-news.org',
    'nei.org',
    'nuclear-news.net',
    'neimagazine.com',
    'nucnet.org',
    'powermag.com'
  ]
};

/**
 * Search for news using Perplexity Search API
 * Returns raw search results with URLs, titles, snippets
 *
 * @param {string} apiKey - Perplexity API key
 * @param {string} sector - Sector identifier (offshore, wind, smr)
 * @param {string} sectorLabel - Human-readable sector label
 * @returns {Promise<Array>} Array of search results
 */
export async function searchNews(apiKey, sector, sectorLabel) {
  const domains = NEWS_SOURCES[sector] || [];

  console.log(`[Search API] Searching for ${sectorLabel} news from ${domains.length} sources`);

  const response = await fetch('https://api.perplexity.ai/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      query: `latest ${sectorLabel} industry news developments projects announcements`,
      search_recency_filter: 'week',        // Last 7 days only
      search_domain_filter: domains,         // Trusted sources only
      max_results: 20                        // Get more results for better selection
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('[Search API] Error:', response.status, errorBody);
    throw new Error(`Search API error ${response.status}: ${errorBody}`);
  }

  const data = await response.json();
  const results = data.results || [];

  console.log(`[Search API] Found ${results.length} results for ${sector}`);

  // Return results with normalized structure
  return results.map(result => ({
    title: result.title || '',
    url: result.url || '',
    snippet: result.snippet || result.description || '',
    source: extractSourceName(result.url),
    published_date: result.published_date || result.date || null
  }));
}

/**
 * Extract clean source name from URL
 * @param {string} url - Full URL
 * @returns {string} Clean source name
 */
function extractSourceName(url) {
  if (!url) return 'Unknown';

  try {
    const hostname = new URL(url).hostname.replace('www.', '');

    // Map common domains to nice names
    const nameMap = {
      'reuters.com': 'Reuters',
      'bloomberg.com': 'Bloomberg',
      'offshoreenergytoday.com': 'Offshore Energy',
      'offshore-mag.com': 'Offshore Magazine',
      'energyvoice.com': 'Energy Voice',
      'upstreamonline.com': 'Upstream',
      'offshorewind.biz': 'Offshorewind.biz',
      'renews.biz': 'reNEWS',
      'windpowermonthly.com': 'Windpower Monthly',
      'rechargenews.com': 'Recharge',
      'world-nuclear-news.org': 'World Nuclear News',
      'nei.org': 'NEI',
      'nuclear-news.net': 'Nuclear News'
    };

    return nameMap[hostname] || hostname;
  } catch {
    return 'Unknown';
  }
}

export { NEWS_SOURCES };
