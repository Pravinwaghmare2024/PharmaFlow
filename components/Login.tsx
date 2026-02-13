
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.USER);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulating authentication
    setTimeout(() => {
      const mockUser: User = {
        id: role === UserRole.ADMIN ? 'ADM-01' : 'USR-01',
        name: role === UserRole.ADMIN ? 'Administrator' : 'Marketing Executive',
        email: email || (role === UserRole.ADMIN ? 'admin@pharmaflow.com' : 'user@pharmaflow.com'),
        role: role,
        isActive: true,
        lastLogin: new Date().toISOString()
      };
      onLogin(mockUser);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900 via-slate-900 to-black">
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center mb-10">
          <div className="inline-block p-4 rounded-3xl bg-blue-600 shadow-2xl shadow-blue-500/20 mb-6">
            <span className="text-4xl">🧬</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">PharmaFlow CRM</h1>
          <p className="text-slate-400 mt-2 font-medium">Enterprise Marketing Intelligence Portal</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] shadow-2xl">
          <div className="flex bg-white/5 p-1 rounded-2xl mb-8">
            <button 
              onClick={() => setRole(UserRole.USER)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${role === UserRole.USER ? 'bg-white text-blue-600 shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Marketing User
            </button>
            <button 
              onClick={() => setRole(UserRole.ADMIN)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${role === UserRole.ADMIN ? 'bg-white text-blue-600 shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
            >
              System Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Secure Password</label>
              <input 
                type="password" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-600/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Initialize Session</span>
                  <span className="text-lg">→</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              GXP Compliant Access • SSL Encrypted
            </p>
          </div>
        </div>

        <p className="text-center mt-8 text-slate-500 text-xs">
          © 2024 PharmaFlow Enterprise. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
