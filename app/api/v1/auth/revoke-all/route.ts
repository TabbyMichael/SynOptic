import { NextRequest, NextResponse } from 'next/server';
import { getAuthContext } from '@/src/modules/auth/utils/auth.guard';
import { revokeAllSessionsService } from '@/src/modules/auth/services/revokeAllSessions.service';

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthContext(req);
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    // Prefer the sid from auth context as the one to keep
    const exceptSessionId = auth.sid || body.exceptSessionId as string | undefined;
    
    const count = await revokeAllSessionsService.revokeAll(auth.userId, exceptSessionId);
    return NextResponse.json({ success: true, revoked: count });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

