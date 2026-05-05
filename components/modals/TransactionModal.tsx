'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { X, ArrowDownRight, ArrowUpRight, ArrowLeftRight } from 'lucide-react';
import { transactionsApi, walletsApi, categoriesApi } from '@/lib/api';
import { Wallet, Category } from '@/types';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type TransactionType = 'income' | 'expense' | 'transfer';

export default function TransactionModal({ isOpen, onClose, onSuccess }: TransactionModalProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [walletId, setWalletId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      const [walletsRes, categoriesRes] = await Promise.all([
        walletsApi.getAll(),
        categoriesApi.getAll(),
      ]);

      if (walletsRes.success) {
        setWallets(walletsRes.wallets || walletsRes.data || []);
        if (walletsRes.wallets?.[0]) {
          setWalletId(walletsRes.wallets[0].id);
        }
      }

      if (categoriesRes.success) {
        setCategories(categoriesRes.categories || categoriesRes.data || []);
      }
    } catch (err) {
      console.error('Erreur chargement données:', err);
    }
  };

  const filteredCategories = categories.filter(cat => cat.type === type || type === 'transfer');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await transactionsApi.create({
        wallet_id: walletId,
        category_id: categoryId,
        type,
        amount: parseFloat(amount),
        description,
        date,
      });

      if (response.success) {
        onSuccess?.();
        onClose();
        resetForm();
      } else {
        setError(response.message || 'Erreur lors de la création');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setType('expense');
    setAmount('');
    setDescription('');
    setCategoryId('');
    setDate(new Date().toISOString().split('T')[0]);
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div
        className={cn(
          'relative w-full max-w-md mx-4 rounded-2xl p-6 shadow-xl',
          isDark ? 'bg-slate-800' : 'bg-white'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Nouvelle Transaction</h2>
          <button
            onClick={onClose}
            className={cn(
              'p-2 rounded-lg',
              isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
            )}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Type Selector */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {[
            { value: 'expense', label: 'Dépense', icon: ArrowUpRight, color: 'red' },
            { value: 'income', label: 'Revenu', icon: ArrowDownRight, color: 'green' },
            { value: 'transfer', label: 'Transfert', icon: ArrowLeftRight, color: 'blue' },
          ].map((t) => {
            const Icon = t.icon;
            const isSelected = type === t.value;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setType(t.value as TransactionType)}
                className={cn(
                  'flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all',
                  isSelected
                    ? t.color === 'red'
                      ? 'border-red-500 bg-red-500/10 text-red-400'
                      : t.color === 'green'
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                      : 'border-blue-500 bg-blue-500/10 text-blue-400'
                    : isDark
                    ? 'border-slate-600 hover:border-slate-500'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount */}
          <div>
            <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-slate-300' : 'text-gray-700')}>
              Montant (FCFA)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              required
              className={cn(
                'w-full px-4 py-3 rounded-xl border outline-none transition-colors text-2xl font-bold',
                isDark
                  ? 'bg-slate-700 border-slate-600 focus:border-blue-500'
                  : 'bg-gray-50 border-gray-200 focus:border-blue-500'
              )}
            />
          </div>

          {/* Description */}
          <div>
            <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-slate-300' : 'text-gray-700')}>
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Courses au marché"
              required
              className={cn(
                'w-full px-4 py-3 rounded-xl border outline-none transition-colors',
                isDark
                  ? 'bg-slate-700 border-slate-600 focus:border-blue-500'
                  : 'bg-gray-50 border-gray-200 focus:border-blue-500'
              )}
            />
          </div>

          {/* Wallet */}
          <div>
            <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-slate-300' : 'text-gray-700')}>
              Portefeuille
            </label>
            <select
              value={walletId}
              onChange={(e) => setWalletId(e.target.value)}
              required
              className={cn(
                'w-full px-4 py-3 rounded-xl border outline-none transition-colors',
                isDark
                  ? 'bg-slate-700 border-slate-600 focus:border-blue-500'
                  : 'bg-gray-50 border-gray-200 focus:border-blue-500'
              )}
            >
              <option value="">Sélectionner un portefeuille</option>
              {wallets.map((wallet) => (
                <option key={wallet.id} value={wallet.id}>
                  {wallet.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-slate-300' : 'text-gray-700')}>
              Catégorie
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className={cn(
                'w-full px-4 py-3 rounded-xl border outline-none transition-colors',
                isDark
                  ? 'bg-slate-700 border-slate-600 focus:border-blue-500'
                  : 'bg-gray-50 border-gray-200 focus:border-blue-500'
              )}
            >
              <option value="">Sélectionner une catégorie</option>
              {filteredCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-slate-300' : 'text-gray-700')}>
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className={cn(
                'w-full px-4 py-3 rounded-xl border outline-none transition-colors',
                isDark
                  ? 'bg-slate-700 border-slate-600 focus:border-blue-500'
                  : 'bg-gray-50 border-gray-200 focus:border-blue-500'
              )}
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              'w-full py-3 rounded-xl font-semibold transition-colors',
              'bg-blue-500 hover:bg-blue-600 text-white',
              isLoading && 'opacity-50 cursor-not-allowed'
            )}
          >
            {isLoading ? 'Création...' : 'Créer la transaction'}
          </button>
        </form>
      </div>
    </div>
  );
}
