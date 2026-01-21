# 📈 Market Indicators 설정 가이드

**날짜**: 2026-01-11
**기능**: 실시간 시장 지표 모니터링 (유가, 환율, 원자재)

---

## 🎯 개요

Market Indicators 컴포넌트가 성공적으로 구현되었습니다!

### 표시되는 지표

1. **🛢️ Brent Crude** - 브렌트유 가격 (해양 플랜트 수주에 직접 영향)
2. **💱 USD/KRW** - 원달러 환율 (수출 경쟁력에 직접 영향)
3. **📊 Steel Price Index** - 철강 가격 지수 (건조 원가에 영향)
4. **⛽ LNG Price** - LNG 가격 (LNG선/FSRU 사업 관련)

### AI 인사이트

각 지표의 변화를 분석하여 자동으로 비즈니스 인사이트를 생성합니다:
- 유가 상승 시 → 해양 플랜트 수주 활동 강화 권장
- 원화 약세 시 → 수출 경쟁력 우수, 적극 영업 권장
- 철강가 급등 시 → 원가 상승 압력 경고

---

## 🚀 설치 및 설정

### Step 1: API 키 발급

#### 1.1 Alpha Vantage (유가 데이터)

**무료 플랜**: 500 calls/day, 5 calls/minute

1. https://www.alphavantage.co/support/#api-key 접속
2. 이메일 입력
3. API 키 즉시 발급 (예: `ABC123XYZ`)

#### 1.2 Exchange Rate API (환율 데이터)

**무료 플랜**: 1,500 requests/month

1. https://www.exchangerate-api.com/ 접속
2. "Get Free Key" 클릭
3. 이메일 입력 후 가입
4. API 키 확인 (예: `a1b2c3d4e5f6g7h8`)

---

### Step 2: 환경 변수 설정

프로젝트 루트에 `.env` 파일 생성 (이미 있으면 추가):

```bash
# Existing variables
PERPLEXITY_API_KEY=pplx-xxxxxxxxxxxxxxxx
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGc...

# Market Indicators APIs (새로 추가)
ALPHA_VANTAGE_API_KEY=ABC123XYZ
EXCHANGE_RATE_API_KEY=a1b2c3d4e5f6g7h8
```

**중요**: `.env` 파일은 절대 Git에 커밋하지 마세요!

---

### Step 3: 로컬 테스트

```bash
# 1. 의존성 설치 (필요시)
npm install

# 2. 개발 서버 시작
npm run dev

# 3. 브라우저에서 확인
# http://localhost:5173
```

---

## 🎨 UI 구조

### 대시보드 레이아웃

```
┌─────────────────────────────────────────────────┐
│ Header: Energy Insight                         │
│ [Offshore O&G] [Offshore Wind] [SMR]          │
├─────────────────────────────────────────────────┤
│ 📅 Showing news from the last 72 hours         │
├─────────────────────────────────────────────────┤
│                                                 │
│ 📈 MARKET WATCH (Live)            🔄 5분 전    │
│ ┌─────────────────────────────────────────────┐ │
│ │ ┌──────────┐ ┌──────────┐ ┌──────────┐    │ │
│ │ │🛢️ Brent  │ │💱 USD/KRW│ │📊 Steel  │    │ │
│ │ │          │ │          │ │          │    │ │
│ │ │ $85.43  │ │ ₩1,327  │ │  142.5   │    │ │
│ │ │ ↑ +2.1% │ │ ↓ -0.3% │ │ ↑ +0.5% │    │ │
│ │ │ 🟢 높음  │ │ 🟢 유리  │ │ 🟡 중간  │    │ │
│ │ └──────────┘ └──────────┘ └──────────┘    │ │
│ │                                             │ │
│ │ 🤖 AI Insight:                              │ │
│ │ "브렌트유 $85 돌파로 해양 플랜트 수주       │ │
│ │  활동 강화 시점. 원화 약세로 수출 경쟁력   │ │
│ │  우수. 적극적 영업 권장."                  │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ [기존 KPI Grid]                                 │
│ [기존 News Grid]                                │
└─────────────────────────────────────────────────┘
```

---

## 🔄 자동 업데이트

### 업데이트 주기

- **자동 새로고침**: 5분마다
- **수동 새로고침**: 페이지 새로고침

### 데이터 소스

| 지표 | 소스 | 업데이트 주기 |
|------|------|---------------|
| Brent/WTI | Alpha Vantage | 실시간 (영업일) |
| USD/KRW | Exchange Rate API | 실시간 (24/7) |
| Steel | Mock Data* | 수동 |
| LNG | Mock Data* | 수동 |

*참고: Steel과 LNG는 현재 목(mock) 데이터를 사용합니다. 향후 실제 API 통합 예정.

---

## 📊 API 사용량 및 비용

### 무료 플랜 제한

#### Alpha Vantage
- 일일 한도: 500 calls
- 분당 한도: 5 calls
- **예상 사용량**: ~50 calls/day (5분마다 × 12시간 × 접속자 수)
- **결론**: 무료 플랜으로 충분 ✅

