'use client';

import { useState } from 'react';
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

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const demoAccounts = [
  { label: 'Admin', email: 'admin@agroinsight.ai', role: 'Full system access' },
  { label: 'Farmer', email: 'farmer@agroinsight.ai', role: 'Farm management' },
];

export function LoginForm() {
  const router = useRouter();
  const { login, loginWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    setError('');
    try {
      const success = await login(values.email, values.password);
      if (success) router.push('/dashboard');
      else setError('Invalid credentials');
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await loginWithGoogle();
      router.push('/dashboard');
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (email: string) => {
    setLoading(true);
    setError('');
    try {
      await login(email, 'demo123');
      router.push('/dashboard');
    } catch {
      setError('An error occurred. Please try again.');
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Button type="button" variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={loading}>
              <img src="/Logos/google.png" alt="Google Logo" className="mr-2 h-4 w-4" />
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
              <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
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
              <span className="bg-card px-2 text-muted-foreground">Demo accounts</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {demoAccounts.map((account) => (
              <button
                key={account.email}
                type="button"
                onClick={() => handleDemoLogin(account.email)}
                className="flex flex-col items-center rounded-lg border p-3 text-sm transition-colors hover:bg-emerald-50 hover:border-emerald-200 dark:hover:bg-emerald-950/30 dark:hover:border-emerald-800"
              >
                <span className="font-medium">{account.label}</span>
                <span className="text-xs text-muted-foreground">{account.role}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
  );
}
