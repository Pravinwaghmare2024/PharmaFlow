
import React, { useState } from 'react';
import { generateFollowUpEmail } from '../services/geminiService';

const AIMarketingAssist: React.FC = () => {
  const [customerName, setCustomerName] = useState('');
  const [context, setContext] = useState('');
  const [tone, setTone] = useState<'Professional' | 'Empathetic' | 'Technical' | 'Urgent'>('Professional');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!customerName || !context) return;
    setLoading(true);
    // Modified prompt with Tone
    const promptContext = `Tone: ${tone}. Details: ${context}`;
    const content = await generateFollowUpEmail(customerName, promptContext);
    setResult(content || '');
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    alert('Copied to clipboard!');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">AI Marketing Studio</h2>
        <p className="text-slate-500 mt-3 text-lg">Hyper-personalize pharma outreach with Gemini generative intelligence</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 flex items-center">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
              Configuration
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Target Customer</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all shadow-inner"
                  placeholder="Hospital Name / Doctor"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Interaction Tone</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Professional', 'Empathetic', 'Technical', 'Urgent'].map(t => (
                    <button 
                      key={t}
                      onClick={() => setTone(t as any)}
                      className={`py-2 rounded-xl text-[10px] font-bold transition-all border ${
                        tone === t ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white border-slate-200 text-slate-500 hover:border-blue-200 hover:text-blue-600'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Campaign Context</label>
                <textarea 
                  rows={5}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all shadow-inner"
                  placeholder="Describe the lead or past interactions..."
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                />
              </div>

              <button 
                onClick={handleGenerate}
                disabled={loading}
                className={`w-full py-4 rounded-2xl font-bold text-sm transition-all shadow-2xl ${
                  loading ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                ) : '✨ Generate Intelligent Draft'}
              </button>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-3xl shadow-xl text-white overflow-hidden relative group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <span className="text-8xl">🧬</span>
             </div>
             <h4 className="font-bold text-lg mb-2">Smart Assist Pro</h4>
             <p className="text-xs text-indigo-100 leading-relaxed mb-4">Gemini 3 Flash analyzes past inquiries to find the best angle for conversion.</p>
             <div className="flex items-center space-x-2 text-[10px] font-bold bg-white/10 w-fit px-3 py-1 rounded-full border border-white/20">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                <span>SYSTEM OPTIMIZED</span>
             </div>
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 flex-1 flex flex-col overflow-hidden min-h-[600px]">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50 backdrop-blur">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Composer View</span>
              </div>
              {result && (
                <div className="flex items-center space-x-4">
                   <button 
                    onClick={copyToClipboard}
                    className="text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors"
                  >
                    Copy Draft
                  </button>
                </div>
              )}
            </div>
            <div className="flex-1 p-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]">
              {result ? (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4">
                  <div className="prose prose-slate max-w-none text-slate-700 whitespace-pre-wrap leading-loose font-medium font-serif italic text-lg">
                    {result}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 italic">
                  <div className="text-7xl mb-6 grayscale opacity-50 animate-pulse">📝</div>
                  <p className="text-lg font-medium text-slate-400">Configure parameters to generate strategy</p>
                  <p className="text-xs mt-2 text-slate-300">Gemini will draft high-impact pharmaceutical marketing copy</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIMarketingAssist;
