'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/lib/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Eye, EyeOff } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import Image from 'next/image';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address').or(z.literal('')),
  password: z.string().min(6, 'Password must be at least 6 characters').or(z.literal('')),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface DemoAccount {
  label: string;
  email: string;
  role: string;
}

export function LoginForm() {
  const router = useRouter();
  const { login, loginWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoAccounts, setDemoAccounts] = useState<DemoAccount[]>([
    { label: 'Admin', email: 'kibuguian@gmail.com', role: 'Full system access' },
    { label: 'Farmer', email: 'farmer@agroinsight.ai', role: 'Farm management' },
  ]);

  useEffect(() => {
    async function fetchDemoUsers() {
      try {
        const response = await fetch('/api/auth/demo-users');
        if (response.ok) {
          const data = await response.json();
          setDemoAccounts(data);
        }
      } catch (err) {
        console.error('Failed to load demo accounts:', err);
      }
    }
    fetchDemoUsers();
  }, []);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginFormValues) => {
    if (!values.email || !values.password) {
        setError('Enter a valid email address and password.');
        return;
    }

    setLoading(true);
    setError('');
    try {
      const success = await login(values.email as string, values.password as string);
      if (!success) setError('Invalid email or password. Please try again.');
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError('Google sign-in failed. Please ensure your redirect URIs are correct.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    // 1. Get current form values to see if user typed something manually
    const currentEmail = form.getValues('email');
    const currentPassword = form.getValues('password');

    // 2. Prioritize manual input if fields are filled, otherwise use demo defaults
    const emailToUse = (currentEmail && currentEmail.length > 0) ? currentEmail : demoEmail;
    const passwordToUse = (currentPassword && currentPassword.length > 0) ? currentPassword : 'demo123';

    if (!emailToUse || !passwordToUse) {
        setError('Enter a valid email address and password.');
        return;
    }

    setLoading(true);
    setError('');
    try {
      const result = await login(emailToUse as string, passwordToUse as string);
      if (!result) {
        setError('Sign in failed. Invalid credentials for this account type.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg border-0 shadow-emerald-100/50 dark:shadow-emerald-950/20">
        <CardHeader className="text-center space-y-2 pb-2">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
            <Leaf className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <CardTitle className="text-2xl font-bold">{APP_NAME}</CardTitle>
          <CardDescription>Sign in to your farm intelligence platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button type="button" variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={loading}>
            <Image src="/Logos/google.png" alt="Google Logo" width={16} height={16} className="mr-2" />
            Sign in with Google
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@farm.ai"
                {...form.register('email')}
              />
              {form.formState.errors.email && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="/auth/reset-password" className="text-sm text-emerald-600 hover:underline dark:text-emerald-400">
                    Forgot password?
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  {...form.register('password')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 text-center font-medium animate-in fade-in slide-in-from-top-1">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <a href="/auth/signup" className="text-emerald-600 hover:underline dark:text-emerald-400">
              Sign up
            </a>
          </p>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Quick Access</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {demoAccounts.map((account) => (
              <button
                key={account.email}
                type="button"
                onClick={() => handleDemoLogin(account.email)}
                disabled={loading}
                className="flex flex-col items-center rounded-lg border p-3 text-sm transition-colors hover:bg-emerald-50 hover:border-emerald-200 dark:hover:bg-emerald-950/30 dark:hover:border-emerald-800 disabled:opacity-50"
              >
                <span className="font-medium">{account.label}</span>
                <span className="text-[10px] text-muted-foreground">{account.role}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
  );
}
