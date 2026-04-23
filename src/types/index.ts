export type JournalVisibility = 'private' | 'friends' | 'public';

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
  bio: string;
  createdAt: string;
  friendIds: string[];
}

export interface Journal {
  id: string;
  userId: string;
  title: string;
  content: string;
  visibility: JournalVisibility;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  currentUser: User | null;
  isLoggedIn: boolean;
}
