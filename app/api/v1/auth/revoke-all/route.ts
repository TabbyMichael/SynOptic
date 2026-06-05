import { NextResponse } from 'next/server';
import { getAuthFromRequest } from '@/modules/auth/utils/auth.guard';
import { revokeAllSessionsService } from '@/modules/auth/services/revokeAllSessions.service';

export async function POST(req: Request) {
  try {
    const { userId } = getAuthFromRequest(req as any);
    const body = await req.json().catch(() => ({}));
    const exceptSessionId = body.exceptSessionId as string | undefined;
    const count = await revokeAllSessionsService.revokeAll(userId, exceptSessionId);
    return NextResponse.json({ success: true, revoked: count });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 401 });
  }
}

