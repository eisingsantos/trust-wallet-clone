// src/app/api/crypto/route.ts
import { NextResponse } from 'next/server';

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || 'c114ac1d-9f4d-4df6-a8db-cb09ae4f139d';
const COINMARKETCAP_API_URL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest';

// Cache para evitar muitas requisições
let cache: { data: any; timestamp: number } | null = null;
const CACHE_DURATION = 60000; // 1 minuto em millisegundos

export async function GET() {
  try {
    // Verifica se temos cache válido
    if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
      return NextResponse.json(cache.data);
    }

    // Busca dados do Ethereum (ID: 1027 na CoinMarketCap)
    const response = await fetch(`${COINMARKETCAP_API_URL}?id=1027&convert=USD`, {
      headers: {
        'X-CMC_PRO_API_KEY': COINMARKETCAP_API_KEY,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`CoinMarketCap API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extrai os dados do Ethereum
    const ethData = data.data['1027'];
    
    const formattedData = {
      symbol: ethData.symbol,
      name: ethData.name,
      price: ethData.quote.USD.price,
      percent_change_24h: ethData.quote.USD.percent_change_24h,
      percent_change_1h: ethData.quote.USD.percent_change_1h,
      percent_change_7d: ethData.quote.USD.percent_change_7d,
      market_cap: ethData.quote.USD.market_cap,
      volume_24h: ethData.quote.USD.volume_24h,
      last_updated: ethData.quote.USD.last_updated,
    };

    // Atualiza o cache
    cache = {
      data: formattedData,
      timestamp: Date.now(),
    };

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    
    // Retorna dados de fallback se houver erro
    return NextResponse.json({
      symbol: 'ETH',
      name: 'Ethereum',
      price: 4287.33,
      percent_change_24h: -1.89,
      percent_change_1h: 0,
      percent_change_7d: 0,
      market_cap: 0,
      volume_24h: 0,
      last_updated: new Date().toISOString(),
      error: true,
      message: 'Using fallback data due to API error'
    }, { status: 200 });
  }
}

// Adiciona suporte a OPTIONS para CORS
export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}