/**
 * Perplexity Chat Completions API Integration
 * Uses Sonar Pro to generate Korean and English summaries from search results
 */

/**
 * Generate Korean and English summaries for news articles
 * Uses Sonar Pro model for high-quality multilingual summaries
 *
 * @param {string} apiKey - Perplexity API key
 * @param {Array} searchResults - Results from Search API
 * @param {string} sectorLabel - Human-readable sector label
 * @returns {Promise<Array>} Array of news items with summaries
 */
export async function summarizeNewsInKorean(apiKey, searchResults, sectorLabel) {
  if (!searchResults || searchResults.length === 0) {
    console.warn('[Summarize API] No search results to summarize');
    return [];
  }

  // Use top 10 results for summarization
  const topResults = searchResults.slice(0, 10);

  // Build context from search results
  const newsContext = topResults
    .map((result, idx) => {
      const title = result.title || 'No title';
      const snippet = result.snippet || '';
      const url = result.url || '';
      return `${idx + 1}. ${title}\n   URL: ${url}\n   Content: ${snippet}`;
    })
    .join('\n\n');

  console.log(`[Summarize API] Generating summaries for ${topResults.length} news items...`);

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'sonar-pro',
      max_tokens: 2500,
      temperature: 0.4,
      messages: [
        {
          role: 'system',
          content: `You are a bilingual energy industry analyst. Your task is to analyze news articles and create summaries in both Korean and English.

CRITICAL: Return ONLY valid JSON. No markdown, no code blocks, no explanations.

Required JSON structure:
{
  "items": [
    {
      "title": "original English title",
      "summary_ko": "한글 요약 (2-3문장, 핵심 내용 중심)",
      "summary_en": "English summary (2-3 sentences, key points)",
      "source": "source name",
      "url": "original URL",
      "date": "YYYY-MM-DD"
    }
  ]
}

Korean summary guidelines:
- 2-3 sentences in natural Korean
- Focus on key business impact and developments
- Use professional business Korean terminology
- Be concise but informative

English summary guidelines:
- 2-3 sentences in clear English
- Highlight main developments and implications
- Use industry-standard terminology`
        },
        {
          role: 'user',
          content: `Based on these ${sectorLabel} news articles, create 6 news items with Korean and English summaries.

NEWS ARTICLES:
${newsContext}

INSTRUCTIONS:
1. Select the 6 most important and recent news items
2. For each item, write:
   - title: Keep original English title
   - summary_ko: Korean summary (2-3 sentences explaining key points)
   - summary_en: English summary (2-3 sentences)
   - source: News outlet name
   - url: Original article URL
   - date: Publication date in YYYY-MM-DD format

Return ONLY the JSON object. No markdown code blocks.`
        }
      ]
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('[Summarize API] Error:', response.status, errorBody);
    throw new Error(`Chat API error ${response.status}: ${errorBody}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
    console.error('[Summarize API] No content in response');
    throw new Error('No content returned from Chat API');
  }

  // Parse JSON response
  let parsed;
  try {
    const cleaned = cleanJsonText(content);
    parsed = JSON.parse(cleaned);
  } catch (err) {
    console.error('[Summarize API] Failed to parse response:', content.substring(0, 200));
    throw new Error(`Failed to parse response: ${err.message}`);
  }

  const items = parsed.items || [];
  console.log(`[Summarize API] Successfully generated ${items.length} summaries`);

  return items;
}

/**
 * Clean JSON text by removing markdown code blocks
 * @param {string} raw - Raw text from API
 * @returns {string} Cleaned JSON string
 */
function cleanJsonText(raw) {
  const trimmed = String(raw || '').trim();

  // Remove markdown code blocks (```json ... ``` or ``` ... ```)
  if (trimmed.startsWith('```') && trimmed.endsWith('```')) {
    return trimmed
      .replace(/^```\w*\n?/, '')
      .replace(/```$/, '')
      .trim();
  }

  return trimmed;
}
