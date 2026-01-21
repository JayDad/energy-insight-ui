# 🔍 Energy Insight UI - 분석 및 개선안

**분석 날짜**: 2026-01-11
**대상 고객**: 현대중공업 해양에너지 사업부
**목표**: 비즈니스 의사결정을 위한 실시간 시장 인사이트 제공

---

## 📊 현재 상태 분석

### ✅ 구현된 기능

#### 1. 뉴스 모니터링
- **3개 섹터 커버**:
  - Offshore Oil & Gas (해양 석유/가스)
  - Offshore Wind (해상풍력)
  - SMR (소형모듈원자로)

- **Perplexity AI 통합**:
  - Search API: 신뢰할 수 있는 뉴스 소스 20개+ 필터링
  - Sonar Pro: 한글/영어 이중 언어 요약
  - Citations: 출처 추적

- **시간 필터링**:
  - 실시간 뉴스 (72시간)
  - 히스토리 (6개월)

#### 2. 사용자 경험
- ✅ 한글 요약으로 빠른 정보 파악
- ✅ 확장/접기 UI
- ✅ 다크 테마 (장시간 모니터링 적합)

### ❌ 현재 부족한 점

#### 1. **KPI 데이터가 정적**
```javascript
const KPI_ITEMS = [
  { key: "rigs", label: "Active Rigs", value: "184", unit: "units" },
  { key: "dayrate", label: "Avg Dayrate", value: "$318K", unit: "/day" },
  ...
];
```
→ **문제**: 실시간 데이터 아님, 수동 업데이트 필요

#### 2. **유가/환율 지표 없음**
- 현대중공업 사업에 직접적 영향을 주는 지표:
  - ❌ 브렌트/WTI 유가
  - ❌ USD/KRW 환율
  - ❌ 철강 가격
  - ❌ LNG 가격

#### 3. **경쟁사 정보 없음**
- 삼성중공업, 대우조선해양 등 경쟁사 동향
- 글로벌 경쟁사 (싱가포르 Keppel, 중국 COSCO 등)

#### 4. **트렌드 분석 없음**
- 시계열 데이터 부재
- 시장 변화 추세 파악 불가
- 예측 기능 없음

#### 5. **비즈니스 인사이트 부족**
- 수주 기회 발굴 기능 없음
- 리스크 조기 경보 없음
- 경영진 리포트 자동 생성 없음

---

## 🎯 현대중공업 맞춤 개선안

### Phase 1: 실시간 시장 지표 연동 (핵심 우선순위)

#### 1.1 유가 지표 추가
```javascript
// 추가할 API 엔드포인트: /api/market-indicators

// 데이터 소스 옵션:
// - Alpha Vantage API (무료, 일 500 calls)
// - EIA API (미국 에너지정보청, 무료)
// - Yahoo Finance API (무료)

const MARKET_INDICATORS = [
  {
    key: "brent",
    label: "Brent Crude",
    value: "$85.43",
    change: "+2.1%",
    unit: "/barrel",
    impact: "high" // 해양 플랜트 수주에 직접 영향
  },
  {
    key: "wti",
    label: "WTI Crude",
    value: "$82.17",
    change: "+1.8%",
    unit: "/barrel",
    impact: "high"
  },
  {
    key: "usdkrw",
    label: "USD/KRW",
    value: "1,327.50",
    change: "-0.3%",
    unit: "원",
    impact: "critical" // 수출 경쟁력에 직접 영향
  },
  {
    key: "steel",
    label: "Steel Price Index",
    value: "142.5",
    change: "+0.5%",
    unit: "index",
    impact: "medium" // 원가에 영향
  },
  {
    key: "lng",
    label: "LNG Price (JKM)",
    value: "$12.34",
    change: "-1.2%",
    unit: "/MMBtu",
    impact: "high" // FSRU/FLNG 사업 관련
  }
];
```

