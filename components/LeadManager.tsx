
import React, { useState } from 'react';
import { Lead, LeadStatus } from '../types';
import { MOCK_LEADS } from '../constants';

const LeadManager: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showOutcomeModal, setShowOutcomeModal] = useState<{leadId: string, type: 'WON' | 'LOST'} | null>(null);
  const [newLead, setNewLead] = useState<Partial<Lead>>({ status: LeadStatus.PROSPECT });
  const [outcomeReason, setOutcomeReason] = useState('');

  const handleAddLead = () => {
    if (!newLead.companyName || !newLead.contactPerson) return;
    const lead: Lead = {
      id: `LD-${Math.floor(1000 + Math.random() * 9000)}`,
      companyName: newLead.companyName!,
      contactPerson: newLead.contactPerson!,
      email: newLead.email || '',
      phone: newLead.phone || '',
      estimatedValue: Number(newLead.estimatedValue) || 0,
      status: LeadStatus.PROSPECT,
      source: newLead.source || 'Direct',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setLeads([lead, ...leads]);
    setShowAddModal(false);
    setNewLead({ status: LeadStatus.PROSPECT });
  };

  const handleUpdateOutcome = () => {
    if (!showOutcomeModal) return;
    const updatedLeads = leads.map(l => {
      if (l.id === showOutcomeModal.leadId) {
        return { 
          ...l, 
          status: showOutcomeModal.type === 'WON' ? LeadStatus.WON : LeadStatus.LOST,
          outcomeReason: outcomeReason
        };
      }
      return l;
    });
    setLeads(updatedLeads);
    setShowOutcomeModal(null);
    setOutcomeReason('');
  };

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case LeadStatus.WON: return 'bg-emerald-100 text-emerald-700';
      case LeadStatus.LOST: return 'bg-rose-100 text-rose-700';
      case LeadStatus.PROSPECT: return 'bg-blue-100 text-blue-700';
      case LeadStatus.NEGOTIATION: return 'bg-amber-100 text-amber-700';
      case LeadStatus.QUALIFIED: return 'bg-purple-100 text-purple-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Lead Management</h2>
          <p className="text-slate-500 text-sm">Track potential pharmaceutical sales opportunities</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-all"
        >
          + Add New Lead
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Value', value: `$${leads.reduce((acc, l) => acc + l.estimatedValue, 0).toLocaleString()}`, icon: '💰' },
          { label: 'Won Leads', value: leads.filter(l => l.status === LeadStatus.WON).length, icon: '✅' },
          { label: 'Lost Leads', value: leads.filter(l => l.status === LeadStatus.LOST).length, icon: '❌' },
          { label: 'Conversion Rate', value: `${Math.round((leads.filter(l => l.status === LeadStatus.WON).length / Math.max(1, leads.filter(l => l.status !== LeadStatus.PROSPECT).length)) * 100)}%`, icon: '📈' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center space-x-4">
            <div className="text-2xl">{item.icon}</div>
            <div>
              <p className="text-xs text-slate-500 font-medium">{item.label}</p>
              <p className="text-lg font-bold text-slate-800">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Lead Info</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Est. Value</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-slate-900">{lead.companyName}</div>
                  <div className="text-xs text-slate-500">Source: {lead.source}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-slate-700">{lead.contactPerson}</div>
                  <div className="text-xs text-slate-400">{lead.email}</div>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-blue-600">
                  ${lead.estimatedValue.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(lead.status)}`}>
                    {lead.status}
                  </span>
                  {lead.outcomeReason && (
                    <div className="text-[10px] text-slate-400 mt-1 italic max-w-[150px] truncate" title={lead.outcomeReason}>
                      Reason: {lead.outcomeReason}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm flex space-x-2">
                  {lead.status !== LeadStatus.WON && lead.status !== LeadStatus.LOST ? (
                    <>
                      <button 
                        onClick={() => setShowOutcomeModal({leadId: lead.id, type: 'WON'})}
                        className="p-1.5 hover:bg-emerald-50 rounded text-emerald-600" title="Mark Won"
                      >
                        ✅
                      </button>
                      <button 
                         onClick={() => setShowOutcomeModal({leadId: lead.id, type: 'LOST'})}
                        className="p-1.5 hover:bg-rose-50 rounded text-rose-600" title="Mark Lost"
                      >
                        ❌
                      </button>
                    </>
                  ) : (
                    <span className="text-slate-300 text-xs italic">Closed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">Add New Lead</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Company Name</label>
                  <input 
                    type="text" 
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    onChange={(e) => setNewLead({...newLead, companyName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Contact Person</label>
                  <input 
                    type="text" 
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    onChange={(e) => setNewLead({...newLead, contactPerson: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Estimated Value ($)</label>
                <input 
                  type="number" 
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  onChange={(e) => setNewLead({...newLead, estimatedValue: Number(e.target.value)})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Lead Source</label>
                  <select 
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    onChange={(e) => setNewLead({...newLead, source: e.target.value})}
                  >
                    <option value="Website">Website</option>
                    <option value="Referral">Referral</option>
                    <option value="Trade Show">Trade Show</option>
                    <option value="Cold Call">Cold Call</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email</label>
                  <input 
                    type="email" 
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    onChange={(e) => setNewLead({...newLead, email: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 rounded-b-2xl flex justify-end space-x-3">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-slate-600 font-medium">Cancel</button>
              <button onClick={handleAddLead} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">Save Lead</button>
            </div>
          </div>
        </div>
      )}

      {/* Outcome Modal (Win/Loss Reason) */}
      {showOutcomeModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-slate-100">
              <h3 className={`text-xl font-bold ${showOutcomeModal.type === 'WON' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {showOutcomeModal.type === 'WON' ? 'Congratulations! Lead Won' : 'Lead Lost Analysis'}
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600">Please provide a brief reason for this outcome to help improve our marketing strategy.</p>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Reason / Notes</label>
                <textarea 
                  rows={3}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder={showOutcomeModal.type === 'WON' ? "e.g. Price flexibility, product availability..." : "e.g. Competitor price, timing issues..."}
                  value={outcomeReason}
                  onChange={(e) => setOutcomeReason(e.target.value)}
                />
              </div>
            </div>
            <div className="p-6 bg-slate-50 rounded-b-2xl flex justify-end space-x-3">
              <button onClick={() => setShowOutcomeModal(null)} className="px-4 py-2 text-slate-600 font-medium">Back</button>
              <button 
                onClick={handleUpdateOutcome}
                className={`px-6 py-2 text-white rounded-lg font-bold ${showOutcomeModal.type === 'WON' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}`}
              >
                Confirm {showOutcomeModal.type === 'WON' ? 'Win' : 'Loss'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadManager;
