import { useMemo, useState } from "react";
import HeaderBar from "./components/HeaderBar";
import KpiGrid from "./components/KpiGrid";
import NewsGrid from "./components/NewsGrid";

/**
 * 2단계 준비용: 아직은 더미 KPI (다음 단계에서 실데이터로 교체)
 */
const DUMMY_KPI = [
  { key: "brent", label: "Brent", value: 78.2, unit: "USD/bbl" },
  { key: "wti", label: "WTI", value: 74.1, unit: "USD/bbl" },
  { key: "gas", label: "Nat Gas (Henry Hub)", value: 3.15, unit: "USD/MMBtu" },
  { key: "fx", label: "USD/KRW", value: 1375.0, unit: "KRW" }
];

/**
 * 2단계 준비용: 아직은 더미 뉴스 (RSS 연동 후 교체)
 * - 핵심: sector 필드를 추가해 "섹터별 요약" 구조로 정리
 */
const DUMMY_NEWS = [
  // offshore
  {
    id: "o-1",
    sector: "offshore",
    title: "Deepwater FEED activity expected in GoM",
    source: "Upstream",
    date: "2025-12-13",
    link: "#"
  },
  {
    id: "o-2",
    sector: "offshore",
    title: "FPSO awards accelerate in Brazil",
    source: "Offshore Engineer",
    date: "2025-12-12",
    link: "#"
  },

  // wind
  {
    id: "w-1",
    sector: "wind",
    title: "Offshore wind auction rules revised in Europe",
    source: "Recharge",
    date: "2025-12-13",
    link: "#"
  },
  {
    id: "w-2",
    sector: "wind",
    title: "Supply chain pressure eases slightly",
    source: "Recharge",
    date: "2025-12-11",
    link: "#"
  },

  // smr
  {
    id: "s-1",
    sector: "smr",
    title: "SMR licensing guidance updated by regulator",
    source: "World Nuclear News",
    date: "2025-12-13",
    link: "#"
  },
  {
    id: "s-2",
    sector: "smr",
    title: "Utilities explore SMR deployment models",
    source: "World Nuclear News",
    date: "2025-12-10",
    link: "#"
  }
];

export default function App() {
  // ✅ 메인페이지에서 유지할 상태는 sector 하나만
  const [sector, setSector] = useState("offshore");

  // ✅ 2단계에서 RSS/API 붙이기 쉽게: 데이터는 state로 관리 (지금은 더미로 초기화)
  const [kpis] = useState(DUMMY_KPI);
  const [news] = useState(DUMMY_NEWS);

  /**
   * 메인 페이지는 "섹터별 최신 요약"이 핵심이므로
   * - 전체 뉴스에서 섹터별 Top N만 뽑아 보여준다.
   */
  const newsBySector = useMemo(() => {
    const grouped = { offshore: [], wind: [], smr: [] };
    for (const item of news) {
      if (grouped[item.sector]) grouped[item.sector].push(item);
    }
    // 최신이 위로 오도록 정렬 (date가 YYYY-MM-DD 라는 가정)
    for (const key of Object.keys(grouped)) {
      grouped[key] = grouped[key].sort((a, b) => String(b.date).localeCompare(String(a.date))).slice(0, 6);
    }
    return grouped;
  }, [news]);

  return (
    <div style={{ background: "#0b1220", minHeight: "100vh", color: "#e7eefc" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: 20 }}>
        <HeaderBar sector={sector} onChangeSector={setSector} />

        <KpiGrid items={kpis} />

        {/* ✅ 메인페이지: 섹터별 요약 카드(3개)를 항상 노출 */}
        <div style={styles.sectionHeader}>
          <div style={styles.h2}>Latest headlines</div>
          <div style={styles.h2Sub}>
            Executive view — drill down pages will come in Step 3
          </div>
        </div>

        <NewsGrid
          activeSector={sector}
          blocks={[
            { sector: "offshore", title: "Offshore (Oil & Gas)", items: newsBySector.offshore },
            { sector: "wind", title: "Offshore Wind", items: newsBySector.wind },
            { sector: "smr", title: "SMR", items: newsBySector.smr }
          ]}
        />
      </div>
    </div>
  );
}

const styles = {
  sectionHeader: { marginTop: 18, marginBottom: 10 },
  h2: { fontSize: 14, fontWeight: 800 },
  h2Sub: { marginTop: 4, fontSize: 12, opacity: 0.65 }
};
