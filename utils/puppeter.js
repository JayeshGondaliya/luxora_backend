import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 🧾 HTML Template Generator
function escapeHtml(unsafe) {
  return unsafe
    .replace(/[&<"'>]/g, (match) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    })[match]);
}
function generateInvoiceHTML(order) {
  // Helper function to escape HTML
  const escapeHtml = (unsafe) => {
    if (!unsafe) return '';
    return unsafe.toString()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  // Format currency with Indian numbering system
  const formatCurrency = (amount) => {
    return '₹' + (Number(amount) || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Calculate dates
  const invoiceDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 7);
  const formattedDueDate = dueDate.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  // Calculate totals
  const subtotal = order.items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const taxRate = 0.18; // 18% GST
  const taxAmount = subtotal * taxRate;
  const totalAmount = subtotal + taxAmount;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice ${escapeHtml(order.invoiceNumber || order.sessionId)}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
    
    :root {
      --primary-color: #5A189A;
      --secondary-color: #7B2CBF;
      --accent-color: #9D4EDD;
      --text-color: #333333;
      --light-text: #666666;
      --border-color: #eeeeee;
      --light-bg: #f9f9f9;
      --success-color: #1F7B1F;
      --success-bg: #E6F7E6;
      --danger-color: #D32F2F;
      --danger-bg: #FFECEC;
    }
    
    body {
      font-family: 'Poppins', sans-serif;
      background-color: #ffffff;
      padding: 0;
      margin: 0;
      color: var(--text-color);
      line-height: 1.6;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--border-color);
    }
    .logo-container {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    .logo {
      font-size: 24px;
      font-weight: 700;
      color: var(--primary-color);
      background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .company-details {
      color: var(--light-text);
      font-size: 13px;
      line-height: 1.5;
    }
    .invoice-title {
      text-align: right;
    }
    h1 {
      font-size: 28px;
      color: var(--text-color);
      margin: 0;
      font-weight: 600;
      letter-spacing: -0.5px;
    }
    .invoice-number {
      color: var(--light-text);
      font-size: 16px;
      margin-top: 5px;
    }
    .details-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 30px;
    }
    .detail-box {
      padding: 20px;
      background: var(--light-bg);
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    .detail-title {
      font-weight: 600;
      color: var(--primary-color);
      margin-bottom: 12px;
      font-size: 16px;
      padding-bottom: 8px;
      border-bottom: 1px dashed var(--border-color);
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin: 30px 0;
      font-size: 15px;
    }
    .items-table th {
      background-color: var(--primary-color);
      color: white;
      padding: 14px 16px;
      text-align: left;
      font-weight: 500;
      font-size: 15px;
    }
    .items-table td {
      padding: 12px 16px;
      border-bottom: 1px solid var(--border-color);
    }
    .items-table tr:last-child td {
      border-bottom: none;
    }
    .text-right {
      text-align: right;
    }
    .text-center {
      text-align: center;
    }
    .total-section {
      background: var(--light-bg);
      padding: 25px;
      border-radius: 10px;
      margin-top: 20px;
      width: 50%;
      margin-left: auto;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
    }
    .total-label {
      font-weight: 500;
    }
    .total-amount {
      font-weight: 600;
    }
    .grand-total {
      font-size: 18px;
      color: var(--primary-color);
      border-top: 1px solid var(--border-color);
      padding-top: 12px;
      margin-top: 12px;
    }
    .footer {
      margin-top: 40px;
      text-align: center;
      color: var(--light-text);
      font-size: 14px;
      border-top: 1px solid var(--border-color);
      padding-top: 20px;
    }
    .status-badge {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 500;
      background-color: ${order.payments_status === 'paid' ? 'var(--success-bg)' : 'var(--danger-bg)'};
      color: ${order.payments_status === 'paid' ? 'var(--success-color)' : 'var(--danger-color)'};
    }
    .payment-info {
      margin-top: 30px;
      padding: 20px;
      background: #f5f5ff;
      border-radius: 10px;
      font-size: 14px;
      border-left: 4px solid var(--accent-color);
    }
    .notes {
      margin-top: 20px;
      font-size: 14px;
      color: var(--light-text);
      line-height: 1.6;
    }
    .watermark {
      position: fixed;
      opacity: 0.1;
      font-size: 120px;
      font-weight: 700;
      color: var(--primary-color);
      transform: rotate(-30deg);
      pointer-events: none;
      z-index: -1;
      top: 30%;
      left: 10%;
    }
    @media print {
      body {
        padding: 0;
      }
      .container {
        padding: 20px;
      }
      .watermark {
        opacity: 0.05;
      }
    }
  </style>
</head>
<body>
  <div class="watermark">LUXNOVA</div>
  <div class="container">
    <div class="header">
      <div>
        <div class="logo-container">
          <div class="logo">LUXNOVA</div>
        </div>
        <div class="company-details">
          207, Galleria park<br>
          Karnataka 560001, India<br>
          
        </div>
      </div>
      <div class="invoice-title">
        <h1> INVOICE</h1>
       
        <div style="margin-top: 15px;">
          <span class="status-badge">${escapeHtml(order.payments_status.toUpperCase())}</span>
        </div>
      </div>
    </div>

    <div class="details-section">
      <div class="detail-box">
        <div class="detail-title">BILLED TO</div>
        <p style="margin: 8px 0; font-weight: 500;">${escapeHtml(order.name)}</p>
        ${order.address ? `<p style="margin: 5px 0; color: var(--light-text);">${escapeHtml(order.address)}</p>` : ''}
        <p style="margin: 5px 0; color: var(--light-text);">${escapeHtml(order.email)}</p>
        ${order.phone ? `<p style="margin: 5px 0; color: var(--light-text);">Phone: ${escapeHtml(order.phone)}</p>` : ''}
        ${order.gstin ? `<p style="margin: 5px 0 0; color: var(--light-text);">GSTIN: ${escapeHtml(order.gstin)}</p>` : ''}
      </div>
      <div class="detail-box">
        <div class="detail-title">INVOICE DETAILS</div>
        <p style="margin: 8px 0;"><strong>Invoice Date:</strong> ${invoiceDate}</p>
        <p style="margin: 8px 0;"><strong>Due Date:</strong> ${formattedDueDate}</p>
        ${order.poNumber ? `<p style="margin: 8px 0;"><strong>PO Number:</strong> ${escapeHtml(order.poNumber)}</p>` : ''}
      </div>
    </div>

    <table class="items-table">
      <thead>
        <tr>
          <th>DESCRIPTION</th>
          <th class="text-center">QTY</th>
          <th class="text-right">RATE</th>
          <th class="text-right">AMOUNT (₹)</th>
        </tr>
      </thead>
      <tbody>
        ${order.items.map((item, index) => {
          const amount = Number(item.amount) || 0;
          const quantity = item.quantity || 1;
          const unitPrice = amount / quantity;
          return `
            <tr>
              <td>${escapeHtml(item.name)}</td>
              <td class="text-center">${quantity}</td>
              <td class="text-right">${formatCurrency(unitPrice)}</td>
              <td class="text-right">${formatCurrency(amount)}</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>

    <div class="total-section">
      <div class="total-row">
        <span class="total-label">Subtotal:</span>
        <span class="total-amount">${formatCurrency(subtotal)}</span>
      </div>
      <div class="total-row">
        <span class="total-label">GST (18%):</span>
        <span class="total-amount">${formatCurrency(taxAmount)}</span>
      </div>
      <div class="total-row grand-total">
        <span class="total-label">Total Amount:</span>
        <span class="total-amount">${formatCurrency(totalAmount)}</span>
      </div>
      ${order.amountPaid ? `
        <div class="total-row">
          <span class="total-label">Amount Paid:</span>
          <span class="total-amount">${formatCurrency(order.amountPaid)}</span>
        </div>
        <div class="total-row grand-total">
          <span class="total-label">Balance Due:</span>
          <span class="total-amount">${formatCurrency(totalAmount - (order.amountPaid || 0))}</span>
        </div>
      ` : ''}
    </div>

   
    <div class="notes">
      <strong>TERMS & CONDITIONS:</strong><br>
      - Payment due within 7 days of invoice date<br>
      - Late payments subject to 1.5% monthly interest<br>
      - Please include invoice number as payment reference<br>
      - Goods sold are not returnable<br>
      - All disputes subject to Bengaluru jurisdiction
    </div>

    <div class="footer">
      <p>Thank you for your business!</p>
      <p>For any queries, please contact accounts@luxnova.com or call +91 9876543210</p>
      <p>© ${new Date().getFullYear()} Luxnova Technologies Pvt Ltd. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
}

// 🚀 API Controller to Generate PDF
export const pdfGenerates = async (req, res) => {
  const { sessionId, userId, email, name, payments_status, totalAmount, items } = req.body;
  const orderData = { sessionId, userId, email, name, payments_status, totalAmount, items };

  console.log("orders data:-", orderData);

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    const htmlContent = generateInvoiceHTML(orderData);
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const invoicesDir = path.join(__dirname, '../invoices');
    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir);
    }

    const pdfPath = path.join(invoicesDir, `invoice_${sessionId}.pdf`);
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
    });

    await browser.close();

    res.status(200).json({ success: true, pdfPath: `pdf/invoice_${sessionId}.pdf` });
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({ success: false, message: "PDF generation failed" });
  }
};
