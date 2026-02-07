
export const downloadFile = (filename: string, content: string, mimeType: string = 'text/plain') => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const generateQuotationText = (quo: any) => {
  const lineItems = quo.items.map((item: any) => 
    `${item.productName.padEnd(30)} | Qty: ${item.quantity.toString().padEnd(5)} | Price: $${item.unitPrice.toFixed(2).padEnd(8)} | Total: $${item.total.toFixed(2)}`
  ).join('\n');

  return `
================================================================================
PHARMAFLOW CRM - OFFICIAL SALES QUOTATION
================================================================================
Quote ID: ${quo.id}
Date: ${quo.date}
Expiry: ${quo.expiryDate}
--------------------------------------------------------------------------------
CUSTOMER INFORMATION:
Name: ${quo.customerName}
Customer ID: ${quo.customerId}
--------------------------------------------------------------------------------
LINE ITEMS:
${lineItems}
--------------------------------------------------------------------------------
GRAND TOTAL: $${quo.totalAmount.toLocaleString()}
--------------------------------------------------------------------------------
NOTES:
This quotation is valid for 30 days. Prices are inclusive of applicable 
pharmaceutical taxes. 

Authorized Signature: _________________________  Date: ______________
================================================================================
  `;
};
