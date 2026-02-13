
import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'leads', label: 'Leads & CRM', icon: '🎯' },
    { id: 'manufacturing', label: 'Manufacturing', icon: '🏭' },
    { id: 'customers', label: 'Customers', icon: '🏢' },
    { id: 'inventory', label: 'Product Catalog', icon: '💊' },
    { id: 'inquiries', label: 'Inquiries', icon: '📨' },
    { id: 'quotations', label: 'Quotations', icon: '📝' },
    { id: 'reports', label: 'Reports', icon: '📋' },
    { id: 'deployment', label: 'Server Config', icon: '⚙️' },
    { id: 'ai-assist', label: 'AI Marketing Assist', icon: '✨' },
  ];

  return (
    <div className="w-64 bg-slate-900 h-screen text-white flex flex-col fixed left-0 top-0 shadow-xl z-50">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold tracking-tight text-blue-400">PharmaFlow CRM</h1>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold">Enterprise Portal</p>
      </div>
      <nav className="flex-1 mt-6 px-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-6 border-t border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold">JD</div>
          <div>
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-slate-400">System Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
