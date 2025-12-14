import express from "express";
import handler from "./api/news.js";

const app = express();

app.get("/api/news", (req, res) => handler(req, res));

app.listen(3001, () => {
  console.log("API server running on http://localhost:3001");
});
