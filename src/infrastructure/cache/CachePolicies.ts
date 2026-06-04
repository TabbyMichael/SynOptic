export const DefaultTTLs = {
  weatherCurrent: 15 * 60, // 15 minutes
  weatherForecast: 60 * 60, // 1 hour
  farmDetails: 10 * 60, // 10 minutes
  analysisResults: 24 * 60 * 60, // 24 hours
  analytics: 30 * 60, // 30 minutes
  alertRules: 5 * 60, // 5 minutes
}

export interface CachePolicyOptions {
  // multiplier to extend or shrink TTL based on quota pressure (1 = default)
  ttlMultiplier?: number
}

export class CachePolicies {
  static getTTL(keyType: keyof typeof DefaultTTLs, opts: CachePolicyOptions = {}): number {
    const base = DefaultTTLs[keyType]
    const multiplier = opts.ttlMultiplier ?? 1
    return Math.max(0, Math.floor(base * multiplier))
  }

  static forWeatherCurrent(opts?: CachePolicyOptions) {
    return this.getTTL('weatherCurrent', opts)
  }

  static forWeatherForecast(opts?: CachePolicyOptions) {
    return this.getTTL('weatherForecast', opts)
  }

  static forFarmDetails(opts?: CachePolicyOptions) {
    return this.getTTL('farmDetails', opts)
  }

  static forAnalysisResults(opts?: CachePolicyOptions) {
    return this.getTTL('analysisResults', opts)
  }
}

export default CachePolicies
