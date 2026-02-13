
import React, { useState, useEffect } from 'react';
import { Quotation, Comment, Attachment, Inquiry, QuotationItem, CompanySettings } from '../types';
import { MOCK_PRODUCTS, MOCK_CUSTOMERS } from '../constants';
import { downloadFile, generateQuotationText } from '../utils/downloadUtils';

interface QuotationManagerProps {
  prefillData?: Partial<Inquiry> | null;
  onClearPrefill?: () => void;
}

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

const QuotationManager: React.FC<QuotationManagerProps> = ({ prefillData, onClearPrefill }) => {
  const [quotations, setQuotations] = useState<Quotation[]>(INITIAL_QUOTATIONS);
  const [selectedQuo, setSelectedQuo] = useState<Quotation | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [companyInfo, setCompanyInfo] = useState({ name: 'PharmaFlow Enterprise', address: '123 Global Biotech Park, NY' });

  useEffect(() => {
    const savedBranding = localStorage.getItem('pharmaflow_branding');
    if (savedBranding) {
      const parsed = JSON.parse(savedBranding);
      setCompanyInfo({ name: parsed.name, address: parsed.address });
    }
  }, []);

  // New Quotation Form State
  const [formData, setFormData] = useState<Partial<Quotation>>({
    items: [],
    status: 'Draft',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (prefillData) {
      setFormData({
        inquiryId: prefillData.id,
        customerId: prefillData.customerId,
        customerName: prefillData.customerName,
        items: [],
        status: 'Draft',
        date: new Date().toISOString().split('T')[0],
      });
      setShowCreateModal(true);
      onClearPrefill?.();
    }
  }, [prefillData]);

  const handleDownload = (quo: Quotation) => {
    setIsDownloading(true);
    const content = generateQuotationText(quo, companyInfo);
    // Simulate generation delay
    setTimeout(() => {
      downloadFile(`${quo.id}_PharmaFlow_Quote.txt`, content);
      setIsDownloading(false);
    }, 800);
  };

  const handleAddItem = (productId: string) => {
    const product = MOCK_PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const newItem: QuotationItem = {
      productId: product.id,
      productName: product.name,
      quantity: 10,
      unitPrice: product.unitPrice,
      discount: 0,
      total: 10 * product.unitPrice
    };

    setFormData(prev => ({
      ...prev,
      items: [...(prev.items || []), newItem]
    }));
  };

  const handleCreateQuotation = () => {
    if (!formData.customerId || !formData.items?.length) return;

    const total = formData.items.reduce((sum, item) => sum + item.total, 0);
    const newQuo: Quotation = {
      id: `QUO-23-00${quotations.length + 1}`,
      inquiryId: formData.inquiryId || 'Direct',
      customerId: formData.customerId!,
      customerName: formData.customerName || 'Unknown',
      date: formData.date!,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: formData.items!,
      totalAmount: total,
      status: 'Pending Approval'
    };

    setQuotations([newQuo, ...quotations]);
    setShowCreateModal(false);
    setFormData({ items: [] });
  };

  const updateStatus = (status: Quotation['status']) => {
    if (!selectedQuo) return;
    const updated = { ...selectedQuo, status };
    setQuotations(quotations.map(q => q.id === selectedQuo.id ? updated : q));
    setSelectedQuo(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Sales Quotations</h2>
          <p className="text-slate-500 text-sm">Professional quotes and approval workflows</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          + Create Quote
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quotations.map(q => (
          <div key={q.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow group">
            <div className="p-5 border-b border-slate-50 bg-slate-50/50 flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{q.id}</span>
                <h3 className="font-bold text-slate-800 line-clamp-1">{q.customerName}</h3>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                q.status === 'Pending Approval' ? 'bg-amber-100 text-amber-700' : 
                q.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
              }`}>
                {q.status}
              </span>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Date</span>
                <span className="text-slate-800 font-medium">{q.date}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Total Amount</span>
                <span className="text-blue-600 font-bold">${q.totalAmount.toLocaleString()}</span>
              </div>
            </div>
            <div className="p-4 bg-slate-50 flex space-x-2">
              <button 
                onClick={() => setSelectedQuo(q)}
                className="flex-1 bg-white border border-slate-200 text-slate-700 py-1.5 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                Review
              </button>
              <button 
                onClick={() => handleDownload(q)}
                className="px-3 bg-white border border-slate-200 text-slate-600 py-1.5 rounded-lg text-sm hover:text-blue-600 transition-colors"
                title="Download Quote"
              >
                📥
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Quotation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[95vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-800">Generate New Quotation</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl">✕</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Customer</label>
                  <select 
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-sm"
                    value={formData.customerId || ''}
                    onChange={(e) => {
                      const c = MOCK_CUSTOMERS.find(x => x.id === e.target.value);
                      setFormData({...formData, customerId: e.target.value, customerName: c?.name});
                    }}
                  >
                    <option value="">Select Customer...</option>
                    {MOCK_CUSTOMERS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Quote Date</label>
                  <input type="date" className="w-full border border-slate-200 rounded-lg p-2.5 text-sm" value={formData.date} />
                </div>
              </div>

              <div className="border-t pt-8">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-slate-800">Line Items</h4>
                  <select 
                    className="border border-slate-200 rounded-lg p-1.5 text-xs font-bold bg-blue-50 text-blue-600"
                    onChange={(e) => handleAddItem(e.target.value)}
                    value=""
                  >
                    <option value="">+ Add Product Item</option>
                    {MOCK_PRODUCTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                
                <table className="w-full text-left text-sm">
                  <thead className="text-slate-400 font-bold border-b border-slate-100">
                    <tr>
                      <th className="py-2">Product</th>
                      <th className="py-2">Qty</th>
                      <th className="py-2">Price</th>
                      <th className="py-2">Total</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {formData.items?.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-4 font-medium">{item.productName}</td>
                        <td className="py-4">
                          <input 
                            type="number" 
                            className="w-16 border rounded p-1" 
                            value={item.quantity}
                            onChange={(e) => {
                              const qty = Number(e.target.value);
                              const updatedItems = [...(formData.items || [])];
                              updatedItems[idx] = { ...item, quantity: qty, total: qty * item.unitPrice };
                              setFormData({ ...formData, items: updatedItems });
                            }}
                          />
                        </td>
                        <td className="py-4">${item.unitPrice}</td>
                        <td className="py-4 font-bold text-blue-600">${item.total.toLocaleString()}</td>
                        <td className="py-4 text-right">
                          <button 
                            className="text-rose-400 hover:text-rose-600"
                            onClick={() => {
                              const updatedItems = formData.items?.filter((_, i) => i !== idx);
                              setFormData({ ...formData, items: updatedItems });
                            }}
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                    {(!formData.items || formData.items.length === 0) && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400 italic">No items added yet.</td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="border-t-2 border-slate-100">
                    <tr>
                      <td colSpan={3} className="py-4 text-right font-bold text-slate-500 uppercase text-xs">Grand Total</td>
                      <td className="py-4 font-extrabold text-blue-600 text-xl">
                        ${formData.items?.reduce((s, i) => s + i.total, 0).toLocaleString()}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end space-x-4">
              <button 
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-2 text-slate-600 font-bold"
              >
                Discard
              </button>
              <button 
                onClick={handleCreateQuotation}
                disabled={!formData.items?.length}
                className="px-8 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50"
              >
                Create Quotation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approval & Review Slide-over */}
      {selectedQuo && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex justify-end">
          <div className="w-full max-w-2xl bg-white h-screen shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Quotation Approval</h3>
                <p className="text-sm text-slate-500">{selectedQuo.id} • {selectedQuo.customerName}</p>
              </div>
              <button onClick={() => setSelectedQuo(null)} className="text-slate-400 hover:text-slate-600 text-2xl">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <section className="bg-slate-50 rounded-xl p-4 border border-slate-200 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Status</label>
                  <div className="mt-1 font-semibold text-slate-700">{selectedQuo.status}</div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Total Value</label>
                  <div className="mt-1 font-bold text-blue-600 text-lg">${selectedQuo.totalAmount.toLocaleString()}</div>
                </div>
              </section>

              <section>
                <h4 className="font-bold text-slate-800 mb-4 uppercase text-xs tracking-widest">Items Detail</h4>
                <div className="space-y-3">
                  {selectedQuo.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between p-3 border rounded-xl bg-slate-50/50">
                      <div>
                        <p className="font-bold text-slate-800">{item.productName}</p>
                        <p className="text-xs text-slate-500">Qty: {item.quantity} × ${item.unitPrice}</p>
                      </div>
                      <p className="font-bold text-blue-600">${item.total.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex space-x-4">
              <button 
                onClick={() => handleDownload(selectedQuo)}
                disabled={isDownloading}
                className="flex-1 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center justify-center"
              >
                {isDownloading ? 'Generating...' : '📄 Download Formal Quote'}
              </button>
              <button 
                onClick={() => updateStatus('Approved')}
                disabled={selectedQuo.status === 'Approved'}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all shadow-md ${
                  selectedQuo.status === 'Approved' ? 'bg-slate-200 text-slate-400' : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {selectedQuo.status === 'Approved' ? 'Already Approved' : 'Approve Quotation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotationManager;
