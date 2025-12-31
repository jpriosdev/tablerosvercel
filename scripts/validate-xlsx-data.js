// scripts/validate-xlsx-data.js
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const excelPath = path.join(__dirname, '../data/Reporte_QA_V1.xlsx');

function validateXlsxData() {
  console.log('\n📊 VALIDACIÓN DE DATOS EN XLSX\n');
  console.log('='.repeat(70));

  try {
    if (!fs.existsSync(excelPath)) {
      throw new Error(`Archivo no encontrado: ${excelPath}`);
    }

    const workbook = XLSX.readFile(excelPath);
    const report = {
      timestamp: new Date().toISOString(),
      file: excelPath,
      sheets: {},
      summary: {
        totalSheets: workbook.SheetNames.length,
        totalRecords: 0,
        dataQuality: {}
      }
    };

    console.log(`✓ Archivo: ${path.basename(excelPath)}`);
    console.log(`📋 Hojas encontradas: ${workbook.SheetNames.length}\n`);

    // Analizar cada hoja importante
    const sheetsToAnalyze = ['Reporte_Gral', 'Tendencia', 'Versiones', 'BUGS X DESARROLLADOR', 'BUG X MÓDULO', 'BUGS X SPRINT', 'BUGS X CATEGORÍA'];

    sheetsToAnalyze.forEach((sheetName, idx) => {
      const sheet = workbook.Sheets[sheetName];
      
      if (!sheet) {
        console.log(`${idx + 1}. ❌ "${sheetName}" - NO ENCONTRADA`);
        report.sheets[sheetName] = { found: false };
        return;
      }

      const data = XLSX.utils.sheet_to_json(sheet);
      const validRows = data.filter(row => Object.values(row).some(v => v !== null && v !== undefined && v !== ''));
      
      report.sheets[sheetName] = {
        found: true,
        totalRows: data.length,
        validRows: validRows.length,
        columns: Object.keys(data[0] || {}).length,
        firstRecord: data[0] || null
      };

      report.summary.totalRecords += validRows.length;

      console.log(`${idx + 1}. ✅ "${sheetName}"`);
      console.log(`   Filas totales: ${data.length} | Filas válidas: ${validRows.length}`);
      console.log(`   Columnas: ${Object.keys(data[0] || {}).length}`);
    });

    // Validación de data
    console.log('\n📋 VALIDACIÓN DE DATOS:\n');

    // 1. Validar Reporte General
    const reporteGral = workbook.Sheets['Reporte_Gral'];
    if (reporteGral) {
      const gralData = XLSX.utils.sheet_to_json(reporteGral);
      const stateCount = {};
      const moduleCount = {};
      
      gralData.forEach(row => {
        if (row['Estado']) stateCount[row['Estado']] = (stateCount[row['Estado']] || 0) + 1;
        if (row['Módulo']) moduleCount[row['Módulo']] = (moduleCount[row['Módulo']] || 0) + 1;
      });

      console.log(`Estado (Reporte_Gral):`);
      Object.entries(stateCount).forEach(([state, count]) => {
        console.log(`  - ${state}: ${count}`);
      });

      console.log(`\nMódulos (Reporte_Gral):`);
      Object.entries(moduleCount).forEach(([module, count]) => {
        console.log(`  - ${module}: ${count}`);
      });
    }

    // 2. Validar datos de Sprints
    const tendenciaSheet = workbook.Sheets['Tendencia'];
    if (tendenciaSheet) {
      const tendenciaData = XLSX.utils.sheet_to_json(tendenciaSheet);
      const validSprints = tendenciaData.filter(row => row['__EMPTY_1'] && String(row['__EMPTY_1']).includes('Sprint'));
      
      console.log(`\n✅ Sprints encontrados en Tendencia: ${validSprints.length}`);
      if (validSprints.length > 0) {
        console.log(`   Ejemplo: ${JSON.stringify(validSprints[0], null, 2)}`);
      }
    }

    // 3. Validar Versiones
    const versionesSheet = workbook.Sheets['Versiones'];
    if (versionesSheet) {
      const versionData = XLSX.utils.sheet_to_json(versionesSheet);
      const validVersions = versionData.filter(row => row['Versión'] && row['Sprint']);
      
      console.log(`\n✅ Versiones encontradas: ${validVersions.length}`);
      if (validVersions.length > 0) {
        console.log(`   Ejemplo: ${JSON.stringify(validVersions[0], null, 2)}`);
      }
    }

    // 4. Validar Desarrolladores
    const devSheet = workbook.Sheets['BUGS X DESARROLLADOR'];
    if (devSheet) {
      const devData = XLSX.utils.sheet_to_json(devSheet);
      // El primer registro es un encabezado, entonces empezamos desde el segundo
      const validDevs = devData.slice(1).filter(row => row['Reporte por DESARROLLADOR'] && row['Reporte por DESARROLLADOR'] !== 'Total general');
      
      console.log(`\n✅ Desarrolladores encontrados: ${validDevs.length}`);
      if (validDevs.length > 0) {
        console.log(`   Primeros 3:`);
        validDevs.slice(0, 3).forEach(dev => {
          console.log(`     - ${JSON.stringify(dev)}`);
        });
      }
    }

    // Guardar reporte
    const reportPath = path.join(__dirname, '../data/xlsx-validation-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log('\n' + '='.repeat(70));
    console.log(`✅ VALIDACIÓN COMPLETADA`);
    console.log(`📁 Reporte: ${path.basename(reportPath)}`);
    console.log('='.repeat(70) + '\n');

    return report;

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

validateXlsxData();
