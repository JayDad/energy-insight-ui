import { useEffect, useMemo, useState } from "react";
import HeaderBar from "./components/HeaderBar.jsx";
import KpiGrid from "./components/KpiGrid.jsx";
import NewsGrid from "./components/NewsGrid.jsx";
import { fetchNews } from "./services/news.js";

const SECTORS = [
  { key: "offshore", title: "Offshore (O&G)" },
  { key: "wind", title: "Offshore Wind" },
  { key: "smr", title: "SMR" }
];

const KPI_ITEMS = [
  { key: "rigs", label: "Active Rigs", value: "184", unit: "units" },
  { key: "dayrate", label: "Avg Dayrate", value: "$318K", unit: "/day" },
  { key: "wind", label: "Wind Capacity", value: "28.4", unit: "GW" },
  { key: "smr", label: "SMR Projects", value: "14", unit: "in pipeline" }
];

export default function App() {
  const [sector, setSector] = useState("offshore");
  const [newsBySector, setNewsBySector] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadAll() {
      setLoading(true);
      setError("");

      try {
        const results = await Promise.all(
          SECTORS.map(async (s) => [s.key, await fetchNews(s.key)])
        );

        if (!active) return;

        const next = {};
        for (const [key, items] of results) {
          next[key] = items;
        }

        setNewsBySector(next);
      } catch {
        if (!active) return;
        setError("Failed to load news.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadAll();
    return () => {
      active = false;
    };
  }, []);

  const blocks = useMemo(
    () =>
      SECTORS.map((s) => ({
        sector: s.key,
        title: s.title,
        items: newsBySector[s.key] || []
      })),
    [newsBySector]
  );

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <HeaderBar sector={sector} onChangeSector={setSector} />

        {error ? <div style={styles.statusError}>{error}</div> : null}
        {loading ? <div style={styles.statusInfo}>Loading news...</div> : null}

        <KpiGrid items={KPI_ITEMS} />

        <div style={styles.sectionGap} />
        <NewsGrid blocks={blocks} activeSector={sector} />
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
    maxWidth: 1100,
    margin: "0 auto"
  },
  statusInfo: {
    marginTop: 8,
    fontSize: 12,
    opacity: 0.75
  },
  statusError: {
    marginTop: 8,
    fontSize: 12,
    color: "#ffb4b4"
  },
  sectionGap: { height: 12 }
};