#### Exchange Rate API
- 월간 한도: 1,500 requests
- **예상 사용량**: ~360 requests/month (5분마다 × 12시간 × 30일 / 접속자 수)
- **결론**: 무료 플랜으로 충분 ✅

### 비용

```
현재 비용: $0/월 (무료 API 사용)

필요시 유료 플랜:
- Alpha Vantage Premium: $49.99/월 (무제한)
- Exchange Rate API Pro: $9/월 (100K requests)

총 예상 비용: $0 ~ $59/월
```

---

## 🐛 트러블슈팅

### 문제 1: "시장 데이터를 불러올 수 없습니다" 에러

**원인**:
- API 키가 설정되지 않음
- API 키가 잘못됨
- API 레이트 리밋 초과

**해결**:
```bash
# 1. .env 파일 확인
cat .env | grep API_KEY

# 2. API 키가 올바른지 확인
# Alpha Vantage: https://www.alphavantage.co/support/#api-key
# Exchange Rate API: https://app.exchangerate-api.com/

# 3. 서버 재시작
npm run dev
```

### 문제 2: 데이터가 업데이트되지 않음

**원인**:
- 5분 캐싱 때문에 즉시 업데이트 안 됨
- API 레이트 리밋 도달

**해결**:
```bash
# 1. 브라우저 콘솔 열기 (F12)
# 2. Network 탭에서 /api/market-indicators 확인
# 3. 에러 메시지 확인

# 레이트 리밋 경고 시:
# → Alpha Vantage는 5분에 5회만 호출 가능
# → 여러 브라우저 탭을 열지 마세요
```

### 문제 3: Mock 데이터만 표시됨

**원인**:
- API 키 미설정
- API 오류로 fallback 동작

**해결**:
```bash
# 1. 서버 로그 확인
npm run dev
# 콘솔에서 "[AlphaVantage]" 또는 "[ExchangeRate]" 메시지 확인

# 2. Mock 데이터는 정상 동작입니다
# API 키 없이도 테스트 가능하도록 설계됨
```

---

## 🔮 향후 개선 계획

### Phase 2: 실제 원자재 데이터 통합

현재 Steel과 LNG는 mock 데이터 사용 중. 향후 다음 API 통합 예정:

1. **Trading Economics API** (철강, LNG)
   - 유료: $50~$500/월
   - 가장 신뢰할 수 있는 데이터

2. **Quandl API** (원자재)
   - 무료/유료 혼합
   - 금융 데이터 전문

3. **Web Scraping** (무료 대안)
   - 공개 웹사이트에서 크롤링
   - 법적 검토 필요

### Phase 3: 과거 데이터 저장 및 추세 분석

```sql
-- Supabase에 시계열 데이터 저장
CREATE TABLE market_history (
  date DATE,
  indicator VARCHAR(50),
  value DECIMAL,
  PRIMARY KEY (date, indicator)
);

-- 6개월 차트 표시
-- 추세 예측 (AI 기반)
-- 알림 기능 (특정 값 이상/이하 시)
```

### Phase 4: 알림 시스템

- 유가 $90 이상 → 이메일/슬랙 알림
- 원달러 환율 1,400원 이상 → 알림
- 철강가 급등 (10% 이상) → 알림

---

## 📚 참고 자료

### API 문서
- [Alpha Vantage Documentation](https://www.alphavantage.co/documentation/)
- [Exchange Rate API Documentation](https://www.exchangerate-api.com/docs/overview)

### 무료 API 대안
- [Financial Modeling Prep](https://financialmodelingprep.com/) - 주식, 원자재
- [Twelve Data](https://twelvedata.com/) - 유가, 환율
- [Open Exchange Rates](https://openexchangerates.org/) - 환율

### 유료 프리미엄 API
- [Trading Economics](https://tradingeconomics.com/api) - 모든 시장 데이터
- [IHS Markit](https://ihsmarkit.com/) - 해양 산업 전문
- [Bloomberg API](https://www.bloomberg.com/professional/product/api-data/) - 금융 데이터

---

## ✅ 체크리스트

구현 완료 확인:

- [x] Alpha Vantage API 통합
- [x] Exchange Rate API 통합
- [x] market-indicators 엔드포인트 생성
- [x] MarketIndicators React 컴포넌트
- [x] Dashboard 통합
- [x] AI 인사이트 생성
- [x] 5분 자동 새로고침
- [x] 에러 핸들링 및 Fallback
- [x] 빌드 테스트 통과

다음 단계:

- [ ] API 키 발급 (Alpha Vantage, Exchange Rate API)
- [ ] .env 파일 설정
- [ ] 로컬 테스트
- [ ] 프로덕션 배포
- [ ] 실제 데이터 확인

---

**마지막 업데이트**: 2026-01-11
**구현 시간**: 약 2시간
**비용**: $0/월 (무료 API 사용)
**다음 개선**: Steel/LNG 실제 데이터 통합, 과거 데이터 저장, 알림 시스템
