// scripts/inspect-excel.js
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const excelPath = path.join(__dirname, '../data/Reporte_QA_V1.xlsx');

if (!fs.existsSync(excelPath)) {
  console.error(`❌ Archivo no encontrado: ${excelPath}`);
  process.exit(1);
}

console.log(`\n📊 INSPECCIÓN DEL ARCHIVO EXCEL: ${excelPath}\n`);
console.log('='.repeat(70));

try {
  const workbook = XLSX.readFile(excelPath);
  
  console.log(`\n📋 Hojas encontradas (${workbook.SheetNames.length}):\n`);
  
  workbook.SheetNames.forEach((sheetName, idx) => {
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    
    console.log(`${idx + 1}. "${sheetName}"`);
    console.log(`   - Filas: ${data.length}`);
    
    if (data.length > 0) {
      const headers = Object.keys(data[0]);
      console.log(`   - Columnas (${headers.length}): ${headers.join(', ')}`);
      console.log(`   - Primer registro: ${JSON.stringify(data[0], null, 2)}`);
    }
    console.log('');
  });
  
  console.log('='.repeat(70) + '\n');

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
