import NewsCard from './NewsCard';

function Card({ children }) {
  return <div style={styles.card}>{children}</div>;
}

function Badge({ active, children }) {
  return <span style={active ? styles.badgeActive : styles.badge}>{children}</span>;
}

/**
 * props:
 * - blocks: [{ sector, title, items }]
 * - activeSector: currently selected sector
 */
export default function NewsGrid({ blocks = [], activeSector }) {
  return (
    <div style={styles.grid}>
      {blocks.map((b) => (
        <Card key={b.sector}>
          <div style={styles.cardTop}>
            <div style={styles.cardTitle}>{b.title}</div>
            <Badge active={activeSector === b.sector}>
              {activeSector === b.sector ? "Selected" : "Overview"}
            </Badge>
          </div>

          <div style={styles.list}>
            {b.items?.length ? (
              b.items.map((n) => (
                <NewsCard key={n.id} news={n} />
              ))
            ) : (
              <div style={styles.empty}>No headlines yet.</div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 12
  },
  card: {
    background: "rgba(255,255,255,.04)",
    border: "1px solid rgba(255,255,255,.12)",
    borderRadius: 16,
    padding: 12
  },
  cardTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 10
  },
  cardTitle: { fontSize: 13, fontWeight: 800 },
  badge: {
    fontSize: 11,
    padding: "4px 8px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,.14)",
    opacity: 0.75
  },
  badgeActive: {
    fontSize: 11,
    padding: "4px 8px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,.22)",
    background: "rgba(255,255,255,.10)"
  },
  list: { display: "flex", flexDirection: "column", gap: 10 },
  empty: { fontSize: 12, opacity: 0.7, padding: 10 },

  footer: { marginTop: 10, display: "flex", justifyContent: "flex-end" },
  linkBtn: {
    border: "1px solid rgba(255,255,255,.14)",
    background: "transparent",
    color: "#e7eefc",
    borderRadius: 999,
    padding: "6px 10px",
    cursor: "pointer",
    fontSize: 12,
    opacity: 0.85
  }
};
