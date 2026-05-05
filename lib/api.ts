import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.API_URL || 'http://localhost:8080/api/v1';

// Créer l'instance Axios
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Intercepteur pour ajouter le token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs et le refresh token
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Si erreur 401 et pas encore réessayé
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = Cookies.get('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });

          if (response.data.success) {
            const { access_token, refresh_token: newRefreshToken } = response.data;
            
            Cookies.set('access_token', access_token, { expires: 1 });
            if (newRefreshToken) {
              Cookies.set('refresh_token', newRefreshToken, { expires: 30 });
            }

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${access_token}`;
            }
            return api(originalRequest);
          }
        } catch (refreshError) {
          // Refresh échoué, déconnecter l'utilisateur
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
          window.location.href = '/auth/login';
          return Promise.reject(refreshError);
        }
      } else {
        // Pas de refresh token, rediriger vers login
        window.location.href = '/auth/login';
      }
    }

    return Promise.reject(error);
  }
);

// ==================== AUTH ====================

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (data: {
    email: string;
    password: string;
    phone?: string;
    first_name: string;
    last_name: string;
  }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
    }
  },

  refreshToken: async (refreshToken: string) => {
    const response = await api.post('/auth/refresh', { refresh_token: refreshToken });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// ==================== WALLETS ====================

export const walletsApi = {
  getAll: async () => {
    const response = await api.get('/wallets');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/wallets/${id}`);
    return response.data;
  },

  create: async (data: { name: string; type: string; balance?: number }) => {
    const response = await api.post('/wallets', {
      ...data,
      balance: (data.balance || 0) * 100, // Convertir en centimes
    });
    return response.data;
  },

  update: async (id: string, data: { name?: string; type?: string }) => {
    const response = await api.put(`/wallets/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/wallets/${id}`);
    return response.data;
  },
};

// ==================== TRANSACTIONS ====================

export const transactionsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    type?: string;
    category_id?: string;
    wallet_id?: string;
    start_date?: string;
    end_date?: string;
  }) => {
    const response = await api.get('/transactions', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  create: async (data: {
    wallet_id: string;
    category_id: string;
    type: string;
    amount: number;
    description: string;
    date: string;
  }) => {
    const response = await api.post('/transactions', {
      ...data,
      amount: data.amount * 100, // Convertir en centimes
    });
    return response.data;
  },

  update: async (id: string, data: Partial<{
    category_id: string;
    amount: number;
    description: string;
    date: string;
  }>) => {
    const payload = { ...data };
    if (data.amount) {
      payload.amount = data.amount * 100;
    }
    const response = await api.put(`/transactions/${id}`, payload);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },

  getStats: async (period?: string) => {
    const response = await api.get('/transactions/stats', { params: { period } });
    return response.data;
  },

  getRecent: async (limit: number = 10) => {
    const response = await api.get('/transactions/recent', { params: { limit } });
    return response.data;
  },
};

// ==================== CATEGORIES ====================

export const categoriesApi = {
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  create: async (data: { name: string; icon: string; color: string; type: string }) => {
    const response = await api.post('/categories', data);
    return response.data;
  },
};

// ==================== BUDGETS ====================

export const budgetsApi = {
  getAll: async () => {
    const response = await api.get('/budgets');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/budgets/${id}`);
    return response.data;
  },

  create: async (data: {
    category_id: string;
    amount_limit: number;
    period: string;
    alert_threshold?: number;
  }) => {
    const response = await api.post('/budgets', data);
    return response.data;
  },

  update: async (id: string, data: Partial<{
    amount_limit: number;
    alert_threshold: number;
  }>) => {
    const response = await api.put(`/budgets/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/budgets/${id}`);
    return response.data;
  },
};

// ==================== TONTINES ====================

export const tontinesApi = {
  getAll: async () => {
    const response = await api.get('/tontines');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/tontines/${id}`);
    return response.data;
  },

  create: async (data: {
    name: string;
    description?: string;
    contribution_amount: number;
    frequency: string;
    start_date: string;
    is_public: boolean;
    max_members: number;
  }) => {
    const response = await api.post('/tontines', {
      ...data,
      contribution_amount: data.contribution_amount * 100,
    });
    return response.data;
  },

  join: async (id: string, code?: string) => {
    const response = await api.post(`/tontines/${id}/join`, { code });
    return response.data;
  },

  leave: async (id: string) => {
    const response = await api.post(`/tontines/${id}/leave`);
    return response.data;
  },

  getMembers: async (id: string) => {
    const response = await api.get(`/tontines/${id}/members`);
    return response.data;
  },

  contribute: async (id: string, data: { amount: number; wallet_id: string }) => {
    const response = await api.post(`/tontines/${id}/contribute`, {
      ...data,
      amount: data.amount * 100,
    });
    return response.data;
  },
};

// ==================== DEBTS ====================

export const debtsApi = {
  getAll: async () => {
    const response = await api.get('/debts');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/debts/${id}`);
    return response.data;
  },

  create: async (data: {
    person_name: string;
    type: 'lent' | 'borrowed';
    amount: number;
    description?: string;
    due_date?: string;
  }) => {
    const response = await api.post('/debts', {
      ...data,
      amount: data.amount * 100,
    });
    return response.data;
  },

  addPayment: async (id: string, data: { amount: number; wallet_id: string }) => {
    const response = await api.post(`/debts/${id}/payments`, {
      ...data,
      amount: data.amount * 100,
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/debts/${id}`);
    return response.data;
  },
};

// ==================== SAVINGS GOALS ====================

export const goalsApi = {
  getAll: async () => {
    const response = await api.get('/goals');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/goals/${id}`);
    return response.data;
  },

  create: async (data: {
    name: string;
    target_amount: number;
    icon?: string;
    color?: string;
    deadline?: string;
  }) => {
    const response = await api.post('/goals', {
      ...data,
      target_amount: data.target_amount * 100,
    });
    return response.data;
  },

  addContribution: async (id: string, data: { amount: number; wallet_id: string }) => {
    const response = await api.post(`/goals/${id}/contribute`, {
      ...data,
      amount: data.amount * 100,
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/goals/${id}`);
    return response.data;
  },
};

// ==================== DASHBOARD ====================

export const dashboardApi = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  getMonthlyData: async (year?: number) => {
    const response = await api.get('/dashboard/monthly', { params: { year } });
    return response.data;
  },

  getCategorySpending: async (period?: string) => {
    const response = await api.get('/dashboard/categories', { params: { period } });
    return response.data;
  },
};

export default api;
