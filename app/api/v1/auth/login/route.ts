import { NextResponse } from 'next/server';
import { loginService } from '@/src/modules/auth/services/login.service';
import { loginSchema } from '@/src/modules/auth/dtos/auth.dto';
import { logger } from '@/src/infrastructure/logger/logger.service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = loginSchema.parse(body);

    const userAgent = req.headers.get('user-agent') || 'unknown';
    const ipAddress = req.headers.get('x-forwarded-for') || '127.0.0.1';

    // Simple parser for device info
    const deviceInfo = {
      deviceName: userAgent.split('(')[1]?.split(';')[0] || 'Desktop',
      browser: userAgent.includes('Chrome') ? 'Chrome' : 'Browser',
      operatingSystem: userAgent.includes('Windows') ? 'Windows' : 'OS',
      userAgent,
      ipAddress,
    };

    const { user, accessToken, refreshToken } = await loginService.login(validated, deviceInfo);

    const response = NextResponse.json({ user, accessToken });

    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutes
    });

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    logger.error({ msg: 'Login error', error: error.message });
    return NextResponse.json({ error: error.message || 'Invalid credentials' }, { status: 401 });
  }
}
