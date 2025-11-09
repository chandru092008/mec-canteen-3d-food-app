export interface User {
  id: number;
  email: string;
  role: 'student' | 'admin';
  fullName: string;
  studentId?: string;
  phone?: string;
  walletBalance: number;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
}

export function getStoredAuth(): User | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('auth_user');
  return stored ? JSON.parse(stored) : null;
}

export function setStoredAuth(user: User | null) {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem('auth_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('auth_user');
  }
}

export function clearAuth() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_user');
  localStorage.removeItem('cart');
}
