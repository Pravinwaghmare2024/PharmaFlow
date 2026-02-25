
import React, { useState } from 'react';
import { Batch, BatchStatus, InventoryItem, UnitType, Product } from '../types';

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'RM-001', name: 'Amoxicillin API', type: 'Raw Material', quantity: 250, unit: 'KG', minThreshold: 50 },
  { id: 'RM-002', name: 'Paracetamol Powder', type: 'Raw Material', quantity: 500, unit: 'KG', minThreshold: 100 },
  { id: 'PK-001', name: 'Standard Outer Box', type: 'Packaging', quantity: 1200, unit: 'BOX', minThreshold: 200 },
  { id: 'PK-002', name: 'Bulk Industrial Drum', type: 'Packaging', quantity: 45, unit: 'DRUM', minThreshold: 10 },
  { id: 'PK-003', name: 'Retail Foil Packet', type: 'Packaging', quantity: 15000, unit: 'PACKET', minThreshold: 1000 },
];

const INITIAL_BATCHES: Batch[] = [
  { 
    id: 'B-101', 
    batchNumber: 'AX2023-01', 
    productId: 'P1', 
    productName: 'Amoxicillin 500mg', 
    quantity: 5000, 
    unit: 'BOX', 
    status: BatchStatus.RELEASED, 
    manufacturingDate: '2023-11-01', 
    expiryDate: '2025-11-01' 
  },
  { 
    id: 'B-102', 
    batchNumber: 'PM2023-12', 
    productId: 'P2', 
    productName: 'Paracetamol 650mg', 
    quantity: 120, 
    unit: 'DRUM', 
    status: BatchStatus.IN_PRODUCTION, 
    manufacturingDate: '2023-11-15', 
    expiryDate: '2026-11-15' 
  },
];

interface ManufacturingManagerProps {
  products: Product[];
}

