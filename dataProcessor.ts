
import { WorkoutRecord } from './types';
import { RAW_CSV_DATA } from './constants';

const VALID_TYPES = ['HIIT', 'Cardio'];

export const parseFitnessCSV = (csv: string): WorkoutRecord[] => {
  const lines = csv.split('\n').map(l => l.trim()).filter(l => l);
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const record: any = {};
    
    values.forEach((val, idx) => {
      const header = headers[idx];
      if (!header) return;
      
      let cleanVal: string | number = val.trim();
      
      // Auto-correct 'HIT' to 'HIIT' if found in CSV
      if (header.includes('workout_type') && cleanVal.toUpperCase() === 'HIT') {
        cleanVal = 'HIIT';
      }

      // Convert to number if applicable, excluding non-numeric fields
      if (!isNaN(Number(cleanVal)) && !['gender', 'workout_type'].some(k => header.includes(k))) {
        cleanVal = Number(cleanVal);
      }
      
      // Mapping headers to specific WorkoutRecord properties
      if (header === 'age') record.age = cleanVal;
      else if (header === 'gender') record.gender = cleanVal;
      else if (header.includes('weight')) record.weight = cleanVal; // Handles "Weight (kg)"
      else if (header.includes('height')) record.height = cleanVal; // Handles "Height (m)"
      else if (header.includes('max_bpm')) record.maxBPM = cleanVal;
      else if (header.includes('avg_bpm')) record.avgBPM = cleanVal;
      else if (header.includes('resting_bpm')) record.restingBPM = cleanVal;
      else if (header.includes('duration')) record.duration = cleanVal;
      else if (header.includes('calories')) record.calories = cleanVal;
      else if (header.includes('workout_type')) record.workoutType = cleanVal;
      else if (header.includes('fat_percentage')) record.fatPercentage = cleanVal;
      else if (header.includes('water_intake')) record.waterIntake = cleanVal;
      else if (header.includes('frequency')) record.frequency = cleanVal;
      else if (header.includes('experience')) record.experienceLevel = cleanVal;
      else if (header.includes('bmi')) record.bmi = cleanVal;
    });
    
    return record as WorkoutRecord;
  }).filter(record => VALID_TYPES.includes(record.workoutType));
};

export const calculateSummary = (data: WorkoutRecord[]) => {
  if (data.length === 0) return {
    count: 0,
    avgCalories: 0,
    avgDuration: 0,
    avgBPM: 0,
    efficiency: 0,
    typeDistribution: []
  };

  const avgCalories = data.reduce((acc, curr) => acc + (curr.calories || 0), 0) / data.length;
  const avgDuration = data.reduce((acc, curr) => acc + (curr.duration || 0), 0) / data.length;
  const avgBPM = data.reduce((acc, curr) => acc + (curr.avgBPM || 0), 0) / data.length;
  const efficiency = avgDuration > 0 ? avgCalories / avgDuration : 0; 
  
  const workoutTypes = Array.from(new Set(data.map(d => d.workoutType).filter(type => VALID_TYPES.includes(type))));
  const typeDistribution = workoutTypes.map(type => {
    const subset = data.filter(d => d.workoutType === type);
    return {
      name: type,
      value: subset.length,
      avgCalories: subset.reduce((acc, curr) => acc + (curr.calories || 0), 0) / subset.length
    };
  });

  return {
    count: data.length,
    avgCalories,
    avgDuration,
    avgBPM,
    efficiency,
    typeDistribution
  };
};

export const getInitialData = () => parseFitnessCSV(RAW_CSV_DATA);
