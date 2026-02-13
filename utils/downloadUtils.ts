
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

export const generateInstallationGuide = () => {
  return `
PHARMAFLOW CRM - ENTERPRISE INSTALLATION GUIDE
Generated on: ${new Date().toLocaleString()}
--------------------------------------------------------------------------------

1. UBUNTU SERVER (NGINX) DEPLOYMENT
================================================================================

A. ENVIRONMENT PREPARATION:
   Run these commands to prepare your Ubuntu 22.04+ environment:
   
   $ sudo apt update && sudo apt upgrade -y
   $ sudo apt install nginx -y
   $ curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   $ sudo apt-get install -y nodejs

B. NGINX CONFIGURATION:
   Create a file at /etc/nginx/sites-available/pharma-flow:

   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/pharma-flow/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       gzip on;
       gzip_types text/plain text/css application/json application/javascript;
   }

C. DEPLOYMENT STEPS:
   1. Run 'npm run build' locally.
   2. Upload 'dist/' contents to /var/www/pharma-flow/dist.
   3. Enable site: sudo ln -s /etc/nginx/sites-available/pharma-flow /etc/nginx/sites-enabled/
   4. Restart: sudo systemctl restart nginx


2. WINDOWS SERVER (IIS) DEPLOYMENT
================================================================================

A. PREREQUISITES:
   - Install IIS (Internet Information Services) via Server Manager.
   - MANDATORY: Install URL Rewrite Module from:
     https://www.iis.net/downloads/microsoft/url-rewrite

B. WEB.CONFIG (Place in your application root):

   <?xml version="1.0" encoding="UTF-8"?>
   <configuration>
     <system.webServer>
       <rewrite>
         <rules>
           <rule name="React Routes" stopProcessing="true">
             <match url=".*" />
             <conditions logicalGrouping="MatchAll">
               <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
               <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
             </conditions>
             <action type="Rewrite" url="/" />
           </rule>
         </rules>
       </rewrite>
       <staticContent>
         <mimeMap fileExtension=".json" mimeType="application/json" />
       </staticContent>
     </system.webServer>
   </configuration>

C. IIS CONFIGURATION:
   - Set Application Pool to "No Managed Code".
   - Ensure 'IUSR' has 'Read' permissions on the folder.
   - Map physical path to the build/dist folder.

--------------------------------------------------------------------------------
SUPPORT: contact-admin@pharmaflow-enterprise.com
================================================================================
`;
};
