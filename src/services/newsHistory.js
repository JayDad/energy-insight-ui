export async function fetchNewsHistory(sector, page = 1, limit = 20) {
  const res = await fetch(`/api/news-history?sector=${sector}&page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error("News history fetch failed");
  return res.json();
}