**UI 배치**:
```
┌─────────────────────────────────────────────────┐
│ 📈 Market Indicators (Live)                    │
├─────────────────────────────────────────────────┤
│ Brent: $85.43 ↑2.1%  |  WTI: $82.17 ↑1.8%    │
│ USD/KRW: 1,327.50 ↓0.3%  |  Steel: 142.5 ↑0.5%│
│ LNG: $12.34 ↓1.2%                              │
│                                                 │
│ 🔔 Alert: 브렌트유 가격 $85 돌파!              │
│    → 해양 플랜트 수주 활동 강화 시점            │
└─────────────────────────────────────────────────┘
```

**비즈니스 영향**:
- ✅ 유가 상승 → 석유사 투자 증가 → 수주 기회 증가
- ✅ 원화 약세 → 수출 경쟁력 향상
- ✅ 철강가 상승 → 원가 상승 압력 조기 파악

#### 1.2 해양 플랜트 특화 KPI (실시간)
```javascript
const OFFSHORE_KPI = [
  {
    key: "jackup_utilization",
    label: "Jack-up Utilization",
    value: "89.2%",
    change: "+3.1%",
    source: "IHS Petrodata",
    insight: "높은 가동률 → 신규 장비 수요 증가 예상"
  },
  {
    key: "dayrate_avg",
    label: "Avg Dayrate (Drillship)",
    value: "$318,500",
    change: "+8.2%",
    source: "Bassoe Analytics",
    insight: "데이레이트 상승 → 시장 회복 중"
  },
  {
    key: "fpso_pipeline",
    label: "FPSO Projects Pipeline",
    value: "42",
    change: "+5 (QoQ)",
    source: "Infield Systems",
    insight: "FPSO 수요 증가 → 수주 기회"
  },
  {
    key: "wind_capex",
    label: "Offshore Wind CapEx",
    value: "$87.2B",
    change: "+12.3%",
    source: "GWEC",
    insight: "해상풍력 투자 급증 → 설치선박 수요"
  }
];
```

**데이터 소스**:
- IHS Markit API (유료, 가장 정확)
- Rigzone API (무료/유료 혼합)
- 자체 스크래핑 (Offshore Magazine, Offshore Engineer)

---

### Phase 2: 현대중공업 특화 인사이트

#### 2.1 경쟁사 모니터링
```javascript
// 새 섹션: 경쟁사 동향
const COMPETITORS = [
  {
    name: "삼성중공업",
    sector: ["offshore", "wind", "lng"],
    recentNews: [
      {
        title: "삼성중공업, 카타르로부터 LNG선 4척 수주",
        value: "$1.2B",
        impact: "high",
        summary_ko: "카타르 에너지로부터 17만4000㎥급..."
      }
    ]
  },
  {
    name: "대우조선해양",
    sector: ["offshore", "lng"],
    recentNews: [...]
  },
  {
    name: "Keppel (싱가포르)",
    sector: ["fpso", "rig"],
    recentNews: [...]
  },
  {
    name: "SembCorp Marine",
    sector: ["fpso", "rig"],
    recentNews: [...]
  }
];
```

**UI**:
```
┌─────────────────────────────────────────────────┐
│ 🏢 Competitor Watch                            │
├─────────────────────────────────────────────────┤
│ 🔴 삼성중공업                                    │
│    최근 수주: LNG선 4척 ($1.2B)                  │
│    → 카타르 시장 선점, 대응 전략 필요            │
│                                                 │
│ 🟡 대우조선해양                                  │
│    최근 동향: 중동 FPSO 입찰 참여 중             │
│                                                 │
│ 🟢 Keppel                                       │
│    최근 수주: 브라질 FPSO 개조 프로젝트          │
└─────────────────────────────────────────────────┘
```

