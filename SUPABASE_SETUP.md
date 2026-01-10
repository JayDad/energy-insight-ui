# Supabase Setup Guide

This guide will help you set up Supabase for the Energy Insight UI project.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/log in
2. Click "New Project"
3. Fill in the project details:
   - **Project name**: energy-insight-ui
   - **Database password**: Create a strong password (save it securely)
   - **Region**: Choose the closest region to your users
4. Click "Create new project" and wait for setup to complete (~2 minutes)

## Step 2: Run the Database Schema

1. In your Supabase dashboard, click on the **SQL Editor** tab (left sidebar)
2. Click "New query"
3. Copy the entire content of `supabase-schema.sql` and paste it into the editor
4. Click "Run" or press Ctrl+Enter
5. You should see "Success. No rows returned" - this is normal!

## Step 3: Get Your API Keys

1. In your Supabase dashboard, click on the **Settings** icon (gear icon, bottom left)
2. Click on **API** in the settings menu
3. You'll see two important keys:
   - **Project URL**: This is your `SUPABASE_URL`
   - **anon public**: DON'T use this one
   - **service_role**: This is your `SUPABASE_SERVICE_KEY` (keep it secret!)

## Step 4: Configure Environment Variables

### For Local Development:

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Then edit `.env` and add your keys:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
PERPLEXITY_API_KEY=pplx-your-key-here
CRON_SECRET=any-random-string-for-security
```

### For Vercel Deployment:

1. Go to your Vercel project dashboard
2. Click on **Settings** → **Environment Variables**
3. Add these variables:
   - `SUPABASE_URL`: Your project URL
   - `SUPABASE_SERVICE_KEY`: Your service role key
   - `PERPLEXITY_API_KEY`: Your Perplexity API key
   - `CRON_SECRET`: A random secret string

## Step 5: Test the Connection

Start your development server:

```bash
npm run dev  # Frontend (port 5173)
npm run api  # Backend (port 3001)
```

Then test the cron endpoint to fetch and save news:

```bash
# Without CRON_SECRET
curl http://localhost:3001/api/cron/update-news

# With CRON_SECRET
curl -H "Authorization: Bearer your-cron-secret" \
     http://localhost:3001/api/cron/update-news
```

If successful, you should see:

```json
{
  "ok": true,
  "updated": {
    "offshore": { "fetched": 6, "saved": 6, "skipped": 0 },
    "wind": { "fetched": 6, "saved": 6, "skipped": 0 },
    "smr": { "fetched": 6, "saved": 6, "skipped": 0 }
  },
  "failures": {}
}
```

## Step 6: Verify Data in Supabase

1. In Supabase dashboard, click **Table Editor** (left sidebar)
2. Select the `news` table
3. You should see your news items with all the data populated

## Troubleshooting

### Error: "Missing SUPABASE_URL or SUPABASE_SERVICE_KEY"

- Make sure your `.env` file exists in the project root
- Restart your API server after adding environment variables

### Error: "Failed to save news: relation 'news' does not exist"

- You haven't run the SQL schema yet
- Go back to Step 2 and run `supabase-schema.sql`

### Error: "permission denied for table news"

- You're using the wrong API key
- Make sure you're using the `service_role` key, not the `anon public` key

### Error: "Failed to fetch news from Perplexity"

- Check your `PERPLEXITY_API_KEY` is correct
- Make sure you have credits in your Perplexity account

## Data Retention

The database is configured to keep:
- **Main dashboard**: Last 72 hours of news
- **History page**: Up to 6 months of news

Old news (6+ months) can be automatically deleted using the `delete_old_news()` function.

## API Endpoints

After setup, these endpoints will be available:

- `GET /api/news?sector=offshore` - Get recent news (72h) for a sector
- `GET /api/news` - Get all recent news grouped by sector
- `GET /api/news-history?sector=offshore&page=1&limit=20` - Get historical news
- `GET /api/cron/update-news` - Trigger news update (cron job)

## Next Steps

1. Set up Vercel Cron Job to run `/api/cron/update-news` twice daily
2. Configure the cron schedule in `vercel.json` (already done: 6am & 12pm KST)
3. Deploy to Vercel and test the production environment
