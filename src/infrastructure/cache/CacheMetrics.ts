type Counters = Record<string, number>
type Gauges = Record<string, number>

export class CacheMetrics {
  private counters: Counters = {}
  private gauges: Gauges = {}

  increment(name: string, value = 1) {
    this.counters[name] = (this.counters[name] || 0) + value
  }

  gauge(name: string, value: number) {
    this.gauges[name] = value
  }

  snapshot() {
    return { counters: { ...this.counters }, gauges: { ...this.gauges } }
  }

  toPrometheus(): string {
    const lines: string[] = []
    for (const [k, v] of Object.entries(this.counters)) {
      lines.push(`# TYPE ${k} counter`)
      lines.push(`${k} ${v}`)
    }
    for (const [k, v] of Object.entries(this.gauges)) {
      lines.push(`# TYPE ${k} gauge`)
      lines.push(`${k} ${v}`)
    }
    return lines.join('\n')
  }
}

export default CacheMetrics
