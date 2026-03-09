
import React, { useState, useEffect, lazy, Suspense } from 'react';
import Sidebar from './components/Sidebar';
import LoadingSpinner from './components/LoadingSpinner';
import Login from './components/Login';
import { MOCK_CUSTOMERS, MOCK_PRODUCTS } from './constants';
import { Inquiry, InquiryStatus, User, UserRole, Customer, Product, Quotation, Batch, InventoryItem, CompanySettings } from './types';

// Lazy load components
const Dashboard = lazy(() => import('./components/Dashboard'));
const InquiryManager = lazy(() => import('./components/InquiryManager'));
const QuotationManager = lazy(() => import('./components/QuotationManager'));
const AIMarketingAssist = lazy(() => import('./components/AIMarketingAssist'));
const ReportGenerator = lazy(() => import('./components/ReportGenerator'));
const LeadManager = lazy(() => import('./components/LeadManager'));
const ProductCatalog = lazy(() => import('./components/ProductCatalog'));
const ManufacturingManager = lazy(() => import('./components/ManufacturingManager'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));
const CustomerManager = lazy(() => import('./components/CustomerManager'));
const TemplateSettings = lazy(() => import('./components/TemplateSettings'));

const INITIAL_SETTINGS: CompanySettings = {
  name: 'PharmaFlow Enterprise',
  address: '123 Global Biotech Park, NY',
  quotationPrefix: 'QUO-23-',
  inquiryPrefix: 'INQ-',
  termsAndConditions: '1. Payment within 30 days. 2. Goods once sold are not returnable. 3. Subject to jurisdiction of New York courts.',
  footerText: 'PharmaFlow - Empowering Healthcare through Innovation'
};

const INITIAL_INQUIRIES: Inquiry[] = [
  { 
    id: 'INQ-001', 
    customerId: 'C1', 
    customerName: 'St. Mary\'s General Hospital', 
    contactPerson: 'Dr. Sarah Wilson',
    status: InquiryStatus.NEW, 
    date: '2023-11-20', 
    products: ['Amoxicillin 500mg'], 
    notes: 'Immediate requirement for ICU', 
    assignedTo: 'John Doe',
    followUps: [
      { id: 'f1', date: '2023-11-20', type: 'Email', summary: 'Sent introductory catalog', outcome: 'Awaiting reply' }
    ]
  },
  { 
    id: 'INQ-002', 
    customerId: 'C2', 
    customerName: 'HealthFirst Pharmacy', 
    contactPerson: 'Mark Miller',
    status: InquiryStatus.FOLLOW_UP, 
    date: '2023-11-21', 
    products: ['Metformin 500mg', 'Paracetamol 650mg'], 
    notes: 'Looking for bulk pricing', 
    assignedTo: 'John Doe',
    followUps: [
      { id: 'f2', date: '2023-11-21', type: 'Call', summary: 'Spoke with pharmacist regarding discounts', outcome: 'Requested official quote' }
    ]
  },
];

