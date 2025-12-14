export default function KpiGrid({ items = [] }) {
  return (
    <div style={styles.wrap}>
      <div style={styles.grid}>
        {items.map((k) => (
          <div key={k.key} style={styles.card}>
            <div style={styles.label}>{k.label}</div>
            <div style={styles.value}>{k.value}</div>
            <div style={styles.unit}>{k.unit}</div>
          </div>
        ))}
      </div>

      <div style={styles.foot}>
        * Static UI only. Live data will replace these values in Step 2.
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    background: "rgba(255,255,255,.04)",
    border: "1px solid rgba(255,255,255,.12)",
    borderRadius: 16,
    padding: 12,
    marginTop: 10
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: 12
  },
  card: {
    background: "rgba(0,0,0,.10)",
    border: "1px solid rgba(255,255,255,.10)",
    borderRadius: 14,
    padding: 12
  },
  label: {
    fontSize: 12,
    opacity: 0.7,
    fontWeight: 700
  },
  value: {
    marginTop: 8,
    fontSize: 28,
    fontWeight: 900
  },
  unit: {
    marginTop: 6,
    fontSize: 12,
    opacity: 0.75
  },
  foot: {
    marginTop: 10,
    fontSize: 12,
    opacity: 0.65
  }
};
