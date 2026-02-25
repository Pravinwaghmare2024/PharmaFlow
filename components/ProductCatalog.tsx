
import React, { useState } from 'react';
import { Product } from '../types';

interface ProductCatalogProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({ products, onAddProduct }) => {
  const [filter, setFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    category: 'Antibiotics',
    dosageForm: 'Tablet'
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
      category: newProduct.category as any || 'Antibiotics',
      stock: Number(newProduct.stock) || 0,
    };

    onAddProduct(product);
    setShowAddModal(false);
    setNewProduct({ category: 'Antibiotics', dosageForm: 'Tablet' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Product Catalog</h2>
          <p className="text-slate-500 text-sm">Enterprise drug inventory and pricing index</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex bg-slate-200 p-1 rounded-xl">
            {['All', 'Antibiotics', 'Chronic', 'OTC', 'Specialty'].map((cat) => (
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
          <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all group flex flex-col">
            <div className="h-32 bg-slate-50 relative flex items-center justify-center">
              <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
                {p.category === 'Antibiotics' ? '💊' : p.category === 'Chronic' ? '🩸' : p.category === 'OTC' ? '🛒' : '🧪'}
              </span>
              <span className="absolute top-4 right-4 bg-white/80 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-slate-500 border border-slate-100">
                {p.id}
              </span>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-blue-600 transition-colors">{p.name}</h3>
                <span className="text-blue-600 font-extrabold text-lg">${p.unitPrice.toFixed(2)}</span>
              </div>
              <p className="text-xs text-slate-400 mb-4">{p.strength} • {p.dosageForm} • {p.packSize}</p>
              
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
                <button className="w-full border border-slate-200 text-slate-700 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors group-hover:border-blue-200">
                  Update Pricing / Stock
                </button>
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
                    onChange={e => setNewProduct({...newProduct, category: e.target.value as any})}
                  >
                    <option value="Antibiotics">Antibiotics</option>
                    <option value="Chronic">Chronic</option>
                    <option value="OTC">OTC</option>
                    <option value="Specialty">Specialty</option>
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
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Unit Price ($)</label>
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
