import { NextResponse } from 'next/server';
import { userRepository } from '@/src/repositories/user.repository';

export async function GET() {
  try {
    const demoUsers = await userRepository.findDemoUsers();
    
    // Transform to the format expected by the frontend
    const demoAccounts = demoUsers.map(user => ({
      label: user.role === 'ADMIN' ? 'Admin' : 'Farmer',
      email: user.email,
      role: user.role === 'ADMIN' ? 'Full system access' : 'Farm management'
    }));

    // If no users in DB yet, return the default ones as fallback
    if (demoAccounts.length === 0) {
        return NextResponse.json([
            { label: 'Admin', email: 'kibuguian@gmail.com', role: 'Full system access' },
            { label: 'Farmer', email: 'farmer@agroinsight.ai', role: 'Farm management' },
        ]);
    }

    return NextResponse.json(demoAccounts);
  } catch (error) {
    console.error('Failed to fetch demo users:', error);
    return NextResponse.json({ error: 'Failed to fetch demo users' }, { status: 500 });
  }
}
