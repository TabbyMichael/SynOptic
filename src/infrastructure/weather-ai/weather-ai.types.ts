export interface WeatherAiCurrentResponse {
  // Original flat properties for compatibility
  temp: number;
  humidity: number;
  wind_speed: number;
  rain: number;
  pressure: number;
  timestamp: string;
  condition?: string;
  icon?: string;
  
  // My new nested structure for modern usages
  location?: {
    lat: number;
    lon: number;
    timezone: string;
  };
  current?: {
    temperature: number;
    condition_code: string;
    humidity: number;
    wind_speed: number;
    feels_like: number;
    icon: string;
  };
  insight?: string;
}

export interface WeatherAiForecastResponse {
  daily: Array<{
    date: string;
    temp_min: number;
    temp_max: number;
    precipitation_probability: number;
    condition_code: string;
    icon: string;
    wind_speed?: number;
    
    // Compatibility fields if any
    day?: string;
    high?: number;
    low?: number;
    rainChance?: number;
  }>;
}

export interface WeatherAiUsageResponse {
  plan: string;
  requests_used: number;
  requests_remaining: number;
  ai_requests_used: number;
  ai_requests_remaining: number;
  billing_period_start: string;
  billing_period_end: string;
}

export interface WeatherAiForestryResponse {
  // Original fields
  id: string;
  tree_stats: {
    total: number;
    healthy: number;
    unhealthy: number;
    dead: number;
  };
  coverage: {
    canopy: number;
    density: number;
  };
  score: number;
  overlay: string;

  // New fields
  analysis_id?: string;
  total_tree_count?: number;
  canopy_coverage_pct?: number;
  confidence_score?: number;
  original_image_url?: string;
  overlay_image_url?: string;
  observations?: string[];
  recommendations?: string[];
}
