import { NextResponse } from 'next/server'
import { getAuthFromRequest } from '@/modules/auth/utils/auth.guard'
import { adminService } from '@/modules/admin/services/admin.service'
import { z } from 'zod'

export async function GET(req: Request) {
  try {
    const { userId, role } = getAuthFromRequest(req as any)
    if (role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const url = new URL(req.url)
    const raw = {
      limit: url.searchParams.get('limit'),
      offset: url.searchParams.get('offset'),
      search: url.searchParams.get('search') || undefined,
    }

    const qp = z
      .object({
        limit: z.coerce.number().int().min(1).default(20),
        offset: z.coerce.number().int().min(0).default(0),
        search: z.string().optional(),
      })
      .parse(raw)

    const limit = qp.limit
    const offset = qp.offset
    const search = qp.search || ''

    const result = await adminService.listUsers({ limit, offset, search })
    return NextResponse.json({ data: result })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 })
  }
}

