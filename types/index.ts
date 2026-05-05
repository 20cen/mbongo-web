// Types pour l'application Mbongo

export interface User {
  id: string;
  email: string;
  phone?: string;
  first_name: string;
  last_name: string;
  role: 'free' | 'premium';
  created_at: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  access_token?: string;
  refresh_token?: string;
  user?: User;
}

export interface Wallet {
  id: string;
  user_id: string;
  name: string;
  type: WalletType;
  balance: number; // En centimes
  icon?: string;
  color?: string;
  is_default: boolean;
  created_at: string;
}

export type WalletType = 'cash' | 'bank' | 'mtn_momo' | 'airtel_money' | 'savings';

export interface Transaction {
  id: string;
  user_id: string;
  wallet_id: string;
  category_id: string;
  type: TransactionType;
  amount: number; // En centimes
  description: string;
  date: string;
  wallet?: Wallet;
  category?: Category;
  created_at: string;
}

export type TransactionType = 'income' | 'expense' | 'transfer';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}

export interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  amount_limit: number; // En FCFA
  current_spent: number; // En centimes
  period: 'weekly' | 'monthly' | 'yearly';
  alert_threshold: number;
  start_date: string;
  end_date: string;
  category?: Category;
}

export interface Tontine {
  id: string;
  name: string;
  description?: string;
  contribution_amount: number;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  start_date: string;
  is_public: boolean;
  max_members: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  members_count?: number;
  total_collected?: number;
}

export interface TontineMember {
  id: string;
  tontine_id: string;
  user_id: string;
  role: 'admin' | 'member';
  position: number;
  status: 'active' | 'inactive';
  user?: User;
}

export interface Debt {
  id: string;
  user_id: string;
  person_name: string;
  type: 'lent' | 'borrowed';
  amount: number;
  remaining_amount: number;
  description?: string;
  due_date?: string;
  status: 'pending' | 'partial' | 'paid';
  created_at: string;
}

export interface SavingsGoal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  icon?: string;
  color?: string;
  deadline?: string;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
}

export interface DashboardStats {
  total_balance: number;
  total_income: number;
  total_expense: number;
  total_savings: number;
  income_change: number;
  expense_change: number;
}

export interface MonthlyData {
  month: string;
  revenus: number;
  depenses: number;
}

export interface CategorySpending {
  name: string;
  value: number;
  color: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}
