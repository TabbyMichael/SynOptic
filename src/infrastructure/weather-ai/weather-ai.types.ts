export interface WeatherAiCurrentResponse {
  temp: number;
  humidity: number;
  wind_speed: number;
  rain: number;
  pressure: number;
  timestamp: string;
}

export interface WeatherAiForestryResponse {
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
}

export interface WeatherAiErrorResponse {
  error: string;
  code: string;
}
