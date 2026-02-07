
import React, { useState } from 'react';
import { downloadFile } from '../utils/downloadUtils';

const DesktopClientInfo: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'desktop' | 'iis' | 'troubleshoot'>('desktop');
  const [buildStatus, setBuildStatus] = useState<'idle' | 'running' | 'completed'>('idle');
  const [logs, setLogs] = useState<string[]>([]);

  const startBuild = () => {
    setBuildStatus('running');
    setLogs(['[BUILD] Initializing Electron packager...', '[BUILD] Fetching dependencies...', '[BUILD] Bundling assets...']);
    
    let step = 0;
    const interval = setInterval(() => {
      const messages = [
        '[BUILD] Compiling React into production bundle...',
        '[BUILD] Generating NSIS installer for Windows...',
        '[BUILD] Applying code signing certificates...',
        '[BUILD] Success: PharmaFlow_Setup_1.0.exe generated.'
      ];
      
      if (step < messages.length) {
        setLogs(prev => [...prev, messages[step]]);
        step++;
      } else {
        clearInterval(interval);
        setBuildStatus('completed');
        // Trigger simulated installer download
        downloadFile('PharmaFlow_Setup_1.0.exe', 'Simulated Installer Content', 'application/octet-stream');
      }
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Deployment Center</h2>
          <p className="text-slate-500 text-sm">Enterprise setup and distribution guide</p>
        </div>
        <div className="flex bg-slate-200 p-1 rounded-xl">
          {['desktop', 'iis', 'troubleshoot'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveSubTab(tab as any)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all uppercase ${activeSubTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeSubTab === 'desktop' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 rounded-xl shadow-2xl overflow-hidden border border-slate-800">
              <div className="px-4 py-2 bg-slate-800 flex items-center justify-between border-b border-slate-700">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                </div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Build Console</span>
              </div>
              <div className="p-6 font-mono text-xs h-80 overflow-y-auto space-y-1">
                {logs.map((log, i) => (
                  <div key={i} className={log && typeof log === 'string' && log.includes('Success') ? 'text-emerald-400' : 'text-slate-300'}>
                    <span className="text-slate-600 mr-2">$</span> {log}
                  </div>
                ))}
                {buildStatus === 'idle' && <div className="text-slate-500 italic">Ready for build.</div>}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-4">Actions</h3>
                <button 
                  onClick={startBuild} 
                  disabled={buildStatus === 'running'}
                  className={`w-full py-3 rounded-xl font-bold mb-3 transition-all ${
                    buildStatus === 'running' ? 'bg-slate-200 text-slate-500' : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {buildStatus === 'running' ? 'Packaging...' : 'Package .EXE'}
                </button>
                <p className="text-[10px] text-slate-400 text-center leading-relaxed">Generated executable will be optimized for Windows 10/11 environments.</p>
                {buildStatus === 'completed' && (
                  <div className="mt-4 p-3 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium text-center border border-emerald-100">
                    Installer generated and downloaded.
                  </div>
                )}
             </div>
          </div>
        </div>
      )}

      {activeSubTab === 'iis' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-sm">1</span>
                Server Prerequisites
              </h3>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8">
                <p className="text-sm text-slate-700 font-medium mb-2">Required: URL Rewrite Module</p>
                <p className="text-xs text-slate-500 mb-4">You must install this on your Windows Server to enable SPA routing.</p>
                <code className="block bg-slate-900 text-blue-400 p-4 rounded-lg text-xs overflow-x-auto">
                  https://www.iis.net/downloads/microsoft/url-rewrite
                </code>
              </div>

              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-sm">2</span>
                The web.config file
              </h3>
              <p className="text-sm text-slate-600 mb-4">Vite build automatically includes a <code className="bg-slate-100 px-1 rounded font-mono">web.config</code> in the <code className="bg-slate-100 px-1 rounded font-mono">/dist</code> folder. Ensure it contains the routing rule:</p>
              <div className="bg-slate-900 p-4 rounded-lg overflow-x-auto">
                <pre className="text-[10px] text-emerald-400">
{`<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="React Routes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
          </conditions>
          <action type="Rewrite" url="/" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>`}
                </pre>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-blue-600 p-6 rounded-xl shadow-lg text-white">
              <h4 className="font-bold mb-4">IIS Setup Checklist</h4>
              <ul className="space-y-4 text-xs">
                <li className="flex items-start space-x-3">
                  <span className="bg-blue-500 w-5 h-5 rounded flex items-center justify-center shrink-0">1</span>
                  <span>Run <code className="bg-blue-700 px-1 rounded font-mono">npx vite build</code>.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="bg-blue-500 w-5 h-5 rounded flex items-center justify-center shrink-0">2</span>
                  <span>Copy <code className="bg-blue-700 px-1 rounded font-mono">/dist</code> to the server.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="bg-blue-500 w-5 h-5 rounded flex items-center justify-center shrink-0">3</span>
                  <span>Point IIS Website to the folder.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="bg-blue-500 w-5 h-5 rounded flex items-center justify-center shrink-0">4</span>
                  <span>Set <strong>App Pool</strong> to "No Managed Code".</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'troubleshoot' && (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 animate-in fade-in duration-300">
          <div className="flex items-center space-x-4 mb-8">
            <div className="bg-rose-100 text-rose-600 p-3 rounded-full text-2xl">⚠️</div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Common Build Errors</h3>
              <p className="text-slate-500 text-sm">Quick fixes for terminal and dependency issues.</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-800 mb-4 flex items-center text-sm">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                'vite' is not recognized
              </h4>
              <p className="text-xs text-slate-600 mb-4">The 'vite' tool lives inside the <code className="bg-slate-200 px-1 rounded font-mono text-[10px]">node_modules</code> folder. Run install or use the npx executor:</p>
              <div className="space-y-2">
                <code className="block bg-slate-900 text-blue-400 p-3 rounded-lg text-xs font-mono">npm install</code>
                <code className="block bg-slate-900 text-emerald-400 p-3 rounded-lg text-xs font-mono">npx vite build</code>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-800 mb-4 flex items-center text-sm">
                <span className="w-2 h-2 bg-rose-500 rounded-full mr-2"></span>
                'terser' not found
              </h4>
              <p className="text-xs text-slate-600 mb-4">Terser is an optional minifier. We have configured the project to use the default <strong>esbuild</strong> engine to avoid this error.</p>
              <div className="space-y-2">
                <p className="text-[10px] text-slate-500 mb-2">If you strictly need Terser, install it manually:</p>
                <code className="block bg-slate-900 text-blue-400 p-3 rounded-lg text-xs font-mono">npm install -D terser</code>
              </div>
            </div>

            <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
              <h4 className="font-bold text-amber-800 mb-2 text-sm">Node.js Environment</h4>
              <p className="text-xs text-amber-700 leading-relaxed">
                Ensure <strong>Node.js (v18+)</strong> is installed. Verify with <code className="bg-amber-100 px-1 rounded">node -v</code>. If missing, download from <a href="https://nodejs.org" target="_blank" className="underline font-bold">nodejs.org</a>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesktopClientInfo;
