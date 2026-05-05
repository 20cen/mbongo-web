'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn, formatMoney } from '@/lib/utils';
import { tontinesApi } from '@/lib/api';
import { Plus, Users, ChevronRight, Calendar, DollarSign } from 'lucide-react';

export default function TontinesPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [tontines, setTontines] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTontines();
  }, []);

  const loadTontines = async () => {
    setIsLoading(true);
    try {
      const response = await tontinesApi.getAll();
      if (response.success) {
        setTontines(response.tontines || response.data || []);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const displayTontines = tontines.length > 0 ? tontines : [
    { id: '1', name: 'Tontine Famille', members_count: 12, contribution_amount: 5000000, frequency: 'monthly', next_date: '2024-01-15', status: 'active', total_collected: 60000000 },
    { id: '2', name: 'Tontine Collègues', members_count: 8, contribution_amount: 2500000, frequency: 'weekly', next_date: '2024-01-07', status: 'active', total_collected: 20000000 },
    { id: '3', name: 'Tontine Amis', members_count: 6, contribution_amount: 10000000, frequency: 'monthly', next_date: '2024-02-01', status: 'pending', total_collected: 0 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Tontines</h1>
          <p className={isDark ? 'text-slate-400' : 'text-gray-500'}>Gérez vos groupes d'épargne</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-medium">
          <Plus className="w-4 h-4" />
          Créer une Tontine
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {displayTontines.map((tontine: any) => (
            <div key={tontine.id} className={cn('rounded-2xl p-6 border', isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200')}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{tontine.name}</h3>
                    <p className={isDark ? 'text-slate-400' : 'text-gray-500'}>
                      {tontine.members_count} membres • {tontine.frequency === 'monthly' ? 'Mensuel' : 'Hebdo'}
                    </p>
                  </div>
                </div>
                <span className={cn(
                  'px-3 py-1 rounded-full text-xs font-medium',
                  tontine.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'
                )}>
                  {tontine.status === 'active' ? 'Actif' : 'En attente'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className={cn('p-3 rounded-xl', isDark ? 'bg-slate-700/50' : 'bg-gray-50')}>
                  <p className={cn('text-sm', isDark ? 'text-slate-400' : 'text-gray-500')}>Cotisation</p>
                  <p className="font-bold">{formatMoney(tontine.contribution_amount)}</p>
                </div>
                <div className={cn('p-3 rounded-xl', isDark ? 'bg-slate-700/50' : 'bg-gray-50')}>
                  <p className={cn('text-sm', isDark ? 'text-slate-400' : 'text-gray-500')}>Total Collecté</p>
                  <p className="font-bold text-emerald-400">{formatMoney(tontine.total_collected)}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className={cn('text-sm flex items-center gap-1', isDark ? 'text-slate-400' : 'text-gray-500')}>
                  <Calendar className="w-4 h-4" />
                  Prochain: {tontine.next_date}
                </span>
                <button className="text-blue-400 font-medium text-sm flex items-center gap-1 hover:text-blue-300">
                  Voir détails <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
