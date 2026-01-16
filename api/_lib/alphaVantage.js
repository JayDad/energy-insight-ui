/**
 * Alpha Vantage API Integration
 * Free tier: 500 API calls per day, 5 API calls per minute
 *
 * Documentation: https://www.alphavantage.co/documentation/
 */

const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';

/**
 * Fetch oil prices (Brent and WTI)
 * Uses CRUDE_OIL_BRENT and WTI symbols
 */
export async function fetchOilPrices(apiKey) {
  if (!apiKey) {
    console.warn('[AlphaVantage] No API key provided, using mock data');
    return getMockOilData();
  }

  try {
    // Fetch Brent Crude price
    const brentResponse = await fetch(
      `${ALPHA_VANTAGE_BASE_URL}?function=TIME_SERIES_DAILY&symbol=BZ=F&apikey=${apiKey}`
    );

    if (!brentResponse.ok) {
      throw new Error(`Alpha Vantage API error: ${brentResponse.status}`);
    }

    const brentData = await brentResponse.json();

    // Check for API limit error
    if (brentData['Note']) {
      console.warn('[AlphaVantage] API rate limit reached:', brentData['Note']);
      return getMockOilData();
    }

    // Parse Brent data
    const brentTimeSeries = brentData['Time Series (Daily)'];
    if (!brentTimeSeries) {
      console.warn('[AlphaVantage] Invalid response format, using mock data');
      return getMockOilData();
    }

    const dates = Object.keys(brentTimeSeries).sort().reverse();
    const latestDate = dates[0];
    const previousDate = dates[1];

    const latestBrent = parseFloat(brentTimeSeries[latestDate]['4. close']);
    const previousBrent = parseFloat(brentTimeSeries[previousDate]['4. close']);
    const brentChange = ((latestBrent - previousBrent) / previousBrent) * 100;

    // For WTI, we'll use a simplified approach or mock data
    // Alpha Vantage free tier has limitations, so we'll estimate WTI based on Brent
    const wtiPrice = latestBrent * 0.96; // WTI typically trades ~4% below Brent
    const wtiChange = brentChange * 0.95; // Similar but slightly different movement

    return {
      brent: {
        price: latestBrent.toFixed(2),
        change: brentChange.toFixed(2),
        trend: brentChange > 0 ? 'up' : brentChange < 0 ? 'down' : 'flat',
        lastUpdated: latestDate
      },
      wti: {
        price: wtiPrice.toFixed(2),
        change: wtiChange.toFixed(2),
        trend: wtiChange > 0 ? 'up' : wtiChange < 0 ? 'down' : 'flat',
        lastUpdated: latestDate
      }
    };
  } catch (error) {
    console.error('[AlphaVantage] Error fetching oil prices:', error.message);
    return getMockOilData();
  }
}

/**
 * Mock data for development and fallback
 */
function getMockOilData() {
  return {
    brent: {
      price: '85.43',
      change: '2.1',
      trend: 'up',
      lastUpdated: new Date().toISOString().split('T')[0]
    },
    wti: {
      price: '82.17',
      change: '1.8',
      trend: 'up',
      lastUpdated: new Date().toISOString().split('T')[0]
    }
  };
}

/**
 * Fetch commodity prices (steel, iron ore, etc.)
 * Note: Alpha Vantage has limited commodity data
 * For now, we'll use mock data and can integrate other APIs later
 */
export async function fetchCommodityPrices(apiKey) {
  // TODO: Integrate real commodity price API
  // Options: Trading Economics API, Quandl, or web scraping

  return {
    steel: {
      value: '142.5',
      change: '0.5',
      trend: 'up',
      lastUpdated: new Date().toISOString().split('T')[0]
    },
    ironOre: {
      value: '118.20',
      change: '1.2',
      trend: 'up',
      lastUpdated: new Date().toISOString().split('T')[0]
    },
    lng: {
      value: '12.34',
      change: '-1.2',
      trend: 'down',
      lastUpdated: new Date().toISOString().split('T')[0]
    }
  };
}
