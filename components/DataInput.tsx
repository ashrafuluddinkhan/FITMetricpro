
import React, { useState, useMemo } from 'react';
import { WorkoutRecord } from '../types';
import { parseFitnessCSV } from '../dataProcessor';

interface DataInputProps {
  onAddData: (newData: WorkoutRecord[]) => void;
}

const DataInput: React.FC<DataInputProps> = ({ onAddData }) => {
  const [importText, setImportText] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Main form state
  const [form, setForm] = useState<Partial<WorkoutRecord>>({
    age: 30,
    gender: 'Male',
    weight: 70,
    height: 1.75,
    maxBPM: 180,
    avgBPM: 140,
    restingBPM: 65,
    duration: 1,
    calories: 500,
    workoutType: 'HIIT',
    fatPercentage: 20,
    waterIntake: 2,
    frequency: 3,
    experienceLevel: 1
  });

  // Scientific Calorie Calculation (HR-based)
  // Male: [(-55.0969 + (0.6309 x HR) + (0.1988 x W) + (0.2017 x A)) / 4.184] x T
  // Female: [(-20.4022 + (0.4472 x HR) - (0.1263 x W) + (0.074 x A)) / 4.184] x T
  const estimatedCalories = useMemo(() => {
    const hr = Number(form.avgBPM) || 0;
    const w = Number(form.weight) || 0;
    const a = Number(form.age) || 0;
    const t = (Number(form.duration) || 0) * 60; // in minutes

    if (hr <= 0 || w <= 0 || a <= 0 || t <= 0) return 0;

    let cal = 0;
    if (form.gender === 'Male') {
      cal = ((-55.0969 + (0.6309 * hr) + (0.1988 * w) + (0.2017 * a)) / 4.184) * t;
    } else {
      cal = ((-20.4022 + (0.4472 * hr) - (0.1263 * w) + (0.074 * a)) / 4.184) * t;
    }

    return Math.max(0, Math.round(cal));
  }, [form.avgBPM, form.weight, form.age, form.duration, form.gender]);

  const calculatedBMI = useMemo(() => {
    const h = Number(form.height);
    const w = Number(form.weight);
    if (h > 0 && w > 0) {
      const bmi = w / (h * h);
      return isFinite(bmi) ? bmi.toFixed(1) : '0.0';
    }
    return '0.0';
  }, [form.height, form.weight]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : parseFloat(value)) : value
    }));
  };

  const syncCalories = () => {
    setForm(prev => ({ ...prev, calories: estimatedCalories }));
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const record: WorkoutRecord = {
      ...form,
      age: Number(form.age) || 0,
      weight: Number(form.weight) || 0,
      height: Number(form.height) || 0,
      maxBPM: Number(form.maxBPM) || 0,
      avgBPM: Number(form.avgBPM) || 0,
      restingBPM: Number(form.restingBPM) || 0,
      duration: Number(form.duration) || 0,
      calories: Number(form.calories) || 0,
      fatPercentage: Number(form.fatPercentage) || 0,
      waterIntake: Number(form.waterIntake) || 0,
      frequency: Number(form.frequency) || 0,
      experienceLevel: Number(form.experienceLevel) || 0,
      bmi: parseFloat(calculatedBMI)
    } as WorkoutRecord;
    
    onAddData([record]);
    showSuccess('Record added successfully!');
  };

  const handleBulkImport = () => {
    const parsed = parseFitnessCSV(importText);
    if (parsed.length > 0) {
      onAddData(parsed);
      setImportText('');
      showSuccess(`Imported ${parsed.length} records!`);
    } else {
      showSuccess('No valid HIIT or Cardio records found.');
    }
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all";
  const readOnlyInputClass = "w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-600 outline-none cursor-not-allowed";
  const labelClass = "block text-xs font-bold text-slate-500 uppercase mb-1 ml-1";
  const sliderLabelClass = "flex justify-between text-[10px] font-bold mb-1.5 uppercase tracking-wider";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
      {/* Manual Entry Form */}
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            </div>
            <h2 className="text-xl font-bold text-slate-800">Log New Session</h2>
          </div>

          <form onSubmit={handleManualSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Age (years)</label>
                <input type="number" name="age" value={form.age} onChange={handleFormChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Gender Identity</label>
                <select name="gender" value={form.gender} onChange={handleFormChange} className={inputClass}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Workout Category</label>
                <select name="workoutType" value={form.workoutType} onChange={handleFormChange} className={inputClass}>
                  <option value="HIIT">HIIT</option>
                  <option value="Cardio">Cardio</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Body Weight (kg)</label>
                <input type="number" name="weight" step="0.1" value={form.weight} onChange={handleFormChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Height (meters)</label>
                <input type="number" name="height" step="0.01" value={form.height} onChange={handleFormChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Resulting BMI</label>
                <input 
                  type="text" 
                  value={calculatedBMI} 
                  readOnly 
                  className={readOnlyInputClass}
                  tabIndex={-1}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Duration (hours)</label>
                <input type="number" name="duration" step="0.1" value={form.duration} onChange={handleFormChange} className={inputClass} />
              </div>
              <div className="relative">
                <label className={labelClass}>Calories Burned</label>
                <input type="number" name="calories" value={form.calories} onChange={handleFormChange} className={inputClass} />
                <button 
                  type="button" 
                  onClick={syncCalories}
                  title="Apply precision estimate"
                  className="absolute right-2 top-7 p-1 text-blue-500 hover:text-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                </button>
              </div>
              <div>
                <label className={labelClass}>Average BPM</label>
                <input type="number" name="avgBPM" value={form.avgBPM} onChange={handleFormChange} className={inputClass} />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-slate-400 italic">
                {successMsg && <span className="text-green-500 font-bold animate-bounce block">✓ {successMsg}</span>}
              </div>
              <button 
                type="submit"
                className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all transform active:scale-95"
              >
                Log Session
              </button>
            </div>
          </form>
        </div>

        {/* Precision Burn Counter Tool */}
        <div className="bg-gradient-to-br from-slate-900 to-black rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden border border-white/5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full -mr-48 -mt-48 blur-[80px]"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full -ml-32 -mb-32 blur-[60px]"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-2xl font-black tracking-tight mb-1">Burn Intelligence</h3>
                <p className="text-slate-400 text-sm font-medium">Physiological performance estimation</p>
              </div>
              <div className="text-right flex flex-col items-end">
                <div className="flex items-baseline space-x-2">
                  <span className="text-5xl font-black text-blue-400 tracking-tighter tabular-nums leading-none">
                    {estimatedCalories}
                  </span>
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">kcal</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Primary Biometrics */}
              <div className="space-y-6">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Core Stats</h4>
                
                <div>
                  <div className={sliderLabelClass}>
                    <span className="text-slate-400">Age</span>
                    <span className="text-blue-400">{form.age} yrs</span>
                  </div>
                  <input type="range" name="age" min="12" max="100" value={form.age} onChange={handleFormChange} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                </div>

                <div>
                  <div className={sliderLabelClass}>
                    <span className="text-slate-400">Weight</span>
                    <span className="text-blue-400">{form.weight} kg</span>
                  </div>
                  <input type="range" name="weight" min="40" max="200" step="0.5" value={form.weight} onChange={handleFormChange} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                </div>

                <div>
                  <div className={sliderLabelClass}>
                    <span className="text-slate-400">Height (Impacts BMI)</span>
                    <span className="text-blue-400">{form.height} m</span>
                  </div>
                  <input type="range" name="height" min="1" max="2.5" step="0.01" value={form.height} onChange={handleFormChange} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                </div>
              </div>

              {/* Session Intensity */}
              <div className="space-y-6">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Performance</h4>
                
                <div>
                  <div className={sliderLabelClass}>
                    <span className="text-slate-400">Avg Heart Rate</span>
                    <span className="text-blue-400 font-mono">{form.avgBPM} BPM</span>
                  </div>
                  <input type="range" name="avgBPM" min="60" max="210" value={form.avgBPM} onChange={handleFormChange} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                </div>

                <div>
                  <div className={sliderLabelClass}>
                    <span className="text-slate-400">Duration</span>
                    <span className="text-blue-400 font-mono">{form.duration} hrs</span>
                  </div>
                  <input type="range" name="duration" min="0.1" max="5" step="0.1" value={form.duration} onChange={handleFormChange} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                </div>

                <div className="pt-2">
                  <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
                    <p className="text-[10px] text-slate-500 font-black uppercase mb-2">MET Score Estimate</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-200">{(estimatedCalories / (Number(form.duration) || 1)).toFixed(0)}</span>
                      <span className="text-[10px] font-bold text-slate-500">KCAL/HOUR</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status & Action */}
              <div className="flex flex-col">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Metabolic State</h4>
                
                <div className="flex-1 bg-white/[0.03] rounded-3xl p-6 border border-white/5 flex flex-col items-center justify-center text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-500 ${
                    Number(form.avgBPM) > 165 ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse' : 
                    Number(form.avgBPM) > 135 ? 'bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.3)]' : 
                    'bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                  }`}>
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  
                  <p className={`text-xl font-black mb-6 tracking-tight transition-colors ${
                    Number(form.avgBPM) > 165 ? 'text-red-400' : Number(form.avgBPM) > 135 ? 'text-orange-400' : 'text-green-400'
                  }`}>
                    {Number(form.avgBPM) > 165 ? 'Anaerobic' : Number(form.avgBPM) > 135 ? 'Cardiovascular' : 'Fat Oxidation'}
                  </p>

                  <button 
                    onClick={syncCalories}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-900/40 active:scale-95 flex items-center justify-center group"
                  >
                    Sync to Entry
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Import */}
      <div className="space-y-6">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 h-full flex flex-col">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
            </div>
            <h2 className="text-xl font-bold text-slate-800">CSV Import</h2>
          </div>
          
          <p className="text-sm text-slate-500 mb-4 leading-relaxed">
            Import records via CSV. Use headers: <strong>Weight (kg), Height (m), Workout_Type</strong>, etc.
          </p>
          
          <textarea 
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="Age,Gender,Weight (kg),Height (m),Max_BPM,Avg_BPM,Resting_BPM,Duration,Calories,Workout_Type..."
            className="flex-1 w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-mono outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none min-h-[300px]"
          />
          
          <button 
            onClick={handleBulkImport}
            disabled={!importText.trim()}
            className="w-full mt-4 bg-slate-800 text-white py-3 rounded-2xl font-bold hover:bg-slate-900 disabled:opacity-50 transition-all"
          >
            Process Bulk Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataInput;