const ManufacturingManager: React.FC<ManufacturingManagerProps> = ({ products }) => {
  const [batches, setBatches] = useState<Batch[]>(INITIAL_BATCHES);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [showAddBatch, setShowAddBatch] = useState(false);
  const [showAddStock, setShowAddStock] = useState(false);

  const [newBatch, setNewBatch] = useState<Partial<Batch>>({
    status: BatchStatus.PLANNED,
    unit: 'BOX'
  });

  const [newStock, setNewStock] = useState<Partial<InventoryItem>>({
    type: 'Raw Material',
    unit: 'KG'
  });

  const handleCreateBatch = () => {
    if (!newBatch.batchNumber || !newBatch.productId) return;
    const prod = products.find(p => p.id === newBatch.productId);
    const batch: Batch = {
      id: `B-${Date.now()}`,
      batchNumber: newBatch.batchNumber!,
      productId: newBatch.productId!,
      productName: prod?.name || 'Unknown',
      quantity: Number(newBatch.quantity) || 0,
      unit: newBatch.unit as UnitType,
      status: BatchStatus.PLANNED,
      manufacturingDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    setBatches([batch, ...batches]);
    setShowAddBatch(false);
  };

  const handleAddStock = () => {
    if (!newStock.name || !newStock.quantity) return;
    const item: InventoryItem = {
      id: `RM-INV-${Date.now()}`,
      name: newStock.name!,
      type: newStock.type as any,
      quantity: Number(newStock.quantity),
      unit: newStock.unit as UnitType,
      minThreshold: Number(newStock.minThreshold) || 10
    };
    setInventory([item, ...inventory]);
    setShowAddStock(false);
  };

  const getStatusBadge = (status: BatchStatus) => {
    switch (status) {
      case BatchStatus.RELEASED: return 'bg-emerald-100 text-emerald-700';
      case BatchStatus.IN_PRODUCTION: return 'bg-blue-100 text-blue-700';
      case BatchStatus.PLANNED: return 'bg-slate-100 text-slate-700';
      case BatchStatus.QC_PENDING: return 'bg-amber-100 text-amber-700';
      default: return 'bg-rose-100 text-rose-700';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Manufacturing Unit</h2>
          <p className="text-slate-500 text-sm">Batch production and resource inventory control</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowAddStock(true)}
            className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-medium hover:bg-slate-50 transition-all text-sm shadow-sm"
          >
            📦 Add Stock
          </button>
          <button 
            onClick={() => setShowAddBatch(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold transition-all text-sm shadow-md"
          >
            + New Production Batch
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Inventory Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Current Inventory</h3>
            <div className="space-y-6">
              {inventory.map(item => (
                <div key={item.id} className="group">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{item.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{item.type} • {item.id}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-extrabold ${item.quantity < item.minThreshold ? 'text-rose-600' : 'text-slate-900'}`}>
                        {item.quantity.toLocaleString()} {item.unit}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        item.quantity < item.minThreshold ? 'bg-rose-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min(100, (item.quantity / (item.minThreshold * 5)) * 100)}%` }}
                    ></div>
                  </div>
                  {item.quantity < item.minThreshold && (
                    <p className="text-[10px] text-rose-500 font-bold mt-1 uppercase animate-pulse">Low Stock Alert</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Batch Tracking Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Active Production Batches</h3>
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Batch Info</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Yield</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dates</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {batches.map(batch => (
                  <tr key={batch.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-slate-900">{batch.batchNumber}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{batch.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-700 font-medium">{batch.productName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-blue-600">{batch.quantity} {batch.unit}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${getStatusBadge(batch.status)}`}>
                        {batch.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[10px] text-slate-500">MFG: {batch.manufacturingDate}</div>
                      <div className="text-[10px] text-rose-400 font-bold">EXP: {batch.expiryDate}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Batch Modal */}
      {showAddBatch && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-800 uppercase tracking-tight">Setup New Batch</h3>
              <button onClick={() => setShowAddBatch(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Batch Number</label>
                  <input 
                    type="text" 
                    placeholder="e.g. AMX-2024-001"
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={newBatch.batchNumber || ''}
                    onChange={e => setNewBatch({...newBatch, batchNumber: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Target Product</label>
                  <select 
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newBatch.productId || ''}
                    onChange={e => setNewBatch({...newBatch, productId: e.target.value})}
                  >
                    <option value="">Select Product...</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Planned Yield</label>
                  <input 
                    type="number" 
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm"
                    value={newBatch.quantity || ''}
                    onChange={e => setNewBatch({...newBatch, quantity: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Packaging Unit</label>
                  <select 
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm"
                    value={newBatch.unit || 'BOX'}
                    onChange={e => setNewBatch({...newBatch, unit: e.target.value as any})}
                  >
                    <option value="BOX">BOX</option>
                    <option value="DRUM">DRUM</option>
                    <option value="PACKET">PACKET</option>
                    <option value="KG">KG (Bulk Powder)</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 flex justify-end space-x-3">
              <button onClick={() => setShowAddBatch(false)} className="px-6 py-2 text-slate-600 font-bold">Cancel</button>
              <button 
                onClick={handleCreateBatch}
                className="px-8 py-2 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all"
              >
                Initiate Production
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Stock Modal */}
      {showAddStock && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-800">Inventory Creation</h3>
              <button onClick={() => setShowAddStock(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Resource Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Magnesium Stearate"
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm"
                  onChange={e => setNewStock({...newStock, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Category</label>
                  <select 
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm"
                    onChange={e => setNewStock({...newStock, type: e.target.value as any})}
                  >
                    <option value="Raw Material">Raw Material</option>
                    <option value="Packaging">Packaging</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Initial Quantity</label>
                  <div className="flex">
                    <input 
                      type="number" 
                      className="w-full border border-slate-200 rounded-l-xl p-3 text-sm"
                      onChange={e => setNewStock({...newStock, quantity: Number(e.target.value)})}
                    />
                    <select 
                      className="border border-slate-200 border-l-0 rounded-r-xl p-3 text-xs font-bold bg-slate-50"
                      onChange={e => setNewStock({...newStock, unit: e.target.value as any})}
                    >
                      <option value="KG">KG</option>
                      <option value="BOX">BOX</option>
                      <option value="DRUM">DRUM</option>
                      <option value="PACKET">PKT</option>
                    </select>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Low Stock Threshold</label>
                <input 
                  type="number" 
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm"
                  onChange={e => setNewStock({...newStock, minThreshold: Number(e.target.value)})}
                />
              </div>
            </div>
            <div className="p-6 bg-slate-50 flex justify-end space-x-3">
              <button onClick={() => setShowAddStock(false)} className="px-6 py-2 text-slate-600 font-bold">Discard</button>
              <button 
                onClick={handleAddStock}
                className="px-8 py-2 bg-slate-900 text-white rounded-xl font-bold shadow-xl hover:bg-slate-800 transition-all"
              >
                Add to Inventory
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManufacturingManager;
