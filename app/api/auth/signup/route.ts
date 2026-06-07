import { NextResponse } from 'next/server';
import { registerService } from '@/src/modules/auth/services/register.service';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const user = await registerService.register({ name, email, password });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }
    });
  } catch (error: any) {
    console.error('Signup API Error:', error.message);
    return NextResponse.json({ 
      error: error.message || 'Failed to create account' 
    }, { status: 500 });
  }
}
