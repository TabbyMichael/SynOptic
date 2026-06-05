import { NextRequest, NextResponse } from 'next/server';
import { JwtUtils } from '@/src/modules/auth/utils/jwt';
import { userRepository } from '@/src/repositories/user.repository';
import { logger } from '@/src/infrastructure/logger/logger.service';

export async function GET(req: NextRequest) {
  try {
    const accessToken = req.cookies.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = JwtUtils.verifyAccessToken(accessToken);
    const user = await userRepository.findById(payload.sub);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error: any) {
    logger.error({ msg: 'Me error', error: error.message });
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
