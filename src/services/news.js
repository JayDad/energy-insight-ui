export async function fetchNews(sector) {
  const res = await fetch(`/api/news?sector=${sector}`);
  if (!res.ok) throw new Error("News fetch failed");
  return res.json();
}
