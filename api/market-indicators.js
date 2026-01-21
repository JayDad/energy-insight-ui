/**
 * Market Indicators API Endpoint
 * Returns real-time market data: oil prices, exchange rates, commodities
 *
 * GET /api/market-indicators
 */

import { fetchOilPrices, fetchCommodityPrices } from './_lib/alphaVantage.js';
import { fetchExchangeRates } from './_lib/exchangeRate.js';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('[Market Indicators] Fetching market data...');

    // Get API keys from environment
    const alphaVantageKey = process.env.ALPHA_VANTAGE_API_KEY;
    const exchangeRateKey = process.env.EXCHANGE_RATE_API_KEY;

    // Fetch all data in parallel
    const [oilData, fxData, commodityData] = await Promise.all([
      fetchOilPrices(alphaVantageKey),
      fetchExchangeRates(exchangeRateKey),
      fetchCommodityPrices(alphaVantageKey)
    ]);

    // Generate AI insight based on current market conditions
    const aiInsight = generateMarketInsight(oilData, fxData, commodityData);

    // Calculate overall market status
    const marketStatus = calculateMarketStatus(oilData, fxData);

    // Return formatted response
    const response = {
      lastUpdate: new Date().toISOString(),
      marketStatus,

      // Oil prices
      brent: {
        label: 'Brent Crude',
        value: `$${oilData.brent.price}`,
        change: parseFloat(oilData.brent.change),
        trend: oilData.brent.trend,
        unit: '/barrel',
        impact: 'high',
        icon: '🛢️'
      },
      wti: {
        label: 'WTI Crude',
        value: `$${oilData.wti.price}`,
        change: parseFloat(oilData.wti.change),
        trend: oilData.wti.trend,
        unit: '/barrel',
        impact: 'high',
        icon: '🛢️'
      },

      // Exchange rates
      usdkrw: {
        label: 'USD/KRW',
        value: `₩${fxData.usdkrw.rate}`,
        change: parseFloat(fxData.usdkrw.change),
        trend: fxData.usdkrw.trend,
        unit: 'KRW',
        impact: 'critical',
        icon: '💱'
      },
      eurusd: {
        label: 'EUR/USD',
        value: fxData.eurusd.rate,
        change: parseFloat(fxData.eurusd.change),
        trend: fxData.eurusd.trend,
        unit: 'USD',
        impact: 'medium',
        icon: '💱'
      },

      // Commodities
      steel: {
        label: 'Steel Price Index',
        value: commodityData.steel.value,
        change: parseFloat(commodityData.steel.change),
        trend: commodityData.steel.trend,
        unit: 'index',
        impact: 'medium',
        icon: '📊'
      },
      lng: {
        label: 'LNG Price (JKM)',
        value: `$${commodityData.lng.value}`,
        change: parseFloat(commodityData.lng.change),
        trend: commodityData.lng.trend,
        unit: '/MMBtu',
        impact: 'high',
        icon: '⛽'
      },

      // AI-generated insight
      aiInsight
    };

    console.log('[Market Indicators] ✓ Successfully fetched market data');

    // Set cache headers (cache for 5 minutes)
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60');

    return res.status(200).json(response);
  } catch (error) {
    console.error('[Market Indicators] Error:', error);
    return res.status(500).json({
      error: 'Failed to fetch market indicators',
      message: error.message
    });
  }
}

/**
 * Generate AI-powered market insight
 */
function generateMarketInsight(oilData, fxData, commodityData) {
  const brentPrice = parseFloat(oilData.brent.price);
  const brentChange = parseFloat(oilData.brent.change);
  const krwChange = parseFloat(fxData.usdkrw.change);
  const steelChange = parseFloat(commodityData.steel.change);

  let insight = '';

  // Oil price analysis
  if (brentPrice > 85 && brentChange > 0) {
    insight += '브렌트유가 $85 이상으로 상승하며 해양 플랜트 수주 활동 강화 시점입니다. ';
  } else if (brentPrice > 80) {
    insight += '유가가 안정적인 수준을 유지하며 해양 프로젝트 투자 환경이 우호적입니다. ';
  } else if (brentPrice < 75) {
    insight += '유가 하락으로 석유사들의 신규 투자가 보수적일 수 있습니다. ';
  }

  // Exchange rate analysis (negative change = won weakening = good for exports)
  if (krwChange < 0) {
    insight += '원화 약세로 수출 경쟁력이 우수합니다. ';
  } else if (krwChange > 1) {
    insight += '원화 강세로 수출 가격 경쟁력 확보가 필요합니다. ';
  }

  // Steel price analysis
  if (steelChange > 2) {
    insight += '철강가 급등으로 건조 원가 상승이 예상됩니다. ';
  } else if (steelChange < -1) {
    insight += '철강가 하락으로 원가 경쟁력이 개선되고 있습니다. ';
  }

  // Overall recommendation
  if (brentChange > 0 && krwChange < 0) {
    insight += '적극적인 영업 활동과 신규 수주 확대를 권장합니다.';
  } else if (brentChange < -2) {
    insight += '시장 모니터링을 강화하고 기존 프로젝트에 집중하는 것이 좋습니다.';
  } else {
    insight += '안정적인 시장 환경에서 균형잡힌 사업 전략이 필요합니다.';
  }

  return insight || '시장 데이터를 분석 중입니다.';
}

/**
 * Calculate overall market status
 */
function calculateMarketStatus(oilData, fxData) {
  const brentChange = parseFloat(oilData.brent.change);
  const krwChange = parseFloat(fxData.usdkrw.change);

  // Positive oil change + negative KRW change = favorable
  if (brentChange > 1 && krwChange < 0) {
    return {
      status: 'favorable',
      label: 'FAVORABLE',
      color: '#51cf66',
      icon: '🟢'
    };
  }

  // Negative oil change + positive KRW change = unfavorable
  if (brentChange < -1 && krwChange > 1) {
    return {
      status: 'unfavorable',
      label: 'UNFAVORABLE',
      color: '#ff6b6b',
      icon: '🔴'
    };
  }

  // Everything else = neutral
  return {
    status: 'neutral',
    label: 'NEUTRAL',
    color: '#ffd43b',
    icon: '🟡'
  };
}
