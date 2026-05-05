'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn, getInitials } from '@/lib/utils';
import {
  Home,
  Receipt,
  Wallet,
  Target,
  Users,
  HandCoins,
  Goal,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Tableau de bord', icon: Home, href: '/dashboard' },
  { id: 'transactions', label: 'Transactions', icon: Receipt, href: '/transactions' },
  { id: 'wallets', label: 'Portefeuilles', icon: Wallet, href: '/wallets' },
  { id: 'budgets', label: 'Budgets', icon: Target, href: '/budgets' },
  { id: 'tontines', label: 'Tontines', icon: Users, href: '/tontines' },
  { id: 'debts', label: 'Dettes', icon: HandCoins, href: '/debts' },
  { id: 'goals', label: 'Objectifs', icon: Goal, href: '/goals' },
  { id: 'reports', label: 'Rapports', icon: BarChart3, href: '/reports' },
];

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const isDark = theme === 'dark';

  const handleLogout = async () => {
    await logout();
    window.location.href = '/auth/login';
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full z-40 flex flex-col transition-all duration-300',
        isOpen ? 'w-64' : 'w-20',
        isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200',
        'border-r'
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          'h-16 flex items-center border-b',
          isOpen ? 'px-6' : 'justify-center',
          isDark ? 'border-slate-700' : 'border-gray-200'
        )}
      >
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
          <Wallet className="w-5 h-5 text-white" />
        </div>
        {isOpen && (
          <span className="ml-3 font-bold text-xl bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Mbongo
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'w-full flex items-center py-3 rounded-xl transition-all duration-200',
                isOpen ? 'px-4' : 'justify-center',
                isActive
                  ? 'bg-blue-500/10 text-blue-400'
                  : isDark
                  ? 'text-slate-400 hover:bg-slate-700 hover:text-white'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <Icon className={cn('w-5 h-5', isActive && 'text-blue-400')} />
              {isOpen && <span className="ml-3 font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Settings & Logout */}
      <div className={cn('p-4 border-t', isDark ? 'border-slate-700' : 'border-gray-200')}>
        <Link
          href="/settings"
          className={cn(
            'w-full flex items-center py-3 rounded-xl transition-all duration-200',
            isOpen ? 'px-4' : 'justify-center',
            isDark
              ? 'text-slate-400 hover:bg-slate-700 hover:text-white'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
          )}
        >
          <Settings className="w-5 h-5" />
          {isOpen && <span className="ml-3 font-medium">Paramètres</span>}
        </Link>

        <button
          onClick={handleLogout}
          className={cn(
            'w-full flex items-center py-3 rounded-xl transition-all duration-200',
            isOpen ? 'px-4' : 'justify-center',
            'text-red-400 hover:bg-red-500/10'
          )}
        >
          <LogOut className="w-5 h-5" />
          {isOpen && <span className="ml-3 font-medium">Déconnexion</span>}
        </button>
      </div>

      {/* User Section */}
      <div className={cn('p-4 border-t', isDark ? 'border-slate-700' : 'border-gray-200')}>
        <div className={cn('flex items-center', !isOpen && 'justify-center')}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">
            {user ? getInitials(`${user.first_name} ${user.last_name}`) : 'U'}
          </div>
          {isOpen && user && (
            <div className="ml-3 overflow-hidden">
              <p className={cn('font-medium text-sm truncate', isDark ? 'text-white' : 'text-gray-900')}>
                {user.first_name} {user.last_name}
              </p>
              <p className={cn('text-xs truncate', isDark ? 'text-slate-400' : 'text-gray-500')}>
                {user.role === 'premium' ? '⭐ Premium' : 'Gratuit'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className={cn(
          'absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center',
          'bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-colors'
        )}
      >
        {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
    </aside>
  );
}
