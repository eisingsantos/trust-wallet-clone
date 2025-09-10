// src/hooks/useTokensData.ts
import { useState, useEffect, useCallback } from 'react';

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

interface TokensData {
  tokens: Token[];
  isLoading: boolean;
  isRefreshing: boolean;
  lastUpdate: Date | null;
  error: string | null;
}

export const useTokensData = (autoRefreshInterval: number = 300000) => {
  const [data, setData] = useState<TokensData>({
    tokens: [],
    isLoading: true,
    isRefreshing: false,
    lastUpdate: null,
    error: null,
  });

  const fetchTokensData = useCallback(async (showRefreshing: boolean = false) => {
    if (showRefreshing) {
      setData(prev => ({ ...prev, isRefreshing: true }));
    }

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

      const result = await response.json();
      
      setData({
        tokens: result.tokens || [],
        isLoading: false,
        isRefreshing: false,
        lastUpdate: new Date(),
        error: null,
      });
    } catch (error) {
      console.error('Error fetching tokens:', error);
      
      // Fallback data
      const fallbackTokens: Token[] = [
        {
          id: 38168,
          symbol: 'MTP',
          name: 'Metapath',
          price: 0.02,
          percent_change_24h: 0.08,
          market_cap: 1760000000,
          logo: '/mtp.png',
          chainLogo: '/mtp2.png',
          error: true,
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
          error: true,
        }
      ];

      setData({
        tokens: fallbackTokens,
        isLoading: false,
        isRefreshing: false,
        lastUpdate: new Date(),
        error: 'Usando dados offline',
      });
    }
  }, []);

  // Fetch inicial
  useEffect(() => {
    fetchTokensData(false);
  }, [fetchTokensData]);

  // Auto-refresh
  useEffect(() => {
    if (autoRefreshInterval > 0) {
      const interval = setInterval(() => {
        fetchTokensData(false);
      }, autoRefreshInterval);

      return () => clearInterval(interval);
    }
  }, [fetchTokensData, autoRefreshInterval]);

  const refresh = useCallback(() => {
    return fetchTokensData(true);
  }, [fetchTokensData]);

  return {
    ...data,
    refresh,
  };
};