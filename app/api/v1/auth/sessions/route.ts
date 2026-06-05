import { NextRequest, NextResponse } from 'next/server';
import { getAuthContext } from '@/src/modules/auth/utils/auth.guard';
import { getSessionsService } from '@/src/modules/auth/services/getSessions.service';

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthContext(req);
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);
    
    const data = await getSessionsService.listForUser(auth.userId, limit, offset);
    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
