import { NextResponse } from 'next/server';
import { getAuthFromRequest } from '@/modules/auth/utils/auth.guard';
import { DrizzleAuditRepository } from '@/infrastructure/database/repositories/drizzle-repositories';

export async function GET(req: Request) {
  try {
    const { userId } = getAuthFromRequest(req as any);
    const auditRepo = new DrizzleAuditRepository();
    const events = await auditRepo.findByUserId(userId);
    return NextResponse.json({ data: events });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 401 });
  }
}

export default GET;
