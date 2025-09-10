// src/app/api/tokens/route.ts
import { NextResponse } from 'next/server';

const COINMARKETCAP_API_KEY = 'c114ac1d-9f4d-4df6-a8db-cb09ae4f139d';
const COINMARKETCAP_API_URL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest';

// IDs dos tokens na CoinMarketCap
const TOKEN_IDS = {
  MTP: 38168,  // Metapath (MTP)
  ZENT: 30963, // Zentry (ZENT)
};

export async function GET(request: Request) {
  try {
    const headers = {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    };

    if (!COINMARKETCAP_API_KEY) {
      console.error('COINMARKETCAP_API_KEY not configured');
      // Retorna dados de fallback
      return NextResponse.json({
        tokens: [
          {
            id: TOKEN_IDS.MTP,
            symbol: 'MTP',
            name: 'Metapath',
            price: 0.02,
            percent_change_24h: 0.08,
            market_cap: 1760000000,
            logo: '/mtp.png',
            chainLogo: '/mtp2.png',
            error: true
          },
          {
            id: TOKEN_IDS.ZENT,
            symbol: 'ZENT',
            name: 'Zentry',
            price: 0.015,
            percent_change_24h: -2.5,
            market_cap: 1070000000,
            logo: '/zent.png',
            chainLogo: '/zent2.png',
            error: true
          }
        ],
        message: 'Using fallback data'
      }, { status: 200, headers });
    }

    // Busca dados dos tokens
    const ids = Object.values(TOKEN_IDS).join(',');
    const response = await fetch(`${COINMARKETCAP_API_URL}?id=${ids}&convert=USD`, {
      headers: {
        'X-CMC_PRO_API_KEY': COINMARKETCAP_API_KEY,
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`CoinMarketCap API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Formata dados dos tokens
    const tokens = [
      {
        id: TOKEN_IDS.MTP,
        symbol: 'MTP',
        name: 'Metapath',
        price: data.data[TOKEN_IDS.MTP]?.quote.USD.price || 0.02,
        percent_change_24h: data.data[TOKEN_IDS.MTP]?.quote.USD.percent_change_24h || 0,
        market_cap: data.data[TOKEN_IDS.MTP]?.quote.USD.market_cap || 1760000000,
        logo: '/mtp.png',
        chainLogo: '/mtp2.png',
      },
      {
        id: TOKEN_IDS.ZENT,
        symbol: 'ZENT',
        name: 'Zentry',
        price: data.data[TOKEN_IDS.ZENT]?.quote.USD.price || 0.015,
        percent_change_24h: data.data[TOKEN_IDS.ZENT]?.quote.USD.percent_change_24h || 0,
        market_cap: data.data[TOKEN_IDS.ZENT]?.quote.USD.market_cap || 1070000000,
        logo: '/zent.png',
        chainLogo: '/zent2.png',
      }
    ];

    return NextResponse.json({ 
      tokens,
      timestamp: Date.now()
    }, { 
      status: 200, 
      headers 
    });

  } catch (error) {
    console.error('Error fetching tokens data:', error);
    
    // Retorna dados de fallback
    return NextResponse.json({
      tokens: [
        {
          id: TOKEN_IDS.MTP,
          symbol: 'MTP',
          name: 'Metapath',
          price: 0.02,
          percent_change_24h: 0.08,
          market_cap: 1760000000,
          logo: '/mtp.png',
          chainLogo: '/mtp2.png',
          error: true
        },
        {
          id: TOKEN_IDS.ZENT,
          symbol: 'ZENT',
          name: 'Zentry',
          price: 0.015,
          percent_change_24h: -2.5,
          market_cap: 1070000000,
          logo: '/zent.png',
          chainLogo: '/zent2.png',
          error: true
        }
      ],
      message: 'Using fallback data due to API error',
      timestamp: Date.now()
    }, { status: 200 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}