#### 2.2 수주 기회 AI 발굴
```javascript
// Perplexity AI를 활용한 수주 기회 스캔

// 뉴스에서 다음 키워드 탐지:
const OPPORTUNITY_KEYWORDS = [
  // 직접적 기회
  "tender", "bidding", "EPC contract",
  "seeking contractor", "RFP", "RFQ",

  // 간접적 신호
  "FID approval", "final investment decision",
  "oil discovery", "gas field development",
  "offshore wind farm approved",

  // 지역별 키워드
  "Petrobras", "Saudi Aramco", "QatarEnergy",
  "Equinor", "Shell", "TotalEnergies",

  // 프로젝트 유형
  "FPSO", "drillship", "jack-up rig",
  "offshore wind turbine installation vessel",
  "LNG carrier", "LNG-FSRU"
];

// AI 분석 결과:
const OPPORTUNITIES = [
  {
    title: "Petrobras announces $5B FPSO tender",
    location: "Brazil, Santos Basin",
    value: "$5B",
    timeline: "Bid deadline: 2026 Q2",
    probability: "High",
    summary_ko: "브라질 페트로브라스가 산토스 해역에 FPSO 입찰...",
    action: "입찰 준비 착수 권장",
    competitors: ["삼성중공업", "SembCorp Marine"],
    requirements: "180,000 bbl/day capacity, 2028 delivery"
  },
  {
    title: "Saudi Aramco plans 4 new jackup rigs",
    location: "Saudi Arabia, Arabian Gulf",
    value: "$800M",
    timeline: "Q1 2026",
    probability: "Medium",
    summary_ko: "사우디 아람코가 아라비아만에 신규 잭업리그...",
    action: "현지 파트너십 검토",
    competitors: ["Keppel", "Lamprell"]
  }
];
```

**UI**:
```
┌─────────────────────────────────────────────────┐
│ 🎯 Opportunity Radar (AI-Powered)              │
├─────────────────────────────────────────────────┤
│ 🔥 HIGH PRIORITY                                │
│                                                 │
│ 📌 Petrobras FPSO Tender ($5B)                 │
│    📍 Brazil, Santos Basin                      │
│    ⏰ Bid deadline: Q2 2026                     │
│    🤖 AI Insight: 브라질 페트로브라스가 대형     │
│       FPSO 입찰 공고. 현대중공업 기술력 부합.   │
│    ⚔️ 경쟁사: 삼성중공업, SembCorp Marine       │
│    💡 Action: 입찰 준비 착수 권장               │
│    📄 [자세히 보기] [입찰서 템플릿]             │
│                                                 │
│ ⚠️ MEDIUM PRIORITY                              │
│ 📌 Saudi Aramco Jackup Rigs ($800M)            │
│    ...                                          │
└─────────────────────────────────────────────────┘
```

#### 2.3 리스크 조기 경보 시스템
```javascript
const RISK_ALERTS = [
  {
    type: "geopolitical",
    severity: "high",
    title: "중동 지역 긴장 고조",
    summary_ko: "이란-이스라엘 갈등으로 페르시아만 안보 불안...",
    impact: "중동 프로젝트 리스크 증가",
    affected_projects: [
      "Qatar LNG Project",
      "Saudi Offshore Development"
    ],
    recommendation: "계약 조건 재검토, 보험 강화"
  },
  {
    type: "market",
    severity: "medium",
    title: "철강 가격 20% 급등",
    summary_ko: "중국 철강 수출 규제로 국제 철강가 급등...",
    impact: "건조 원가 상승 압력",
    affected_sectors: ["offshore", "wind"],
    recommendation: "장기 철강 계약 검토, 헤지 전략 수립"
  },
  {
    type: "regulatory",
    severity: "low",
    title: "EU 탄소세 강화",
    summary_ko: "유럽연합이 해운 부문 탄소세 강화 발표...",
    impact: "친환경 선박 수요 증가 예상",
    opportunity: "LNG 추진 선박, 암모니아 추진 선박 수주 기회",
    recommendation: "친환경 기술 투자 확대"
  }
];
```

