
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { generateReportSummary } from '../services/geminiService';
import { downloadFile } from '../utils/downloadUtils';

const PRODUCT_DATA = [
  { name: 'Amoxicillin', value: 45 },
  { name: 'Paracetamol', value: 30 },
  { name: 'Omeprazole', value: 20 },
  { name: 'Metformin', value: 15 },
];

const CUSTOMER_DISTRIBUTION = [
  { name: 'Hospitals', value: 40, color: '#3b82f6' },
  { name: 'Pharmacies', value: 35, color: '#22c55e' },
  { name: 'Distributors', value: 15, color: '#f59e0b' },
  { name: 'Clinics', value: 10, color: '#ef4444' },
];

const SALES_TREND = [
  { month: 'Jul', actual: 4000, target: 4500 },
  { month: 'Aug', actual: 3000, target: 3500 },
  { month: 'Sep', actual: 5000, target: 4000 },
  { month: 'Oct', actual: 4500, target: 4800 },
  { month: 'Nov', actual: 6000, target: 5000 },
];

const ReportGenerator: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState('products');
  const [isExporting, setIsExporting] = useState(false);
  const [aiInsight, setAiInsight] = useState('');
  const [loadingInsight, setLoadingInsight] = useState(false);

  const getReportTitle = () => {
    switch(selectedReport) {
      case 'products': return 'Product Demand Analysis';
      case 'customers': return 'Customer Segment Distribution';
      case 'sales': return 'Monthly Sales vs Target';
      default: return 'Report';
    }
  };

  const handleExport = () => {
    setIsExporting(true);
    let data = "";
    if (selectedReport === 'products') data = PRODUCT_DATA.map(d => `${d.name}: ${d.value}`).join('\n');
    if (selectedReport === 'customers') data = CUSTOMER_DISTRIBUTION.map(d => `${d.name}: ${d.value}%`).join('\n');
    if (selectedReport === 'sales') data = SALES_TREND.map(d => `${d.month}: Actual $${d.actual}, Target $${d.target}`).join('\n');

    const content = `PHARMAFLOW REPORT: ${getReportTitle()}\nGenerated: ${new Date().toLocaleString()}\n\nDATA:\n${data}\n\nAI Insights Summary:\n${aiInsight || "No AI analysis performed yet."}`;
    
    setTimeout(() => {
      downloadFile(`${selectedReport}_report.txt`, content);
      setIsExporting(false);
    }, 1000);
  };

  const handleGetInsight = async () => {
    setLoadingInsight(true);
    let dataString = "";
    if (selectedReport === 'products') dataString = JSON.stringify(PRODUCT_DATA);
    if (selectedReport === 'customers') dataString = JSON.stringify(CUSTOMER_DISTRIBUTION);
    if (selectedReport === 'sales') dataString = JSON.stringify(SALES_TREND);
    
    const insight = await generateReportSummary(getReportTitle(), dataString);
    setAiInsight(insight || '');
    setLoadingInsight(false);
  };

  const renderChart = () => {
    // Ensuring the container has a defined height to prevent ResponsiveContainer from collapsing to 0
    return (
      <div style={{ width: '100%', height: '400px', minHeight: '400px' }} className="flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          {(() => {
            switch(selectedReport) {
              case 'products':
                return (
                  <BarChart data={PRODUCT_DATA} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <Tooltip cursor={{fill: '#f8fafc'}} />
                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                );
              case 'customers':
                return (
                  <PieChart>
                    <Pie
                      data={CUSTOMER_DISTRIBUTION}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                      label
                    >
                      {CUSTOMER_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                );
              case 'sales':
                return (
                  <BarChart data={SALES_TREND} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <Tooltip cursor={{fill: '#f8fafc'}} />
                    <Legend />
                    <Bar dataKey="actual" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Actual Sales" />
                    <Bar dataKey="target" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Target Sales" />
                  </BarChart>
                );
              default: return <div className="text-slate-400">Select a report to view data.</div>;
            }
          })()}
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Report Center</h2>
          <p className="text-slate-500 text-sm">Generate and analyze marketing performance reports</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors shadow-sm text-sm flex items-center"
          >
            {isExporting ? '📥 Generating...' : '📥 Export Data'}
          </button>
          <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors shadow-sm text-sm">
            📧 Email Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Select Report</h3>
            <div className="space-y-2">
              {[
                { id: 'products', label: 'Product Demand', icon: '💊' },
                { id: 'customers', label: 'Customer Segments', icon: '🏢' },
                { id: 'sales', label: 'Sales vs Target', icon: '📈' },
              ].map(report => (
                <button
                  key={report.id}
                  onClick={() => {
                    setSelectedReport(report.id);
                    setAiInsight('');
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    selectedReport === report.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-100 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xl">{report.icon}</span>
                  <span>{report.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-indigo-600 p-6 rounded-xl shadow-lg text-white">
            <h4 className="font-bold mb-2 flex items-center">
              <span className="mr-2">✨</span> AI Insights
            </h4>
            <p className="text-xs text-indigo-100 mb-4 leading-relaxed">
              Automated analysis of {getReportTitle().toLowerCase()} with Gemini strategic recommendations.
            </p>
            <button 
              onClick={handleGetInsight}
              disabled={loadingInsight}
              className={`w-full py-2 rounded-lg font-bold text-sm bg-white text-indigo-600 hover:bg-indigo-50 transition-all ${loadingInsight ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loadingInsight ? 'Analyzing...' : 'Generate Analysis'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6">{getReportTitle()}</h3>
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 overflow-hidden min-h-[420px] flex items-center justify-center">
              {renderChart()}
            </div>
          </div>

          {aiInsight && (
            <div className="bg-white p-8 rounded-xl shadow-sm border-l-4 border-l-indigo-500 border border-slate-100 animate-in fade-in slide-in-from-top-4">
              <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-4">Gemini Analysis & Strategy</h3>
              <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed italic">
                {aiInsight}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;
