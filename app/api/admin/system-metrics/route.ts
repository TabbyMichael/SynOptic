import { NextRequest, NextResponse } from 'next/server'
import { getAuthContext } from '@/src/modules/auth/utils/auth.guard'
import { adminService } from '@/modules/admin/services/admin.service'

export async function GET(req: NextRequest) {
  try {
    const authContext = await getAuthContext(req)
    if (!authContext || authContext.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const metrics = await adminService.getSystemMetrics()
    return NextResponse.json({ data: metrics })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 })
  }
}

