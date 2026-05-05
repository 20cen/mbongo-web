'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn, formatMoney, formatDate, getWalletIcon } from '@/lib/utils';
import { walletsApi, transactionsApi, budgetsApi, dashboardApi } from '@/lib/api';
import { Wallet, Transaction, Budget } from '@/types';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  Wallet as WalletIcon, TrendingUp, TrendingDown, PiggyBank,
  ArrowUpRight, ArrowDownRight, Download, ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState('month');

  // Données pour les graphiques (mock pour l'instant)
  const [monthlyData] = useState([
    { month: 'Jan', revenus: 850000, depenses: 620000 },
    { month: 'Fév', revenus: 920000, depenses: 580000 },
    { month: 'Mar', revenus: 780000, depenses: 710000 },
    { month: 'Avr', revenus: 1100000, depenses: 650000 },
    { month: 'Mai', revenus: 950000, depenses: 720000 },
    { month: 'Juin', revenus: 1250000, depenses: 890000 },
  ]);

  const [categoryData] = useState([
    { name: 'Alimentation', value: 280000, color: '#EF4444' },
    { name: 'Transport', value: 150000, color: '#3B82F6' },
    { name: 'Logement', value: 350000, color: '#F59E0B' },
    { name: 'Santé', value: 80000, color: '#EC4899' },
    { name: 'Loisirs', value: 120000, color: '#8B5CF6' },
  ]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [walletsRes, transactionsRes, budgetsRes] = await Promise.all([
        walletsApi.getAll(),
        transactionsApi.getRecent(10),
        budgetsApi.getAll(),
      ]);

      if (walletsRes.success) {
        setWallets(walletsRes.wallets || walletsRes.data || []);
      }
      if (transactionsRes.success) {
        setTransactions(transactionsRes.transactions || transactionsRes.data || []);
      }
      if (budgetsRes.success) {
        setBudgets(budgetsRes.budgets || budgetsRes.data || []);
      }
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalBalance = wallets.reduce((sum, w) => sum + (w.balance || 0), 0);
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalExpense = Math.abs(
    transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + (t.amount || 0), 0)
  );

  const stats = [
    {
      label: 'Solde Total',
      value: totalBalance,
      icon: WalletIcon,
      color: 'from-blue-500 to-cyan-500',
      change: '+12.5%',
      up: true,
    },
    {
      label: 'Revenus (Mois)',
      value: totalIncome || 900000 * 100,
      icon: TrendingUp,
      color: 'from-emerald-500 to-green-500',
      change: '+8.2%',
      up: true,
    },
    {
      label: 'Dépenses (Mois)',
      value: totalExpense || 650000 * 100,
      icon: TrendingDown,
      color: 'from-red-500 to-orange-500',
      change: '-3.1%',
      up: false,
    },
    {
      label: 'Épargne',
      value: 500000 * 100,
      icon: PiggyBank,
      color: 'from-purple-500 to-pink-500',
      change: '+15.0%',
      up: true,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          <p className={isDark ? 'text-slate-400' : 'text-gray-500'}>
            Bienvenue, voici un aperçu de vos finances
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className={cn(
              'px-4 py-2 rounded-xl border outline-none',
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
            )}
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="year">Cette année</option>
          </select>
          <button
            className={cn(
              'p-2 rounded-xl border',
              isDark ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-gray-200 hover:bg-gray-50'
            )}
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={cn(
                'rounded-2xl p-5 border card-hover',
                isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br',
                    stat.color
                  )}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span
                  className={cn(
                    'flex items-center text-sm font-medium',
                    stat.up ? 'text-emerald-400' : 'text-red-400'
                  )}
                >
                  {stat.up ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {stat.change}
                </span>
              </div>
              <p className={cn('text-sm mb-1', isDark ? 'text-slate-400' : 'text-gray-500')}>
                {stat.label}
              </p>
              <p className="text-2xl font-bold">{formatMoney(stat.value)}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div
          className={cn(
            'lg:col-span-2 rounded-2xl p-6 border',
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
          )}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Évolution Financière</h2>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                Revenus
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                Dépenses
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorRevenus" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDepenses" x1="0" y1="0" x2="0" y2="1">
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
                  boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                }}
                formatter={(value: number) => formatMoney(value * 100, false)}
              />
              <Area
                type="monotone"
                dataKey="revenus"
                stroke="#10B981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRevenus)"
              />
              <Area
                type="monotone"
                dataKey="depenses"
                stroke="#EF4444"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorDepenses)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Pie Chart */}
        <div
          className={cn(
            'rounded-2xl p-6 border',
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
          )}
        >
          <h2 className="text-lg font-semibold mb-6">Dépenses par Catégorie</h2>
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

      {/* Wallets & Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wallets */}
        <div
          className={cn(
            'rounded-2xl p-6 border',
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
          )}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Mes Portefeuilles</h2>
            <Link href="/wallets" className="text-blue-400 text-sm font-medium hover:text-blue-300 flex items-center gap-1">
              Voir tout <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {(wallets.length > 0 ? wallets : [
              { id: '1', name: 'Cash Principal', type: 'cash', balance: 24500000 },
              { id: '2', name: 'MTN MoMo', type: 'mtn_momo', balance: 68000000 },
              { id: '3', name: 'Banque UBA', type: 'bank', balance: 125000000 },
            ]).slice(0, 4).map((wallet: any) => (
              <div
                key={wallet.id}
                className={cn(
                  'flex items-center justify-between p-4 rounded-xl',
                  isDark ? 'bg-slate-700/50' : 'bg-gray-50'
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getWalletIcon(wallet.type)}</span>
                  <div>
                    <p className="font-medium">{wallet.name}</p>
                    <p className={cn('text-sm', isDark ? 'text-slate-400' : 'text-gray-500')}>
                      {wallet.type}
                    </p>
                  </div>
                </div>
                <p className="font-bold text-lg">{formatMoney(wallet.balance)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div
          className={cn(
            'rounded-2xl p-6 border',
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
          )}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Transactions Récentes</h2>
            <Link href="/transactions" className="text-blue-400 text-sm font-medium hover:text-blue-300 flex items-center gap-1">
              Voir tout <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {(transactions.length > 0 ? transactions : [
              { id: '1', description: 'Salaire Décembre', amount: 75000000, type: 'income', date: '2024-01-04' },
              { id: '2', description: 'Courses Supermarché', amount: -4500000, type: 'expense', date: '2024-01-04' },
              { id: '3', description: 'Taxi Bureau', amount: -350000, type: 'expense', date: '2024-01-03' },
              { id: '4', description: 'Facture Électricité', amount: -2800000, type: 'expense', date: '2024-01-03' },
              { id: '5', description: 'Vente Business', amount: 15000000, type: 'income', date: '2024-01-02' },
            ]).slice(0, 5).map((tx: any) => (
              <div
                key={tx.id}
                className={cn(
                  'flex items-center justify-between py-3 border-b last:border-0',
                  isDark ? 'border-slate-700' : 'border-gray-100'
                )}
              >
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
                    <p className="font-medium text-sm">{tx.description}</p>
                    <p className={cn('text-xs', isDark ? 'text-slate-400' : 'text-gray-500')}>
                      {formatDate(tx.date, 'relative')}
                    </p>
                  </div>
                </div>
                <p
                  className={cn(
                    'font-bold',
                    tx.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                  )}
                >
                  {tx.type === 'income' ? '+' : ''}
                  {formatMoney(tx.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Budgets Progress */}
      <div
        className={cn(
          'rounded-2xl p-6 border',
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
        )}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Suivi des Budgets</h2>
          <Link href="/budgets" className="text-blue-400 text-sm font-medium hover:text-blue-300 flex items-center gap-1">
            Gérer <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(budgets.length > 0 ? budgets : [
            { id: '1', category: { name: 'Alimentation', icon: '🍽️' }, amount_limit: 300000, current_spent: 28000000 },
            { id: '2', category: { name: 'Transport', icon: '🚌' }, amount_limit: 150000, current_spent: 12000000 },
            { id: '3', category: { name: 'Logement', icon: '🏠' }, amount_limit: 400000, current_spent: 35000000 },
            { id: '4', category: { name: 'Loisirs', icon: '🎉' }, amount_limit: 100000, current_spent: 9500000 },
          ]).slice(0, 4).map((budget: any) => {
            const spent = budget.current_spent / 100; // centimes to FCFA
            const limit = budget.amount_limit;
            const percent = Math.round((spent / limit) * 100);
            const isOver = percent >= 90;

            return (
              <div
                key={budget.id}
                className={cn(
                  'p-4 rounded-xl',
                  isDark ? 'bg-slate-700/50' : 'bg-gray-50'
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl">{budget.category?.icon || '📊'}</span>
                  <span
                    className={cn(
                      'text-sm font-medium',
                      isOver ? 'text-red-400' : 'text-emerald-400'
                    )}
                  >
                    {percent}%
                  </span>
                </div>
                <p className="font-medium mb-1">{budget.category?.name || 'Budget'}</p>
                <div
                  className={cn(
                    'w-full h-2 rounded-full overflow-hidden mb-2',
                    isDark ? 'bg-slate-600' : 'bg-gray-200'
                  )}
                >
                  <div
                    className={cn(
                      'h-full rounded-full transition-all progress-bar',
                      isOver ? 'bg-red-500' : 'bg-emerald-500'
                    )}
                    style={{ width: `${Math.min(percent, 100)}%` }}
                  ></div>
                </div>
                <p className={cn('text-sm', isDark ? 'text-slate-400' : 'text-gray-500')}>
                  {formatMoney(spent * 100, false)} / {formatMoney(limit * 100, false)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
