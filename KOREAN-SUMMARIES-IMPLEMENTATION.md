# Korean Summaries Implementation Guide

## 📋 Overview

This document describes the implementation of Korean/English news summaries using Perplexity's Search API + Chat Completions API (Sonar Pro).

**Implementation Date**: 2026-01-11
**Branch**: `claude/perplexity-news-integration-S7j15`

---

## 🏗️ Architecture

### Two-Stage Pipeline

```
┌─────────────────────────────────────┐
│  Stage 1: Search API                │
│  - Fetch raw news from trusted      │
│    sources (Reuters, Bloomberg...)  │
│  - Filter by recency (7 days)       │
│  - Domain filtering                 │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  Stage 2: Chat API (Sonar Pro)      │
│  - Generate Korean summaries        │
│  - Generate English summaries       │
│  - Extract citations                │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  Supabase Database                  │
│  - Store with summaries             │
│  - Store citations as JSONB         │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  React Frontend                     │
│  - Display with expand/collapse     │
│  - Show Korean/English summaries    │
│  - Link to citations                │
└─────────────────────────────────────┘
```

---

## 📁 File Changes

### Backend

#### New Files
- `api/_lib/perplexitySearch.js` - Search API integration
- `api/_lib/perplexitySummarize.js` - Chat API integration for summaries
- `supabase-migration-korean-summaries.sql` - Database migration

#### Modified Files
- `api/_lib/news.js` - Updated to use 2-stage pipeline
- `api/_lib/supabase.js` - Updated to save new fields (summary_ko, summary_en, citations)

### Frontend

#### New Files
- `src/components/NewsCard.jsx` - Expandable news card component

#### Modified Files
- `src/components/NewsGrid.jsx` - Updated to use NewsCard component

---

## 🗄️ Database Schema Changes

```sql
ALTER TABLE news
  ADD COLUMN summary_ko TEXT,
  ADD COLUMN summary_en TEXT,
  ADD COLUMN citations JSONB;

CREATE INDEX idx_news_citations ON news USING GIN (citations);
```

**Citations JSON Structure**:
```json
[
  {
    "title": "Reuters",
    "url": "https://...",
    "snippet": "..."
  }
]
```

---

## 🔌 API Integration

### Search API

**Endpoint**: `https://api.perplexity.ai/search`

**Request**:
```javascript
{
  "query": "latest offshore oil & gas industry news",
  "search_recency_filter": "week",
  "search_domain_filter": [
    "reuters.com",
    "bloomberg.com",
    "offshoreenergytoday.com",
    ...
  ],
  "max_results": 20
}
```

**Response**: Array of raw search results with URLs, titles, snippets

---

### Chat Completions API (Sonar Pro)

**Endpoint**: `https://api.perplexity.ai/chat/completions`

**Request**:
```javascript
{
  "model": "sonar-pro",
  "max_tokens": 2500,
  "temperature": 0.4,
  "messages": [
    {
      "role": "system",
      "content": "You are a bilingual energy analyst..."
    },
    {
      "role": "user",
      "content": "Based on these news articles, create summaries..."
    }
  ]
}
```

**Response**: JSON with items array containing Korean/English summaries

---

## 🎨 UI Features

### NewsCard Component

**Features**:
- 📌 Short Korean summary preview (always visible)
- ▶/▼ Expand/collapse functionality
- 📝 Full Korean summary (when expanded)
- 🌐 English summary toggle (when expanded)
- 🔗 Citations with links to original sources
- 📄 "Read original article" button

**States**:
- **Collapsed**: Shows title + short Korean preview + metadata
- **Expanded**: Shows full Korean summary + English toggle + citations + original link

---

## 💰 Cost Analysis

### Per Cron Job (3 sectors)

```
Search API:     3 calls × ~$0.0001 = ~$0.0003
Sonar Pro:      3 calls × ~$0.001  = ~$0.003
Total per run:  ~$0.0033
```

### Monthly Cost (hourly updates)

