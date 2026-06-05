import { NextResponse } from 'next/server';
import { registerService } from '@/src/modules/auth/services/register.service';
import { registerSchema } from '@/src/modules/auth/dtos/auth.dto';
import { logger } from '@/src/infrastructure/logger/logger.service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = registerSchema.parse(body);

    const user = await registerService.register(validated);

    return NextResponse.json({ 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    }, { status: 201 });
  } catch (error: any) {
    logger.error({ msg: 'Registration error', error: error.message });
    return NextResponse.json({ error: error.message || 'Registration failed' }, { status: 400 });
  }
}
