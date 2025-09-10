// src/app/api/crypto/route.ts
import { NextResponse } from 'next/server';

const COINMARKETCAP_API_KEY = 'c114ac1d-9f4d-4df6-a8db-cb09ae4f139d';
const COINMARKETCAP_API_URL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest';

// Cache para evitar muitas requisições
let cache: { data: any; timestamp: number } | null = null;
const CACHE_DURATION = 10000; // 1 minuto em millisegundos

// IDs das criptomoedas na CoinMarketCap
const CRYPTO_IDS = {
  ETH: 1027,   // Ethereum
  BTC: 1,      // Bitcoin
  USDT: 825,  // USD Coin
  SOL: 5426,   // Solana
};

export async function GET() {
  try {
    // Verifica se temos cache válido
    if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
      return NextResponse.json(cache.data);
    }

    // Cria string com todos os IDs das moedas
    const cryptoIds = Object.values(CRYPTO_IDS).join(',');
    
    // Busca dados de todas as criptomoedas de uma vez
    const response = await fetch(`${COINMARKETCAP_API_URL}?id=${cryptoIds}&convert=USD`, {
      headers: {
        'X-CMC_PRO_API_KEY': COINMARKETCAP_API_KEY,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`CoinMarketCap API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Formata os dados para cada criptomoeda
    const formattedData: Record<string, any> = {};
    
    Object.entries(CRYPTO_IDS).forEach(([symbol, id]) => {
      const cryptoData = data.data[id.toString()];
      if (cryptoData) {
        formattedData[symbol] = {
          id: cryptoData.id,
          symbol: cryptoData.symbol,
          name: cryptoData.name,
          price: cryptoData.quote.USD.price,
          percent_change_24h: cryptoData.quote.USD.percent_change_24h,
          percent_change_1h: cryptoData.quote.USD.percent_change_1h,
          percent_change_7d: cryptoData.quote.USD.percent_change_7d,
          market_cap: cryptoData.quote.USD.market_cap,
          volume_24h: cryptoData.quote.USD.volume_24h,
          last_updated: cryptoData.quote.USD.last_updated,
        };
      }
    });

    // Atualiza o cache
    cache = {
      data: formattedData,
      timestamp: Date.now(),
    };

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    
    // Retorna dados de fallback se houver erro
    const fallbackData = {
      ETH: {
        id: 1027,
        symbol: 'ETH',
        name: 'Ethereum',
        price: 4287.33,
        percent_change_24h: -1.89,
        percent_change_1h: 0,
        percent_change_7d: 0,
        market_cap: 0,
        volume_24h: 0,
        last_updated: new Date().toISOString(),
      },
      USDT: {
        id: 825,
        symbol: 'USDT',
        name: 'Tether',
        price: 1.00,
        percent_change_24h: 0.01,
        percent_change_1h: 0,
        percent_change_7d: 0.02,
        market_cap: 0,
        volume_24h: 0,
        last_updated: new Date().toISOString(),
      },
      SOL: {
        id: 5426,
        symbol: 'SOL',
        name: 'Solana',
        price: 195,
        percent_change_24h: 3.2,
        percent_change_1h: 0.8,
        percent_change_7d: 8.5,
        market_cap: 0,
        volume_24h: 0,
        last_updated: new Date().toISOString(),
      },
      BTC: {
        id: 1,
        symbol: 'BTC',
        name: 'Bitcoin',
        price: 65000,
        percent_change_24h: 2.5,
        percent_change_1h: 0.5,
        percent_change_7d: 5.2,
        market_cap: 0,
        volume_24h: 0,
        last_updated: new Date().toISOString(),
      }
    };

    return NextResponse.json({
      ...fallbackData,
      error: true,
      message: 'Using fallback data due to API error'
    }, { status: 200 });
  }
}

// Adiciona suporte a OPTIONS para CORS
export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}