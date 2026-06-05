'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf } from 'lucide-react';

const resetSchema = z.object({
  email: z.string().email('Enter a valid email address'),
});

type ResetFormValues = z.infer<typeof resetSchema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (values: ResetFormValues) => {
    setLoading(true);
    // TODO: Implement password reset logic
    console.log(values);
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <Card className="w-full max-w-md shadow-lg border-0 shadow-emerald-100/50 dark:shadow-emerald-950/20">
      <CardHeader className="text-center space-y-2 pb-2">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
          <Leaf className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <CardTitle className="text-2xl font-bold">Reset password</CardTitle>
        <CardDescription>
          {submitted ? 'Check your email for further instructions.' : 'Enter your email to receive a password reset link.'}
        </CardDescription>
      </CardHeader>
      {!submitted && (
        <CardContent className="space-y-4">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@farm.ai" {...form.register('email')} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending link...' : 'Send reset link'}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground">
            <a href="/auth/login" className="text-emerald-600 hover:underline dark:text-emerald-400">
              Back to sign in
            </a>
          </p>
        </CardContent>
      )}
    </Card>
  );
}
