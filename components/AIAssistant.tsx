
import React, { useState } from 'react';
import { getFitnessInsights, chatWithFitnessExpert } from '../geminiService';
import { InsightReport, WorkoutRecord } from '../types';

interface AIAssistantProps {
  data: WorkoutRecord[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({ data }) => {
  const [insight, setInsight] = useState<InsightReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatQuery, setChatQuery] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [isChatting, setIsChatting] = useState(false);

  const generateReport = async () => {
    setIsGenerating(true);
    const summaryStr = JSON.stringify(data.slice(0, 100).map(d => ({
        type: d.workoutType,
        cal: d.calories,
        dur: d.duration,
        bpm: d.avgBPM
    })));
    const report = await getFitnessInsights(summaryStr);
    if (report) setInsight(report);
    setIsGenerating(false);
  };

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatQuery.trim()) return;
    setIsChatting(true);
    const context = `Total records: ${data.length}. Avg Cal: 850. Avg BPM: 145.`;
    const response = await chatWithFitnessExpert(chatQuery, context);
    setChatResponse(response || '');
    setIsChatting(false);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-2 space-y-6">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl text-white shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Smart Insights Evaluation</h2>
              <p className="text-blue-100 text-sm opacity-90">Powered by Gemini AI Engine</p>
            </div>
            <button 
              onClick={generateReport}
              disabled={isGenerating}
              className="bg-white text-blue-600 px-6 py-2.5 rounded-xl font-bold hover:bg-blue-50 transition-colors disabled:opacity-50"
            >
              {isGenerating ? 'Analyzing...' : 'Generate Insights'}
            </button>
          </div>

          {!insight ? (
            <div className="py-12 text-center border-2 border-dashed border-blue-400 rounded-2xl">
              <p className="text-blue-100 italic">No report generated. Click the button above to evaluate your data.</p>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10 text-center">
                  <p className="text-xs uppercase tracking-wider font-semibold opacity-70 mb-1">Efficiency</p>
                  <p className="text-2xl font-bold">{insight.metrics.efficiency}%</p>
                </div>
                <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10 text-center">
                  <p className="text-xs uppercase tracking-wider font-semibold opacity-70 mb-1">Intensity</p>
                  <p className="text-2xl font-bold">{insight.metrics.intensity}%</p>
                </div>
                <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10 text-center">
                  <p className="text-xs uppercase tracking-wider font-semibold opacity-70 mb-1">Hydration</p>
                  <p className="text-2xl font-bold">{insight.metrics.hydrationAdequacy}%</p>
                </div>
              </div>
              
              <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/10">
                <h4 className="font-bold mb-2 flex items-center">
                  <span className="mr-2">💡</span> Executive Summary
                </h4>
                <p className="text-sm text-blue-50 leading-relaxed">{insight.summary}</p>
              </div>

              <div>
                <h4 className="font-bold mb-3 flex items-center">
                   <span className="mr-2">📈</span> Recommendations
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {insight.recommendations.map((rec, i) => (
                    <li key={i} className="bg-white/10 px-4 py-2 rounded-lg text-sm flex items-start">
                      <span className="text-blue-300 mr-2">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col h-full">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a.5.5 0 01-1 0V5a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h3a.5.5 0 010 1H4a2 2 0 01-2-2V5zm12.95 8.95c.117-.115.12-.302.008-.42l-2.24-2.4a.5.5 0 11.732-.68l2.24 2.4a.5.5 0 01-.008.68c-.115.117-.302.12-.42.008l-2.24-2.4a.5.5 0 01.732-.68l2.24 2.4a.5.5 0 01-.008.68z"></path></svg>
          Fitness Expert Chat
        </h3>
        
        <div className="flex-1 bg-slate-50 rounded-2xl p-4 mb-4 overflow-y-auto text-sm min-h-[300px]">
          {chatResponse ? (
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 leading-relaxed">
               {chatResponse}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 italic px-8 text-center">
              Ask questions like "How does HIIT affect my weight loss?" or "Compare my BMI trends."
            </div>
          )}
          {isChatting && <div className="mt-4 text-blue-500 font-medium animate-pulse">Expert is typing...</div>}
        </div>

        <form onSubmit={handleChat} className="relative">
          <input 
            type="text" 
            value={chatQuery}
            onChange={(e) => setChatQuery(e.target.value)}
            placeholder="Ask anything..."
            className="w-full bg-slate-100 border-none rounded-2xl py-3 pl-4 pr-12 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
          <button 
            type="submit"
            className="absolute right-2 top-1.5 p-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;