const INITIAL_QUOTATIONS: Quotation[] = [
  {
    id: 'QUO-23-001',
    inquiryId: 'INQ-001',
    customerId: 'C1',
    customerName: "St. Mary's General Hospital",
    date: '2023-11-22',
    expiryDate: '2023-12-22',
    items: [
      { productId: 'P1', productName: 'Amoxicillin 500mg', quantity: 50, unitPrice: 12.50, discount: 5, total: 593.75 }
    ],
    totalAmount: 593.75,
    status: 'Pending Approval',
    comments: [
      { id: 'cm-1', author: 'John Doe', text: 'Sent for manager review regarding high discount.', timestamp: '2023-11-22 10:00' }
    ],
    attachments: [
      { id: 'at-1', name: 'Special_Pricing_Justification.pdf', size: '1.2 MB', type: 'application/pdf', status: 'Pending Review', uploadedBy: 'John Doe', uploadedAt: '2023-11-22 10:05' }
    ]
  }
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [prefillQuotation, setPrefillQuotation] = useState<Partial<Inquiry> | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>(INITIAL_INQUIRIES);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>(INITIAL_QUOTATIONS);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [settings, setSettings] = useState<CompanySettings>(INITIAL_SETTINGS);

  useEffect(() => {
    const savedUser = localStorage.getItem('pharmaflow_active_user');
    if (savedUser) setUser(JSON.parse(savedUser));

    const savedCustomers = localStorage.getItem('pharmaflow_customers');
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    } else {
      setCustomers(MOCK_CUSTOMERS as Customer[]);
    }

    const savedProducts = localStorage.getItem('pharmaflow_products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(MOCK_PRODUCTS as Product[]);
    }

    const savedQuotations = localStorage.getItem('pharmaflow_quotations');
    if (savedQuotations) {
      setQuotations(JSON.parse(savedQuotations));
    }

    const savedInquiries = localStorage.getItem('pharmaflow_inquiries');
    if (savedInquiries) {
      setInquiries(JSON.parse(savedInquiries));
    }

    const savedBatches = localStorage.getItem('pharmaflow_batches');
    if (savedBatches) setBatches(JSON.parse(savedBatches));

    const savedInventory = localStorage.getItem('pharmaflow_inventory');
    if (savedInventory) setInventory(JSON.parse(savedInventory));

    const savedSettings = localStorage.getItem('pharmaflow_settings');
    if (savedSettings) setSettings(JSON.parse(savedSettings));
    
    // Auto-collapse sidebar on small screens
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  }, []);

  useEffect(() => {
    if (customers.length > 0) {
      localStorage.setItem('pharmaflow_customers', JSON.stringify(customers));
    }
  }, [customers]);

  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('pharmaflow_products', JSON.stringify(products));
    }
  }, [products]);

  useEffect(() => {
    if (quotations.length > 0) {
      localStorage.setItem('pharmaflow_quotations', JSON.stringify(quotations));
    }
  }, [quotations]);

  useEffect(() => {
    if (inquiries.length > 0) {
      localStorage.setItem('pharmaflow_inquiries', JSON.stringify(inquiries));
    }
  }, [inquiries]);

  useEffect(() => {
    localStorage.setItem('pharmaflow_batches', JSON.stringify(batches));
  }, [batches]);

  useEffect(() => {
    localStorage.setItem('pharmaflow_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('pharmaflow_settings', JSON.stringify(settings));
  }, [settings]);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('pharmaflow_active_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('pharmaflow_active_user');
  };

  const handleConvertToQuote = (inquiry: Inquiry) => {
    setPrefillQuotation(inquiry);
    setActiveTab('quotations');
  };

  const handleDeleteInquiry = (id: string) => {
    setInquiries(prev => prev.filter(inq => inq.id !== id));
  };

  const handleAddInquiry = (inq: Inquiry) => {
    setInquiries(prev => [inq, ...prev]);
  };

  const handleUpdateInquiry = (updatedInq: Inquiry) => {
    setInquiries(prev => prev.map(inq => inq.id === updatedInq.id ? updatedInq : inq));
  };

  const handleAddCustomer = (customer: Customer) => {
    setCustomers(prev => [customer, ...prev]);
  };

  const handleDeleteCustomer = (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setCustomers(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleAddProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleAddQuotation = (quo: Quotation) => {
    setQuotations(prev => [quo, ...prev]);
  };

  const handleUpdateQuotation = (updatedQuo: Quotation) => {
    setQuotations(prev => prev.map(q => q.id === updatedQuo.id ? updatedQuo : q));
  };

  const handleDeleteQuotation = (id: string) => {
    if (window.confirm('Are you sure you want to delete this quotation?')) {
      setQuotations(prev => prev.filter(q => q.id !== id));
    }
  };

  const handleAddBatch = (batch: Batch) => {
    setBatches(prev => [batch, ...prev]);
  };

  const handleDeleteBatch = (id: string) => {
    if (window.confirm('Are you sure you want to delete this production batch?')) {
      setBatches(prev => prev.filter(b => b.id !== id));
    }
  };

  const handleAddInventory = (item: InventoryItem) => {
    setInventory(prev => [item, ...prev]);
  };

  const handleDeleteInventory = (id: string) => {
    if (window.confirm('Are you sure you want to delete this inventory item?')) {
      setInventory(prev => prev.filter(i => i.id !== id));
    }
  };

  const handleUpdateStock = (productId: string, newStock: number) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: newStock } : p));
  };

  const handleExportData = () => {
    const data = {
      customers,
      products,
      inquiries,
      quotations,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pharmaflow_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.customers) setCustomers(data.customers);
        if (data.products) setProducts(data.products);
        if (data.inquiries) setInquiries(data.inquiries);
        if (data.quotations) setQuotations(data.quotations);
        alert('Data imported successfully!');
      } catch (err) {
        alert('Failed to import data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        {(() => {
          switch (activeTab) {
            case 'dashboard': return <Dashboard />;
            case 'leads': return <LeadManager />;
            case 'manufacturing': return (
              <ManufacturingManager 
                products={products} 
                batches={batches}
                inventory={inventory}
                onAddBatch={handleAddBatch}
                onDeleteBatch={handleDeleteBatch}
                onAddInventory={handleAddInventory}
                onDeleteInventory={handleDeleteInventory}
              />
            );
            case 'inventory': return (
              <ProductCatalog 
                products={products} 
                onAddProduct={handleAddProduct} 
                onDeleteProduct={handleDeleteProduct}
                onUpdateStock={handleUpdateStock}
                onExport={handleExportData}
                onImport={handleImportData}
              />
            );
            case 'inquiries': return (
              <InquiryManager 
                inquiries={inquiries} 
                customers={customers}
                settings={settings}
                onAddCustomer={handleAddCustomer}
                onConvertToQuote={handleConvertToQuote}
                onAddInquiry={handleAddInquiry}
                onUpdateInquiry={handleUpdateInquiry}
                onDeleteInquiry={handleDeleteInquiry}
                onExport={handleExportData}
                onImport={handleImportData}
              />
            );
            case 'quotations': return (
              <QuotationManager 
                prefillData={prefillQuotation} 
                customers={customers}
                products={products}
                quotations={quotations}
                settings={settings}
                onAddQuotation={handleAddQuotation}
                onUpdateQuotation={handleUpdateQuotation}
                onDeleteQuotation={handleDeleteQuotation}
                onAddCustomer={handleAddCustomer}
                onClearPrefill={() => setPrefillQuotation(null)} 
                onExport={handleExportData}
                onImport={handleImportData}
              />
            );
            case 'reports': return user.role === UserRole.ADMIN ? <ReportGenerator /> : <Dashboard />;
            case 'ai-assist': return <AIMarketingAssist />;
            case 'settings': return (
              <TemplateSettings 
                settings={settings} 
                onUpdateSettings={setSettings} 
              />
            );
            case 'admin': return user.role === UserRole.ADMIN ? (
              <AdminPanel inquiries={inquiries} onDeleteInquiry={handleDeleteInquiry} />
            ) : <Dashboard />;
            case 'customers': return (
              <CustomerManager 
                customers={customers} 
                onAddCustomer={handleAddCustomer} 
                onDeleteCustomer={handleDeleteCustomer}
                onExport={handleExportData}
                onImport={handleImportData}
              />
            );
            default: return <Dashboard />;
          }
        })()}
      </Suspense>
    );
  };

  return (
    <div className="min-h-screen flex bg-slate-50 relative overflow-x-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        onLogout={handleLogout} 
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <main className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-0'} p-8 max-w-7xl mx-auto`}>
        <header className="mb-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {!isSidebarOpen && (
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-slate-600"
              >
                <span className="text-xl">☰</span>
              </button>
            )}
            <div className={`relative ${isSidebarOpen ? 'w-96' : 'w-80'} transition-all`}>
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
              <input 
                type="text" 
                placeholder="Search institutional leads, catalog, reports..."
                className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex flex-col text-right mr-2">
              <span className="text-xs font-bold text-slate-800">Node: {user.role === UserRole.ADMIN ? 'SECURE' : 'OPS'}</span>
              <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-tighter">Connection Active</span>
            </div>
            <button className="relative w-10 h-10 flex items-center justify-center bg-white rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
              <span>🔔</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
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
