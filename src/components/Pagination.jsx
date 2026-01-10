export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = [];
  const maxVisible = 7;

  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push("...");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1);
      pages.push("...");
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push("...");
      for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
      pages.push("...");
      pages.push(totalPages);
    }
  }

  return (
    <div style={styles.wrap}>
      <button
        style={currentPage === 1 ? styles.btnDisabled : styles.btn}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </button>

      <div style={styles.pages}>
        {pages.map((p, idx) =>
          p === "..." ? (
            <span key={`ellipsis-${idx}`} style={styles.ellipsis}>
              ...
            </span>
          ) : (
            <button
              key={p}
              style={p === currentPage ? styles.pageActive : styles.page}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        style={currentPage === totalPages ? styles.btnDisabled : styles.btn}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
}

const styles = {
  wrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 24
  },
  pages: {
    display: "flex",
    gap: 6,
    alignItems: "center"
  },
  btn: {
    padding: "8px 16px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,.18)",
    background: "rgba(255,255,255,.06)",
    color: "#e7eefc",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600
  },
  btnDisabled: {
    padding: "8px 16px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,.08)",
    background: "rgba(255,255,255,.02)",
    color: "#e7eefc",
    opacity: 0.3,
    cursor: "not-allowed",
    fontSize: 13,
    fontWeight: 600
  },
  page: {
    padding: "6px 12px",
    borderRadius: 6,
    border: "1px solid rgba(255,255,255,.12)",
    background: "rgba(255,255,255,.04)",
    color: "#e7eefc",
    cursor: "pointer",
    fontSize: 13
  },
  pageActive: {
    padding: "6px 12px",
    borderRadius: 6,
    border: "1px solid rgba(255,255,255,.24)",
    background: "rgba(255,255,255,.16)",
    color: "#e7eefc",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 700
  },
  ellipsis: {
    fontSize: 13,
    opacity: 0.5,
    padding: "0 4px"
  }
};
