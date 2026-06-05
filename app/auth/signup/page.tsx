'use client';

import { SignupForm } from '@/components/signup-form';

export default function SignupPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        <SignupForm />
      </div>
      <div 
        className="relative hidden lg:block bg-muted bg-cover bg-center"
        style={{ backgroundImage: 'url(/assets/auth/login-hero.jpg)' }}
      >
        <div className="absolute inset-0 bg-emerald-900/20" />
        <div className="absolute inset-0 flex items-end p-12">
            <p className="text-white text-lg font-medium">Farm intelligence that combines forestry, weather, and monitoring.</p>
        </div>
      </div>
    </div>
  );
}
