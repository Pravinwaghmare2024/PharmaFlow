
import React, { useState } from 'react';
import { Customer } from '../types';

interface CustomerManagerProps {
  customers: Customer[];
  onAddCustomer: (customer: Customer) => void;
}

const CustomerManager: React.FC<CustomerManagerProps> = ({ customers, onAddCustomer }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    type: 'Hospital'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.email || !newCustomer.contactPerson) return;

    const customer: Customer = {
      id: `C-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newCustomer.name!,
      contactPerson: newCustomer.contactPerson!,
      email: newCustomer.email!,
      phone: newCustomer.phone || '',
      type: newCustomer.type as any || 'Hospital',
      address: newCustomer.address || '',
    };

    onAddCustomer(customer);
    setShowAddModal(false);
    setNewCustomer({ type: 'Hospital' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Customer Directory</h2>
          <p className="text-slate-500 text-sm">Hospitals, pharmacies, and distributors in your network</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-100 transition-all active:scale-95"
        >
          + Add New Customer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map(c => (
          <div key={c.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-200 transition-all hover:shadow-xl cursor-default group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50/50 rounded-bl-[3rem] -mr-4 -mt-4 transition-all group-hover:bg-blue-100/50"></div>
            
            <div className="flex justify-between mb-4 items-start relative z-10">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${
                c.type === 'Hospital' ? 'bg-rose-50 text-rose-600' :
                c.type === 'Pharmacy' ? 'bg-emerald-50 text-emerald-600' :
                c.type === 'Distributor' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
              }`}>
                {c.type}
              </span>
              <span className="text-slate-300 font-mono text-[10px]">{c.id}</span>
            </div>
            
            <h3 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-blue-600 transition-colors">{c.name}</h3>
            <p className="text-sm text-slate-500 mb-6 line-clamp-2 h-10">{c.address || 'No address specified'}</p>
            
            <div className="space-y-3 pt-4 border-t border-slate-50">
              <div className="flex items-center text-sm">
                <span className="w-5 text-slate-400">👤</span>
                <span className="text-slate-700 font-semibold">{c.contactPerson}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="w-5 text-slate-400">📧</span>
                <span className="text-blue-600 hover:underline truncate">{c.email}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="w-5 text-slate-400">📞</span>
                <span className="text-slate-600 font-medium">{c.phone || 'N/A'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            <div className="p-8 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Register Customer</h3>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1">GXP Compliant Data Entry</p>
              </div>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl">✕</button>
            </div>
            
            <div className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Company / Institution Name</label>
                  <input 
                    required 
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. Mayo Clinic"
                    value={newCustomer.name || ''}
                    onChange={e => setNewCustomer({...newCustomer, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Entity Type</label>
                  <select 
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    value={newCustomer.type}
                    onChange={e => setNewCustomer({...newCustomer, type: e.target.value as any})}
                  >
                    <option value="Hospital">Hospital</option>
                    <option value="Pharmacy">Pharmacy</option>
                    <option value="Distributor">Distributor</option>
                    <option value="Clinic">Clinic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Primary Contact Person</label>
                  <input 
                    required 
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="John Doe"
                    value={newCustomer.contactPerson || ''}
                    onChange={e => setNewCustomer({...newCustomer, contactPerson: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                  <input 
                    required 
                    type="email"
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="contact@institution.org"
                    value={newCustomer.email || ''}
                    onChange={e => setNewCustomer({...newCustomer, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Phone Number</label>
                  <input 
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="+1 (555) 000-0000"
                    value={newCustomer.phone || ''}
                    onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Physical Address</label>
                <textarea 
                  rows={3}
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Street, City, State, ZIP..."
                  value={newCustomer.address || ''}
                  onChange={e => setNewCustomer({...newCustomer, address: e.target.value})}
                />
              </div>
            </div>

            <div className="p-8 bg-slate-50 flex space-x-4">
              <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 text-slate-500 font-bold text-xs uppercase tracking-widest hover:text-slate-800 transition-colors">Cancel</button>
              <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95">Verify & Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CustomerManager;
