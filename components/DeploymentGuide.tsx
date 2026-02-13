
import React, { useState } from 'react';

const DeploymentGuide: React.FC = () => {
  const [os, setOs] = useState<'ubuntu' | 'iis'>('ubuntu');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Configuration copied to clipboard!');
  };

  const nginxConfig = `server {
    listen 80;
    server_name pharma-flow.yourdomain.com;
    root /var/www/pharma-flow/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Enable Gzip compression for faster delivery
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
}`;

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
          </conditions>
          <action type="Rewrite" url="/" />
        </rule>
      </rules>
    </rewrite>
    <staticContent>
      <mimeMap fileExtension=".json" mimeType="application/json" />
    </staticContent>
  </system.webServer>
</configuration>`;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Server Configuration</h2>
          <p className="text-slate-500 text-sm">Deployment guides for production environments</p>
        </div>
        <div className="flex bg-slate-200 p-1 rounded-xl">
          <button 
            onClick={() => setOs('ubuntu')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${os === 'ubuntu' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
          >
            Ubuntu / Nginx
          </button>
          <button 
            onClick={() => setOs('iis')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${os === 'iis' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
          >
            Windows / IIS
          </button>
        </div>
      </div>

      {os === 'ubuntu' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4">1. Environment Setup</h3>
              <div className="space-y-4">
                <p className="text-sm text-slate-600">Update packages and install Nginx and Node.js:</p>
                <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs text-blue-400 space-y-2">
                  <p>sudo apt update && sudo apt upgrade -y</p>
                  <p>sudo apt install nginx -y</p>
                  <p>curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -</p>
                  <p>sudo apt-get install -y nodejs</p>
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800">2. Nginx Configuration</h3>
                <button 
                  onClick={() => copyToClipboard(nginxConfig)}
                  className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg hover:bg-blue-100"
                >
                  Copy Config
                </button>
              </div>
              <p className="text-sm text-slate-600 mb-4">Create a new site configuration at <code className="bg-slate-100 px-1 rounded text-rose-500">/etc/nginx/sites-available/pharma-flow</code>:</p>
              <div className="bg-slate-900 rounded-xl p-5 font-mono text-xs text-emerald-400 overflow-x-auto">
                <pre>{nginxConfig}</pre>
              </div>
            </section>

            <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4">3. Final Deployment</h3>
              <div className="space-y-3 text-sm text-slate-600">
                <p className="flex items-start"><span className="font-bold text-blue-600 mr-2">A.</span> Build the app locally: <code className="bg-slate-100 px-1 mx-1 rounded">npm run build</code></p>
                <p className="flex items-start"><span className="font-bold text-blue-600 mr-2">B.</span> Transfer the <code className="bg-slate-100 px-1 mx-1 rounded">/dist</code> folder to <code className="bg-slate-100 px-1 mx-1 rounded">/var/www/pharma-flow</code></p>
                <p className="flex items-start"><span className="font-bold text-blue-600 mr-2">C.</span> Enable the site: <code className="bg-slate-100 px-1 mx-1 rounded">sudo ln -s /etc/nginx/sites-available/pharma-flow /etc/nginx/sites-enabled/</code></p>
                <p className="flex items-start"><span className="font-bold text-blue-600 mr-2">D.</span> Restart Nginx: <code className="bg-slate-100 px-1 mx-1 rounded">sudo systemctl restart nginx</code></p>
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl sticky top-8">
              <h4 className="text-xl font-bold mb-4 flex items-center">
                <span className="mr-2">💡</span> Ubuntu Tips
              </h4>
              <ul className="space-y-4 text-sm opacity-90">
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 mr-2 shrink-0"></div>
                  <span>Use <strong>Certbot</strong> for automatic SSL: <code className="bg-white/10 px-1 rounded">sudo apt install python3-certbot-nginx</code></span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 mr-2 shrink-0"></div>
                  <span>Check Nginx logs for errors at <code className="bg-white/10 px-1 rounded">/var/log/nginx/error.log</code></span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 mr-2 shrink-0"></div>
                  <span>Ensure firewall allows port 80/443: <code className="bg-white/10 px-1 rounded">sudo ufw allow 'Nginx Full'</code></span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4">1. Prerequisite: URL Rewrite</h3>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                PharmaFlow CRM is a Single Page Application (SPA). For routing to work on IIS, you <strong>must</strong> install the 
                <a href="https://www.iis.net/downloads/microsoft/url-rewrite" target="_blank" className="text-blue-600 font-bold mx-1 hover:underline">URL Rewrite Module</a>.
              </p>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-xs text-amber-800 font-medium">Without this module, reloading the page on any route other than the root will result in a 404 error.</p>
              </div>
            </section>

            <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800">2. web.config Setup</h3>
                <button 
                  onClick={() => copyToClipboard(iisConfig)}
                  className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg hover:bg-blue-100"
                >
                  Copy XML
                </button>
              </div>
              <p className="text-sm text-slate-600 mb-4">Place this <code className="bg-slate-100 px-1 rounded text-rose-500">web.config</code> file in the root of your application folder:</p>
              <div className="bg-slate-900 rounded-xl p-5 font-mono text-xs text-blue-300 overflow-x-auto">
                <pre>{iisConfig}</pre>
              </div>
            </section>

            <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4">3. Application Pool Settings</h3>
              <div className="space-y-4 text-sm text-slate-600">
                <p>For optimal performance of the Vite-built static assets:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Set <strong>.NET CLR Version</strong> to "No Managed Code".</li>
                  <li>Set <strong>Managed Pipeline Mode</strong> to "Integrated".</li>
                  <li>Ensure the IIS User (IUSR) has "Read" permissions on the application folder.</li>
                </ul>
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-3xl p-8 text-white shadow-xl sticky top-8 border-t-4 border-t-blue-500">
              <h4 className="text-xl font-bold mb-4 flex items-center text-blue-400">
                <span className="mr-2">🏁</span> IIS Checklist
              </h4>
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-sm">1</div>
                  <span className="text-xs font-medium opacity-80 underline underline-offset-4 decoration-slate-600">Install URL Rewrite Module</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-sm">2</div>
                  <span className="text-xs font-medium opacity-80">Copy /dist contents to physical path</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-sm">3</div>
                  <span className="text-xs font-medium opacity-80">Create "web.config" in site root</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-sm">4</div>
                  <span className="text-xs font-medium opacity-80">Check Static Content mappings</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeploymentGuide;
