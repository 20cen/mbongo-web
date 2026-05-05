'use client';

import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn, formatMoney } from '@/lib/utils';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Download, Calendar, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

export default function ReportsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [period, setPeriod] = useState('month');

  // Données mockées
  const monthlyData = [
    { month: 'Jan', revenus: 850000, depenses: 620000 },
    { month: 'Fév', revenus: 920000, depenses: 580000 },
    { month: 'Mar', revenus: 780000, depenses: 710000 },
    { month: 'Avr', revenus: 1100000, depenses: 650000 },
    { month: 'Mai', revenus: 950000, depenses: 720000 },
    { month: 'Juin', revenus: 1250000, depenses: 890000 },
  ];

  const weeklyData = [
    { day: 'Lun', depenses: 45000 },
    { day: 'Mar', depenses: 32000 },
    { day: 'Mer', depenses: 58000 },
    { day: 'Jeu', depenses: 41000 },
    { day: 'Ven', depenses: 89000 },
    { day: 'Sam', depenses: 120000 },
    { day: 'Dim', depenses: 35000 },
  ];

  const categoryData = [
    { name: 'Alimentation', value: 280000, color: '#EF4444' },
    { name: 'Transport', value: 150000, color: '#3B82F6' },
    { name: 'Logement', value: 350000, color: '#F59E0B' },
    { name: 'Santé', value: 80000, color: '#EC4899' },
    { name: 'Loisirs', value: 120000, color: '#8B5CF6' },
  ];

  const totalIncome = monthlyData.reduce((sum, d) => sum + d.revenus, 0);
  const totalExpense = monthlyData.reduce((sum, d) => sum + d.depenses, 0);
  const savings = totalIncome - totalExpense;
  const savingsRate = Math.round((savings / totalIncome) * 100);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Rapports</h1>
          <p className={isDark ? 'text-slate-400' : 'text-gray-500'}>Analysez vos finances en détail</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className={cn('px-4 py-2 rounded-xl border outline-none', isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200')}
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
            <option value="year">Cette année</option>
          </select>
          <button className={cn('flex items-center gap-2 px-4 py-2 rounded-xl border', isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200')}>
            <Download className="w-4 h-4" />
            Exporter PDF
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Revenus Total', value: totalIncome * 100, icon: TrendingUp, color: 'emerald', change: '+8.2%' },
          { label: 'Dépenses Total', value: totalExpense * 100, icon: TrendingDown, color: 'red', change: '-3.1%' },
          { label: 'Épargne Nette', value: savings * 100, icon: Wallet, color: 'blue', change: '+15.0%' },
          { label: 'Taux d\'Épargne', value: savingsRate, icon: Calendar, color: 'purple', isPercent: true, change: '+2.5%' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses: Record<string, string> = {
            emerald: 'from-emerald-500 to-green-500',
            red: 'from-red-500 to-orange-500',
            blue: 'from-blue-500 to-cyan-500',
            purple: 'from-purple-500 to-pink-500',
          };

          return (
            <div key={index} className={cn('rounded-2xl p-5 border', isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200')}>
              <div className="flex items-center justify-between mb-3">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br', colorClasses[stat.color])}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className={cn('text-sm font-medium', stat.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400')}>
                  {stat.change}
                </span>
              </div>
              <p className={cn('text-sm', isDark ? 'text-slate-400' : 'text-gray-500')}>{stat.label}</p>
              <p className="text-2xl font-bold mt-1">
                {stat.isPercent ? `${stat.value}%` : formatMoney(stat.value, false)}
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Comparaison Mensuelle */}
        <div className={cn('rounded-2xl p-6 border', isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200')}>
          <h2 className="text-lg font-semibold mb-6">Comparaison Mensuelle</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#E5E7EB'} />
              <XAxis dataKey="month" stroke={isDark ? '#94A3B8' : '#6B7280'} />
              <YAxis stroke={isDark ? '#94A3B8' : '#6B7280'} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                }}
                formatter={(value: number) => formatMoney(value * 100, false)}
              />
              <Legend />
              <Bar dataKey="revenus" name="Revenus" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="depenses" name="Dépenses" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart - Tendance Hebdomadaire */}
        <div className={cn('rounded-2xl p-6 border', isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200')}>
          <h2 className="text-lg font-semibold mb-6">Dépenses de la Semaine</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#E5E7EB'} />
              <XAxis dataKey="day" stroke={isDark ? '#94A3B8' : '#6B7280'} />
              <YAxis stroke={isDark ? '#94A3B8' : '#6B7280'} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                }}
                formatter={(value: number) => formatMoney(value * 100, false)}
              />
              <Line
                type="monotone"
                dataKey="depenses"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart - Évolution */}
        <div className={cn('lg:col-span-2 rounded-2xl p-6 border', isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200')}>
          <h2 className="text-lg font-semibold mb-6">Évolution Revenus vs Dépenses</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDep" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#E5E7EB'} />
              <XAxis dataKey="month" stroke={isDark ? '#94A3B8' : '#6B7280'} />
              <YAxis stroke={isDark ? '#94A3B8' : '#6B7280'} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                }}
                formatter={(value: number) => formatMoney(value * 100, false)}
              />
              <Area type="monotone" dataKey="revenus" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
              <Area type="monotone" dataKey="depenses" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorDep)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Catégories */}
        <div className={cn('rounded-2xl p-6 border', isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200')}>
          <h2 className="text-lg font-semibold mb-6">Répartition Dépenses</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatMoney(value * 100, false)} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {categoryData.map((cat, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></span>
                  {cat.name}
                </span>
                <span className="font-medium">{formatMoney(cat.value * 100, false)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Statistics Table */}
      <div className={cn('rounded-2xl p-6 border', isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200')}>
        <h2 className="text-lg font-semibold mb-6">Résumé Statistiques</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className={isDark ? 'text-slate-400' : 'text-gray-500'}>Dépense moyenne/jour</p>
            <p className="text-xl font-bold mt-1">{formatMoney(Math.round(totalExpense / 180) * 100, false)}</p>
          </div>
          <div>
            <p className={isDark ? 'text-slate-400' : 'text-gray-500'}>Transactions ce mois</p>
            <p className="text-xl font-bold mt-1">127</p>
          </div>
          <div>
            <p className={isDark ? 'text-slate-400' : 'text-gray-500'}>Plus grosse dépense</p>
            <p className="text-xl font-bold mt-1">{formatMoney(35000000, true)}</p>
          </div>
          <div>
            <p className={isDark ? 'text-slate-400' : 'text-gray-500'}>Catégorie principale</p>
            <p className="text-xl font-bold mt-1">Logement (36%)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
