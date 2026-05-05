'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn, formatMoney, formatDate } from '@/lib/utils';
import { transactionsApi, walletsApi, categoriesApi } from '@/lib/api';
import { Transaction, Wallet, Category } from '@/types';
import { Plus, Filter, Download, ArrowUpRight, ArrowDownRight, Search } from 'lucide-react';
import TransactionModal from '@/components/modals/TransactionModal';

export default function TransactionsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Filtres
  const [typeFilter, setTypeFilter] = useState('');
  const [walletFilter, setWalletFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [txRes, walletsRes, catRes] = await Promise.all([
        transactionsApi.getAll({ limit: 50 }),
        walletsApi.getAll(),
        categoriesApi.getAll(),
      ]);

      if (txRes.success) {
        setTransactions(txRes.transactions || txRes.data || []);
      }
      if (walletsRes.success) {
        setWallets(walletsRes.wallets || walletsRes.data || []);
      }
      if (catRes.success) {
        setCategories(catRes.categories || catRes.data || []);
      }
    } catch (error) {
      console.error('Erreur chargement transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Données de test si pas de transactions
  const displayTransactions = transactions.length > 0 ? transactions : [
    { id: '1', description: 'Salaire Décembre', amount: 75000000, type: 'income', category: { name: 'Salaire', icon: '💰' }, wallet: { name: 'MTN MoMo' }, date: '2024-01-04', created_at: '2024-01-04' },
    { id: '2', description: 'Courses Supermarché', amount: -4500000, type: 'expense', category: { name: 'Alimentation', icon: '🍽️' }, wallet: { name: 'Cash' }, date: '2024-01-04', created_at: '2024-01-04' },
    { id: '3', description: 'Taxi Bureau', amount: -350000, type: 'expense', category: { name: 'Transport', icon: '🚌' }, wallet: { name: 'Cash' }, date: '2024-01-03', created_at: '2024-01-03' },
    { id: '4', description: 'Facture Électricité', amount: -2800000, type: 'expense', category: { name: 'Logement', icon: '🏠' }, wallet: { name: 'Banque' }, date: '2024-01-03', created_at: '2024-01-03' },
    { id: '5', description: 'Vente Business', amount: 15000000, type: 'income', category: { name: 'Business', icon: '💼' }, wallet: { name: 'MTN MoMo' }, date: '2024-01-02', created_at: '2024-01-02' },
    { id: '6', description: 'Médicaments', amount: -1200000, type: 'expense', category: { name: 'Santé', icon: '💊' }, wallet: { name: 'Cash' }, date: '2024-01-02', created_at: '2024-01-02' },
    { id: '7', description: 'Restaurant', amount: -2500000, type: 'expense', category: { name: 'Loisirs', icon: '🎉' }, wallet: { name: 'Cash' }, date: '2024-01-01', created_at: '2024-01-01' },
    { id: '8', description: 'Cotisation Tontine', amount: -5000000, type: 'expense', category: { name: 'Tontine', icon: '👥' }, wallet: { name: 'MTN MoMo' }, date: '2024-01-01', created_at: '2024-01-01' },
  ];

  const filteredTransactions = displayTransactions.filter((tx: any) => {
    if (typeFilter && tx.type !== typeFilter) return false;
    if (searchQuery && !tx.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Transactions</h1>
          <p className={isDark ? 'text-slate-400' : 'text-gray-500'}>
            Gérez toutes vos transactions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl border',
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
            )}
          >
            <Download className="w-4 h-4" />
            Exporter
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-medium"
          >
            <Plus className="w-4 h-4" />
            Ajouter
          </button>
        </div>
      </div>

      {/* Filters */}
      <div
        className={cn(
          'rounded-2xl p-4 border flex flex-wrap gap-4',
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
        )}
      >
        <div className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-xl flex-1 min-w-[200px]',
          isDark ? 'bg-slate-700' : 'bg-gray-100'
        )}>
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent outline-none w-full"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className={cn(
            'px-4 py-2 rounded-xl outline-none',
            isDark ? 'bg-slate-700' : 'bg-gray-100'
          )}
        >
          <option value="">Tous les types</option>
          <option value="income">Revenus</option>
          <option value="expense">Dépenses</option>
          <option value="transfer">Transferts</option>
        </select>

        <select
          value={walletFilter}
          onChange={(e) => setWalletFilter(e.target.value)}
          className={cn(
            'px-4 py-2 rounded-xl outline-none',
            isDark ? 'bg-slate-700' : 'bg-gray-100'
          )}
        >
          <option value="">Tous les portefeuilles</option>
          {wallets.map((w) => (
            <option key={w.id} value={w.id}>{w.name}</option>
          ))}
        </select>

        <input
          type="date"
          className={cn(
            'px-4 py-2 rounded-xl outline-none',
            isDark ? 'bg-slate-700' : 'bg-gray-100'
          )}
        />
      </div>

      {/* Transactions Table */}
      <div
        className={cn(
          'rounded-2xl border overflow-hidden',
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
        )}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <table className="w-full">
            <thead className={isDark ? 'bg-slate-700/50' : 'bg-gray-50'}>
              <tr>
                <th className="text-left p-4 font-medium">Transaction</th>
                <th className="text-left p-4 font-medium hidden md:table-cell">Catégorie</th>
                <th className="text-left p-4 font-medium hidden lg:table-cell">Portefeuille</th>
                <th className="text-left p-4 font-medium hidden md:table-cell">Date</th>
                <th className="text-right p-4 font-medium">Montant</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx: any) => (
                <tr
                  key={tx.id}
                  className={cn(
                    'border-t cursor-pointer transition-colors',
                    isDark ? 'border-slate-700 hover:bg-slate-700/30' : 'border-gray-100 hover:bg-gray-50'
                  )}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'w-10 h-10 rounded-xl flex items-center justify-center',
                          tx.type === 'income'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-red-500/20 text-red-400'
                        )}
                      >
                        {tx.type === 'income' ? (
                          <ArrowDownRight className="w-5 h-5" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{tx.description}</p>
                        <p className={cn('text-sm md:hidden', isDark ? 'text-slate-400' : 'text-gray-500')}>
                          {tx.category?.name || 'Non catégorisé'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className={cn('p-4 hidden md:table-cell', isDark ? 'text-slate-400' : 'text-gray-500')}>
                    <span className="flex items-center gap-2">
                      <span>{tx.category?.icon}</span>
                      {tx.category?.name || 'Non catégorisé'}
                    </span>
                  </td>
                  <td className={cn('p-4 hidden lg:table-cell', isDark ? 'text-slate-400' : 'text-gray-500')}>
                    {tx.wallet?.name || 'N/A'}
                  </td>
                  <td className={cn('p-4 hidden md:table-cell', isDark ? 'text-slate-400' : 'text-gray-500')}>
                    {formatDate(tx.date || tx.created_at)}
                  </td>
                  <td className={cn('p-4 text-right font-bold', tx.type === 'income' ? 'text-emerald-400' : 'text-red-400')}>
                    {tx.type === 'income' ? '+' : ''}{formatMoney(tx.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      <TransactionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={loadData}
      />
    </div>
  );
}
