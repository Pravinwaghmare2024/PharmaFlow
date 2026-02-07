
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { InquiryStatus } from '../types';

const data = [
  { name: 'Mon', inquiries: 4, quotes: 2 },
  { name: 'Tue', inquiries: 3, quotes: 3 },
  { name: 'Wed', inquiries: 7, quotes: 4 },
  { name: 'Thu', inquiries: 5, quotes: 4 },
  { name: 'Fri', inquiries: 8, quotes: 6 },
];

const statusData = [
  { name: 'New', value: 30, color: '#3b82f6' },
  { name: 'Follow-up', value: 45, color: '#f59e0b' },
  { name: 'Converted', value: 25, color: '#22c55e' },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Sales Dashboard</h2>
        <div className="text-sm text-slate-500">Last updated: {new Date().toLocaleDateString()}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Inquiries', value: '142', change: '+12%', color: 'text-blue-600' },
          { label: 'Pending Quotes', value: '28', change: '-3%', color: 'text-amber-600' },
          { label: 'Conversion Rate', value: '24.5%', change: '+2.1%', color: 'text-emerald-600' },
          { label: 'Total Revenue', value: '$124.5k', change: '+18%', color: 'text-indigo-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
            <div className="flex items-end justify-between mt-2">
              <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Weekly Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}} 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="inquiries" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Inquiries" />
                <Bar dataKey="quotes" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Quotes" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Inquiry Lifecycle</h3>
          <div className="h-64 flex">
            <ResponsiveContainer width="60%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-40 flex flex-col justify-center space-y-4">
              {statusData.map((s, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: s.color}}></div>
                  <span className="text-sm text-slate-600 font-medium">{s.name} ({s.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