```
720 runs/month × $0.0033 = ~$2.38/month
```

**Note**: Very affordable for production use!

---

## 🚀 Deployment Steps

### 1. Run Database Migration

In Supabase SQL Editor:
```bash
# Run the migration file
cat supabase-migration-korean-summaries.sql
# Copy and paste into Supabase SQL Editor
```

### 2. Verify Environment Variables

Ensure `.env` has:
```bash
PERPLEXITY_API_KEY=your-api-key-here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key-here
```

### 3. Deploy Backend

```bash
# Build and deploy backend
npm run build
# Deploy to Vercel/your hosting
```

### 4. Test Cron Job

```bash
# Trigger cron manually
curl -X POST http://localhost:5000/api/cron/update-news \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### 5. Verify Frontend

```bash
# Start dev server
npm run dev

# Open http://localhost:5173
# Check that news cards can expand/collapse
# Verify Korean summaries are displayed
```

---

## 🧪 Testing

### Backend Testing

```bash
# Test Search API integration
node -e "import('./api/_lib/perplexitySearch.js').then(m => m.searchNews('YOUR_API_KEY', 'offshore', 'offshore oil & gas').then(console.log))"

# Test summarization
node -e "import('./api/_lib/perplexitySummarize.js').then(m => m.summarizeNewsInKorean('YOUR_API_KEY', [...], 'offshore oil & gas').then(console.log))"
```

### Frontend Testing

1. Click on a news card to expand
2. Verify Korean summary is displayed
3. Click "View English Summary" to toggle
4. Click citations to verify links work
5. Click "원문 기사 읽기" to open original article

---

## 🐛 Troubleshooting

### No Summaries Generated

**Symptom**: News items have no `summary_ko` field

**Solution**:
1. Check Perplexity API logs for errors
2. Verify `sonar-pro` model is available
3. Check API rate limits
4. Fallback to search results without summaries is automatic

### Citations Not Showing

**Symptom**: Citations array is empty

**Solution**:
1. Check URL matching logic in `news.js` (line 66-73)
2. Verify Search API is returning URLs
3. Check database `citations` column is JSONB type

### Korean Text Not Displaying

**Symptom**: Korean characters show as `?????`

**Solution**:
1. Verify database encoding is UTF-8
2. Check API response Content-Type is `application/json; charset=utf-8`
3. Ensure frontend has proper charset in HTML: `<meta charset="UTF-8">`

---

## 📊 Performance Metrics

### Expected Performance

- **Search API**: ~1-2 seconds per sector
- **Summarize API**: ~3-5 seconds per sector
- **Total pipeline**: ~5-8 seconds (parallel) for all 3 sectors
- **Database save**: ~200-500ms
- **Frontend render**: Instant (React)

### Optimization Tips

1. **Run sectors in parallel**: Use `Promise.all()` for all 3 sectors
2. **Cache results**: Implement Redis cache for frequent queries
3. **Batch summarization**: Send multiple news items in single API call (already implemented)
4. **Lazy load**: Only fetch citations when card is expanded (future enhancement)

---

## 🔮 Future Enhancements

### Phase 2 Features

- [ ] Add news filtering by date range
- [ ] Add search functionality within summaries
- [ ] Add "Save for later" bookmarking
- [ ] Add email digest of Korean summaries

### Phase 3 Features

- [ ] Multi-language support (Japanese, Chinese)
- [ ] Sentiment analysis on news
- [ ] Trend visualization over time
- [ ] AI-powered news recommendations

---

## 📚 References

- [Perplexity Search API Docs](https://docs.perplexity.ai/api-reference/search-post)
- [Perplexity Chat Completions API Docs](https://docs.perplexity.ai/api-reference/chat-completions-post)
- [Supabase JSONB Docs](https://supabase.com/docs/guides/database/json)

---

## 👥 Contributors

- Implementation: Claude (AI Assistant)
- Review: [Your Name]
- Testing: [Your Name]

---

**Last Updated**: 2026-01-11
