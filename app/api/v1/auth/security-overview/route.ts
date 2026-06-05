import { NextRequest, NextResponse } from 'next/server';
import { getAuthContext } from '@/src/modules/auth/utils/auth.guard';
import { getSecurityOverviewService } from '@/modules/auth/services/getSecurityOverview.service';

export async function GET(req: NextRequest) {
  try {
    const authContext = await getAuthContext(req);
    if (!authContext) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { userId } = authContext;
    const overview = await getSecurityOverviewService.overviewForUser(userId);
    return NextResponse.json({ data: overview });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 401 });
  }
}

