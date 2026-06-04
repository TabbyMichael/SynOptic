export const CacheKeys = {
  weatherCurrent: (farmId: string) => `weather:current:${farmId}`,
  weatherForecast: (farmId: string) => `weather:forecast:${farmId}`,
  analysis: (analysisId: string) => `analysis:${analysisId}`,
  farm: (farmId: string) => `farm:${farmId}`,
  alerts: (farmId: string) => `alerts:${farmId}`,
  analytics: (farmId: string) => `analytics:${farmId}`,
}

export type CacheKeyFactory = typeof CacheKeys[keyof typeof CacheKeys]

export default CacheKeys
