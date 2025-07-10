import type { SalaryCalculation } from '../types';

// Export to Excel
export function exportToExcel(calculation: SalaryCalculation) {
  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <meta name=ProgId content=Excel.Sheet>
      <meta name=Generator content="Microsoft Excel 15">
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
        }
        
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #2563eb;
          padding-bottom: 15px;
        }
        
        .company-name {
          font-size: 24px;
          font-weight: bold;
          color: #2563eb;
          margin-bottom: 5px;
        }
        
        .report-title {
          font-size: 16px;
          color: #666;
        }
        
        .net-salary-highlight {
          background-color: #2563eb;
          color: white;
          padding: 15px;
          text-align: center;
          font-size: 20px;
          font-weight: bold;
          border-radius: 8px;
          margin: 20px 0;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        
        th, td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }
        
        th {
          background-color: #f8f9fa;
          font-weight: bold;
          color: #2563eb;
        }
        
        .section-header {
          background-color: #e3f2fd;
          font-weight: bold;
          color: #1976d2;
        }
        
        .amount {
          text-align: right;
          font-weight: bold;
        }
        
        .positive {
          color: #059669;
        }
        
        .negative {
          color: #dc2626;
        }
        
        .footer {
          margin-top: 30px;
          text-align: center;
          color: #666;
          font-size: 12px;
          border-top: 1px solid #ddd;
          padding-top: 15px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-name">SARS Salary Calculator</div>
        <div class="report-title">Professional Salary Calculation Report</div>
        <div style="margin-top: 10px; color: #666; font-size: 14px;">
          Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
        </div>
      </div>

      ${calculation.employee_name ? `
      <table>
        <tr>
          <th colspan="2" class="section-header">Employee Information</th>
        </tr>
        <tr>
          <td><strong>Employee Name</strong></td>
          <td>${calculation.employee_name}</td>
        </tr>
      </table>
      ` : ''}

      <div class="net-salary-highlight">
        NET SALARY: R ${calculation.netSalary.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
      </div>

      <table>
        <tr>
          <th colspan="2" class="section-header">Salary Overview</th>
        </tr>
        <tr>
          <td><strong>Gross Salary</strong></td>
          <td class="amount positive">R ${calculation.grossSalary.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</td>
        </tr>
        <tr>
          <td><strong>PAYE Tax</strong></td>
          <td class="amount negative">R ${calculation.payeTax.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</td>
        </tr>
        <tr>
          <td><strong>UIF Contribution</strong></td>
          <td class="amount negative">R ${calculation.uifContribution.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</td>
        </tr>
        <tr>
          <td><strong>Total Deductions</strong></td>
          <td class="amount negative">R ${calculation.deductions.total.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</td>
        </tr>
        <tr>
          <td><strong>Total Additions</strong></td>
          <td class="amount positive">R ${calculation.additions.total.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</td>
        </tr>
      </table>

      <table>
        <tr>
          <th colspan="2" class="section-header">Deductions Breakdown</th>
        </tr>
        <tr>
          <td>Medical Aid</td>
          <td class="amount">R ${calculation.deductions.medicalAid.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</td>
        </tr>
        <tr>
          <td>Pension Fund</td>
          <td class="amount">R ${calculation.deductions.pensionFund.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</td>
        </tr>
        <tr>
          <td>Other Deductions</td>
          <td class="amount">R ${calculation.deductions.other.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</td>
        </tr>
      </table>

      <table>
        <tr>
          <th colspan="2" class="section-header">Additions Breakdown</th>
        </tr>
        <tr>
          <td>Overtime Pay</td>
          <td class="amount">R ${calculation.additions.overtime.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</td>
        </tr>
        <tr>
          <td>Allowances</td>
          <td class="amount">R ${calculation.additions.allowances.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</td>
        </tr>
      </table>

      <table>
        <tr>
          <th colspan="2" class="section-header">Summary Statistics</th>
        </tr>
        <tr>
          <td><strong>Effective Tax Rate</strong></td>
          <td class="amount">${((calculation.payeTax / calculation.grossSalary) * 100).toFixed(2)}%</td>
        </tr>
        <tr>
          <td><strong>Take-home Percentage</strong></td>
          <td class="amount">${((calculation.netSalary / calculation.grossSalary) * 100).toFixed(2)}%</td>
        </tr>
      </table>

      <div class="footer">
        <p><strong>This calculation is based on current SARS tax tables and regulations.</strong></p>
        <p>Generated by SARS Salary Calculator - Professional Payroll Solutions</p>
        <p>For support, contact: support@sarscalculator.co.za</p>
      </div>
    </body>
    </html>
  `;

  // Create blob with proper Excel MIME type for HTML-based .xls
  const blob = new Blob([html], {
    type: 'application/vnd.ms-excel'
  });
  
  // Create download link and trigger download
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = `Salary_Calculation_${calculation.employee_name || 'Report'}_${new Date().toISOString().slice(0, 10)}.xls`;
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  URL.revokeObjectURL(url);
}

// Export to PDF (using browser print)
export function exportToPDF(calculation: SalaryCalculation) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Salary Calculation - ${calculation.employee_name || 'Report'}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.3;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 15px;
          font-size: 13px;
        }
        
        .header {
          text-align: center;
          border-bottom: 2px solid #2563eb;
          padding-bottom: 12px;
          margin-bottom: 18px;
        }
        
        .company-name {
          font-size: 20px;
          font-weight: bold;
          color: #2563eb;
          margin-bottom: 3px;
        }
        
        .report-title {
          font-size: 14px;
          color: #666;
        }
        
        .section {
          margin-bottom: 15px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 12px;
        }
        
        .section-title {
          font-size: 14px;
          font-weight: bold;
          color: #2563eb;
          margin-bottom: 8px;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 3px;
        }
        
        .calculation-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 8px;
        }
        
        .calculation-item {
          display: flex;
          justify-content: space-between;
          padding: 4px 0;
          border-bottom: 1px dotted #d1d5db;
          font-size: 12px;
        }
        
        .calculation-item:last-child {
          border-bottom: none;
        }
        
        .label {
          font-weight: 500;
        }
        
        .value {
          font-weight: bold;
          color: #059669;
        }
        
        .total-row {
          background-color: #2563eb;
          color: white;
          padding: 10px;
          border-radius: 6px;
          font-weight: bold;
          font-size: 16px;
          text-align: center;
          margin: 10px 0;
        }
        
        .compact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
        }
        
        .compact-item {
          font-size: 11px;
          padding: 6px;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          text-align: center;
        }
        
        .compact-label {
          font-weight: 500;
          color: #666;
          display: block;
          margin-bottom: 2px;
        }
        
        .compact-value {
          font-weight: bold;
          color: #2563eb;
        }
        
        .footer {
          margin-top: 20px;
          text-align: center;
          color: #666;
          font-size: 10px;
          border-top: 1px solid #e5e7eb;
          padding-top: 12px;
        }
        
        @media print {
          body { 
            margin: 0; 
            padding: 10px;
            font-size: 11px;
          }
          
          .section {
            page-break-inside: avoid;
            margin-bottom: 10px;
            padding: 8px;
          }
          
          .header {
            margin-bottom: 12px;
            padding-bottom: 8px;
          }
          
          .no-print { display: none; }
          
          /* Force everything to fit on one page */
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-name">SARS Salary Calculator</div>
        <div class="report-title">Salary Calculation Report</div>
        <div style="margin-top: 10px; color: #666; font-size: 14px;">
          Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
        </div>
      </div>

      ${calculation.employee_name ? `
      <div class="section">
        <div class="section-title">Employee Information</div>
        <div class="calculation-item">
          <span class="label">Employee Name:</span>
          <span class="value">${calculation.employee_name}</span>
        </div>
      </div>
      ` : ''}

      <div class="section">
        <div class="section-title">Salary Overview</div>
        <div class="calculation-grid">
          <div>
            <div class="calculation-item">
              <span class="label">Gross Salary</span>
              <span class="value">R ${calculation.grossSalary.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
            </div>
            <div class="calculation-item">
              <span class="label">PAYE Tax</span>
              <span class="value">R ${calculation.payeTax.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
            </div>
            <div class="calculation-item">
              <span class="label">UIF Contribution</span>
              <span class="value">R ${calculation.uifContribution.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
          
          <div>
            <div class="calculation-item">
              <span class="label">Total Deductions</span>
              <span class="value">R ${calculation.deductions.total.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
            </div>
            <div class="calculation-item">
              <span class="label">Total Additions</span>
              <span class="value">R ${calculation.additions.total.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
            </div>
            <div class="calculation-item">
              <span class="label">Tax Rate</span>
              <span class="value">${((calculation.payeTax / calculation.grossSalary) * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
        
        <div class="total-row">
          NET SALARY: R ${calculation.netSalary.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
        </div>
      </div>

      <div class="section">
        <div class="section-title">Breakdown Details</div>
        <div class="compact-grid">
          <div class="compact-item">
            <span class="compact-label">Medical Aid</span>
            <span class="compact-value">R ${calculation.deductions.medicalAid.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
          </div>
          <div class="compact-item">
            <span class="compact-label">Pension Fund</span>
            <span class="compact-value">R ${calculation.deductions.pensionFund.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
          </div>
          <div class="compact-item">
            <span class="compact-label">Other Deductions</span>
            <span class="compact-value">R ${calculation.deductions.other.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
          </div>
          <div class="compact-item">
            <span class="compact-label">Overtime Pay</span>
            <span class="compact-value">R ${calculation.additions.overtime.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
          </div>
          <div class="compact-item">
            <span class="compact-label">Allowances</span>
            <span class="compact-value">R ${calculation.additions.allowances.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
          </div>
          <div class="compact-item">
            <span class="compact-label">Take-home %</span>
            <span class="compact-value">${((calculation.netSalary / calculation.grossSalary) * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>

      <div class="footer">
        <p>This calculation is based on current SARS tax tables and regulations.</p>
        <p>Generated by SARS Salary Calculator - Professional Payroll Solutions</p>
      </div>

      <script>
        window.onload = function() {
          window.print();
          window.onafterprint = function() {
            window.close();
          };
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
} 