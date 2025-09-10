'use client'
import React, { useState, useEffect } from 'react';
import { Settings, MoreHorizontal, Search, ScanLine, FileClock, Settings2, RefreshCw, ChevronDown, Compass, LineChart, ArrowDownToLine, Plus, Send, BarChart3 } from 'lucide-react';
import { useCryptoData } from '@/hooks/useCryptoData';
import TokensAlpha from './TokensAlpha';
import Image from "next/image"; // This is from Next.js


const TrustWalletClone = () => {
  // Define o saldo fixo em ETH
  const ETH_BALANCE = 17087.778;
  
  // Usa o hook para buscar dados reais da API
  const {
    ethPrice,
    ethChange24h,
    usdBalance,
    usdChange,
    isLoading,
    isRefreshing,
    refresh,
    lastUpdate
  } = useCryptoData(ETH_BALANCE);

  // Força atualização ao montar o componente (refresh da página)
  useEffect(() => {
    // O hook já faz a busca inicial, mas isso garante que sempre busque dados novos
    console.log('Página carregada/recarregada - buscando cotação atualizada...');
  }, []);

  // Função para formatar moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Função para formatar saldo ETH com vírgula como separador de milhares
  const formatEthBalance = (value: number) => {
    // Separa a parte inteira da decimal
    const parts = value.toString().split('.');
    const integerPart = parts[0];
    const decimalPart = parts[1] || '';
    
    // Formata a parte inteira com pontos como separador de milhares
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    // Retorna com vírgula como separador decimal
    return `${formattedInteger},${decimalPart.padEnd(3, '0').substring(0, 3)}`;
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
      <div className="px-4 py-6 text-center bg-white">
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-48 mx-auto mb-3"></div>
            <div className="h-5 bg-gray-200 rounded w-32 mx-auto"></div>
          </div>
        ) : (
          <>
            <div className="text-4xl font-bold text-gray-900 mb-3">
              $ {formatCurrency(usdBalance)}
            </div>
            <div className={`flex items-center justify-center text-base mb-6 ${ethChange24h < 0 ? 'text-red-500' : 'text-green-500'}`}>
              <span className="text-sm">{ethChange24h < 0 ? '↓' : '↑'}</span>
              $ {formatCurrency(Math.abs(usdChange))} ({formatPercentage(ethChange24h)}%)
            </div>
          </>
        )}
       
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-6 px-4 mb-6">
        <button className="flex flex-col items-center space-y-2">
          <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center hover:bg-gray-200 transition-colors">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-xs text-gray-600">Enviar</span>
        </button>

        <button className="flex flex-col items-center space-y-2">
          <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center hover:bg-gray-200 transition-colors">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path d="M7 16L17 8M17 16L7 8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-xs text-gray-600">Swap</span>
        </button>

        <button 
          onClick={handleRefresh}
          className="flex flex-col items-center space-y-2"
          disabled={isRefreshing}
        >
          <div className={`w-12 h-12 bg-blue-700 rounded-2xl flex items-center justify-center hover:bg-blue-600 transition-colors ${isRefreshing ? 'opacity-70' : ''}`}>
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-xs text-gray-600">Recarregar</span>
        </button>

        <button className="flex flex-col items-center space-y-2">
          <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center hover:bg-gray-200 transition-colors">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" strokeLinecap="round" strokeLinejoin="round" />
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

      {/* Crypto Item - Ethereum */}
      <div className="bg-white px-4 py-4">
        <div className="flex items-center py-2">
          {/* Ethereum Logo */}
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
            <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
            </svg>
          </div>

          {/* Token Info */}
          <div className="flex-1 ml-3">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-black text-base">ETH</span>
              <span className="text-sm text-gray-500">Ethereum</span>
            </div>

            {/* Preço e porcentagem */}
            <div className="flex items-center space-x-2 mt-0.5">
              {isLoading ? (
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              ) : (
                <>
                  <span className="text-sm text-gray-500">
                    $ {formatCurrency(ethPrice)}
                  </span>
                  <span className={`text-sm ${ethChange24h < 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {ethChange24h < 0 ? '↓' : '↑'} {formatPercentage(ethChange24h)}%
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Balance */}
          <div className="text-right">
            <div className="font-semibold text-gray-900 text-lg">
              {formatEthBalance(ETH_BALANCE)}
            </div>
            <div className="text-sm text-gray-500">
              {isLoading ? (
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              ) : (
                <span>$ {formatCurrency(usdBalance)}</span>
              )}
            </div>
          </div>
        </div>

     {/* Crypto Item - Ethereum */}
        <div className="flex items-center py-2">
          {/* Ethereum Logo */}
     <div className="w-12 h-12 flex items-center justify-center">
  <svg
    className="w-12 h-12"
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* outer filled circle */}
    <circle cx="32" cy="32" r="30" fill="#1E88E5" />
    {/* ring (creates inner ring effect) */}
    <circle cx="32" cy="32" r="24" fill="none" stroke="#ffffff" strokeWidth="4" />
    {/* small gap ring to match the visual of the original */}
    <circle cx="32" cy="32" r="20" fill="#1E88E5" />
    {/* inner white disc for contrast */}
    <circle cx="32" cy="32" r="13.5" fill="#ffffff" />
    {/* $ sign (stroke) */}
    <path
      d="M33 18c-5 0-6.5 2.2-6.5 4.5 0 2.8 2.2 4 5.5 4.8 3.3.8 5.5 1.7 5.5 4.7 0 3-2.7 4.5-6 4.5"
      fill="none"
      stroke="#1E88E5"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="translate(0,2)"
    />
    <line x1="32" y1="12" x2="32" y2="52" stroke="#1E88E5" strokeWidth="1.6" strokeLinecap="round" opacity="0.0"/>
    {/* small horizontal caps to mimic S terminals */}
    <line x1="26.5" y1="23.5" x2="37.5" y2="23.5" stroke="#1E88E5" strokeWidth="1.6" strokeLinecap="round" />
    <line x1="26.5" y1="40.5" x2="37.5" y2="40.5" stroke="#1E88E5" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
</div>


          {/* Token Info */}
          <div className="flex-1 ml-3">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-black text-base">USDC</span>
              <span className="text-sm text-gray-500">Ethereum</span>
            </div>

            {/* Preço e porcentagem */}
            <div className="flex items-center space-x-2 mt-0.5">
              {isLoading ? (
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              ) : (
                <>
                  <span className="text-sm text-gray-500">
                    $1261,32 
                  </span>
                  <span className={`text-sm ${ethChange24h < 0 ? 'text-red-500' : 'text-green-500'}`}>
                  
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Balance */}
          <div className="text-right">
            <div className="font-semibold text-gray-900 text-lg">
                $1261,32 
            </div>
            <div className="text-sm text-gray-500">
              {isLoading ? (
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              ) : (
                <span>$1261,32 </span>
              )}
            </div>
          </div>
        </div>

        {/* Manage Button */}
        <div className="text-center mt-6 mb-4">
          <button className="text-blue-500 font-medium text-sm">
            Gerenciar cripto
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-bottom">
        <div className="flex justify-around items-center">
          <button className="flex flex-col items-center space-y-1 py-2">
            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            <span className="text-xs text-blue-600 font-medium">Página Inicial</span>
          </button>

          <button className="flex flex-col items-center space-y-1 py-2">
            <BarChart3 className="w-6 h-6 text-gray-400" strokeWidth={2} />
            <span className="text-xs text-gray-400">Em alta</span>
          </button>

          <button className="flex flex-col items-center space-y-1 py-2">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path d="M16 3l4 4-4 4M20 7H4M8 21l-4-4 4-4M4 17h16" />
            </svg>
            <span className="text-xs text-gray-400">Swap</span>
          </button>

          <button className="flex flex-col items-center space-y-1 py-2 relative">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" />
            </svg>
            <span className="text-xs text-gray-400">Earn</span>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
          </button>

          <button className="flex flex-col items-center space-y-1 py-2">
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