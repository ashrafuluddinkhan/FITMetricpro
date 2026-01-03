
export interface WorkoutRecord {
  age: number;
  gender: 'Male' | 'Female';
  weight: number;
  height: number;
  maxBPM: number;
  avgBPM: number;
  restingBPM: number;
  duration: number;
  calories: number;
  workoutType: string;
  fatPercentage: number;
  waterIntake: number;
  frequency: number;
  experienceLevel: number;
  bmi: number;
}

export interface MetricCardData {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  description: string;
}

export interface InsightReport {
  summary: string;
  metrics: {
    efficiency: number;
    intensity: number;
    hydrationAdequacy: number;
  };
  recommendations: string[];
}
