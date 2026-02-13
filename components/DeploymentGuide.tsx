
import React, { useState } from 'react';
import { downloadFile, generateInstallationGuide } from '../utils/downloadUtils';

const DeploymentGuide: React.FC = () => {
  const [os, setOs] = useState<'ubuntu' | 'iis'>('iis');
  const [downloading, setDownloading] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Configuration copied to clipboard!');
  };

  const handleDownloadFullGuide = () => {
    setDownloading(true);
    const content = generateInstallationGuide();
    setTimeout(() => {
      downloadFile('PharmaFlow_Installation_Guide.txt', content);
      setDownloading(false);
    }, 800);
  };

  const iisConfig = `<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="React Routes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
            <add input="{REQUEST_URI}" pattern=".*\\.(js|mjs|css|json|png|jpg|jpeg|gif|ico|woff|woff2|svg)" negate="true" />
          </conditions>
          <action type="Rewrite" url="index.html" />
        </rule>
      </rules>
    </rewrite>
    <staticContent>
      <remove fileExtension=".json" />
      <mimeMap fileExtension=".json" mimeType="application/json" />
      <remove fileExtension=".js" />
      <mimeMap fileExtension=".js" mimeType="application/javascript" />
      <remove fileExtension=".mjs" />
      <mimeMap fileExtension=".mjs" mimeType="application/javascript" />
      <remove fileExtension=".woff" />
      <mimeMap fileExtension=".woff" mimeType="font/woff" />
      <remove fileExtension=".woff2" />
      <mimeMap fileExtension=".woff2" mimeType="font/woff2" />
    </staticContent>
  </system.webServer>
</configuration>`;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Deployment Center</h2>
          <p className="text-slate-500 text-sm">Enterprise setup and local server installation</p>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleDownloadFullGuide}
            disabled={downloading}
            className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-md flex items-center"
          >
            <span className="mr-2">{downloading ? '⌛' : '📄'}</span>
            {downloading ? 'Preparing...' : 'Download Full Instructions'}
          </button>
          <div className="flex bg-slate-200 p-1 rounded-xl">
            <button 
              onClick={() => setOs('iis')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${os === 'iis' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
            >
              Windows (IIS)
            </button>
            <button 
              onClick={() => setOs('ubuntu')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${os === 'ubuntu' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
            >
              Linux (Nginx)
            </button>
          </div>
        </div>
      </div>

      {os === 'iis' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-blue-600 text-white font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">1</div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <div className="font-bold text-slate-800 mb-2">Phase 1: Terminal Build</div>
                  <div className="bg-slate-900 rounded-xl p-3 font-mono text-xs text-emerald-400">npm run build</div>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-blue-600 text-white font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">2</div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <div className="font-bold text-slate-800 mb-2">Phase 2: MIME & URL Rewrite</div>
                  <p className="text-sm text-slate-500">Ensure the web.config includes the <code className="bg-slate-100 px-1">pattern</code> exclusions for assets.</p>
                </div>
              </div>
            </div>

            <section className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">Hardened web.config</h3>
                <button onClick={() => copyToClipboard(iisConfig)} className="text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl">Copy XML</button>
              </div>
              <div className="bg-slate-900 rounded-2xl p-6 font-mono text-xs text-blue-300 overflow-x-auto max-h-[400px]">
                <pre>{iisConfig}</pre>
              </div>
            </section>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-rose-50 border border-rose-100 p-8 rounded-3xl shadow-sm">
              <h4 className="text-rose-800 font-bold mb-4 flex items-center">
                <span className="mr-2 text-xl">🚀</span> Critical: Fix Blank Tabs
              </h4>
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-2xl border border-rose-100 shadow-sm">
                  <p className="text-[11px] font-bold text-rose-900 uppercase mb-1">Diagnosis Steps</p>
                  <ul className="text-xs text-slate-600 space-y-2 list-decimal pl-4">
                    <li>Open your site in Chrome.</li>
                    <li>Press <strong>F12</strong> and go to the <strong>Console</strong> tab.</li>
                    <li>Click the "Report" or "Inquiries" tab.</li>
                    <li>If you see <code className="bg-rose-50 text-rose-600 font-bold">Unexpected token '&lt;'</code>, your rewrite rule is wrong. Copy the XML on the left.</li>
                    <li>If you see <code className="bg-rose-50 text-rose-600 font-bold">404 (Not Found)</code>, check your file permissions on the IIS folder.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center py-20">
           <h3 className="text-xl font-bold text-slate-800 mb-2">Ubuntu / Nginx Configuration</h3>
           <button onClick={() => setOs('iis')} className="text-blue-600 font-bold hover:underline">Switch back to IIS Guide</button>
        </div>
      )}
    </div>
  );
};

export default DeploymentGuide;
