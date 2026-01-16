import { useState, useEffect } from 'react';

/**
 * MarketIndicators Component
 * Displays real-time market data: oil prices, exchange rates, commodities
 * Updates every 5 minutes automatically
 */
export default function MarketIndicators() {
  const [indicators, setIndicators] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    fetchMarketData();

    // Refresh every 5 minutes
    const interval = setInterval(fetchMarketData, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  async function fetchMarketData() {
    try {
      const response = await fetch('/api/market-indicators');

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setIndicators(data);
      setLastUpdate(new Date(data.lastUpdate));
      setError(null);
    } catch (err) {
      console.error('Failed to fetch market indicators:', err);
      setError('시장 데이터를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          📊 시장 데이터를 불러오는 중...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>
          ⚠️ {error}
          <button style={styles.retryBtn} onClick={fetchMarketData}>
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  if (!indicators) {
    return null;
  }

  const { marketStatus, brent, usdkrw, steel, lng, aiInsight } = indicators;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h2 style={styles.title}>📈 MARKET WATCH</h2>
          {marketStatus && (
            <span style={{ ...styles.statusBadge, color: marketStatus.color }}>
              {marketStatus.icon} {marketStatus.label}
            </span>
          )}
        </div>
        <div style={styles.updateTime}>
          🔄 {formatUpdateTime(lastUpdate)}
        </div>
      </div>

      {/* Main Indicators Grid */}
      <div style={styles.grid}>
        {/* Brent Oil - Large Card */}
        <IndicatorCard
          indicator={brent}
          size="large"
        />

        {/* USD/KRW - Large Card */}
        <IndicatorCard
          indicator={usdkrw}
          size="large"
        />

        {/* Steel - Medium Card */}
        <IndicatorCard
          indicator={steel}
          size="medium"
        />

        {/* LNG - Medium Card */}
        <IndicatorCard
          indicator={lng}
          size="medium"
        />
      </div>

      {/* AI Insight */}
      {aiInsight && (
        <div style={styles.insight}>
          <div style={styles.insightIcon}>🤖</div>
          <div style={styles.insightContent}>
            <div style={styles.insightLabel}>AI Insight:</div>
            <div style={styles.insightText}>{aiInsight}</div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Individual Indicator Card
 */
function IndicatorCard({ indicator, size = 'medium' }) {
  if (!indicator) return null;

  const { icon, label, value, change, trend, impact } = indicator;

  // Determine colors based on trend
  const isPositive = change > 0;
  const changeColor = isPositive ? '#ff6b6b' : '#51cf66';
  const changeBg = isPositive ? 'rgba(255, 107, 107, 0.15)' : 'rgba(81, 207, 102, 0.15)';

  // Impact badge color
  const impactColors = {
    critical: '#ff6b6b',
    high: '#ffd43b',
    medium: '#74c0fc',
    low: '#a0a0a0'
  };
  const impactColor = impactColors[impact] || '#74c0fc';

  // Size styles
  const cardStyle = size === 'large' ? styles.cardLarge : styles.cardMedium;

  return (
    <div style={{ ...styles.card, ...cardStyle }}>
      {/* Icon */}
      <div style={styles.cardIcon}>{icon}</div>

      {/* Label */}
      <div style={styles.cardLabel}>{label}</div>

      {/* Value */}
      <div style={styles.cardValue}>{value}</div>

      {/* Change */}
      <div style={{ ...styles.cardChange, color: changeColor, background: changeBg }}>
        {isPositive ? '↑' : '↓'} {Math.abs(change).toFixed(1)}%
      </div>

      {/* Impact Badge */}
      <div style={{ ...styles.cardImpact, background: impactColor }}>
        {getImpactLabel(impact)}
      </div>
    </div>
  );
}

/**
 * Helper functions
 */
function formatUpdateTime(date) {
  if (!date) return 'Unknown';

  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return '방금 전';
  if (diffMins < 60) return `${diffMins}분 전`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}시간 전`;

  return date.toLocaleString('ko-KR');
}

function getImpactLabel(impact) {
  const labels = {
    critical: '매우중요',
    high: '높음',
    medium: '중간',
    low: '낮음'
  };
  return labels[impact] || '중간';
}

/**
 * Styles
 */
const styles = {
  container: {
    background: 'rgba(255,255,255,.04)',
    border: '1px solid rgba(255,255,255,.12)',
    borderRadius: 16,
    padding: 16,
    marginTop: 16
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 12
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap'
  },
  title: {
    fontSize: 16,
    fontWeight: 800,
    margin: 0
  },
  statusBadge: {
    fontSize: 13,
    fontWeight: 700,
    padding: '4px 12px',
    borderRadius: 999,
    background: 'rgba(0,0,0,.20)',
    border: '1px solid rgba(255,255,255,.15)'
  },
  updateTime: {
    fontSize: 12,
    opacity: 0.65
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 12,
    marginBottom: 16
  },
  card: {
    background: 'rgba(0,0,0,.15)',
    border: '1px solid rgba(255,255,255,.10)',
    borderRadius: 12,
    padding: 14,
    textAlign: 'center',
    transition: 'all 0.2s ease'
  },
  cardLarge: {
    gridColumn: 'span 1'
  },
  cardMedium: {
    gridColumn: 'span 1'
  },
  cardIcon: {
    fontSize: 32,
    marginBottom: 8
  },
  cardLabel: {
    fontSize: 11,
    opacity: 0.7,
    marginBottom: 8,
    fontWeight: 600
  },
  cardValue: {
    fontSize: 26,
    fontWeight: 900,
    marginBottom: 6,
    lineHeight: 1
  },
  cardChange: {
    display: 'inline-block',
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 8,
    padding: '4px 10px',
    borderRadius: 8
  },
  cardImpact: {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: 999,
    fontSize: 10,
    fontWeight: 700,
    color: '#000'
  },
  insight: {
    background: 'rgba(100, 150, 255, 0.1)',
    border: '1px solid rgba(100, 150, 255, 0.3)',
    borderRadius: 12,
    padding: 14,
    display: 'flex',
    gap: 12,
    alignItems: 'flex-start'
  },
  insightIcon: {
    fontSize: 28,
    flexShrink: 0,
    marginTop: 2
  },
  insightContent: {
    flex: 1
  },
  insightLabel: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 6,
    opacity: 0.9
  },
  insightText: {
    fontSize: 13,
    lineHeight: 1.6,
    opacity: 0.95
  },
  loading: {
    padding: 40,
    textAlign: 'center',
    fontSize: 14,
    opacity: 0.7
  },
  error: {
    padding: 24,
    textAlign: 'center',
    fontSize: 13,
    color: '#ffb4b4',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    alignItems: 'center'
  },
  retryBtn: {
    padding: '8px 16px',
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,.18)',
    background: 'rgba(255,255,255,.08)',
    color: '#e7eefc',
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 600
  }
};
