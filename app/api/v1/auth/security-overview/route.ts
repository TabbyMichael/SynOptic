import { NextResponse } from 'next/server';
import { getAuthFromRequest } from '@/modules/auth/utils/auth.guard';
import { getSecurityOverviewService } from '@/modules/auth/services/getSecurityOverview.service';

export async function GET(req: Request) {
  try {
    const { userId } = getAuthFromRequest(req as any);
    const overview = await getSecurityOverviewService.overviewForUser(userId);
    return NextResponse.json({ data: overview });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 401 });
  }
}

export default GET;
