'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn, formatMoney } from '@/lib/utils';
import { budgetsApi } from '@/lib/api';
import { Budget } from '@/types';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function BudgetsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = async () => {
    setIsLoading(true);
    try {
      const response = await budgetsApi.getAll();
      if (response.success) {
        setBudgets(response.budgets || response.data || []);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Données de test
  const displayBudgets = budgets.length > 0 ? budgets : [
    { id: '1', category: { name: 'Alimentation', icon: '🍽️' }, amount_limit: 300000, current_spent: 28000000, period: 'monthly' },
    { id: '2', category: { name: 'Transport', icon: '🚌' }, amount_limit: 150000, current_spent: 12000000, period: 'monthly' },
    { id: '3', category: { name: 'Logement', icon: '🏠' }, amount_limit: 400000, current_spent: 35000000, period: 'monthly' },
    { id: '4', category: { name: 'Loisirs', icon: '🎉' }, amount_limit: 100000, current_spent: 9500000, period: 'monthly' },
    { id: '5', category: { name: 'Santé', icon: '💊' }, amount_limit: 80000, current_spent: 4500000, period: 'monthly' },
    { id: '6', category: { name: 'Éducation', icon: '📚' }, amount_limit: 200000, current_spent: 15000000, period: 'monthly' },
  ];

  const totalBudget = displayBudgets.reduce((sum, b: any) => sum + (b.amount_limit || 0), 0);
  const totalSpent = displayBudgets.reduce((sum, b: any) => sum + ((b.current_spent || 0) / 100), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Budgets</h1>
          <p className={isDark ? 'text-slate-400' : 'text-gray-500'}>
            Suivez vos budgets mensuels
          </p>
        </div>
        <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-medium">
          <Plus className="w-4 h-4" />
          Nouveau Budget
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={cn('rounded-2xl p-6 border', isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200')}>
          <p className={isDark ? 'text-slate-400' : 'text-gray-500'}>Budget Total</p>
          <p className="text-2xl font-bold mt-2">{formatMoney(totalBudget * 100, false)}</p>
        </div>
        <div className={cn('rounded-2xl p-6 border', isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200')}>
          <p className={isDark ? 'text-slate-400' : 'text-gray-500'}>Dépensé</p>
          <p className="text-2xl font-bold mt-2 text-orange-400">{formatMoney(totalSpent * 100, false)}</p>
        </div>
        <div className={cn('rounded-2xl p-6 border', isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200')}>
          <p className={isDark ? 'text-slate-400' : 'text-gray-500'}>Restant</p>
          <p className="text-2xl font-bold mt-2 text-emerald-400">{formatMoney((totalBudget - totalSpent) * 100, false)}</p>
        </div>
      </div>

      {/* Budget Cards */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayBudgets.map((budget: any) => {
            const spent = (budget.current_spent || 0) / 100;
            const limit = budget.amount_limit || 0;
            const percent = limit > 0 ? Math.round((spent / limit) * 100) : 0;
            const remaining = limit - spent;
            const isOver = percent >= 90;

            return (
              <div
                key={budget.id}
                className={cn('rounded-2xl p-6 border', isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{budget.category?.icon || '📊'}</span>
                    <div>
                      <h3 className="font-semibold">{budget.category?.name || 'Budget'}</h3>
                      <p className={isDark ? 'text-slate-400' : 'text-gray-500'}>Mensuel</p>
                    </div>
                  </div>
                  <span className={cn('text-2xl font-bold', isOver ? 'text-red-400' : 'text-emerald-400')}>
                    {percent}%
                  </span>
                </div>
                
                <div className={cn('w-full h-3 rounded-full overflow-hidden mb-4', isDark ? 'bg-slate-600' : 'bg-gray-200')}>
                  <div
                    className={cn('h-full rounded-full transition-all progress-bar', isOver ? 'bg-red-500' : 'bg-emerald-500')}
                    style={{ width: `${Math.min(percent, 100)}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className={isDark ? 'text-slate-400' : 'text-gray-500'}>
                    Dépensé: {formatMoney(spent * 100, false)}
                  </span>
                  <span className={isDark ? 'text-slate-400' : 'text-gray-500'}>
                    Limite: {formatMoney(limit * 100, false)}
                  </span>
                </div>
                
                <p className={cn('mt-2 text-sm', remaining < 0 ? 'text-red-400' : 'text-emerald-400')}>
                  {remaining >= 0 ? `Reste ${formatMoney(remaining * 100, false)}` : `Dépassé de ${formatMoney(Math.abs(remaining) * 100, false)}`}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-700">
                  <button className="flex-1 py-2 text-sm font-medium text-blue-400 hover:bg-blue-500/10 rounded-lg">
                    <Edit className="w-4 h-4 inline mr-1" />
                    Modifier
                  </button>
                  <button className="flex-1 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-lg">
                    <Trash2 className="w-4 h-4 inline mr-1" />
                    Supprimer
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
