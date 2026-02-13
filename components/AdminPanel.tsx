
import React, { useState, useEffect } from 'react';
import { Inquiry, User, UserRole, CompanySettings } from '../types';
import { downloadFile } from '../utils/downloadUtils';

interface AdminPanelProps {
  inquiries: Inquiry[];
  onDeleteInquiry: (id: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ inquiries, onDeleteInquiry }) => {
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'database' | 'branding'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [passwordResetUser, setPasswordResetUser] = useState<User | null>(null);
  
  // Company Settings
  const [companySettings, setCompanySettings] = useState<CompanySettings>({
    name: 'PharmaFlow Enterprise',
    address: '123 Global Biotech Park, Suite 400, New York, NY 10001',
    logoUrl: 'https://images.unsplash.com/photo-1563206767-5b18f218e7de?q=80&w=100&h=100&auto=format&fit=crop'
  });

  // Database Config State
  const [dbConfig, setDbConfig] = useState({
    host: 'localhost',
    dbName: 'pharmaflow_prod',
    user: 'admin_user',
    port: '5432',
    ssl: true
  });

  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  useEffect(() => {
    // Load users
    const savedUsers = localStorage.getItem('pharmaflow_users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      const initialUsers: User[] = [
        { id: '1', name: 'John Admin', email: 'admin@pharmaflow.com', role: UserRole.ADMIN, isActive: true },
        { id: '2', name: 'Sarah Executive', email: 'sarah@pharmaflow.com', role: UserRole.USER, isActive: true },
      ];
      setUsers(initialUsers);
      localStorage.setItem('pharmaflow_users', JSON.stringify(initialUsers));
    }

    // Load branding
    const savedBranding = localStorage.getItem('pharmaflow_branding');
    if (savedBranding) setCompanySettings(JSON.parse(savedBranding));

    const savedDb = localStorage.getItem('pharmaflow_db_config');
    if (savedDb) setDbConfig(JSON.parse(savedDb));
  }, []);

  const handleSaveBranding = () => {
    localStorage.setItem('pharmaflow_branding', JSON.stringify(companySettings));
    alert('Branding and company information updated successfully!');
  };

  const handleSaveConfig = () => {
    localStorage.setItem('pharmaflow_db_config', JSON.stringify(dbConfig));
    alert('Database configuration saved successfully!');
  };

  const handleGenerateSql = () => {
    const sqlScript = `-- PHARMAFLOW CRM DATABASE INITIALIZATION SCRIPT
-- Generated: ${new Date().toLocaleString()}

CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(20) DEFAULT 'USER',
    password_hash TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customers (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(50),
    email VARCHAR(100),
    address TEXT
);

CREATE TABLE inquiries (
    id VARCHAR(50) PRIMARY KEY,
    customer_id VARCHAR(50) REFERENCES customers(id),
    status VARCHAR(50),
    products JSONB,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE settings (
    key VARCHAR(50) PRIMARY KEY,
    value JSONB
);

-- Seed Data
INSERT INTO settings (key, value) VALUES ('branding', '${JSON.stringify(companySettings)}');
INSERT INTO users (id, name, email, role) VALUES ('1', 'Admin', 'admin@pharmaflow.com', 'ADMIN');
`;
    downloadFile('pharmaflow_db_init.sql', sqlScript);
  };

  const handleAddUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newUser: User = {
      id: `U-${Date.now()}`,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      role: formData.get('role') as UserRole,
      isActive: true,
      password: 'InitialPassword123'
    };
    const updated = [...users, newUser];
    setUsers(updated);
    localStorage.setItem('pharmaflow_users', JSON.stringify(updated));
    setShowAddUser(false);
  };

  const handleResetPassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!passwordResetUser) return;
    const formData = new FormData(e.currentTarget);
    const newPass = formData.get('password') as string;
    
    const updated = users.map(u => u.id === passwordResetUser.id ? { ...u, password: newPass } : u);
    setUsers(updated);
    localStorage.setItem('pharmaflow_users', JSON.stringify(updated));
    setPasswordResetUser(null);
    alert('Password updated for ' + passwordResetUser.name);
  };

  const toggleUserStatus = (id: string) => {
    const updated = users.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u);
    setUsers(updated);
    localStorage.setItem('pharmaflow_users', JSON.stringify(updated));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Admin Control Center</h2>
          <p className="text-slate-500 text-sm">Manage enterprise branding, security, and infrastructure</p>
        </div>
        <div className="flex bg-slate-200 p-1 rounded-xl">
          <button 
            onClick={() => setActiveSubTab('users')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeSubTab === 'users' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
          >
            Users
          </button>
          <button 
            onClick={() => setActiveSubTab('branding')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeSubTab === 'branding' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
          >
            Branding
          </button>
          <button 
            onClick={() => setActiveSubTab('database')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeSubTab === 'database' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
          >
            System Data
          </button>
        </div>
      </div>

      {activeSubTab === 'users' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-12 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Authorized Personnel</h3>
              <button 
                onClick={() => setShowAddUser(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors"
              >
                + Provision New User
              </button>
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">User</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Role</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-xs">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-800">{u.name}</div>
                          <div className="text-[10px] text-slate-400">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${u.role === UserRole.ADMIN ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-8 py-4">
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${u.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                      <span className="text-xs font-medium text-slate-600">{u.isActive ? 'Active' : 'Suspended'}</span>
                    </td>
                    <td className="px-8 py-4 text-right space-x-4">
                      <button 
                        onClick={() => setPasswordResetUser(u)}
                        className="text-[10px] font-bold uppercase text-blue-600 hover:underline"
                      >
                        Reset Password
                      </button>
                      <button 
                        onClick={() => toggleUserStatus(u.id)}
                        className={`text-[10px] font-bold uppercase transition-colors ${u.isActive ? 'text-rose-500' : 'text-emerald-500'}`}
                      >
                        {u.isActive ? 'Suspend' : 'Reactivate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeSubTab === 'branding' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 space-y-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6">Company Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Company Display Name</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm"
                  value={companySettings.name}
                  onChange={e => setCompanySettings({...companySettings, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Official Address (for Quotations)</label>
                <textarea 
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm"
                  value={companySettings.address}
                  onChange={e => setCompanySettings({...companySettings, address: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Company Logo URL</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm"
                  placeholder="https://example.com/logo.png"
                  value={companySettings.logoUrl}
                  onChange={e => setCompanySettings({...companySettings, logoUrl: e.target.value})}
                />
                <p className="text-[10px] text-slate-400 mt-2">Recommended: Square SVG or PNG with transparent background.</p>
              </div>
              <button 
                onClick={handleSaveBranding}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all"
              >
                Save Branding Profile
              </button>
            </div>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 flex flex-col items-center justify-center space-y-6 shadow-sm">
             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Preview</div>
             <div className="w-32 h-32 rounded-3xl bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100">
                {companySettings.logoUrl ? (
                  <img src={companySettings.logoUrl} alt="Company Logo" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-4xl">🏢</span>
                )}
             </div>
             <div className="text-center">
                <h4 className="text-xl font-bold text-slate-900">{companySettings.name}</h4>
                <p className="text-xs text-slate-500 mt-2 max-w-xs">{companySettings.address}</p>
             </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6">Database Connectivity</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">DB Host</label>
                  <input 
                    type="text" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm"
                    value={dbConfig.host}
                    onChange={e => setDbConfig({...dbConfig, host: e.target.value})}
                  />
                </div>
                <button 
                  onClick={handleSaveConfig}
                  className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-xs"
                >
                  Save Connection Config
                </button>
                <div className="pt-4">
                  <button 
                    onClick={handleGenerateSql}
                    className="w-full py-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl font-bold text-xs hover:bg-emerald-100 transition-all"
                  >
                    📜 Generate SQL Schema Script
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Master Inquiry Pruning</h3>
              <span className="text-[10px] font-bold text-slate-400">{inquiries.length} Total Records</span>
            </div>
            <table className="w-full text-left">
              <tbody className="divide-y divide-slate-100">
                {inquiries.map(inq => (
                  <tr key={inq.id} className="group hover:bg-slate-50">
                    <td className="px-8 py-4 font-mono text-xs font-bold text-indigo-600">{inq.id}</td>
                    <td className="px-8 py-4 text-sm font-bold text-slate-800">{inq.customerName}</td>
                    <td className="px-8 py-4 text-right">
                      <button 
                        onClick={() => onDeleteInquiry(inq.id)}
                        className="text-[10px] font-bold text-rose-500 opacity-0 group-hover:opacity-100"
                      >
                        Purge Record
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals for Add User and Password Reset */}
      {showAddUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <form onSubmit={handleAddUser} className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">Provision User</h3>
              <button type="button" onClick={() => setShowAddUser(false)} className="text-slate-400 hover:text-slate-600 text-2xl">✕</button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                <input name="name" required className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Email</label>
                <input name="email" type="email" required className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Role</label>
                <select name="role" className="w-full border border-slate-200 rounded-xl p-3 text-sm">
                  <option value={UserRole.USER}>Standard Marketing User</option>
                  <option value={UserRole.ADMIN}>System Administrator</option>
                </select>
              </div>
            </div>
            <div className="p-8 bg-slate-50 flex space-x-4">
              <button type="button" onClick={() => setShowAddUser(false)} className="flex-1 py-3 text-slate-500 font-bold text-xs uppercase">Cancel</button>
              <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase">Authorize User</button>
            </div>
          </form>
        </div>
      )}

      {passwordResetUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <form onSubmit={handleResetPassword} className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">Security: Reset Password</h3>
              <button type="button" onClick={() => setPasswordResetUser(null)} className="text-slate-400 hover:text-slate-600 text-2xl">✕</button>
            </div>
            <div className="p-8 space-y-6">
              <p className="text-xs text-slate-500 italic">Updating password for <strong>{passwordResetUser.name}</strong></p>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">New Password</label>
                <input name="password" type="password" required className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500" placeholder="••••••••" />
              </div>
            </div>
            <div className="p-8 bg-slate-50 flex space-x-4">
              <button type="button" onClick={() => setPasswordResetUser(null)} className="flex-1 py-3 text-slate-500 font-bold text-xs uppercase">Cancel</button>
              <button type="submit" className="flex-1 py-3 bg-rose-600 text-white rounded-xl font-bold text-xs uppercase shadow-lg shadow-rose-100">Commit Changes</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
