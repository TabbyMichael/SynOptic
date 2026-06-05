import { NextRequest, NextResponse } from 'next/server';
import { getAuthContext } from '@/src/modules/auth/utils/auth.guard';
import { revokeSessionService } from '@/src/modules/auth/services/revokeSession.service';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthContext(req);
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await revokeSessionService.revoke(id, auth.userId);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
