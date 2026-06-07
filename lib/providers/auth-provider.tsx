'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth as firebaseAuth } from '@/lib/firebase';
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    return onAuthStateChanged(firebaseAuth, (firebaseUser) => {
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
    return false;
  }, []);

  const loginWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(firebaseAuth, provider);
      return true;
    } catch (error) {
      console.error('Google Auth Error:', error);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(firebaseAuth);
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout Error:', error);
    }
  }, [router]);

  const switchRole = useCallback((role: Role) => {}, []);

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
