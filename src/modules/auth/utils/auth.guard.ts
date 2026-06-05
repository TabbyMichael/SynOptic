import { NextRequest } from 'next/server'
import { UnauthorizedError } from '@/shared/errors/domain-errors'

export interface AuthContext {
  userId: string
  role: string
}

/**
 * Lightweight authentication guard used in API routes until app-wide auth is integrated.
 * In production, replace this with proper JWT/NextAuth session extraction.
 */
export function getAuthFromRequest(req: Request | NextRequest): AuthContext {
  // Prefer headers set by reverse proxy or middleware
  const headers: any = (req as any).headers || (typeof req === 'object' && (req as any).headers) || {}
  // Node fetch Request uses get() method
  const getHeader = (name: string) => {
    if (typeof headers.get === 'function') return headers.get(name)
    return headers[name] || headers[name.toLowerCase()]
  }

  const userId = getHeader('x-user-id') || getHeader('x-user')
  const role = getHeader('x-user-role') || 'FARMER'
  if (!userId) throw new UnauthorizedError('Missing authentication')
  return { userId, role }
}

export default getAuthFromRequest
