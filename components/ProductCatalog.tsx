
import React, { useState } from 'react';
import { Product, CompanySettings } from '../types';

interface ProductCatalogProps {
  products: Product[];
  settings: CompanySettings;
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateStock: (productId: string, newStock: number) => void;
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({ 
  products, 
  settings,
  onAddProduct,
  onDeleteProduct,
  onUpdateStock,
  onExport,
  onImport
}) => {
  const [filter, setFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    category: settings.categories?.[0] || 'Antibiotics',
    dosageForm: 'Tablet',
    pharmacopoeia: settings.pharmacopoeias?.[0] || 'IP'
  });

  const [stockUpdate, setStockUpdate] = useState({
    quantity: 0,
    type: 'Addition' as 'Addition' | 'Subtraction',
    batchType: 'Regular' as 'Regular' | 'Sample' | 'Urgent' | 'Trial'
  });

  const filteredProducts = filter === 'All' 
    ? products 
    : products.filter(p => p.category === filter);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.strength || !newProduct.unitPrice) return;

    const product: Product = {
      id: `P-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newProduct.name!,
      dosageForm: newProduct.dosageForm || 'Tablet',
      strength: newProduct.strength!,
      packSize: newProduct.packSize || '10x10',
      unitPrice: Number(newProduct.unitPrice),
      category: newProduct.category || settings.categories?.[0] || 'Antibiotics',
      pharmacopoeia: newProduct.pharmacopoeia || settings.pharmacopoeias?.[0] || 'IP',
      stock: Number(newProduct.stock) || 0,
      isBulk: newProduct.isBulk || false,
      bulkUnit: newProduct.bulkUnit,
      bulkQuantity: newProduct.bulkQuantity ? Number(newProduct.bulkQuantity) : undefined,
    };

    onAddProduct(product);
    setShowAddModal(false);
    setNewProduct({ 
      category: settings.categories?.[0] || 'Antibiotics', 
      dosageForm: 'Tablet',
      pharmacopoeia: settings.pharmacopoeias?.[0] || 'IP'
    });
  };

  const handleStockUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showStockModal) return;

    const change = stockUpdate.type === 'Addition' ? stockUpdate.quantity : -stockUpdate.quantity;
    const newStock = Math.max(0, showStockModal.stock + change);
    
    onUpdateStock(showStockModal.id, newStock);
    setShowStockModal(null);
    setStockUpdate({ quantity: 0, type: 'Addition', batchType: 'Regular' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Product Catalog</h2>
          <p className="text-slate-500 text-sm">Enterprise drug inventory and pricing index</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            <button 
              onClick={onExport}
              className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors flex items-center space-x-2"
              title="Export to JSON"
            >
              <span>📤</span>
              <span>Export</span>
            </button>
            <label className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors flex items-center space-x-2 cursor-pointer">
              <span>📥</span>
              <span>Import</span>
              <input type="file" accept=".json" onChange={onImport} className="hidden" />
            </label>
          </div>
          <div className="flex bg-slate-200 p-1 rounded-xl">
            {['All', ...(settings.categories || [])].map((cat) => (
              <button 
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === cat ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-100 transition-all active:scale-95"
          >
            + Add Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(p => (
          <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all group flex flex-col relative">
            <button 
              onClick={() => onDeleteProduct(p.id)}
              className="absolute top-2 right-2 z-10 text-slate-300 hover:text-rose-500 transition-colors p-1 bg-white/50 backdrop-blur rounded-lg opacity-0 group-hover:opacity-100"
              title="Delete Product"
            >
              ✕
            </button>
            <div className="h-32 bg-slate-50 relative flex items-center justify-center">
              <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
                {p.category === 'Antibiotics' ? '💊' : p.category === 'Chronic' ? '🩸' : p.category === 'OTC' ? '🛒' : '🧪'}
              </span>
              <span className="absolute top-4 left-4 bg-white/80 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-slate-500 border border-slate-100">
                {p.id}
              </span>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-blue-600 transition-colors">
                  {p.name} {p.pharmacopoeia && <span className="text-xs font-normal text-slate-400">({p.pharmacopoeia})</span>}
                </h3>
                <span className="text-blue-600 font-extrabold text-lg">{settings.currencySymbol}{p.unitPrice.toFixed(2)}</span>
              </div>
              <p className="text-xs text-slate-400 mb-2">{p.strength} • {p.dosageForm} • {p.packSize}</p>
              {p.isBulk && (
                <div className="mb-4 flex items-center space-x-2">
                  <span className="bg-amber-50 text-amber-600 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-100 uppercase">Bulk Product</span>
                  <span className="text-[10px] text-slate-500 font-medium">{p.bulkQuantity} {p.bulkUnit} per unit</span>
                </div>
              )}
              
              <div className="mt-auto space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Availability</span>
                  <span className={`font-bold ${p.stock < 500 ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {p.stock} units
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${p.stock < 500 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                    style={{ width: `${Math.min(100, (p.stock / 5000) * 100)}%` }}
                  ></div>
                </div>
                <button 
                  onClick={() => setShowStockModal(p)}
                  className="w-full border border-slate-200 text-slate-700 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors group-hover:border-blue-200"
                >
                  Update Pricing / Stock
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stock Update Modal */}
      {showStockModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <form onSubmit={handleStockUpdate} className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">Update Stock: {showStockModal.name}</h3>
              <button type="button" onClick={() => setShowStockModal(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="p-8 space-y-6">
              {showStockModal.isBulk && (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">📦</span>
                    <div>
                      <p className="text-[10px] font-bold text-amber-600 uppercase">Bulk Packaging</p>
                      <p className="text-xs font-medium text-amber-800">{showStockModal.bulkQuantity} {showStockModal.bulkUnit} per unit</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Update Type</label>
                  <select 
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm"
                    value={stockUpdate.type}
                    onChange={e => setStockUpdate({...stockUpdate, type: e.target.value as any})}
                  >
                    <option value="Addition">Addition (+)</option>
                    <option value="Subtraction">Subtraction (-)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Quantity</label>
                  <input 
                    type="number"
                    required
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm"
                    value={stockUpdate.quantity || ''}
                    onChange={e => setStockUpdate({...stockUpdate, quantity: Number(e.target.value)})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Batch Type</label>
                <select 
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm"
                  value={stockUpdate.batchType}
                  onChange={e => setStockUpdate({...stockUpdate, batchType: e.target.value as any})}
                >
                  <option value="Regular">Regular Production</option>
                  <option value="Sample">Sample / Promo</option>
                  <option value="Urgent">Urgent / Emergency</option>
                  <option value="Trial">R&D / Trial</option>
                </select>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-500 uppercase">Current Stock</span>
                  <span className="text-slate-800">{showStockModal.stock} units</span>
                </div>
                <div className="flex justify-between text-xs font-bold mt-2">
                  <span className="text-slate-500 uppercase">New Estimated Stock</span>
                  <span className="text-blue-600">
                    {stockUpdate.type === 'Addition' ? showStockModal.stock + stockUpdate.quantity : Math.max(0, showStockModal.stock - stockUpdate.quantity)} units
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 flex space-x-3">
              <button type="button" onClick={() => setShowStockModal(null)} className="flex-1 py-2 text-slate-500 font-bold text-xs uppercase">Cancel</button>
              <button type="submit" className="flex-1 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase shadow-lg">Confirm Update</button>
            </div>
          </form>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            <div className="p-8 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Add New Product</h3>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1">Inventory Management System</p>
              </div>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl">✕</button>
            </div>
            
            <div className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Product Name</label>
                  <input 
                    required 
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. Amoxicillin 500mg"
                    value={newProduct.name || ''}
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Category</label>
                  <select 
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    value={newProduct.category}
                    onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                  >
                    { (settings.categories || []).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Pharmacopoeia</label>
                  <select 
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    value={newProduct.pharmacopoeia}
                    onChange={e => setNewProduct({...newProduct, pharmacopoeia: e.target.value})}
                  >
                    <option value="">None</option>
                    { (settings.pharmacopoeias || []).map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Dosage Form</label>
                  <select 
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    value={newProduct.dosageForm}
                    onChange={e => setNewProduct({...newProduct, dosageForm: e.target.value})}
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Injection">Injection</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Ointment">Ointment</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Strength</label>
                  <input 
                    required 
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. 500mg"
                    value={newProduct.strength || ''}
                    onChange={e => setNewProduct({...newProduct, strength: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Pack Size</label>
                  <input 
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. 10x10"
                    value={newProduct.packSize || ''}
                    onChange={e => setNewProduct({...newProduct, packSize: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Unit Price ({settings.currencySymbol})</label>
                  <input 
                    required 
                    type="number"
                    step="0.01"
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="0.00"
                    value={newProduct.unitPrice || ''}
                    onChange={e => setNewProduct({...newProduct, unitPrice: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Initial Stock</label>
                  <input 
                    type="number"
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="0"
                    value={newProduct.stock || ''}
                    onChange={e => setNewProduct({...newProduct, stock: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                <div className="flex items-center space-x-3">
                  <input 
                    type="checkbox"
                    id="isBulk"
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    checked={newProduct.isBulk || false}
                    onChange={e => setNewProduct({...newProduct, isBulk: e.target.checked})}
                  />
                  <label htmlFor="isBulk" className="text-xs font-bold text-slate-700 uppercase tracking-wider cursor-pointer">Bulk Product Packaging</label>
                </div>

                {newProduct.isBulk && (
                  <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Bulk Unit</label>
                      <select 
                        className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        value={newProduct.bulkUnit || 'KG'}
                        onChange={e => setNewProduct({...newProduct, bulkUnit: e.target.value})}
                      >
                        <option value="KG">KG</option>
                        <option value="DRUM">DRUM</option>
                        <option value="BAG">BAG</option>
                        <option value="LITER">LITER</option>
                        <option value="TON">TON</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Qty per Unit</label>
                      <input 
                        type="number"
                        className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="e.g. 25"
                        value={newProduct.bulkQuantity || ''}
                        onChange={e => setNewProduct({...newProduct, bulkQuantity: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-8 bg-slate-50 flex space-x-4">
              <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 text-slate-500 font-bold text-xs uppercase tracking-widest hover:text-slate-800 transition-colors">Cancel</button>
              <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95">Add to Catalog</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProductCatalog;
