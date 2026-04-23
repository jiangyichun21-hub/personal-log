import type { User, Journal, FriendRequest } from '@/types';

const USERS_KEY = 'journal_users';
const JOURNALS_KEY = 'journal_entries';
const CURRENT_USER_KEY = 'journal_current_user';
const FRIEND_REQUESTS_KEY = 'journal_friend_requests';

export const storageService = {
  getUsers(): User[] {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  saveUsers(users: User[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  getUserById(id: string): User | null {
    return this.getUsers().find((u) => u.id === id) ?? null;
  },

  getUserByUsername(username: string): User | null {
    return this.getUsers().find((u) => u.username === username) ?? null;
  },

  createUser(user: User): void {
    const users = this.getUsers();
    users.push(user);
    this.saveUsers(users);
  },

  updateUser(updated: User): void {
    const users = this.getUsers().map((u) => (u.id === updated.id ? updated : u));
    this.saveUsers(users);
  },

  getJournals(): Journal[] {
    const raw = localStorage.getItem(JOURNALS_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  saveJournals(journals: Journal[]): void {
    localStorage.setItem(JOURNALS_KEY, JSON.stringify(journals));
  },

  getJournalsByUserId(userId: string): Journal[] {
    return this.getJournals()
      .filter((j) => j.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getJournalById(id: string): Journal | null {
    return this.getJournals().find((j) => j.id === id) ?? null;
  },

  createJournal(journal: Journal): void {
    const journals = this.getJournals();
    journals.push(journal);
    this.saveJournals(journals);
  },

  updateJournal(updated: Journal): void {
    const journals = this.getJournals().map((j) => (j.id === updated.id ? updated : j));
    this.saveJournals(journals);
  },

  deleteJournal(id: string): void {
    const journals = this.getJournals().filter((j) => j.id !== id);
    this.saveJournals(journals);
  },

  getFriendRequests(): FriendRequest[] {
    const raw = localStorage.getItem(FRIEND_REQUESTS_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  saveFriendRequests(requests: FriendRequest[]): void {
    localStorage.setItem(FRIEND_REQUESTS_KEY, JSON.stringify(requests));
  },

  getFriendRequestsBetween(fromUserId: string, toUserId: string): FriendRequest | null {
    return this.getFriendRequests().find(
      (r) => r.fromUserId === fromUserId && r.toUserId === toUserId && r.status === 'pending'
    ) ?? null;
  },

  getPendingRequestsForUser(userId: string): FriendRequest[] {
    return this.getFriendRequests().filter(
      (r) => r.toUserId === userId && r.status === 'pending'
    );
  },

  getSentPendingRequests(userId: string): FriendRequest[] {
    return this.getFriendRequests().filter(
      (r) => r.fromUserId === userId && r.status === 'pending'
    );
  },

  createFriendRequest(request: FriendRequest): void {
    const requests = this.getFriendRequests();
    requests.push(request);
    this.saveFriendRequests(requests);
  },

  updateFriendRequest(id: string, status: 'accepted' | 'rejected'): void {
    const requests = this.getFriendRequests().map((r) =>
      r.id === id ? { ...r, status } : r
    );
    this.saveFriendRequests(requests);
  },

  getCurrentUserId(): string | null {
    return localStorage.getItem(CURRENT_USER_KEY);
  },

  setCurrentUserId(id: string): void {
    localStorage.setItem(CURRENT_USER_KEY, id);
  },

  clearCurrentUser(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  },
};
