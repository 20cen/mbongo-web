import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formater un montant en FCFA
export function formatMoney(amount: number, fromCentimes: boolean = true): string {
  const value = fromCentimes ? Math.abs(amount) / 100 : Math.abs(amount);
  const formatted = Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${amount < 0 ? '-' : ''}${formatted} FCFA`;
}

// Formater un montant court (ex: 1.2M, 500K)
export function formatMoneyShort(amount: number, fromCentimes: boolean = true): string {
  const value = fromCentimes ? amount / 100 : amount;
  const absValue = Math.abs(value);
  
  if (absValue >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (absValue >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return `${value}`;
}

// Formater une date
export function formatDate(date: string | Date, format: 'short' | 'long' | 'relative' = 'short'): string {
  const d = new Date(date);
  
  if (format === 'relative') {
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Aujourd'hui";
    if (days === 1) return 'Hier';
    if (days < 7) return `Il y a ${days} jours`;
    if (days < 30) return `Il y a ${Math.floor(days / 7)} semaines`;
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  }
  
  if (format === 'long') {
    return d.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
  
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// Obtenir l'icône du type de portefeuille
export function getWalletIcon(type: string): string {
  const icons: Record<string, string> = {
    cash: '💵',
    bank: '🏦',
    mtn_momo: '📱',
    airtel_money: '📱',
    savings: '🐷',
  };
  return icons[type] || '💳';
}

// Obtenir la couleur du type de portefeuille
export function getWalletColor(type: string): string {
  const colors: Record<string, string> = {
    cash: '#10B981',
    bank: '#3B82F6',
    mtn_momo: '#F59E0B',
    airtel_money: '#EF4444',
    savings: '#8B5CF6',
  };
  return colors[type] || '#6B7280';
}

// Obtenir le nom du type de portefeuille
export function getWalletTypeName(type: string): string {
  const names: Record<string, string> = {
    cash: 'Espèces',
    bank: 'Banque',
    mtn_momo: 'MTN MoMo',
    airtel_money: 'Airtel Money',
    savings: 'Épargne',
  };
  return names[type] || type;
}

// Calculer le pourcentage
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

// Générer une couleur aléatoire
export function generateColor(): string {
  const colors = [
    '#EF4444', '#F59E0B', '#10B981', '#3B82F6', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Obtenir les initiales d'un nom
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Valider un email
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Valider un numéro de téléphone congolais
export function isValidPhone(phone: string): boolean {
  const regex = /^(\+242|242)?[0-9]{9}$/;
  return regex.test(phone.replace(/\s/g, ''));
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Obtenir le mois en français
export function getMonthName(month: number): string {
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  return months[month] || '';
}

// Obtenir le jour de la semaine en français
export function getDayName(day: number): string {
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  return days[day] || '';
}
