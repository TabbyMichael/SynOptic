export const mockHealthTrend = [
  { month: 'Jan', greenValley: 82, sunrise: 70, riftView: 48 },
  { month: 'Feb', greenValley: 84, sunrise: 71, riftView: 46 },
  { month: 'Mar', greenValley: 83, sunrise: 73, riftView: 47 },
  { month: 'Apr', greenValley: 86, sunrise: 72, riftView: 44 },
  { month: 'May', greenValley: 87, sunrise: 71, riftView: 45 },
  { month: 'Jun', greenValley: 87, sunrise: 72, riftView: 45 },
];

export const mockWeatherTrend = [
  { day: 'Mon', temp: 24, rain: 30 },
  { day: 'Tue', temp: 26, rain: 20 },
  { day: 'Wed', temp: 22, rain: 60 },
  { day: 'Thu', temp: 19, rain: 80 },
  { day: 'Fri', temp: 23, rain: 45 },
  { day: 'Sat', temp: 25, rain: 15 },
  { day: 'Sun', temp: 27, rain: 10 },
];

export const mockAlertFrequency = [
  { month: 'Jan', critical: 2, high: 5, medium: 8, low: 3 },
  { month: 'Feb', critical: 1, high: 3, medium: 6, low: 4 },
  { month: 'Mar', critical: 3, high: 7, medium: 9, low: 2 },
  { month: 'Apr', critical: 1, high: 4, medium: 5, low: 6 },
  { month: 'May', critical: 2, high: 6, medium: 7, low: 3 },
  { month: 'Jun', critical: 2, high: 5, medium: 4, low: 2 },
];

export const mockAnalysisHistory = [
  { month: 'Jan', analyses: 5 },
  { month: 'Feb', analyses: 8 },
  { month: 'Mar', analyses: 12 },
  { month: 'Apr', analyses: 7 },
  { month: 'May', analyses: 9 },
  { month: 'Jun', analyses: 6 },
];

export const mockRecentActivity = [
  { id: '1', action: 'Forestry analysis completed', farm: 'Green Valley Ranch', time: '2 hours ago', type: 'analysis' as const },
  { id: '2', action: 'Health score alert triggered', farm: 'Rift View Farm', time: '5 hours ago', type: 'alert' as const },
  { id: '3', action: 'New farm registered', farm: 'Lake Basin Holdings', time: '1 day ago', type: 'farm' as const },
  { id: '4', action: 'Weather forecast updated', farm: 'Sunrise Acres', time: '1 day ago', type: 'weather' as const },
  { id: '5', action: 'Alert rule updated', farm: 'Cedar Creek Farm', time: '2 days ago', type: 'alert' as const },
];
