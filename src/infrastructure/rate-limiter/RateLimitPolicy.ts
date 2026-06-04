export type Role = 'anonymous' | 'farmer' | 'admin'

export interface RateLimitRule {
  limit: number
  windowSeconds: number
}

export const DefaultPolicies: Record<Role, RateLimitRule> = {
  anonymous: { limit: 100, windowSeconds: 60 * 60 },
  farmer: { limit: 1000, windowSeconds: 60 * 60 },
  admin: { limit: 5000, windowSeconds: 60 * 60 },
}

export const SpecialRoutes = {
  authLogin: { limit: 5, windowSeconds: 15 * 60 },
  imageUpload: { limit: 20, windowSeconds: 60 * 60 },
}

export default RateLimitPolicy
