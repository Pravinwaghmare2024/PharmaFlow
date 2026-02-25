
import React from 'react';
import { User, UserRole } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User | null;
  onLogout: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, user, onLogout, isOpen, onToggle }) => {
  const allMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', roles: [UserRole.ADMIN, UserRole.USER], category: 'Overview' },
    { id: 'leads', label: 'Leads & CRM', icon: '🎯', roles: [UserRole.ADMIN, UserRole.USER], category: 'Core Features' },
    { id: 'customers', label: 'Customers', icon: '🏢', roles: [UserRole.ADMIN, UserRole.USER], category: 'Core Features' },
    { id: 'inquiries', label: 'Inquiries', icon: '📨', roles: [UserRole.ADMIN, UserRole.USER], category: 'Core Features' },
    { id: 'quotations', label: 'Quotations', icon: '📝', roles: [UserRole.ADMIN, UserRole.USER], category: 'Core Features' },
    { id: 'inventory', label: 'Product Catalog', icon: '💊', roles: [UserRole.ADMIN, UserRole.USER], category: 'Operations' },
    { id: 'manufacturing', label: 'Manufacturing', icon: '🏭', roles: [UserRole.ADMIN], category: 'Operations' },
    { id: 'reports', label: 'Reports', icon: '📋', roles: [UserRole.ADMIN], category: 'Analytics' },
    { id: 'ai-assist', label: 'AI Marketing Assist', icon: '✨', roles: [UserRole.ADMIN, UserRole.USER], category: 'Analytics' },
    { id: 'admin', label: 'Admin Panel', icon: '🛡️', roles: [UserRole.ADMIN], category: 'System' },
  ];

  const filteredItems = allMenuItems.filter(item => user && item.roles.includes(user.role));

  const categories = Array.from(new Set(filteredItems.map(item => item.category)));

  return (
    <div className={`w-64 bg-slate-900 h-screen text-white flex flex-col fixed left-0 top-0 shadow-xl z-50 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-6 border-b border-slate-800 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-blue-400">PharmaFlow</h1>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-semibold">Enterprise Portal</p>
        </div>
        <button 
          onClick={onToggle}
          className="lg:hidden text-slate-400 hover:text-white"
        >
          ✕
        </button>
      </div>
      <nav className="flex-1 mt-6 px-4 overflow-y-auto">
        <div className="space-y-6">
          {categories.map(category => (
            <div key={category}>
              <h3 className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                {category}
              </h3>
              <ul className="space-y-1">
                {filteredItems.filter(item => item.category === category).map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                        activeTab === item.id
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="font-medium text-sm">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </nav>
      <div className="p-6 border-t border-slate-800 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold">
            {user?.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{user?.role}</p>
          </div>
        </div>
        <div className="pt-2 space-y-2">
          <button 
            onClick={onToggle}
            className="w-full text-left px-4 py-2 text-[10px] font-bold text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-widest"
          >
            ← Hide Menu
          </button>
          <button 
            onClick={onLogout}
            className="w-full text-left px-4 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            ✕ Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
