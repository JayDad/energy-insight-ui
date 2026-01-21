import { useState } from "react";

/**
 * NewsCard Component
 * Displays news item with expand/collapse functionality
 * Shows Korean/English summaries and citations
 *
 * Props:
 * - news: { id, title, link, source, date, summary_ko, summary_en, citations }
 */
export default function NewsCard({ news }) {
  const [expanded, setExpanded] = useState(false);

  const hasSummary = news.summary_ko || news.summary_en;
  const hasCitations = news.citations && news.citations.length > 0;

  // Truncate text for preview
  const truncate = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  return (
    <div style={styles.card}>
      {/* Header - always visible */}
      <div
        style={styles.header}
        onClick={() => hasSummary && setExpanded(!expanded)}
      >
        {hasSummary && (
          <span style={styles.icon}>
            {expanded ? '▼' : '▶'}
          </span>
        )}
        <div style={styles.titleSection}>
          <div style={styles.title}>{news.title}</div>

          {/* Short Korean summary preview - always visible if exists */}
          {news.summary_ko && !expanded && (
            <div style={styles.shortSummary}>
              📌 {truncate(news.summary_ko, 80)}
            </div>
          )}
        </div>
      </div>

      {/* Meta info - always visible */}
      <div style={styles.meta}>
        <span style={styles.metaText}>{news.source}</span>
        <span style={styles.metaDot}>-</span>
        <span style={styles.metaText}>{news.date}</span>
        {hasSummary && !expanded && (
          <button
            style={styles.readMoreBtn}
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(true);
            }}
          >
            더보기 ▼
          </button>
        )}
      </div>

      {/* Expanded content */}
      {expanded && hasSummary && (
        <div style={styles.expandedContent}>
          {/* Full Korean summary */}
          {news.summary_ko && (
            <div style={styles.summarySection}>
              <div style={styles.label}>📝 요약 (한글):</div>
              <p style={styles.summaryText}>{news.summary_ko}</p>
            </div>
          )}

          {/* English summary toggle */}
          {news.summary_en && (
            <details style={styles.details}>
              <summary style={styles.detailsSummary}>🌐 View English Summary</summary>
              <p style={styles.summaryText}>{news.summary_en}</p>
            </details>
          )}

          {/* Citations */}
          {hasCitations && (
            <div style={styles.citations}>
              <span style={styles.label}>🔗 출처: </span>
              {news.citations.map((cite, idx) => (
                <a
                  key={idx}
                  href={cite.url}
                  target="_blank"
                  rel="noreferrer"
                  style={styles.citationLink}
                  title={cite.snippet || cite.title}
                >
                  [{cite.title || `출처 ${idx + 1}`}]
                </a>
              ))}
            </div>
          )}

          {/* Original article link */}
          {news.link && news.link !== '#' && (
            <a
              href={news.link}
              target="_blank"
              rel="noreferrer"
              style={styles.readOriginal}
            >
              📄 원문 기사 읽기 →
            </a>
          )}

          {/* Collapse button */}
          <button
            style={styles.collapseBtn}
            onClick={() => setExpanded(false)}
          >
            접기 ▲
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    padding: 10,
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,.10)',
    background: 'rgba(0,0,0,.10)',
    transition: 'all 0.2s ease'
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
    cursor: 'pointer',
    userSelect: 'none'
  },
  icon: {
    fontSize: 10,
    opacity: 0.6,
    marginTop: 2,
    flexShrink: 0,
    transition: 'transform 0.2s ease'
  },
  titleSection: {
    flex: 1,
    minWidth: 0
  },
  title: {
    fontSize: 12,
    fontWeight: 700,
    lineHeight: 1.3,
    color: '#e7eefc',
    marginBottom: 4
  },
  shortSummary: {
    fontSize: 11,
    lineHeight: 1.4,
    color: '#b8c8e8',
    opacity: 0.85,
    marginTop: 4,
    fontStyle: 'italic'
  },
  meta: {
    marginTop: 6,
    fontSize: 11,
    opacity: 0.72,
    display: 'flex',
    gap: 6,
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  metaText: {
    color: '#e7eefc'
  },
  metaDot: {
    opacity: 0.6
  },
  readMoreBtn: {
    background: 'transparent',
    border: 'none',
    color: '#88b3ff',
    fontSize: 11,
    cursor: 'pointer',
    padding: '2px 6px',
    marginLeft: 'auto',
    textDecoration: 'underline',
    opacity: 0.8,
    transition: 'opacity 0.2s'
  },
  expandedContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTop: '1px solid rgba(255,255,255,.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: 10
  },
  summarySection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6
  },
  label: {
    fontSize: 11,
    fontWeight: 600,
    color: '#a8b8d8',
    opacity: 0.9
  },
  summaryText: {
    fontSize: 11,
    lineHeight: 1.5,
    color: '#d0ddf0',
    margin: 0,
    paddingLeft: 16,
    opacity: 0.95
  },
  details: {
    fontSize: 11,
    color: '#d0ddf0',
    cursor: 'pointer'
  },
  detailsSummary: {
    fontSize: 11,
    fontWeight: 600,
    color: '#88b3ff',
    cursor: 'pointer',
    userSelect: 'none',
    listStyle: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: 4
  },
  citations: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
    fontSize: 11
  },
  citationLink: {
    color: '#88b3ff',
    textDecoration: 'none',
    fontSize: 11,
    opacity: 0.85,
    transition: 'opacity 0.2s'
  },
  readOriginal: {
    display: 'inline-flex',
    alignItems: 'center',
    color: '#88b3ff',
    fontSize: 11,
    textDecoration: 'none',
    fontWeight: 600,
    marginTop: 4,
    opacity: 0.9,
    transition: 'opacity 0.2s'
  },
  collapseBtn: {
    background: 'rgba(255,255,255,.05)',
    border: '1px solid rgba(255,255,255,.1)',
    color: '#b8c8e8',
    fontSize: 11,
    cursor: 'pointer',
    padding: '6px 12px',
    borderRadius: 8,
    marginTop: 4,
    alignSelf: 'flex-end',
    opacity: 0.8,
    transition: 'all 0.2s'
  }
};
