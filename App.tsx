
import React, { useState, lazy, Suspense } from 'react';
import Sidebar from './components/Sidebar';
import LoadingSpinner from './components/LoadingSpinner';
import { MOCK_CUSTOMERS } from './constants';
import { Inquiry } from './types';

// Lazy load components
const Dashboard = lazy(() => import('./components/Dashboard'));
const InquiryManager = lazy(() => import('./components/InquiryManager'));
const QuotationManager = lazy(() => import('./components/QuotationManager'));
const AIMarketingAssist = lazy(() => import('./components/AIMarketingAssist'));
const ReportGenerator = lazy(() => import('./components/ReportGenerator'));
const LeadManager = lazy(() => import('./components/LeadManager'));
const ProductCatalog = lazy(() => import('./components/ProductCatalog'));
const ManufacturingManager = lazy(() => import('./components/ManufacturingManager'));
const DeploymentGuide = lazy(() => import('./components/DeploymentGuide'));

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [prefillQuotation, setPrefillQuotation] = useState<Partial<Inquiry> | null>(null);

  const handleConvertToQuote = (inquiry: Inquiry) => {
    setPrefillQuotation(inquiry);
    setActiveTab('quotations');
  };

  const renderContent = () => {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        {(() => {
          switch (activeTab) {
            case 'dashboard': return <Dashboard />;
            case 'leads': return <LeadManager />;
            case 'manufacturing': return <ManufacturingManager />;
            case 'inventory': return <ProductCatalog />;
            case 'inquiries': return <InquiryManager onConvertToQuote={handleConvertToQuote} />;
            case 'quotations': return (
              <QuotationManager 
                prefillData={prefillQuotation} 
                onClearPrefill={() => setPrefillQuotation(null)} 
              />
            );
            case 'reports': return <ReportGenerator />;
            case 'deployment': return <DeploymentGuide />;
            case 'ai-assist': return <AIMarketingAssist />;
            case 'customers': return (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Customer Directory</h2>
                    <p className="text-slate-500 text-sm">Hospitals, pharmacies, and distributors</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {MOCK_CUSTOMERS.map(c => (
                    <div key={c.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:border-blue-200 transition-all hover:shadow-md cursor-default group">
                      <div className="flex justify-between mb-4">
                        <span className="text-[10px] bg-blue-50 text-blue-600 font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                          {c.type}
                        </span>
                        <span className="text-slate-400 text-xs font-medium">{c.id}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-blue-600 transition-colors">{c.name}</h3>
                      <p className="text-sm text-slate-500 mb-4">{c.address}</p>
                      <div className="space-y-2 text-sm pt-4 border-t border-slate-50">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Contact</span>
                          <span className="text-slate-800 font-medium">{c.contactPerson}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Email</span>
                          <span className="text-blue-600 hover:underline cursor-pointer">{c.email}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
            default: return <Dashboard />;
          }
        })()}
      </Suspense>
    );
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 ml-64 p-8 max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div className="relative w-96">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input 
              type="text" 
              placeholder="Search manufacturing, products, customers..."
              className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm transition-all"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex flex-col text-right mr-2">
              <span className="text-xs font-bold text-slate-800">PharmaFlow Enterprise</span>
              <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-tighter">Manufacturing Node Online</span>
            </div>
            <button className="relative w-10 h-10 flex items-center justify-center bg-white rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors" aria-label="Notifications">
              <span>🔔</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center bg-white rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors" aria-label="Settings">
              <span>⚙️</span>
            </button>
          </div>
        </header>

        <div className="min-h-[calc(100vh-200px)]">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
