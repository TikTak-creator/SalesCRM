import {
  User,
  Client,
  Deal,
  DashboardMetrics,
  SaleHistory,
  DemoAccount,
  DealStage,
  DealPriority,
  ClientStatus,
  ActivityType
} from '../types';

const API_BASE = '/api';

export const DEFAULT_DEMO_USER: User = {
  id: 1,
  fullName: 'Alexander Wright',
  email: 'admin@salescrm.com',
  role: 'Admin',
  roleName: 'Admin',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  monthlyQuota: 150000,
  phoneNumber: '+1 (555) 019-2831',
  department: 'Executive Leadership',
  isActive: true,
  createdAt: '2025-01-01T00:00:00Z',
  activeDealsCount: 4,
  totalSalesCurrentMonth: 0,
  quotaAttainmentPercent: 120
};

const DEFAULT_DEMO_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiQWxleGFuZGVyIFdyaWdodCIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6ImFkbWluQHNhbGVzY3JtLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiRGVwYXJ0bWVudCI6IkV4ZWN1dGl2ZSBMZWFkZXJzaGlwIiwiQXZhdGFyVXJsIjoiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MzQ1Mjg3NDE3NzUtNTM5OTRhNjlkYWViP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnE9ODAmdz0yNTAiLCJleHAiOjE3OTE3MTMyMTUsImlzcyI6IlNhbGVzQ1JNLkFwaSIsImF1ZCI6IlNhbGVzQ1JNLkNsaWVudCJ9.c6IrkewOUqTLb2rLLAKa8xSTw6qASt58k7I7pzVdImU';

export const getAuthToken = (): string | null => {
  if (localStorage.getItem('crm_logged_out') === 'true') {
    return localStorage.getItem('crm_jwt_token');
  }
  return localStorage.getItem('crm_jwt_token') || DEFAULT_DEMO_TOKEN;
};

export const setAuthToken = (token: string): void => {
  localStorage.removeItem('crm_logged_out');
  localStorage.setItem('crm_jwt_token', token);
};

export const removeAuthToken = (): void => {
  localStorage.setItem('crm_logged_out', 'true');
  localStorage.removeItem('crm_jwt_token');
  localStorage.removeItem('crm_user');
};

export const getStoredUser = (): User | null => {
  if (localStorage.getItem('crm_logged_out') === 'true') {
    return null;
  }
  const data = localStorage.getItem('crm_user');
  if (!data) return DEFAULT_DEMO_USER;
  try {
    return JSON.parse(data);
  } catch {
    return DEFAULT_DEMO_USER;
  }
};

export const setStoredUser = (user: User): void => {
  localStorage.setItem('crm_user', JSON.stringify(user));
};

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});
  
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  if (response.status === 401) {
    removeAuthToken();
    window.dispatchEvent(new Event('auth:unauthorized'));
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `API error: ${response.status}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const api = {
  auth: {
    login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
      const res = await apiFetch<{ token: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      setAuthToken(res.token);
      setStoredUser(res.user);
      return res;
    },
    getDemoAccounts: (): Promise<DemoAccount[]> => apiFetch<DemoAccount[]>('/auth/demo-accounts'),
    getMe: (): Promise<User> => apiFetch<User>('/auth/me'),
  },

  analytics: {
    getDashboard: (): Promise<DashboardMetrics> => apiFetch<DashboardMetrics>('/analytics/dashboard'),
    getSalesHistory: (repId?: number): Promise<SaleHistory[]> => {
      const query = repId ? `?repId=${repId}` : '';
      return apiFetch<SaleHistory[]>(`/analytics/sales-history${query}`);
    }
  },

  deals: {
    getAll: (params?: { stage?: DealStage; assignedUserId?: number; search?: string }): Promise<Deal[]> => {
      const searchParams = new URLSearchParams();
      if (params?.stage) searchParams.append('stage', params.stage);
      if (params?.assignedUserId) searchParams.append('assignedUserId', params.assignedUserId.toString());
      if (params?.search) searchParams.append('search', params.search);
      const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
      return apiFetch<Deal[]>(`/deals${query}`);
    },
    getKanban: (): Promise<Record<string, Deal[]>> => apiFetch<Record<string, Deal[]>>('/deals/kanban'),
    getById: (id: number): Promise<Deal> => apiFetch<Deal>(`/deals/${id}`),
    create: (data: {
      title: string;
      clientId: number;
      assignedUserId: number;
      amount: number;
      stage: DealStage;
      probability: number;
      priority: DealPriority;
      expectedCloseDate?: string;
      description?: string;
    }): Promise<Deal> => apiFetch<Deal>('/deals', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (id: number, data: Partial<Deal>): Promise<void> => apiFetch<void>(`/deals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    updateStage: (id: number, stage: DealStage, note?: string): Promise<{ message: string; stage: string }> =>
      apiFetch<{ message: string; stage: string }>(`/deals/${id}/stage`, {
        method: 'PUT',
        body: JSON.stringify({ stage, note })
      }),
    addActivity: (id: number, type: ActivityType, description: string): Promise<void> =>
      apiFetch<void>(`/deals/${id}/activities`, {
        method: 'POST',
        body: JSON.stringify({ type, description })
      }),
    delete: (id: number): Promise<void> => apiFetch<void>(`/deals/${id}`, { method: 'DELETE' })
  },

  clients: {
    getAll: (params?: { search?: string; status?: ClientStatus; industry?: string; assignedUserId?: number }): Promise<Client[]> => {
      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.append('search', params.search);
      if (params?.status) searchParams.append('status', params.status);
      if (params?.industry) searchParams.append('industry', params.industry);
      if (params?.assignedUserId) searchParams.append('assignedUserId', params.assignedUserId.toString());
      const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
      return apiFetch<Client[]>(`/clients${query}`);
    },
    getById: (id: number): Promise<Client> => apiFetch<Client>(`/clients/${id}`),
    create: (data: Partial<Client>): Promise<Client> => apiFetch<Client>('/clients', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (id: number, data: Partial<Client>): Promise<void> => apiFetch<void>(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (id: number): Promise<void> => apiFetch<void>(`/clients/${id}`, { method: 'DELETE' })
  },

  users: {
    getAll: (): Promise<User[]> => apiFetch<User[]>('/users'),
    getById: (id: number): Promise<User> => apiFetch<User>(`/users/${id}`),
    create: (data: any): Promise<User> => apiFetch<User>('/users', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (id: number, data: any): Promise<void> => apiFetch<void>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }
};
