
import React, { useState } from 'react';
import { Product } from '../types';

const INITIAL_PRODUCTS: Product[] = [
  { id: 'P1', name: 'Amoxicillin 500mg', dosageForm: 'Capsule', strength: '500mg', packSize: '10x10', unitPrice: 12.50, category: 'Antibiotics', stock: 1250 },
  { id: 'P2', name: 'Paracetamol 650mg', dosageForm: 'Tablet', strength: '650mg', packSize: '10x10', unitPrice: 5.20, category: 'OTC', stock: 5000 },
  { id: 'P3', name: 'Omeprazole 20mg', dosageForm: 'Delayed-Release', strength: '20mg', packSize: '14s', unitPrice: 8.75, category: 'Chronic', stock: 840 },
  { id: 'P4', name: 'Metformin 500mg', dosageForm: 'Tablet', strength: '500mg', packSize: '30s', unitPrice: 4.50, category: 'Chronic', stock: 2100 },
  { id: 'P5', name: 'Azithromycin 250mg', dosageForm: 'Tablet', strength: '250mg', packSize: '6s', unitPrice: 15.00, category: 'Antibiotics', stock: 450 },
  { id: 'P6', name: 'Insulin Glargine', dosageForm: 'Injection', strength: '100U/ml', packSize: '3ml Pen', unitPrice: 45.00, category: 'Specialty', stock: 120 },
];

const ProductCatalog: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [filter, setFilter] = useState('All');

  const filteredProducts = filter === 'All' 
    ? products 
    : products.filter(p => p.category === filter);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Product Catalog</h2>
          <p className="text-slate-500 text-sm">Enterprise drug inventory and pricing index</p>
        </div>
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
    </div>
  );
};

export default ProductCatalog;
