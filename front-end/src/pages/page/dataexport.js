import jsPDF from 'jspdf';
import 'jspdf-autotable';


export const exportTableToPDF = (tableId,date,employee) => {
    const doc = new jsPDF();
  
    const table = document.getElementById(tableId);
  
    const headers = Array.from(table.querySelectorAll('th:not(:last-child)')).map((header) => header.textContent.trim());
  
    const data = [];
    for (const row of table.querySelectorAll('tbody tr')) {
      const rowData = [];
      for (const cell of row.querySelectorAll('td:not(:last-child)')) {
        rowData.push(cell.textContent.trim());
      }
      data.push(rowData);
    }
  
    doc.autoTable({
      head: [headers],
      body: data,
    });
  
    let output = 'All'
    if (date!='') {
      output=date
    }
    if (date=='' && employee != '') {
      output = employee
    }
    doc.save(`${output}.pdf`);
  };
  
  