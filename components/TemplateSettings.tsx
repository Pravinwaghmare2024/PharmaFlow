
import React, { useState, useEffect } from 'react';
import { CompanySettings } from '../types';

interface TemplateSettingsProps {
  settings: CompanySettings;
  onUpdateSettings: (settings: CompanySettings) => void;
}

const TemplateSettings: React.FC<TemplateSettingsProps> = ({ settings, onUpdateSettings }) => {
  const [localSettings, setLocalSettings] = useState<CompanySettings>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocalSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleAddItem = (field: 'categories' | 'pharmacopoeias', value: string) => {
    if (!value.trim()) return;
    const items = localSettings[field] || [];
    if (items.includes(value.trim())) return;
    setLocalSettings(prev => ({
      ...prev,
      [field]: [...items, value.trim()]
    }));
  };

  const handleRemoveItem = (field: 'categories' | 'pharmacopoeias', index: number) => {
    const items = localSettings[field] || [];
    setLocalSettings(prev => ({
      ...prev,
      [field]: items.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    onUpdateSettings(localSettings);
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Template & Branding</h2>
          <p className="text-slate-500 text-sm">Customize your inquiries, quotations, and official documents</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-100 transition-all active:scale-95"
        >
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Company Info Section */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Company Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Company Name</label>
              <input 
                name="name"
                value={localSettings.name}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Address</label>
              <textarea 
                name="address"
                value={localSettings.address}
                onChange={handleChange}
                rows={3}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Email</label>
                <input 
                  name="email"
                  value={localSettings.email || ''}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Phone</label>
                <input 
                  name="phone"
                  value={localSettings.phone || ''}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Document Prefixes & Regional Section */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Document & Regional</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Quotation Prefix</label>
              <input 
                name="quotationPrefix"
                value={localSettings.quotationPrefix}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="QUO-"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Inquiry Prefix</label>
              <input 
                name="inquiryPrefix"
                value={localSettings.inquiryPrefix}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="INQ-"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Currency Symbol</label>
            <input 
              name="currencySymbol"
              value={localSettings.currencySymbol}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="$"
            />
          </div>
          
          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <p className="text-xs text-blue-600 leading-relaxed">
              <strong>Pro Tip:</strong> Prefixes help you organize documents by year or department. For example, <code>QUO-2024-</code>.
            </p>
          </div>
        </div>

        {/* Product Customization Section */}
        <div className="md:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-8">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Product Customization</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Categories Management */}
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Product Categories</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {(localSettings.categories || []).map((cat, i) => (
                  <span key={i} className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-2 border border-blue-100">
                    <span>{cat}</span>
                    <button onClick={() => handleRemoveItem('categories', i)} className="hover:text-blue-800">✕</button>
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                <input 
                  id="new-category"
                  className="flex-1 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Add new category..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddItem('categories', (e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
                <button 
                  onClick={() => {
                    const input = document.getElementById('new-category') as HTMLInputElement;
                    handleAddItem('categories', input.value);
                    input.value = '';
                  }}
                  className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Pharmacopoeias Management */}
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Pharmacopoeia Options (IP, BP, USP, etc.)</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {(localSettings.pharmacopoeias || []).map((p, i) => (
                  <span key={i} className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-2 border border-emerald-100">
                    <span>{p}</span>
                    <button onClick={() => handleRemoveItem('pharmacopoeias', i)} className="hover:text-emerald-800">✕</button>
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                <input 
                  id="new-pharmacopoeia"
                  className="flex-1 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Add new pharmacopoeia..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddItem('pharmacopoeias', (e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
                <button 
                  onClick={() => {
                    const input = document.getElementById('new-pharmacopoeia') as HTMLInputElement;
                    handleAddItem('pharmacopoeias', input.value);
                    input.value = '';
                  }}
                  className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* License Section */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">License & Activation</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <div>
                <p className="text-[10px] font-bold text-emerald-600 uppercase">License Status</p>
                <p className="text-sm font-bold text-emerald-800">Commercial Enterprise Active</p>
              </div>
              <span className="text-2xl">✅</span>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">License Key</label>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-mono text-slate-600 select-all">
                {settings.licenseKey || 'N/A'}
              </div>
            </div>
            
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase px-1">
              <span>Activated On</span>
              <span>{settings.activationDate ? new Date(settings.activationDate).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Terms & Footer Section */}
        <div className="md:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Standard Terms & Footer</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Terms and Conditions</label>
              <textarea 
                name="termsAndConditions"
                value={localSettings.termsAndConditions}
                onChange={handleChange}
                rows={5}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Standard payment terms, validity, etc."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Footer Text</label>
              <input 
                name="footerText"
                value={localSettings.footerText}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Thank you for your business!"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSettings;
