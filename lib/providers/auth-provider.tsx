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
import { signIn, signOut, useSession, SessionProvider } from 'next-auth/react';
import type { User, Role } from '@/lib/types';

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
  switchRole: (role: Role) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function AuthProviderInner({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const isLoading = status === 'loading';

  useEffect(() => {
    if (session?.user) {
      setUser({
        id: (session.user as any).id || '',
        email: session.user.email || '',
        name: session.user.name || '',
        role: (session.user as any).role || 'FARMER',
        createdAt: new Date().toISOString(),
      });
    } else {
      setUser(null);
    }
  }, [session]);

  const login = useCallback(async (email: string, _password: string) => {
    const result = await signIn('credentials', {
        email,
        password: _password,
        redirect: false,
    });
    
    if (result?.error) {
        console.error('Login Error:', result.error);
        return false;
    }
    
    router.push('/dashboard');
    return true;
  }, [router]);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      // Automatically sign in after signup
      return login(email, password);
    } catch (error: any) {
      console.error('Signup Error:', error.message);
      throw error;
    }
  }, [login]);

  const loginWithGoogle = useCallback(async () => {
    try {
      const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
      const { auth } = await import('@/lib/firebase');

      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });

      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      // 1. Sync Firebase user with our Database
      const syncResponse = await fetch('/api/auth/firebase-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          name: user.displayName,
          idToken: idToken,
        }),
      });

      if (!syncResponse.ok) {
        throw new Error('Failed to sync user data');
      }

      // 2. Sign in to NextAuth session using the credentials provider with the Firebase bypass
      const nextAuthResult = await signIn('credentials', {
        email: user.email,
        isFirebase: 'true',
        redirect: false,
      });

      if (nextAuthResult?.error) {
        throw new Error(nextAuthResult.error);
      }

      router.push('/dashboard');
      return true;
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        return false;
      }
      console.error('Google Auth Error:', error);
      return false;
    }
  }, [router]);


  const logout = useCallback(async () => {
    try {
      await signOut({ callbackUrl: '/auth/login' });
    } catch (error) {
      console.error('Logout Error:', error);
    }
  }, []);

  const switchRole = useCallback((role: Role) => {}, []);

  return (
    <AuthContext.Provider
      value={{ user, login, signup, loginWithGoogle, logout, switchRole, isAuthenticated: !!user, isLoading }}
    >
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen bg-background">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            <p className="text-sm font-medium text-muted-foreground animate-pulse">Securing session...</p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <AuthProviderInner>
                {children}
            </AuthProviderInner>
        </SessionProvider>
    );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
