function Tab({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={active ? styles.tabActive : styles.tab}
      type="button"
    >
      {children}
    </button>
  );
}

export default function HeaderBar({ sector, onChangeSector }) {
  const lastUpdated = new Date().toLocaleString();

  return (
    <header style={styles.wrap}>
      <div>
        <div style={styles.title}>Offshore & Energy Insight</div>
        <div style={styles.sub}>Oil & Gas / Offshore Wind / SMR</div>

        <div style={styles.tabs}>
          <Tab active={sector === "offshore"} onClick={() => onChangeSector("offshore")}
          >
            Offshore (O&G)
          </Tab>
          <Tab active={sector === "wind"} onClick={() => onChangeSector("wind")}
          >
            Offshore Wind
          </Tab>
          <Tab active={sector === "smr"} onClick={() => onChangeSector("smr")}
          >
            SMR
          </Tab>
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.meta}>
          Last updated: <span style={{ opacity: 1 }}>{lastUpdated}</span>
        </div>
      </div>
    </header>
  );
}

const styles = {
  wrap: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    flexWrap: "wrap",
    paddingBottom: 12
  },
  title: { fontSize: 18, fontWeight: 800 },
  sub: { marginTop: 4, fontSize: 12, opacity: 0.75 },
  right: { textAlign: "right" },
  meta: { fontSize: 12, opacity: 0.75 },
  note: { marginTop: 6, fontSize: 12, opacity: 0.65 },

  tabs: { marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" },
  tab: {
    padding: "8px 10px",
    borderRadius: 12,
    background: "rgba(255,255,255,.04)",
    color: "#e7eefc",
    border: "1px solid rgba(255,255,255,.14)",
    cursor: "pointer"
  },
  tabActive: {
    padding: "8px 10px",
    borderRadius: 12,
    background: "rgba(255,255,255,.12)",
    color: "#e7eefc",
    border: "1px solid rgba(255,255,255,.22)",
    cursor: "pointer"
  }
};
