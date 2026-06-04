import { NextResponse } from 'next/server';
import { getAuthFromRequest } from '@/modules/auth/utils/auth.guard';
import { getSessionsService } from '@/modules/auth/services/getSessions.service';

export async function GET(req: Request) {
  try {
    const { userId } = getAuthFromRequest(req as any);
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);
    const data = await getSessionsService.listForUser(userId, limit, offset);
    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 401 });
  }
}

export default GET;
