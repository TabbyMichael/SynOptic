import { NextRequest, NextResponse } from 'next/server';
import { getAuthContext } from '@/src/modules/auth/utils/auth.guard';
import { DrizzleAuditRepository } from '@/infrastructure/database/repositories/drizzle-repositories';

export async function GET(req: NextRequest) {
  try {
    const authContext = await getAuthContext(req);
    if (!authContext) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { userId } = authContext;
    const auditRepo = new DrizzleAuditRepository();
    const events = await auditRepo.findByUserId(userId);
    return NextResponse.json({ data: events });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 401 });
  }
}

export default GET;
