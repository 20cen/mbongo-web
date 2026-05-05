'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn, formatMoney, getInitials } from '@/lib/utils';
import { debtsApi } from '@/lib/api';
import { Plus, Calendar } from 'lucide-react';

export default function DebtsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [debts, setDebts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDebts();
  }, []);

  const loadDebts = async () => {
    setIsLoading(true);
    try {
      const response = await debtsApi.getAll();
      if (response.success) {
        setDebts(response.debts || response.data || []);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const displayDebts = debts.length > 0 ? debts : [
    { id: '1', person_name: 'Jean Makaya', type: 'lent', amount: 15000000, remaining_amount: 10000000, due_date: '2024-02-15' },
    { id: '2', person_name: 'Marie Ngoma', type: 'borrowed', amount: 7500000, remaining_amount: 7500000, due_date: '2024-01-31' },
    { id: '3', person_name: 'Paul Mbemba', type: 'lent', amount: 5000000, remaining_amount: 2500000, due_date: '2024-03-01' },
  ];

  const totalLent = displayDebts.filter((d: any) => d.type === 'lent').reduce((sum, d: any) => sum + d.remaining_amount, 0);
  const totalBorrowed = displayDebts.filter((d: any) => d.type === 'borrowed').reduce((sum, d: any) => sum + d.remaining_amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dettes & Créances</h1>
          <p className={isDark ? 'text-slate-400' : 'text-gray-500'}>Suivez vos prêts et emprunts</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-medium">
          <Plus className="w-4 h-4" />
          Ajouter
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={cn('rounded-2xl p-6 border', isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200')}>
          <p className={isDark ? 'text-slate-400' : 'text-gray-500'}>On me doit</p>
          <p className="text-3xl font-bold mt-2 text-emerald-400">{formatMoney(totalLent)}</p>
        </div>
        <div className={cn('rounded-2xl p-6 border', isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200')}>
          <p className={isDark ? 'text-slate-400' : 'text-gray-500'}>Je dois</p>
          <p className="text-3xl font-bold mt-2 text-red-400">{formatMoney(totalBorrowed)}</p>
        </div>
      </div>

      {/* Debts List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className={cn('rounded-2xl border', isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200')}>
          {displayDebts.map((debt: any, index: number) => {
            const percent = Math.round(((debt.amount - debt.remaining_amount) / debt.amount) * 100);
            return (
              <div key={debt.id} className={cn('p-6', index > 0 && `border-t ${isDark ? 'border-slate-700' : 'border-gray-200'}`)}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn('w-12 h-12 rounded-full flex items-center justify-center font-bold text-white', debt.type === 'lent' ? 'bg-emerald-500' : 'bg-red-500')}>
                      {getInitials(debt.person_name)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{debt.person_name}</h3>
                      <p className={cn('text-sm flex items-center gap-1', isDark ? 'text-slate-400' : 'text-gray-500')}>
                        {debt.type === 'lent' ? 'Me doit' : 'Je dois'} • 
                        <Calendar className="w-3 h-3 ml-1" /> {debt.due_date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn('text-xl font-bold', debt.type === 'lent' ? 'text-emerald-400' : 'text-red-400')}>
                      {formatMoney(debt.remaining_amount)}
                    </p>
                    <p className={cn('text-sm', isDark ? 'text-slate-400' : 'text-gray-500')}>sur {formatMoney(debt.amount)}</p>
                  </div>
                </div>
                <div className={cn('w-full h-2 rounded-full overflow-hidden', isDark ? 'bg-slate-600' : 'bg-gray-200')}>
                  <div className={cn('h-full rounded-full', debt.type === 'lent' ? 'bg-emerald-500' : 'bg-red-500')} style={{ width: `${percent}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
