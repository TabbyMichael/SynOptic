import { NextRequest } from 'next/server';
import { auth } from '@/src/infrastructure/auth/auth.config';
import { JwtUtils } from './jwt';

export interface AuthContext {
  userId: string;
  role: string;
  sid: string;
}

export async function getAuthContext(req: NextRequest): Promise<AuthContext | null> {
  // 1. Try NextAuth session
  const session = await auth();
  if (session?.user?.id) {
    return {
      userId: session.user.id,
      role: (session.user as any).role || 'FARMER',
      sid: '', // NextAuth doesn't expose sid easily in session by default here
    };
  }

  // 2. Try JWT from cookies
  const accessToken = req.cookies.get('accessToken')?.value;
  if (accessToken) {
    try {
      const payload = JwtUtils.verifyAccessToken(accessToken);
      return {
        userId: payload.sub,
        role: payload.role,
        sid: payload.sid,
      };
    } catch (e) {
      return null;
    }
  }

  return null;
}
