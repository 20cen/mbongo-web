'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn, formatMoney, getWalletIcon, getWalletColor, getWalletTypeName } from '@/lib/utils';
import { walletsApi } from '@/lib/api';
import { Wallet } from '@/types';
import { Plus, ArrowUpRight, Trash2, Edit } from 'lucide-react';

export default function WalletsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWallets();
  }, []);

  const loadWallets = async () => {
    setIsLoading(true);
    try {
      const response = await walletsApi.getAll();
      if (response.success) {
        setWallets(response.wallets || response.data || []);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Données de test
  const displayWallets = wallets.length > 0 ? wallets : [
    { id: '1', name: 'Cash Principal', type: 'cash', balance: 24500000, is_default: true },
    { id: '2', name: 'MTN MoMo', type: 'mtn_momo', balance: 68000000, is_default: false },
    { id: '3', name: 'Banque UBA', type: 'bank', balance: 125000000, is_default: false },
    { id: '4', name: 'Épargne', type: 'savings', balance: 50000000, is_default: false },
  ];

  const totalBalance = displayWallets.reduce((sum, w: any) => sum + (w.balance || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Portefeuilles</h1>
          <p className={isDark ? 'text-slate-400' : 'text-gray-500'}>
            Gérez vos comptes et portefeuilles
          </p>
        </div>
        <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-medium">
          <Plus className="w-4 h-4" />
          Nouveau Portefeuille
        </button>
      </div>

      {/* Total Balance Card */}
      <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
        <p className="text-blue-100 mb-2">Solde Total</p>
        <p className="text-4xl font-bold mb-4">{formatMoney(totalBalance)}</p>
        <div className="flex items-center gap-2 text-blue-100">
          <ArrowUpRight className="w-4 h-4" />
          <span>+12.5% par rapport au mois dernier</span>
        </div>
      </div>

      {/* Wallets Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayWallets.map((wallet: any) => (
            <div
              key={wallet.id}
              className={cn(
                'rounded-2xl p-6 border hover:border-blue-500/50 transition-colors cursor-pointer card-hover',
                isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{getWalletIcon(wallet.type)}</span>
                <div className="flex items-center gap-2">
                  {wallet.is_default && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                      Par défaut
                    </span>
                  )}
                  <span
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-medium',
                      isDark ? 'bg-slate-700' : 'bg-gray-100'
                    )}
                  >
                    {getWalletTypeName(wallet.type)}
                  </span>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">{wallet.name}</h3>
              <p className="text-2xl font-bold" style={{ color: getWalletColor(wallet.type) }}>
                {formatMoney(wallet.balance)}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-700">
                <button className="flex-1 py-2 text-sm font-medium text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
                  <Edit className="w-4 h-4 inline mr-1" />
                  Modifier
                </button>
                <button className="flex-1 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4 inline mr-1" />
                  Supprimer
                </button>
              </div>
            </div>
          ))}

          {/* Add New Wallet Card */}
          <div
            className={cn(
              'rounded-2xl p-6 border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:border-blue-500/50 transition-colors min-h-[200px]',
              isDark ? 'border-slate-700' : 'border-gray-200'
            )}
          >
            <div
              className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center mb-3',
                isDark ? 'bg-slate-700' : 'bg-gray-100'
              )}
            >
              <Plus className="w-6 h-6 text-blue-400" />
            </div>
            <p className="font-medium">Ajouter un portefeuille</p>
          </div>
        </div>
      )}
    </div>
  );
}
