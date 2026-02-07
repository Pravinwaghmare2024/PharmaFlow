
import React, { useState } from 'react';
import { Inquiry, InquiryStatus, FollowUp } from '../types';
import { MOCK_CUSTOMERS } from '../constants';
import { generateFollowUpEmail } from '../services/geminiService';

interface InquiryManagerProps {
  onConvertToQuote?: (inq: Inquiry) => void;
}

const INITIAL_INQUIRIES: Inquiry[] = [
  { 
    id: 'INQ-001', 
    customerId: 'C1', 
    customerName: 'St. Mary\'s General Hospital', 
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

const InquiryManager: React.FC<InquiryManagerProps> = ({ onConvertToQuote }) => {
  const [inquiries, setInquiries] = useState<Inquiry[]>(INITIAL_INQUIRIES);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [newInquiry, setNewInquiry] = useState<Partial<Inquiry>>({ status: InquiryStatus.NEW });
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');
  
  // Follow-up log state
  const [logSummary, setLogSummary] = useState('');
  const [logType, setLogType] = useState<FollowUp['type']>('Email');

  const handleAddInquiry = () => {
    if (!newInquiry.customerId || !newInquiry.products) return;
    
    const customer = MOCK_CUSTOMERS.find(c => c.id === newInquiry.customerId);
    const inq: Inquiry = {
      id: `INQ-00${inquiries.length + 1}`,
      customerId: newInquiry.customerId!,
      customerName: customer?.name || 'Unknown',
      status: InquiryStatus.NEW,
      date: new Date().toISOString().split('T')[0],
      products: Array.isArray(newInquiry.products) ? newInquiry.products : [newInquiry.products as string],
      notes: newInquiry.notes || '',
      assignedTo: 'John Doe',
      followUps: []
    };

    setInquiries([inq, ...inquiries]);
    setShowAddModal(false);
    setNewInquiry({ status: InquiryStatus.NEW });
  };

  const handleAiFollowUp = async (inq: Inquiry) => {
    setAiLoading(true);
    const result = await generateFollowUpEmail(inq.customerName, inq.notes);
    setAiSuggestion(result || 'Could not generate suggestion.');
    setAiLoading(false);
  };

  const handleAddLogEntry = () => {
    if (!selectedInquiry || !logSummary) return;

    const newLog: FollowUp = {
      id: `f-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: logType,
      summary: logSummary,
      outcome: 'Logged interaction'
    };

    const updatedInquiries = inquiries.map(inq => {
      if (inq.id === selectedInquiry.id) {
        return { 
          ...inq, 
          followUps: [...(inq.followUps || []), newLog],
          status: InquiryStatus.FOLLOW_UP 
        };
      }
      return inq;
    });

    setInquiries(updatedInquiries);
    const updatedSelected = updatedInquiries.find(i => i.id === selectedInquiry.id);
    if (updatedSelected) setSelectedInquiry(updatedSelected);
    setLogSummary('');
  };

  const getStatusStyle = (status: InquiryStatus) => {
    switch (status) {
      case InquiryStatus.NEW: return 'bg-blue-100 text-blue-700';
      case InquiryStatus.FOLLOW_UP: return 'bg-amber-100 text-amber-700';
      case InquiryStatus.CONVERTED: return 'bg-emerald-100 text-emerald-700';
      case InquiryStatus.QUOTED: return 'bg-indigo-100 text-indigo-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Sales Inquiries</h2>
          <p className="text-slate-500 text-sm">Manage incoming product requests and track follow-ups</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          + New Inquiry
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Products</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {inquiries.map((inq) => (
              <tr key={inq.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{inq.id}</td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  <div className="font-semibold text-slate-800">{inq.customerName}</div>
                  <div className="text-xs">{inq.date}</div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  <div className="flex flex-wrap gap-1">
                    {inq.products.map((p, i) => (
                      <span key={i} className="bg-slate-100 px-2 py-0.5 rounded text-xs">{p}</span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusStyle(inq.status)}`}>
                    {inq.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-right space-x-3">
                  <button 
                    onClick={() => setSelectedInquiry(inq)}
                    className="text-blue-600 hover:text-blue-800 font-bold text-xs bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Details & History
                  </button>
                  <button 
                    onClick={() => onConvertToQuote?.(inq)}
                    className="text-emerald-600 hover:text-emerald-800 font-bold text-xs bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Create Quote
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Inquiry Detail & Follow-up Timeline Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                  {selectedInquiry.customerName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{selectedInquiry.customerName}</h3>
                  <p className="text-xs text-slate-500">{selectedInquiry.id} • Assigned to {selectedInquiry.assignedTo}</p>
                </div>
              </div>
              <button onClick={() => { setSelectedInquiry(null); setAiSuggestion(''); }} className="text-slate-400 hover:text-slate-600 text-2xl">✕</button>
            </div>
            
            <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-3">
              <div className="md:col-span-2 p-8 space-y-8 border-r border-slate-100">
                <section>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Inquiry Context</h4>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <p className="text-sm text-slate-700 italic leading-relaxed">"{selectedInquiry.notes}"</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {selectedInquiry.products.map((p, i) => (
                        <span key={i} className="bg-white px-3 py-1 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 shadow-sm">{p}</span>
                      ))}
                    </div>
                  </div>
                </section>

                <section>
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Follow-up Timeline</h4>
                    <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-bold">{selectedInquiry.followUps?.length || 0} Entries</span>
                  </div>

                  <div className="space-y-6 relative before:content-[''] before:absolute before:left-3.5 before:top-4 before:bottom-0 before:w-0.5 before:bg-slate-100">
                    {selectedInquiry.followUps?.length === 0 && (
                      <div className="pl-10 text-sm text-slate-400 italic py-4">No follow-ups recorded yet. Start by logging an interaction.</div>
                    )}
                    {selectedInquiry.followUps?.map((f, i) => (
                      <div key={f.id} className="relative pl-10 animate-in fade-in slide-in-from-left-2" style={{ animationDelay: `${i * 100}ms` }}>
                        <div className={`absolute left-0 top-1 w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-sm text-xs ${
                          f.type === 'Email' ? 'bg-blue-500 text-white' : 
                          f.type === 'Call' ? 'bg-emerald-500 text-white' : 
                          f.type === 'Meeting' ? 'bg-indigo-500 text-white' : 'bg-slate-400 text-white'
                        }`}>
                          {f.type === 'Email' ? '📧' : f.type === 'Call' ? '📞' : f.type === 'Meeting' ? '🤝' : '📝'}
                        </div>
                        <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm hover:border-blue-200 transition-colors">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-slate-800 text-sm">{f.type} Interaction</span>
                            <span className="text-[10px] font-medium text-slate-400">{f.date}</span>
                          </div>
                          <p className="text-sm text-slate-600">{f.summary}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="bg-slate-50/50 p-8 space-y-8">
                <section>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Log Interaction</h4>
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Channel</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Email', 'Call', 'Meeting', 'Note'].map(t => (
                          <button 
                            key={t}
                            onClick={() => setLogType(t as any)}
                            className={`py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all border ${
                              logType === t ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Summary</label>
                      <textarea 
                        className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="What happened during this touchpoint?"
                        rows={3}
                        value={logSummary}
                        onChange={(e) => setLogSummary(e.target.value)}
                      />
                    </div>
                    <button 
                      onClick={handleAddLogEntry}
                      disabled={!logSummary}
                      className="w-full bg-blue-600 text-white py-2 rounded-xl text-xs font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-lg shadow-blue-200"
                    >
                      Save to History
                    </button>
                  </div>
                </section>

                <section>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Strategist</h4>
                    <button 
                      onClick={() => handleAiFollowUp(selectedInquiry)}
                      disabled={aiLoading}
                      className="text-[10px] font-bold text-blue-600 hover:text-blue-800"
                    >
                      {aiLoading ? 'Thinking...' : '✨ New Strategy'}
                    </button>
                  </div>
                  
                  {aiSuggestion ? (
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-indigo-100 animate-in zoom-in-95">
                      <p className="text-[11px] text-slate-700 whitespace-pre-wrap leading-relaxed">
                        {aiSuggestion}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-slate-100/50 rounded-2xl border border-dashed border-slate-200">
                      <p className="text-[10px] text-slate-400 font-medium">Click ✨ for a professional follow-up strategy</p>
                    </div>
                  )}
                </section>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Inquiry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-800">New Sales Inquiry</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Customer</label>
                <select 
                  className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={newInquiry.customerId || ''}
                  onChange={(e) => setNewInquiry({...newInquiry, customerId: e.target.value})}
                >
                  <option value="">Choose a hospital or pharmacy...</option>
                  {MOCK_CUSTOMERS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Products Interested</label>
                <input 
                  type="text" 
                  placeholder="e.g., Amoxicillin, Paracetamol"
                  className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  onChange={(e) => setNewInquiry({...newInquiry, products: e.target.value.split(',')})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Additional Notes</label>
                <textarea 
                  rows={3}
                  className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Specific requirements, urgency, etc."
                  onChange={(e) => setNewInquiry({...newInquiry, notes: e.target.value})}
                />
              </div>
            </div>
            <div className="p-6 bg-slate-50 flex justify-end space-x-3">
              <button 
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-slate-600 font-medium hover:text-slate-800"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddInquiry}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
              >
                Create Inquiry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InquiryManager;
