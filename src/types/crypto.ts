// src/types/crypto.ts

export interface CryptoAsset {
  id: number;
  symbol: string;
  name: string;
  balance: number;
  price: number;
  change24h: number;
  value: number;
  icon?: string;
}

export interface WalletBalance {
  totalUSD: number;
  totalChange24h: number;
  totalChangeAmount: number;
  assets: CryptoAsset[];
}

export interface CoinMarketCapResponse {
  status: {
    timestamp: string;
    error_code: number;
    error_message: string | null;
    elapsed: number;
    credit_count: number;
  };
  data: {
    [key: string]: {
      id: number;
      name: string;
      symbol: string;
      slug: string;
      quote: {
        USD: {
          price: number;
          volume_24h: number;
          percent_change_1h: number;
          percent_change_24h: number;
          percent_change_7d: number;
          percent_change_30d: number;
          market_cap: number;
          last_updated: string;
        };
      };
    };
  };
}

export interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'swap';
  from: string;
  to: string;
  amount: number;
  symbol: string;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
  txHash?: string;
  gasUsed?: number;
  gasPrice?: number;
}