import { describe, it, expect } from 'vitest'
import CachePolicies, { DefaultTTLs } from '../../src/infrastructure/cache/CachePolicies'

describe('CachePolicies', () => {
  it('returns configured default ttls', () => {
    expect(CachePolicies.forWeatherCurrent()).toBe(DefaultTTLs.weatherCurrent)
    expect(CachePolicies.forWeatherForecast()).toBe(DefaultTTLs.weatherForecast)
    expect(CachePolicies.forAnalysisResults()).toBe(DefaultTTLs.analysisResults)
  })

  it('applies multiplier', () => {
    expect(CachePolicies.getTTL('weatherCurrent', { ttlMultiplier: 2 })).toBe(DefaultTTLs.weatherCurrent * 2)
  })
})