**UI**:
```
┌─────────────────────────────────────────────────┐
│ ⚠️ Risk Monitor                                 │
├─────────────────────────────────────────────────┤
│ 🔴 HIGH                                         │
│ 중동 지역 긴장 고조                              │
│ → 영향: Qatar LNG Project, Saudi Offshore       │
│ → 권장: 계약 조건 재검토, 보험 강화              │
│                                                 │
│ 🟡 MEDIUM                                       │
│ 철강 가격 20% 급등                               │
│ → 영향: 건조 원가 상승                           │
│ → 권장: 장기 철강 계약 검토                      │
└─────────────────────────────────────────────────┘
```

---

### Phase 3: 트렌드 분석 및 시각화

#### 3.1 시계열 차트
```javascript
// 새 페이지: /trends

import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

const TREND_DATA = {
  oil_price: [
    { date: '2025-10', brent: 78.5, wti: 75.2 },
    { date: '2025-11', brent: 82.1, wti: 78.9 },
    { date: '2025-12', brent: 85.3, wti: 82.1 },
    { date: '2026-01', brent: 85.4, wti: 82.2 }
  ],
  rig_count: [
    { date: '2025-10', jackup: 142, drillship: 68 },
    { date: '2025-11', jackup: 145, drillship: 70 },
    { date: '2025-12', jackup: 148, drillship: 71 },
    { date: '2026-01', jackup: 151, drillship: 72 }
  ],
  order_pipeline: [
    { quarter: '2025 Q3', offshore: 12, wind: 8, lng: 15 },
    { quarter: '2025 Q4', offshore: 15, wind: 10, lng: 18 },
    { quarter: '2026 Q1', offshore: 18, wind: 12, lng: 20 }
  ]
};
```

**UI**:
```
┌─────────────────────────────────────────────────┐
│ 📈 Market Trends                               │
├─────────────────────────────────────────────────┤
│                                                 │
│  [유가 추세 차트]                                │
│   Brent ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━         │
│   WTI   - - - - - - - - - - - - - - - - -       │
│                                                 │
│  [리그 가동 현황]                                │
│   Jack-up ████████████████████████             │
│   Drillship ██████████████                     │
│                                                 │
│  [수주 파이프라인 (분기별)]                      │
│   Offshore ████████████████████                │
│   Wind     ████████████                        │
│   LNG      ████████████████████████            │
│                                                 │
│  🤖 AI Insight:                                 │
│  유가 상승세 지속 + 리그 가동률 증가 추세        │
│  → 향후 6개월 해양 플랜트 수주 호황 예상         │
└─────────────────────────────────────────────────┘
```

#### 3.2 예측 모델
```javascript
// Perplexity AI + 시계열 데이터 분석

const FORECAST = {
  oil_price: {
    current: 85.43,
    forecast_3m: 88.20,
    forecast_6m: 92.50,
    confidence: 75,
    reasoning: "OPEC+ 감산 지속, 중국 수요 회복, 지정학적 리스크"
  },
  market_outlook: {
    offshore_og: {
      trend: "상승",
      confidence: "high",
      summary_ko: "유가 강세 지속으로 석유사들의 해양 프로젝트 투자 확대 예상. 특히 심해 개발 프로젝트 증가."
    },
    offshore_wind: {
      trend: "급성장",
      confidence: "very high",
      summary_ko: "글로벌 탄소중립 목표로 해상풍력 투자 폭증. 2026년 80GW 이상 신규 설비 예상."
    }
  }
};
```

---

### Phase 4: 경영진 대시보드

