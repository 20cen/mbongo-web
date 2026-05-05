'use client';

import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Plus,
  Menu,
  X,
} from 'lucide-react';
import TransactionModal from '@/components/modals/TransactionModal';

interface HeaderProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

export default function Header({ onMenuClick, sidebarOpen }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <header
        className={cn(
          'h-16 flex items-center justify-between px-4 lg:px-6 border-b sticky top-0 z-30',
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
        )}
      >
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className={cn(
              'p-2 rounded-lg lg:hidden',
              isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'
            )}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Search */}
          <div
            className={cn(
              'hidden md:flex items-center rounded-xl px-4 py-2 w-80',
              isDark ? 'bg-slate-700' : 'bg-gray-100'
            )}
          >
            <Search className={cn('w-4 h-4', isDark ? 'text-slate-400' : 'text-gray-400')} />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                'ml-3 bg-transparent outline-none w-full',
                isDark ? 'text-white placeholder:text-slate-500' : 'text-gray-900 placeholder:text-gray-400'
              )}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button
            className={cn(
              'p-2 rounded-lg relative',
              isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'
            )}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={cn(
              'p-2 rounded-lg',
              isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'
            )}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* New Transaction Button */}
          <button
            onClick={() => setShowTransactionModal(true)}
            className="hidden md:flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nouvelle Transaction
          </button>

          {/* Mobile New Transaction */}
          <button
            onClick={() => setShowTransactionModal(true)}
            className="md:hidden p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
      />
    </>
  );
}
