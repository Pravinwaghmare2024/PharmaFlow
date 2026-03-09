
import React, { useState } from 'react';

interface CommercialActivationProps {
  onActivate: (key: string) => void;
}

const CommercialActivation: React.FC<CommercialActivationProps> = ({ onActivate }) => {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsValidating(true);

    // Simulated validation logic
    // For demo purposes, any key starting with "PHARMA-" and having 16 chars total is "valid"
    // Or just a specific key: PHARMA-PRO-2024-ACTIVE
    setTimeout(() => {
      if (key.toUpperCase() === 'PHARMA-PRO-2024-ACTIVE' || (key.startsWith('PHARMA-') && key.length >= 15)) {
        onActivate(key.toUpperCase());
      } else {
        setError('Invalid License Key. Please contact support@pharmaflow.com for a valid commercial license.');
        setIsValidating(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 rounded-full blur-[120px]"></div>
      
      <div className="w-full max-w-lg z-10">
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden">
          <div className="p-10 text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-blue-600/20 border border-blue-500/30 mb-4">
              <span className="text-4xl">🛡️</span>
            </div>
            
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Commercial Activation</h1>
              <p className="text-slate-400 mt-2 text-sm">Enter your enterprise license key to unlock the full potential of PharmaFlow CRM.</p>
            </div>

            <form onSubmit={handleActivate} className="space-y-6 text-left">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3 ml-1">Enterprise License Key</label>
                <div className="relative">
                  <input 
                    type="text"
                    required
                    placeholder="XXXX-XXXX-XXXX-XXXX"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white font-mono text-center tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    value={key}
                    onChange={e => setKey(e.target.value)}
                    disabled={isValidating}
                  />
                  {isValidating && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                {error && <p className="text-rose-500 text-xs mt-3 font-medium text-center">{error}</p>}
              </div>

              <button 
                type="submit"
                disabled={isValidating || !key}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-500 text-white py-4 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl shadow-blue-900/20 transition-all active:scale-[0.98]"
              >
                {isValidating ? 'Validating License...' : 'Activate Enterprise Edition'}
              </button>
            </form>

            <div className="pt-6 border-t border-slate-800/50">
              <div className="flex items-center justify-center space-x-8">
                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Status</p>
                  <p className="text-xs text-amber-500 font-bold mt-1">Trial Mode</p>
                </div>
                <div className="w-px h-8 bg-slate-800"></div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Version</p>
                  <p className="text-xs text-slate-300 font-bold mt-1">v2.5.0-Enterprise</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/30 p-6 text-center">
            <p className="text-[10px] text-slate-500 font-medium">
              Don't have a key? <a href="#" className="text-blue-400 hover:underline">Contact Sales</a> or <a href="#" className="text-blue-400 hover:underline">Request a Demo</a>
            </p>
          </div>
        </div>
        
        <p className="text-center mt-8 text-slate-600 text-[10px] font-bold uppercase tracking-widest">
          &copy; 2024 PharmaFlow Enterprise Solutions. All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default CommercialActivation;