#### 4.1 주간 요약 리포트 자동 생성
```javascript
// Perplexity Sonar Pro로 자동 생성

const WEEKLY_REPORT = {
  week: "2026-01-06 ~ 2026-01-12",
  generated: "2026-01-13 08:00",

  executive_summary_ko: `
  이번 주 해양에너지 시장 주요 동향:

  1. 시장 환경
     - 브렌트유 $85 돌파, 전주 대비 +2.1%
     - USD/KRW 1,327원, 수출 경쟁력 개선
     - 글로벌 리그 가동률 89.2%, 신규 수요 증가

  2. 주요 뉴스
     - Petrobras, $5B FPSO 입찰 공고 (수주 기회 ★★★)
     - Shell, 북해 4개 유전 개발 최종 승인 (장비 수요)
     - 한국 정부, 해상풍력 8GW 추가 승인 (국내 기회)

  3. 경쟁사 동향
     - 삼성중공업: 카타르 LNG선 4척 수주 ($1.2B)
     - 대우조선: 중동 FPSO 입찰 참여 중

  4. 권장 액션
     - Petrobras FPSO 입찰 준비 착수 (마감: Q2 2026)
     - 북해 프로젝트 파트너 미팅 일정 조율
     - 국내 해상풍력 설치선박 수요 선점 전략 수립
  `,

  key_metrics: [
    { metric: "신규 입찰 공고", value: 8, change: "+2" },
    { metric: "수주 기회 (총액)", value: "$12.3B", change: "+$3.1B" },
    { metric: "경쟁사 수주", value: 5, change: "+1" }
  ],

  opportunities: [...],
  risks: [...],
  recommendations: [...]
};
```

**UI (이메일 또는 PDF)**:
```
┌─────────────────────────────────────────────────┐
│ 📊 Weekly Executive Report                     │
│ 해양에너지 시장 주간 리포트                      │
│ 2026년 1월 6일 ~ 1월 12일                        │
├─────────────────────────────────────────────────┤
│                                                 │
│ 🎯 핵심 요약                                     │
│ • 브렌트유 $85 돌파, 시장 호황 지속              │
│ • Petrobras FPSO 입찰 ($5B) - 즉시 대응 필요   │
│ • 삼성중공업 카타르 수주 - 경쟁 심화             │
│                                                 │
│ 📈 주요 지표                                     │
│ • 신규 입찰: 8건 (↑2)                           │
│ • 수주 기회: $12.3B (↑$3.1B)                    │
│                                                 │
│ 💡 권장 액션                                     │
│ 1. Petrobras 입찰 준비 착수                     │
│ 2. 북해 파트너 미팅 조율                         │
│ 3. 국내 해상풍력 선점 전략                       │
│                                                 │
│ [전체 리포트 다운로드 (PDF)]                     │
└─────────────────────────────────────────────────┘
```

---

## 🛠️ 기술 구현 로드맵

### Phase 1: 시장 지표 연동 (4주)

#### Week 1-2: 유가/환율 API 통합
```bash
# 필요한 API
1. Alpha Vantage (유가, 환율)
   - 무료: 500 calls/day
   - URL: https://www.alphavantage.co/

2. EIA API (미국 에너지정보청)
   - 무료, unlimited
   - URL: https://www.eia.gov/opendata/

3. Exchange Rate API (환율)
   - 무료: 1500 calls/month
   - URL: https://exchangerate-api.com/

# 구현 파일
api/market-indicators.js        (새 엔드포인트)
api/_lib/alphaVantage.js        (Alpha Vantage 통합)
api/_lib/eia.js                 (EIA 통합)
src/components/MarketIndicators.jsx  (UI 컴포넌트)
```

**예상 비용**: $0 (무료 티어 사용)

#### Week 3-4: KPI 실시간 데이터
```bash
# 데이터 소스
1. IHS Markit API (유료)
   - 가격: ~$500-1000/월
   - 가장 정확한 리그/선박 데이터

2. Rigzone Scraping (무료)
   - 리그 카운트, 데이레이트
   - 크롤링 + 파싱

3. 자체 DB 구축
   - 공개 리포트 수동 입력
   - Perplexity로 자동 추출

# 구현 파일
api/offshore-kpi.js
api/_lib/rigzoneScraper.js
supabase-migration-kpi-tables.sql
```

**예상 비용**: $0-500/월 (무료 스크래핑 or 유료 API)

---

### Phase 2: 인사이트 기능 (6주)

#### Week 5-7: 경쟁사 모니터링
```bash
# Perplexity Search API 활용
# 경쟁사 이름으로 뉴스 필터링

api/_lib/competitorWatch.js
src/pages/CompetitorDashboard.jsx

# 크롤링 대상
- 삼성중공업 IR 페이지
- 대우조선해양 보도자료
- Keppel 공시
```

