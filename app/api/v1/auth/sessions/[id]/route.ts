import { NextResponse } from 'next/server';
import { getAuthFromRequest } from '@/modules/auth/utils/auth.guard';
import { revokeSessionService } from '@/modules/auth/services/revokeSession.service';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = getAuthFromRequest(req as any);
    const { id } = await params;
    await revokeSessionService.revoke(id, userId);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 401 });
  }
}

