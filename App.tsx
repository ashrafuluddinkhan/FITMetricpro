
import React, { useState, useEffect } from 'react';
import { WorkoutRecord } from './types';
import { getInitialData } from './dataProcessor';
import Dashboard from './components/Dashboard';
import AIAssistant from './components/AIAssistant';
import DataInput from './components/DataInput';

const App: React.FC = () => {
  const [data, setData] = useState<WorkoutRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'ai' | 'entry'>('dashboard');

  useEffect(() => {
    // Simulate initial load
    const timer = setTimeout(() => {
      setData(getInitialData());
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleAddData = (newData: WorkoutRecord[]) => {
    setData(prev => [...newData, ...prev]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium animate-pulse">Loading Fitness Data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar-style Nav for Top */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-blue-200">
                 <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z"></path></svg>
              </div>
              <span className="text-xl font-black text-slate-800 tracking-tight">FitMetric<span className="text-blue-600">Pro</span></span>
            </div>
            
            <div className="flex items-center space-x-1 sm:space-x-4">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                Analytics
              </button>
              <button 
                onClick={() => setActiveTab('entry')}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'entry' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                Data Entry
              </button>
              <button 
                onClick={() => setActiveTab('ai')}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'ai' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                AI Assistant
              </button>
            </div>
            
            <div className="hidden md:flex items-center">
               <div className="flex items-center space-x-3 bg-slate-100 px-4 py-2 rounded-2xl">
                 <div className="w-8 h-8 rounded-full bg-slate-300"></div>
                 <div className="text-xs">
                    <p className="font-bold text-slate-700">Health Admin</p>
                    <p className="text-slate-500">Tier: Elite</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
            {activeTab === 'dashboard' && 'Performance Analytics'}
            {activeTab === 'entry' && 'Data Management'}
            {activeTab === 'ai' && 'Health Evaluation'}
          </h1>
          <p className="text-slate-500 max-w-2xl">
            {activeTab === 'dashboard' && 'Real-time breakdown of workout efficiency, heart rate distributions, and calorie burning patterns.'}
            {activeTab === 'entry' && 'Manually log your latest session or bulk import historical data to enrich your analytics profile.'}
            {activeTab === 'ai' && 'Advanced machine learning insights and actionable guidance tailored specifically to your physiology.'}
          </p>
        </header>

        {activeTab === 'dashboard' && <Dashboard data={data} />}
        {activeTab === 'entry' && <DataInput onAddData={handleAddData} />}
        {activeTab === 'ai' && <AIAssistant data={data} />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-slate-400 text-sm">
          <p>© 2024 FitMetric Pro AI. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-blue-500">Privacy Policy</a>
            <a href="#" className="hover:text-blue-500">Export Data</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