#### Week 8-10: 수주 기회 AI
```bash
# Perplexity Sonar Pro로 키워드 탐지
# NLP 분석으로 입찰 정보 추출

api/_lib/opportunityScanner.js
api/_lib/nlpAnalyzer.js
src/pages/OpportunityRadar.jsx

# 알림 시스템
- 이메일 알림 (SendGrid API)
- 슬랙 웹훅
- 대시보드 배지
```

---

### Phase 3: 트렌드 분석 (4주)

#### Week 11-12: 시계열 차트
```bash
npm install recharts

src/components/TrendCharts.jsx
src/pages/TrendsPage.jsx
api/historical-data.js

# Supabase에 시계열 데이터 저장
CREATE TABLE market_history (
  date DATE,
  indicator VARCHAR(50),
  value DECIMAL,
  PRIMARY KEY (date, indicator)
);
```

#### Week 13-14: 예측 모델
```bash
# Perplexity AI로 전망 생성
# 과거 데이터 기반 패턴 분석

api/_lib/forecastEngine.js
src/components/ForecastCard.jsx
```

---

### Phase 4: 경영진 리포트 (2주)

#### Week 15-16: 자동 리포트
```bash
# 매주 월요일 08:00 자동 생성
# Perplexity로 요약 작성
# PDF 생성 (Puppeteer)

api/cron/weekly-report.js
api/_lib/reportGenerator.js
api/_lib/pdfExporter.js

# 이메일 발송
import nodemailer from 'nodemailer';
```

---

## 💰 비용 분석

### 월간 운영 비용 추정

| 항목 | 무료 옵션 | 유료 옵션 | 추천 |
|------|-----------|-----------|------|
| **뉴스 수집** | | | |
| Perplexity API | $2.38/월 | 동일 | ✅ 현재 구현 |
| **시장 지표** | | | |
| Alpha Vantage | $0 (무료) | $49.99/월 | ✅ 무료로 충분 |
| EIA API | $0 (무료) | - | ✅ 무료 |
| Exchange Rate API | $0 (무료) | $9/월 | ✅ 무료로 충분 |
| **KPI 데이터** | | | |
| Rigzone 스크래핑 | $0 | - | ✅ 시작 단계 |
| IHS Markit API | - | $500-1000/월 | 🔶 정확도 필요시 |
| **인프라** | | | |
| Vercel 호스팅 | $0 (무료) | $20/월 | ✅ 무료로 충분 |
| Supabase DB | $0 (무료) | $25/월 | ✅ 무료로 충분 |
| SendGrid (이메일) | $0 (100/day) | $19.95/월 | ✅ 무료로 충분 |
| **총계** | **$2.38/월** | **$623.94/월** | |

**권장 초기 구성**:
- **$2.38/월** (무료 티어 활용)
- 필요시 IHS Markit API 추가 → **$502.38/월**

**연간 비용**:
- 무료 구성: **$28.56/년**
- 프리미엄 구성: **$6,028.56/년**

---

## 🎯 비즈니스 ROI

### 기대 효과

#### 1. 수주 기회 조기 발굴
- **현재**: 입찰 공고 발견까지 평균 2-3주 지연
- **개선**: 실시간 AI 스캔으로 즉시 파악
- **효과**: 입찰 준비 시간 확보 → 수주 성공률 ↑

#### 2. 경쟁사 대응 시간 단축
- **현재**: 경쟁사 수주 소식을 며칠 후 언론 보도로 확인
- **개선**: 실시간 모니터링으로 당일 파악
- **효과**: 대응 전략 신속 수립

#### 3. 시장 타이밍 최적화
- **현재**: 유가/시장 동향을 주간/월간 리포트로 확인
- **개선**: 실시간 지표로 즉각 판단
- **효과**: 영업/마케팅 타이밍 최적화

