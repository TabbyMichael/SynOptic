import { NextRequest, NextResponse } from 'next/server';
import { refreshService } from '@/src/modules/auth/services/refresh.service';
import { logger } from '@/src/infrastructure/logger/logger.service';

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: 'Refresh token missing' }, { status: 401 });
    }

    const { accessToken, refreshToken: newRefreshToken } = await refreshService.refresh(refreshToken);

    const response = NextResponse.json({ accessToken });

    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60,
    });

    response.cookies.set('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    logger.error({ msg: 'Refresh error', error: error.message });
    return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
  }
}
