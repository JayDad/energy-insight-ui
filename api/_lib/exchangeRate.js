/**
 * Exchange Rate API Integration
 * Free tier: 1,500 requests per month
 *
 * Documentation: https://www.exchangerate-api.com/docs/overview
 */

const EXCHANGE_RATE_BASE_URL = 'https://v6.exchangerate-api.com/v6';

/**
 * Fetch exchange rates (USD/KRW, EUR/USD, etc.)
 */
export async function fetchExchangeRates(apiKey) {
  if (!apiKey) {
    console.warn('[ExchangeRate] No API key provided, using mock data');
    return getMockExchangeRateData();
  }

  try {
    // Fetch USD to KRW rate
    const usdKrwResponse = await fetch(
      `${EXCHANGE_RATE_BASE_URL}/${apiKey}/pair/USD/KRW`
    );

    if (!usdKrwResponse.ok) {
      throw new Error(`Exchange Rate API error: ${usdKrwResponse.status}`);
    }

    const usdKrwData = await usdKrwResponse.json();

    if (usdKrwData.result !== 'success') {
      console.warn('[ExchangeRate] API error:', usdKrwData['error-type']);
      return getMockExchangeRateData();
    }

    // Fetch EUR to USD rate
    const eurUsdResponse = await fetch(
      `${EXCHANGE_RATE_BASE_URL}/${apiKey}/pair/EUR/USD`
    );

    const eurUsdData = await eurUsdResponse.json();

    // Calculate change percentage (comparing with previous close)
    // Note: Free tier doesn't provide historical data, so we'll simulate
    const usdKrwRate = usdKrwData.conversion_rate;
    const eurUsdRate = eurUsdData.result === 'success' ? eurUsdData.conversion_rate : 1.0842;

    // Simulate daily change (in production, store previous day's rate in DB)
    const usdKrwChange = getSimulatedChange(usdKrwRate, -0.3); // Simulate -0.3% change
    const eurUsdChange = getSimulatedChange(eurUsdRate, 0.2);   // Simulate +0.2% change

    return {
      usdkrw: {
        rate: usdKrwRate.toFixed(2),
        change: usdKrwChange.toFixed(2),
        trend: usdKrwChange > 0 ? 'up' : usdKrwChange < 0 ? 'down' : 'flat',
        lastUpdated: usdKrwData.time_last_update_utc
      },
      eurusd: {
        rate: eurUsdRate.toFixed(4),
        change: eurUsdChange.toFixed(2),
        trend: eurUsdChange > 0 ? 'up' : eurUsdChange < 0 ? 'down' : 'flat',
        lastUpdated: eurUsdData.time_last_update_utc || new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('[ExchangeRate] Error fetching exchange rates:', error.message);
    return getMockExchangeRateData();
  }
}

/**
 * Simulate percentage change
 * In production, this should compare with stored historical data
 */
function getSimulatedChange(currentRate, targetChangePercent) {
  // Just return the target change for now
  // TODO: Store rates in Supabase and calculate real change
  return targetChangePercent;
}

/**
 * Mock data for development and fallback
 */
function getMockExchangeRateData() {
  return {
    usdkrw: {
      rate: '1327.50',
      change: '-0.3',
      trend: 'down',
      lastUpdated: new Date().toISOString()
    },
    eurusd: {
      rate: '1.0842',
      change: '0.2',
      trend: 'up',
      lastUpdated: new Date().toISOString()
    }
  };
}

/**
 * Store current rates for future comparison
 * TODO: Implement with Supabase
 */
export async function storeExchangeRates(rates) {
  // TODO: Save to Supabase market_history table
  // CREATE TABLE market_history (
  //   date DATE,
  //   indicator VARCHAR(50),
  //   value DECIMAL,
  //   PRIMARY KEY (date, indicator)
  // );

  console.log('[ExchangeRate] TODO: Store rates in database:', rates);
}
