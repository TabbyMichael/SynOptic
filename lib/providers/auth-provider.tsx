'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import type { User, Role } from '@/lib/types';

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
  switchRole: (role: Role) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const MOCK_USERS: Record<Role, User> = {
  ADMIN: {
    id: 'usr-admin-1',
    email: 'admin@agroinsight.ai',
    name: 'Sarah Mwangi',
    role: 'ADMIN',
    createdAt: '2024-01-15T08:00:00Z',
  },
  FARMER: {
    id: 'usr-farmer-1',
    email: 'farmer@agroinsight.ai',
    name: 'James Ochieng',
    role: 'FARMER',
    createdAt: '2024-03-22T10:30:00Z',
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial auth check
  useEffect(() => {
    return onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || '',
          role: 'FARMER',
          createdAt: new Date().toISOString(),
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
  }, []);

  const login = useCallback(async (email: string, _password: string) => {
    if (email === MOCK_USERS.ADMIN.email) {
      setUser(MOCK_USERS.ADMIN);
      return true;
    }
    if (email === MOCK_USERS.FARMER.email) {
      setUser(MOCK_USERS.FARMER);
      return true;
    }
    setUser(MOCK_USERS.FARMER);
    return true;
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      return true;
    } catch (error) {
      console.error('Google Auth Error:', error);
      setIsLoading(false);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    await auth.signOut();
  }, []);

  const switchRole = useCallback((role: Role) => {
    setUser(MOCK_USERS[role]);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, loginWithGoogle, logout, switchRole, isAuthenticated: !!user, isLoading }}
    >
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen bg-background">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
