import { NextRequest, NextResponse } from 'next/server'
import { getAuthContext } from '@/src/modules/auth/utils/auth.guard'
import { adminService } from '@/modules/admin/services/admin.service'
import { db } from '@/infrastructure/database/db.service'
import { z } from 'zod'

export async function GET(req: NextRequest) {
  try {
    const authContext = await getAuthContext(req)
    if (!authContext || authContext.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const url = new URL(req.url)
    const raw = {
      limit: url.searchParams.get('limit'),
      offset: url.searchParams.get('offset'),
      userId: url.searchParams.get('userId') || undefined,
      action: url.searchParams.get('action') || undefined,
    }

    const qp = z
      .object({
        limit: z.coerce.number().int().min(1).default(50),
        offset: z.coerce.number().int().min(0).default(0),
        userId: z.string().optional(),
        action: z.string().optional(),
      })
      .parse(raw)

    const limit = qp.limit
    const offset = qp.offset
    const filterUserId = qp.userId
    const action = qp.action

    const result = await adminService.getAuditLogs({ limit, offset, userId: filterUserId || undefined, action: action || undefined })
    return NextResponse.json({ data: result })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 })
  }
}

export default GET
