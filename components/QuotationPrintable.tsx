
import React from 'react';
import { Quotation, CompanySettings } from '../types';

interface QuotationPrintableProps {
  quotation: Quotation;
  settings: CompanySettings;
}

const QuotationPrintable: React.FC<QuotationPrintableProps> = ({ quotation, settings }) => {
  return (
    <div className="print-only p-12 bg-white text-slate-900 font-sans" id="printable-quotation">
      <div className="flex justify-between items-start border-b-2 border-slate-900 pb-8 mb-8">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900">{settings.name}</h1>
          <p className="text-sm text-slate-600 mt-2 max-w-xs">{settings.address}</p>
          <div className="mt-4 space-y-1 text-xs font-bold text-slate-500">
            {settings.email && <p>Email: {settings.email}</p>}
            {settings.phone && <p>Phone: {settings.phone}</p>}
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-5xl font-black text-slate-200 uppercase tracking-widest leading-none">Quotation</h2>
          <div className="mt-6 space-y-2">
            <p className="text-sm font-bold text-slate-900">Quote ID: <span className="text-blue-600">{quotation.id}</span></p>
            <p className="text-xs text-slate-500">Date: {quotation.date}</p>
            <p className="text-xs text-slate-500">Valid Until: {quotation.expiryDate}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-12 mb-12">
        <div>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Bill To:</h3>
          <div className="space-y-1">
            <p className="text-lg font-bold text-slate-900">{quotation.customerName}</p>
            <p className="text-xs text-slate-500">Customer ID: {quotation.customerId}</p>
          </div>
        </div>
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Summary</h3>
          <div className="flex justify-between items-end">
            <span className="text-xs text-slate-500">Total Items: {quotation.items.length}</span>
            <span className="text-2xl font-black text-slate-900">{settings.currencySymbol}{quotation.totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <table className="w-full mb-12">
        <thead>
          <tr className="border-b-2 border-slate-900 text-left">
            <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Description</th>
            <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Qty</th>
            <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Unit Price</th>
            <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {quotation.items.map((item, idx) => (
            <tr key={idx}>
              <td className="py-6">
                <p className="font-bold text-slate-900">{item.productName}</p>
                {item.pharmacopoeia && <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{item.pharmacopoeia} Standard</p>}
              </td>
              <td className="py-6 text-center font-bold text-slate-700">{item.quantity}</td>
              <td className="py-6 text-right font-medium text-slate-600">{settings.currencySymbol}{item.unitPrice.toFixed(2)}</td>
              <td className="py-6 text-right font-black text-slate-900">{settings.currencySymbol}{item.total.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-slate-900">
            <td colSpan={3} className="py-6 text-right text-sm font-black text-slate-400 uppercase tracking-widest">Grand Total</td>
            <td className="py-6 text-right text-2xl font-black text-blue-600">{settings.currencySymbol}{quotation.totalAmount.toLocaleString()}</td>
          </tr>
        </tfoot>
      </table>

      <div className="grid grid-cols-2 gap-12 mt-24">
        <div className="space-y-6">
          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Terms & Conditions</h4>
            <p className="text-[10px] text-slate-500 leading-relaxed whitespace-pre-wrap">{settings.termsAndConditions}</p>
          </div>
          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Notes</h4>
            <p className="text-[10px] text-slate-500 leading-relaxed">Prices are inclusive of applicable pharmaceutical taxes. This quotation is valid for 30 days from the date of issue.</p>
          </div>
        </div>
        <div className="flex flex-col justify-end items-end space-y-8">
          <div className="w-48 border-b border-slate-900 pb-2 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authorized Signature</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{settings.footerText}</p>
            <p className="text-[8px] text-slate-400 mt-1">Generated by PharmaFlow CRM Enterprise</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationPrintable;
