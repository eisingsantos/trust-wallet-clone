// src/hooks/useCryptoData.ts
import { useState, useEffect, useCallback } from 'react';

interface CryptoData {
  id: number;
  symbol: string;
  name: string;
  price: number;
  percent_change_24h: number;
  percent_change_1h: number;
  percent_change_7d: number;
  market_cap: number;
  volume_24h: number;
  last_updated: string;
}

interface Portfolio {
  [key: string]: {
    balance: number;
    data: CryptoData;
    usdValue: number;
    usdChange24h: number;
  };
}

interface WalletData {
  portfolio: Portfolio;
  totalUsdBalance: number;
  totalUsdChange24h: number;
  totalPercentChange24h: number;
  isLoading: boolean;
  isRefreshing: boolean;
  lastUpdate: Date | null;
}

// Saldos fixos das criptomoedas na wallet
const CRYPTO_BALANCES = {
  ETH: 17087.778,    // Ethereum
  BTC: 0.5,          // Bitcoin
  USDT: 1000,        // USD Coin
  SOL: 25,           // Solana
};

export const useCryptoData = () => {
  const [walletData, setWalletData] = useState<WalletData>({
    portfolio: {},
    totalUsdBalance: 0,
    totalUsdChange24h: 0,
    totalPercentChange24h: 0,
    isLoading: true,
    isRefreshing: false,
    lastUpdate: null,
  });

  const calculatePortfolioValues = (cryptoDataMap: Record<string, CryptoData>) => {
    const portfolio: Portfolio = {};
    let totalUsdBalance = 0;
    let totalUsdChange24h = 0;
    let totalPreviousValue = 0;

    Object.entries(CRYPTO_BALANCES).forEach(([symbol, balance]) => {
      const cryptoData = cryptoDataMap[symbol];
      if (cryptoData) {
        const currentValue = balance * cryptoData.price;
        
        // Calcula o valor anterior (24h atrás)
        const previousPrice = cryptoData.price / (1 + cryptoData.percent_change_24h / 100);
        const previousValue = balance * previousPrice;
        const usdChange24h = currentValue - previousValue;

        portfolio[symbol] = {
          balance,
          data: cryptoData,
          usdValue: currentValue,
          usdChange24h: usdChange24h
        };

        totalUsdBalance += currentValue;
        totalUsdChange24h += usdChange24h;
        totalPreviousValue += previousValue;
      }
    });

    const totalPercentChange24h = totalPreviousValue > 0 
      ? ((totalUsdBalance - totalPreviousValue) / totalPreviousValue) * 100 
      : 0;

    return {
      portfolio,
      totalUsdBalance,
      totalUsdChange24h,
      totalPercentChange24h
    };
  };

  const fetchCryptoData = useCallback(async (showRefreshing: boolean = false) => {
    if (showRefreshing) {
      setWalletData(prev => ({ ...prev, isRefreshing: true }));
    }

    try {
      const response = await fetch('/api/crypto');
      
      if (!response.ok) {
        throw new Error('Failed to fetch crypto data');
      }

      const data = await response.json();
      
      // Calcula os valores do portfólio
      const portfolioData = calculatePortfolioValues(data);

      setWalletData({
        ...portfolioData,
        isLoading: false,
        isRefreshing: false,
        lastUpdate: new Date(),
      });
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      
      // Em caso de erro, usa dados padrão
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

      const portfolioData = calculatePortfolioValues(fallbackData);

      setWalletData({
        ...portfolioData,
        isLoading: false,
        isRefreshing: false,
        lastUpdate: new Date(),
      });
    }
  }, []);

  // Busca dados iniciais
  useEffect(() => {
    fetchCryptoData(false);
  }, [fetchCryptoData]);

  // Atualização automática a cada 60 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      fetchCryptoData(false);
    }, 10000); // 60 segundos

    return () => clearInterval(interval);
  }, [fetchCryptoData]);

  const refresh = useCallback(() => {
    return fetchCryptoData(true);
  }, [fetchCryptoData]);

  return {
    ...walletData,
    refresh,
  };
};