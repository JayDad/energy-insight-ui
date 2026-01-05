/* global process */

import { kv } from "@vercel/kv";
import { SUPPORTED_SECTORS, fetchLatestNews } from "../_lib/news.js";

function isAuthorized(req) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  const authHeader = req.headers?.authorization || "";
  return authHeader === `Bearer ${secret}`;
}

export default async function handler(req, res) {
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Missing PERPLEXITY_API_KEY" });
  }

  const requestedSector = String(req.query?.sector || "").toLowerCase();
  const sectors = requestedSector
    ? [requestedSector]
    : Object.keys(SUPPORTED_SECTORS);

  const results = {};
  const failures = {};

  for (const sector of sectors) {
    if (!SUPPORTED_SECTORS[sector]) {
      failures[sector] = "Invalid sector";
      continue;
    }

    try {
      const items = await fetchLatestNews(apiKey, sector);
      await kv.set(`news:${sector}`, items);
      results[sector] = items.length;
    } catch (err) {
      failures[sector] = String(err?.message || err);
    }
  }

  return res.status(200).json({
    ok: Object.keys(failures).length === 0,
    updated: results,
    failures
  });
}
