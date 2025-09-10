// src/components/CryptoIcons.tsx
import React from 'react';
import Image from 'next/image';

interface CryptoIconProps {
  symbol: string;
  size?: number;
  className?: string;
}

const CryptoIcon: React.FC<CryptoIconProps> = ({ symbol, size = 48, className = "" }) => {
  const getIconPath = (symbol: string) => {
    switch (symbol.toUpperCase()) {
      case 'ETH':
        return '/eth.png';
      case 'USDC':
        return '/usdc.png';
      case 'SOL':
        return '/solana.png';
      case 'BTC':
        return '/bitcoin.png';
      default:
        return '/eth.png'; // Fallback
    }
  };

  const getAltText = (symbol: string) => {
    switch (symbol.toUpperCase()) {
      case 'ETH':
        return 'Ethereum';
      case 'USDC':
        return 'USD Coin';
      case 'SOL':
        return 'Solana';
      case 'BTC':
        return 'Bitcoin';
      default:
        return symbol;
    }
  };

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <Image
        src={getIconPath(symbol)}
        alt={getAltText(symbol)}
        width={size}
        height={size}
        className="rounded-full"
        priority
        onError={(e) => {
          // Fallback para ícone genérico se a imagem não carregar
          console.warn(`Não foi possível carregar o ícone para ${symbol}`);
        }}
      />
    </div>
  );
};

export default CryptoIcon;