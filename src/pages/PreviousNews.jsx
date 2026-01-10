import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchNewsHistory } from "../services/newsHistory.js";
import Pagination from "../components/Pagination.jsx";

const SECTORS = [
  { key: "offshore", title: "Offshore (O&G)" },
  { key: "wind", title: "Offshore Wind" },
  { key: "smr", title: "SMR" }
];

export default function PreviousNews() {
  const navigate = useNavigate();
  const [sector, setSector] = useState("offshore");
  const [news, setNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const result = await fetchNewsHistory(sector, currentPage, 20);

        if (!active) return;

        setNews(result.news || []);
        setTotalPages(result.pages || 1);
        setTotal(result.total || 0);
      } catch {
        if (!active) return;
        setError("Failed to load news history");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [sector, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSectorChange = (newSector) => {
    setSector(newSector);
    setCurrentPage(1);
  };

  const currentSectorTitle = SECTORS.find((s) => s.key === sector)?.title || sector;

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <header style={styles.header}>
          <div>
            <button style={styles.backBtn} onClick={() => navigate("/")}>
              ← Back to Dashboard
            </button>
            <h1 style={styles.title}>Previous News Archive</h1>
            <p style={styles.subtitle}>6-month history of energy sector updates</p>
          </div>
        </header>

        <div style={styles.tabs}>
          {SECTORS.map((s) => (
            <button
              key={s.key}
              onClick={() => handleSectorChange(s.key)}
              style={sector === s.key ? styles.tabActive : styles.tab}
            >
              {s.title}
            </button>
          ))}
        </div>

        {error && <div style={styles.error}>{error}</div>}
        {loading && <div style={styles.loading}>Loading...</div>}

        <div style={styles.stats}>
          Showing page {currentPage} of {totalPages} ({total} total articles)
        </div>

        <div style={styles.newsList}>
          {news.length === 0 && !loading ? (
            <div style={styles.empty}>No historical news found for {currentSectorTitle}</div>
          ) : (
            news.map((item) => (
              <a
                key={item.id}
                href={item.link || "#"}
                target={item.link && item.link !== "#" ? "_blank" : undefined}
                rel={item.link && item.link !== "#" ? "noreferrer" : undefined}
                style={styles.newsItem}
              >
                <div style={styles.newsTitle}>{item.title}</div>
                <div style={styles.newsMeta}>
                  <span>{item.source}</span>
                  <span style={styles.dot}>•</span>
                  <span>{new Date(item.created_at).toLocaleDateString()}</span>
                  {item.published_date && (
                    <>
                      <span style={styles.dot}>•</span>
                      <span>Published: {new Date(item.published_date).toLocaleDateString()}</span>
                    </>
                  )}
                </div>
              </a>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: 16,
    color: "#e7eefc",
    background:
      "radial-gradient(circle at 20% 20%, rgba(43, 61, 88, 0.55), transparent 45%), radial-gradient(circle at 80% 0%, rgba(12, 33, 61, 0.6), transparent 40%), #0b1220"
  },
  shell: {
    maxWidth: 900,
    margin: "0 auto"
  },
  header: {
    marginBottom: 24
  },
  backBtn: {
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,.14)",
    background: "rgba(255,255,255,.04)",
    color: "#e7eefc",
    cursor: "pointer",
    fontSize: 13,
    marginBottom: 12
  },
  title: {
    fontSize: 24,
    fontWeight: 800,
    margin: "12px 0 6px 0"
  },
  subtitle: {
    fontSize: 13,
    opacity: 0.7,
    margin: 0
  },
  tabs: {
    display: "flex",
    gap: 8,
    marginBottom: 20,
    flexWrap: "wrap"
  },
  tab: {
    padding: "8px 16px",
    borderRadius: 12,
    background: "rgba(255,255,255,.04)",
    color: "#e7eefc",
    border: "1px solid rgba(255,255,255,.14)",
    cursor: "pointer",
    fontSize: 13
  },
  tabActive: {
    padding: "8px 16px",
    borderRadius: 12,
    background: "rgba(255,255,255,.12)",
    color: "#e7eefc",
    border: "1px solid rgba(255,255,255,.22)",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 700
  },
  error: {
    padding: 12,
    borderRadius: 8,
    background: "rgba(255,100,100,.1)",
    border: "1px solid rgba(255,100,100,.3)",
    color: "#ffb4b4",
    fontSize: 13,
    marginBottom: 16
  },
  loading: {
    padding: 12,
    fontSize: 13,
    opacity: 0.7,
    textAlign: "center"
  },
  stats: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 12
  },
  newsList: {
    display: "flex",
    flexDirection: "column",
    gap: 10
  },
  newsItem: {
    textDecoration: "none",
    color: "#e7eefc",
    padding: 14,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,.12)",
    background: "rgba(255,255,255,.04)",
    transition: "all 0.2s"
  },
  newsTitle: {
    fontSize: 14,
    fontWeight: 700,
    lineHeight: 1.4,
    marginBottom: 6
  },
  newsMeta: {
    fontSize: 11,
    opacity: 0.65,
    display: "flex",
    gap: 8,
    alignItems: "center",
    flexWrap: "wrap"
  },
  dot: {
    opacity: 0.5
  },
  empty: {
    padding: 40,
    textAlign: "center",
    fontSize: 14,
    opacity: 0.6
  }
};