#### 4. 의사결정 속도 향상
- **현재**: 시장 조사 → 보고서 작성 → 경영진 보고 (1-2주)
- **개선**: AI 자동 요약 → 실시간 대시보드 (즉시)
- **효과**: 의사결정 리드타임 90% 단축

### ROI 계산 (예시)

```
가정:
- 연간 수주 기회: 50건
- AI 시스템으로 추가 발견: +10건 (20% 증가)
- 평균 프로젝트 규모: $100M
- 수주 성공률: 10%
- 현대중공업 마진: 5%

추가 수주액:
10건 × $100M × 10% = $100M/년

추가 이익:
$100M × 5% = $5M/년

시스템 비용:
- 초기 개발: $50K (외주 시)
- 연간 운영: $6K (프리미엄 API 사용)

ROI:
($5M - $6K) / ($50K + $6K) × 100 = 8,810%

투자 회수 기간:
($50K + $6K) / $5M × 12개월 = 0.13개월 (약 4일)
```

→ **압도적인 ROI**, 즉시 투자 가치 있음

---

## 🚀 우선순위 추천

### 즉시 시작 (1-2주 내)
1. ✅ **유가/환율 API 연동**
   - 영향: 매우 높음
   - 난이도: 낮음
   - 비용: $0

2. ✅ **경쟁사 뉴스 필터 추가**
   - 영향: 높음
   - 난이도: 낮음 (기존 Perplexity 활용)
   - 비용: $0

### 1개월 내
3. ✅ **수주 기회 AI 스캔**
   - 영향: 매우 높음
   - 난이도: 중간
   - 비용: $0 (Perplexity 기존 사용)

4. ✅ **리스크 알림 시스템**
   - 영향: 높음
   - 난이도: 중간
   - 비용: $0

### 3개월 내
5. 🔶 **KPI 실시간 데이터**
   - 영향: 중간
   - 난이도: 높음 (데이터 소스 확보)
   - 비용: $0-500/월

6. 🔶 **트렌드 분석 차트**
   - 영향: 중간
   - 난이도: 중간
   - 비용: $0

### 6개월 내
7. 🔷 **자동 리포트 생성**
   - 영향: 높음
   - 난이도: 중간
   - 비용: $0

8. 🔷 **예측 모델**
   - 영향: 중간
   - 난이도: 높음
   - 비용: $0

---

## 📝 결론 및 권장사항

### 현재 상태 평가
- ✅ **강점**: 뉴스 수집/요약 기능 우수 (한글 지원, Citations)
- ❌ **약점**: 시장 지표 부재, 정적 데이터, 인사이트 부족

### 핵심 개선 방향
1. **실시간 시장 지표 연동** (유가, 환율, KPI)
2. **현대중공업 특화 인사이트** (수주 기회, 경쟁사, 리스크)
3. **의사결정 지원** (트렌드, 예측, 자동 리포트)

### 즉시 실행 가능한 Quick Wins
```
Week 1:
- Alpha Vantage API 연동 (유가/환율)
- MarketIndicators 컴포넌트 추가
- 대시보드 상단에 표시

Week 2:
- 경쟁사 뉴스 필터 추가
- Competitor Watch 섹션 생성

Week 3-4:
- 수주 기회 AI 스캔 구현
- Opportunity Radar 페이지 생성
- 이메일 알림 설정
```

### 기대 효과
- 📈 **수주 기회 발굴**: +20% 증가
- ⚡ **의사결정 속도**: 90% 단축
- 💰 **비즈니스 영향**: 연간 $5M+ 추가 이익 가능
- 🎯 **투자 대비 효과**: ROI 8,810%

---

**다음 단계**: 이 분석을 기반으로 어떤 기능부터 구현을 시작하시겠습니까?

1. **빠른 성과**: 유가/환율 지표 연동 (1-2주, $0)
2. **비즈니스 임팩트**: 수주 기회 AI (3-4주, $0)
3. **종합 개선**: 전체 로드맵 순차 진행 (16주)

**추천**: **Option 1 (유가/환율 지표)** → 빠르게 가치 입증 → 추가 투자 확보
