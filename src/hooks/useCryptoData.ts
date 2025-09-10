// src/hooks/useCryptoData.ts
import { useState, useEffect, useCallback } from 'react';

interface CryptoData {
  symbol: string;
  name: string;
  price: number;
  percent_change_24h: number;
  percent_change_1h: number;
  percent_change_7d: number;
  market_cap: number;
  volume_24h: number;
  last_updated: string;
  error?: boolean;
  message?: string;
}

interface WalletData {
  ethBalance: number;
  ethPrice: number;
  ethChange24h: number;
  usdBalance: number;
  usdChange: number;
  isLoading: boolean;
  isRefreshing: boolean;
  lastUpdate: Date | null;
}

export const useCryptoData = (ethBalance: number = 17087.778) => {
  const [walletData, setWalletData] = useState<WalletData>({
    ethBalance: ethBalance,
    ethPrice: 4287.33,
    ethChange24h: -1.89,
    usdBalance: 73261037.58,
    usdChange: 0,
    isLoading: true,
    isRefreshing: false,
    lastUpdate: null,
  });

  const fetchCryptoData = useCallback(async (showRefreshing: boolean = false) => {
    if (showRefreshing) {
      setWalletData(prev => ({ ...prev, isRefreshing: true }));
    }

    try {
      const response = await fetch('/api/crypto');
      
      if (!response.ok) {
        throw new Error('Failed to fetch crypto data');
      }

      const data: CryptoData = await response.json();
      
      // Calcula o valor em USD baseado no preço atual
      const usdBalance = ethBalance * data.price;
      
      // Calcula a mudança em USD baseada na porcentagem de mudança 24h
      const previousPrice = data.price / (1 + data.percent_change_24h / 100);
      const previousUsdBalance = ethBalance * previousPrice;
      const usdChange = usdBalance - previousUsdBalance;

      setWalletData({
        ethBalance: ethBalance,
        ethPrice: data.price,
        ethChange24h: data.percent_change_24h,
        usdBalance: usdBalance,
        usdChange: usdChange,
        isLoading: false,
        isRefreshing: false,
        lastUpdate: new Date(),
      });
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      
      // Em caso de erro, calcula com os valores padrão
      const defaultPrice = 4287.33;
      const defaultChange = -1.89;
      const usdBalance = ethBalance * defaultPrice;
      const previousPrice = defaultPrice / (1 + defaultChange / 100);
      const previousUsdBalance = ethBalance * previousPrice;
      const usdChange = usdBalance - previousUsdBalance;

      setWalletData({
        ethBalance: ethBalance,
        ethPrice: defaultPrice,
        ethChange24h: defaultChange,
        usdBalance: usdBalance,
        usdChange: usdChange,
        isLoading: false,
        isRefreshing: false,
        lastUpdate: new Date(),
      });
    }
  }, [ethBalance]);

  // Busca dados iniciais
  useEffect(() => {
    fetchCryptoData(false);
  }, [fetchCryptoData]);

  // Atualização automática a cada 60 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      fetchCryptoData(false);
    }, 60000); // 60 segundos

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