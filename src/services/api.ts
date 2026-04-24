import type { User, Journal, FriendRequest, JournalVisibility } from '@/types';

function getBaseUrl(): string {
  const onedayConfig = (window as any).ONEDAY_CONFIG || (window.parent as any)?.ONEDAY_CONFIG;
  if (onedayConfig?.fc?.baseUrl) {
    return onedayConfig.fc.baseUrl;
  }
  return 'http://localhost:9000';
}

function getToken(): string | null {
  return localStorage.getItem('journal_token');
}

function setToken(token: string): void {
  localStorage.setItem('journal_token', token);
}

function clearToken(): void {
  localStorage.removeItem('journal_token');
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await fetch(`${getBaseUrl()}${path}`, {
    ...options,
    headers,
  });
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ error: '请求失败' }));
    throw new Error(errorBody.error || '请求失败');
  }
  return response.json();
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface FriendRequestWithUser extends FriendRequest {
  fromUser?: { id: string; username: string; avatar: string; bio: string };
  toUser?: { id: string; username: string; avatar: string };
}

export const apiService = {
  setToken,
  clearToken,
  getToken,

  async register(username: string, password: string): Promise<AuthResponse> {
    const result = await request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    setToken(result.token);
    return result;
  },

  async login(username: string, password: string): Promise<AuthResponse> {
    const result = await request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    setToken(result.token);
    return result;
  },

  async getMe(): Promise<User> {
    return request<User>('/api/auth/me');
  },

  async updateMe(fields: { avatar?: string; bio?: string; username?: string }): Promise<User> {
    return request<User>('/api/auth/me', {
      method: 'PUT',
      body: JSON.stringify(fields),
    });
  },

  async getUserByUsername(username: string): Promise<User> {
    return request<User>(`/api/auth/user/${encodeURIComponent(username)}`);
  },

  async getMyJournals(): Promise<Journal[]> {
    return request<Journal[]>('/api/journals');
  },

  async getUserJournals(userId: string): Promise<Journal[]> {
    return request<Journal[]>(`/api/journals/user/${userId}`);
  },

  async getJournalById(id: string): Promise<Journal> {
    return request<Journal>(`/api/journals/${id}`);
  },

  async createJournal(
    title: string,
    content: string,
    visibility: JournalVisibility
  ): Promise<Journal> {
    return request<Journal>('/api/journals', {
      method: 'POST',
      body: JSON.stringify({ title, content, visibility }),
    });
  },

  async updateJournal(
    id: string,
    title: string,
    content: string,
    visibility: JournalVisibility
  ): Promise<Journal> {
    return request<Journal>(`/api/journals/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ title, content, visibility }),
    });
  },

  async deleteJournal(id: string): Promise<void> {
    await request<{ success: boolean }>(`/api/journals/${id}`, { method: 'DELETE' });
  },

  async getFriends(): Promise<User[]> {
    return request<User[]>('/api/friends');
  },

  async getPendingRequests(): Promise<FriendRequestWithUser[]> {
    return request<FriendRequestWithUser[]>('/api/friends/requests/pending');
  },

  async getSentRequests(): Promise<FriendRequestWithUser[]> {
    return request<FriendRequestWithUser[]>('/api/friends/requests/sent');
  },

  async sendFriendRequest(toUserId: string): Promise<FriendRequest> {
    return request<FriendRequest>('/api/friends/request', {
      method: 'POST',
      body: JSON.stringify({ toUserId }),
    });
  },

  async acceptFriendRequest(requestId: string): Promise<void> {
    await request<{ success: boolean }>(`/api/friends/requests/${requestId}`, {
      method: 'PUT',
      body: JSON.stringify({ action: 'accept' }),
    });
  },

  async rejectFriendRequest(requestId: string): Promise<void> {
    await request<{ success: boolean }>(`/api/friends/requests/${requestId}`, {
      method: 'PUT',
      body: JSON.stringify({ action: 'reject' }),
    });
  },

  async removeFriend(friendId: string): Promise<void> {
    await request<{ success: boolean }>(`/api/friends/${friendId}`, { method: 'DELETE' });
  },
};
