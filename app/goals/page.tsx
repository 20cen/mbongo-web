'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn, formatMoney } from '@/lib/utils';
import { goalsApi } from '@/lib/api';
import { Plus, Target, Calendar } from 'lucide-react';

export default function GoalsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [goals, setGoals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    setIsLoading(true);
    try {
      const response = await goalsApi.getAll();
      if (response.success) {
        setGoals(response.goals || response.data || []);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const displayGoals = goals.length > 0 ? goals : [
    { id: '1', name: 'MacBook Pro', icon: '💻', target_amount: 150000000, current_amount: 85000000, deadline: '2024-06-01', color: '#3B82F6' },
    { id: '2', name: 'Voyage Paris', icon: '✈️', target_amount: 200000000, current_amount: 45000000, deadline: '2024-12-01', color: '#8B5CF6' },
    { id: '3', name: 'Voiture', icon: '🚗', target_amount: 500000000, current_amount: 120000000, deadline: '2025-06-01', color: '#10B981' },
    { id: '4', name: 'Fonds d\'urgence', icon: '🏦', target_amount: 100000000, current_amount: 75000000, deadline: '2024-03-01', color: '#F59E0B' },
  ];

  const totalTarget = displayGoals.reduce((sum, g: any) => sum + g.target_amount, 0);
  const totalSaved = displayGoals.reduce((sum, g: any) => sum + g.current_amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Objectifs d'Épargne</h1>
          <p className={isDark ? 'text-slate-400' : 'text-gray-500'}>Suivez vos objectifs financiers</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-medium">
          <Plus className="w-4 h-4" />
          Nouvel Objectif
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={cn('rounded-2xl p-6 border', isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200')}>
          <p className={isDark ? 'text-slate-400' : 'text-gray-500'}>Objectif Total</p>
          <p className="text-2xl font-bold mt-2">{formatMoney(totalTarget)}</p>
        </div>
        <div className={cn('rounded-2xl p-6 border', isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200')}>
          <p className={isDark ? 'text-slate-400' : 'text-gray-500'}>Épargné</p>
          <p className="text-2xl font-bold mt-2 text-emerald-400">{formatMoney(totalSaved)}</p>
        </div>
        <div className={cn('rounded-2xl p-6 border', isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200')}>
          <p className={isDark ? 'text-slate-400' : 'text-gray-500'}>Progression</p>
          <p className="text-2xl font-bold mt-2 text-blue-400">{Math.round((totalSaved / totalTarget) * 100)}%</p>
        </div>
      </div>

      {/* Goals Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayGoals.map((goal: any) => {
            const percent = Math.round((goal.current_amount / goal.target_amount) * 100);
            const remaining = goal.target_amount - goal.current_amount;

            return (
              <div
                key={goal.id}
                className={cn('rounded-2xl p-6 border card-hover', isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${goal.color}20` }}
                    >
                      {goal.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{goal.name}</h3>
                      <p className={cn('text-sm flex items-center gap-1', isDark ? 'text-slate-400' : 'text-gray-500')}>
                        <Calendar className="w-3 h-3" /> Échéance: {goal.deadline}
                      </p>
                    </div>
                  </div>
                  <span
                    className="text-2xl font-bold"
                    style={{ color: goal.color }}
                  >
                    {percent}%
                  </span>
                </div>

                <div className={cn('w-full h-4 rounded-full overflow-hidden mb-4', isDark ? 'bg-slate-700' : 'bg-gray-200')}>
                  <div
                    className="h-full rounded-full transition-all progress-bar"
                    style={{ width: `${percent}%`, backgroundColor: goal.color }}
                  ></div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className={cn('text-sm', isDark ? 'text-slate-400' : 'text-gray-500')}>Épargné</p>
                    <p className="font-bold" style={{ color: goal.color }}>{formatMoney(goal.current_amount)}</p>
                  </div>
                  <div className="text-right">
                    <p className={cn('text-sm', isDark ? 'text-slate-400' : 'text-gray-500')}>Objectif</p>
                    <p className="font-bold">{formatMoney(goal.target_amount)}</p>
                  </div>
                </div>

                <div className={cn('mt-4 pt-4 border-t flex justify-between items-center', isDark ? 'border-slate-700' : 'border-gray-200')}>
                  <span className={cn('text-sm', isDark ? 'text-slate-400' : 'text-gray-500')}>
                    Reste: {formatMoney(remaining)}
                  </span>
                  <button
                    className="px-4 py-2 rounded-xl text-sm font-medium text-white"
                    style={{ backgroundColor: goal.color }}
                  >
                    + Ajouter
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
