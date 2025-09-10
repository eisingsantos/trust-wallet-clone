'use client'
import React, { useState, useEffect } from 'react';
import { Settings, MoreHorizontal, Search, ScanLine, FileClock, Settings2, RefreshCw, ChevronDown, Compass, LineChart, ArrowDownToLine, Plus, Send, BarChart3 } from 'lucide-react';
import { useCryptoData } from '@/hooks/useCryptoData';
import TokensAlpha from './TokensAlpha';
import CryptoIcon from './CryptoIcons';

const TrustWalletClone = () => {
  // Usa o hook para buscar dados reais da API
  const {
    portfolio,
    totalUsdBalance,
    totalUsdChange24h,
    totalPercentChange24h,
    isLoading,
    isRefreshing,
    refresh,
    lastUpdate
  } = useCryptoData();

  // Força atualização ao montar o componente (refresh da página)
  useEffect(() => {
    console.log('Página carregada/recarregada - buscando cotação atualizada...');
  }, []);

  // Função para formatar moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Função para formatar saldo com vírgula como separador decimal
  const formatBalance = (value: number, decimals: number = 3) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  };

  // Função para formatar porcentagem
  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Math.abs(value));
  };

  // Handler para refresh manual
  const handleRefresh = async () => {
    await refresh();
  };

  // Ordena o portfólio por valor USD (maior para menor)
  const sortedPortfolio = Object.entries(portfolio).sort((a, b) => b[1].usdValue - a[1].usdValue);

  return (
    <div className="min-h-screen bg-white">
      {/* Status Bar Spacer */}
      <div className=" bg-white"></div>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-white">
        <div className="flex items-center space-x-4">
          <Settings size={20} className="text-gray-700" strokeWidth={3} />
          <ScanLine size={18} strokeWidth={4} className="text-black hover:text-gray-500 cursor-pointer" />
        </div>

        <div className="flex items-center space-x-1">
          <span className="text-base font-medium text-gray-900">Carteira princi...</span>
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <polyline points="6,9 12,15 18,9"></polyline>
          </svg>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={handleRefresh}
            className="w-12 h-12 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-center"
            disabled={isRefreshing}
          >
            <svg
              viewBox="0 0 24 14"
              className="w-full h-full text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
            >
              <path d="M9 12c0-3 2-5 5-5-3 0-5-2-5-5 0 3-2 5-5 5 3 0 5 2 5 5z" />
              <path d="M17 7c0-1.5 1-2.5 2.5-2.5-1.5 0-2.5-1-2.5-2.5 0 1.5-1 2.5-2.5 2.5 1.5 0 2.5 1 2.5 2.5z" />
            </svg>
          </button>

          <Search size={20} className="text-gray-700" strokeWidth={3} />
        </div>
      </div>

      {/* Balance Section */}
      <div className="px-4 py- text-center bg-white">
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-48 mx-auto mb-3"></div>
            <div className="h-5 bg-gray-200 rounded w-32 mx-auto"></div>
          </div>
        ) : (
          <>
            <div className="text-4xl font-bold text-gray-900 ">
              $ {formatCurrency(totalUsdBalance)}
            </div>
            <div className={`flex items-center justify-center text-base mb-4 ${totalPercentChange24h < 0 ? 'text-red-500' : 'text-green-500'}`}>
              <span className="text-sm">{totalPercentChange24h < 0 ? '↓' : '↑'}</span>
              $ {formatCurrency(Math.abs(totalUsdChange24h))} ({formatPercentage(totalPercentChange24h)}%)
            </div>
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-2 px-4 mb-6">
        <button className="flex flex-col items-center space-y-2">
          <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center hover:bg-gray-200 transition-colors">
            <svg
              className="w-5 h-5 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                d="M5 10l7-7 7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 3v18"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-xs text-gray-600">Enviar</span>
        </button>

        <button className="flex flex-col items-center space-y-2">
          <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center hover:bg-gray-200 transition-colors">
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
              <path d="M16 3l4 4-4 4M20 7H4M8 21l-4-4 4-4M4 17h16" />
            </svg>
          </div>
          <span className="text-xs text-gray-600">Swap</span>
        </button>

        <button
          onClick={handleRefresh}
          className="flex flex-col items-center space-y-2"
          disabled={isRefreshing}
        >
          <div
            className={`w-12 h-12 bg-blue-700 rounded-2xl flex items-center justify-center hover:bg-blue-600 transition-colors ${isRefreshing ? 'opacity-70' : ''
              }`}
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                fill="white"
              />
            </svg>
          </div>
          <span className="text-xs text-gray-600">Recarregar</span>
        </button>

        <button className="flex flex-col items-center space-y-2">
          <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center hover:bg-gray-200 transition-colors">
            <svg
              className="w-5 h-5 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path d="M3 10h18" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 10l10-6 10 6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 10v8" strokeLinecap="round" />
              <path d="M10 10v8" strokeLinecap="round" />
              <path d="M14 10v8" strokeLinecap="round" />
              <path d="M18 10v8" strokeLinecap="round" />
              <path d="M4 20h16" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-xs text-gray-600">Vender</span>
        </button>
      </div>

      {/* Tokens Alpha Section - Componente separado */}
      <TokensAlpha />

      {/* Tabs Section */}
      <div className="bg-white px-4">
        <div className="flex items-center justify-between border-b border-gray-200 pb-0">
          <div className="flex space-x-8">
            <button className="pb-3 border-b-4 border-blue-500 text-gray-500 font-medium text-sm">
              Criptomoeda
            </button>
            <button className="pb-3 text-gray-500 text-sm">
              NFTs
            </button>
          </div>

          <div className="flex items-center space-x-3 pb-3">
            <FileClock size={18} className="text-gray-700" strokeWidth={3} />
            <Settings2 size={18} className="text-gray-700" strokeWidth={3} />
          </div>
        </div>
      </div>

      {/* Crypto Items - Lista dinâmica do portfólio */}
      <div className="bg-white px-4 py-4">
        {isLoading ? (
          // Loading skeleton para múltiplas criptomoedas
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center py-2 animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 ml-3">
                <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="text-right">
                <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          ))
        ) : (
          sortedPortfolio.map(([symbol, data]) => (
            <div key={symbol} className="flex items-center py-2">
              {/* Crypto Logo */}
              <div className="w-12 h-12 flex items-center justify-center">
                <CryptoIcon symbol={symbol} size={48} />
              </div>

              {/* Token Info */}
              <div className="flex-1 ml-3">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-black text-base">{symbol}</span>
                  <span className="text-sm text-gray-500">{data.data.name}</span>
                </div>

                {/* Preço e porcentagem */}
                <div className="flex items-center space-x-2 mt-0.5">
                  <span className="text-sm text-gray-500">
                    $ {formatCurrency(data.data.price)}
                  </span>
                  <span className={`text-sm ${data.data.percent_change_24h < 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {data.data.percent_change_24h < 0 ? '↓' : '↑'} {formatPercentage(data.data.percent_change_24h)}%
                  </span>
                </div>
              </div>

              {/* Balance */}
              <div className="text-right">
                <div className="font-semibold text-gray-900 text-lg">
                  {formatBalance(data.balance, symbol === 'USDT' ? 2 : 3)}
                </div>
                <div className="text-sm text-gray-500">
                  $ {formatCurrency(data.usdValue)}
                </div>
              </div>
            </div>
          ))
        )}

        {/* Manage Button */}
        <div className="text-center mt-6 mb-4">
          <button className="text-blue-500 font-medium text-sm">
            Gerenciar cripto
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 safe-area-bottom">
        <div className="flex justify-between items-center">
          <button className="flex flex-col items-center flex-1 space-y-1 py-2">
            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            <span className="text-xs text-blue-600 font-medium">Página Inicial</span>
          </button>

          <button className="flex flex-col items-center flex-1 space-y-1 py-2">
            <BarChart3 className="w-6 h-6 text-gray-400" strokeWidth={2} />
            <span className="text-xs text-gray-400">Em alta</span>
          </button>

          <button className="flex flex-col items-center flex-1 space-y-1 py-2">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path d="M16 3l4 4-4 4M20 7H4M8 21l-4-4 4-4M4 17h16" />
            </svg>
            <span className="text-xs text-gray-400">Swap</span>
          </button>

          <button className="flex flex-col items-center flex-1 space-y-1 py-2 relative">
            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM12 8.5L14.5 11L12 13.5L9.5 11L12 8.5Z"
              />
              <path d="M6 20H18V21H6V20Z" />
            </svg>
            <span className="text-xs text-gray-400">Earn</span>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
          </button>

          <button className="flex flex-col items-center flex-1 space-y-1 py-2">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88 16.24,7.76" />
            </svg>
            <span className="text-xs text-gray-400">Descubra</span>
          </button>
        </div>
      </div>

      {/* Loading Overlay */}
      {isRefreshing && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-4 flex items-center space-x-3 shadow-lg">
            <RefreshCw size={18} className="text-blue-500 animate-spin" />
            <span className="text-gray-700">Atualizando cotação...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrustWalletClone;