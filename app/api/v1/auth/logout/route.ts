import { NextRequest, NextResponse } from 'next/server';
import { revokeSessionService } from '@/src/modules/auth/services/revokeSession.service';
import { JwtUtils } from '@/src/modules/auth/utils/jwt';
import { logger } from '@/src/infrastructure/logger/logger.service';

export async function POST(req: NextRequest) {
  try {
    const accessToken = req.cookies.get('accessToken')?.value;
    
    if (accessToken) {
      try {
        const payload = JwtUtils.verifyAccessToken(accessToken);
        await revokeSessionService.revoke(payload.sid, payload.sub);
      } catch (e) {
        // Token might be expired, try refresh token
        const refreshToken = req.cookies.get('refreshToken')?.value;
        if (refreshToken) {
          const payload = JwtUtils.verifyRefreshToken(refreshToken);
          await revokeSessionService.revoke(payload.sid, payload.sub);
        }
      }
    }

    const response = NextResponse.json({ message: 'Logged out' });
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');

    return response;
  } catch (error: any) {
    logger.error({ msg: 'Logout error', error: error.message });
    const response = NextResponse.json({ message: 'Logged out' });
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');
    return response;
  }
}
