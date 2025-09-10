// src/components/TokensAlpha.tsx
'use client'
import React, { useState, useEffect } from 'react';

interface Token {
  id: number;
  symbol: string;
  name: string;
  price: number;
  percent_change_24h: number;
  market_cap: number;
  logo: string;
  chainLogo: string;
  error?: boolean;
}

const TokensAlpha = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTokensData();
  }, []);

  const fetchTokensData = async () => {
    try {
      const timestamp = Date.now();
      const response = await fetch(`/api/tokens?t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tokens data');
      }

      const data = await response.json();
      setTokens(data.tokens || []);
    } catch (error) {
      console.error('Error fetching tokens:', error);
      // Usa dados de fallback
      setTokens([
        {
          id: 38168,
          symbol: 'MTP',
          name: 'Metapath',
          price: 0.02,
          percent_change_24h: 0.08,
          market_cap: 1760000000,
          logo: '/mtp.png',
          chainLogo: '/mtp2.png',
        },
        {
          id: 30963,
          symbol: 'ZENT',
          name: 'Zentry',
          price: 0.015,
          percent_change_24h: -2.5,
          market_cap: 1070000000,
          logo: '/zent.png',
          chainLogo: '/zent2.png',
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 1) {
      return `$${price.toFixed(2)}`;
    }
    return `$${price.toFixed(2)}`;
  };

  const formatMarketCap = (marketCap: number) => {
    const billions = marketCap / 1000000000;
    if (billions >= 1) {
      return `$${billions.toFixed(2)}B`.replace('.', ',');
    }
    const millions = marketCap / 1000000;
    return `$${millions.toFixed(0)}M`;
  };

  const formatPercentage = (value: number) => {
    const formatted = Math.abs(value).toFixed(2).replace('.', ',');
    return value >= 0 ? `+${formatted}%` : `-${formatted}%`;
  };

  return (
    <div className="px-4 mb-6">
      <h3 className="text-xl font-bold text-gray-900 mb-2">Tokens Alpha</h3>
      
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
        {isLoading ? (
          // Loading state
          <>
            <div className="flex-shrink-0 w-[250px] h-[88px] bg-gray-100 rounded-2xl animate-pulse" />
            <div className="flex-shrink-0 w-[250px] h-[88px] bg-gray-100 rounded-2xl animate-pulse" />
          </>
        ) : (
          tokens.map((token) => (
            <div
              key={token.id}
              className="flex-shrink-0 w-[220px] p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                {/* Left side - Token info */}
                <div className="flex items-center gap-3">
                  {/* Token Logo with Chain Logo */}
                  <div className="relative">
                    <img 
                      src={token.logo} 
                      alt={`${token.symbol} logo`}
                      className="w-8 h-8 rounded-full bg-white"
                      onError={(e) => {
                        e.currentTarget.src = token.symbol === 'MTP' 
                          ? 'https://s2.coinmarketcap.com/static/img/coins/64x64/38168.png'
                          : 'https://s2.coinmarketcap.com/static/img/coins/64x64/30963.png';
                      }}
                    />
                    <img 
                      src={token.chainLogo} 
                      alt="chain logo"
                      className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-white"
                      onError={(e) => {
                        e.currentTarget.src = token.symbol === 'MTP'
                          ? 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png'
                          : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png';
                      }}
                    />
                  </div>
                  
                  {/* Token Symbol and Market Cap */}
                  <div>
                    <div className="font-semibold text-black text-base">
                      {token.symbol}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatMarketCap(token.market_cap)}
                    </div>
                  </div>
                </div>
                
                {/* Right side - Price info */}
                <div className="text-right">
                  <div className="font-medium text-black text-base">
                    {formatPrice(token.price)}
                  </div>
                  <div className={`text-sm font-medium ${
                    token.percent_change_24h >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {formatPercentage(token.percent_change_24h)}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        
        {/* Placeholder cards se houver menos de 2 tokens */}
        {!isLoading && tokens.length < 2 && (
          <div className="flex-shrink-0 w-[250px] p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="flex items-center justify-center h-full">
              <span className="text-gray-400 text-sm">Mais tokens em breve</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokensAlpha;