import { z } from 'zod'

export const createSessionSchema = z.object({
  deviceName: z.string().optional(),
  browser: z.string().optional(),
  operatingSystem: z.string().optional(),
  userAgent: z.string().optional(),
  ipAddress: z.string().optional(),
  location: z.record(z.any()).optional(),
  trusted: z.boolean().optional(),
})

export const revokeSessionSchema = z.object({
  id: z.string().uuid(),
})

export default createSessionSchema
