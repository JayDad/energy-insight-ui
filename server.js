import express from "express";
import newsHandler from "./api/news.js";
import newsHistoryHandler from "./api/news-history.js";
import updateNewsHandler from "./api/cron/update-news.js";

const app = express();

app.get("/api/news", (req, res) => newsHandler(req, res));
app.get("/api/news-history", (req, res) => newsHistoryHandler(req, res));
app.get("/api/cron/update-news", (req, res) => updateNewsHandler(req, res));

app.listen(3001, () => {
  console.log("API server running on http://localhost:3001");
});
