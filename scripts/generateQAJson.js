#!/usr/bin/env node
/**
 * generateQAJson.js
 * 
 * Script para generar JSON de QA a partir del archivo Excel.
 * Se ejecuta automáticamente en:
 * - npm run dev (antes de iniciar Next.js)
 * - npm run build (antes de compilar)
 * - Manualmente: node scripts/generateQAJson.js
 */

const fs = require('fs');
const path = require('path');

// Importar procesador Excel
const { ExcelQAProcessor } = require('../lib/excelProcessor.cjs');

// Prefer V2 if present, fallback to V1. Allow forcing via CLI flag --force-v2
const EXCEL_V2 = path.join(__dirname, '..', 'data', 'Reporte_QA_V2.xlsx');
const EXCEL_V1 = path.join(__dirname, '..', 'data', 'Reporte_QA_V1.xlsx');
let EXCEL_PATH = fs.existsSync(EXCEL_V2) ? EXCEL_V2 : EXCEL_V1;
if (process.argv.includes('--force-v2')) {
  EXCEL_PATH = EXCEL_V2;
}
if (process.argv.includes('--force-v1')) {
  EXCEL_PATH = EXCEL_V1;
}
const JSON_OUTPUT_PATH = path.join(__dirname, '..', 'data', 'qa-data.json');
const DATA_DIR = path.dirname(JSON_OUTPUT_PATH);

/**
 * Genera JSON desde Excel si el archivo Excel existe
 */
function generateJsonFromExcel() {
  try {
    // Verificar que el directorio de salida existe
    if (!fs.existsSync(DATA_DIR)) {
      console.log(`📁 Creando directorio: ${DATA_DIR}`);
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    // Verificar que el Excel existe
    if (!fs.existsSync(EXCEL_PATH)) {
      console.warn(`⚠️  Archivo Excel no encontrado: ${EXCEL_PATH}`);
      console.log('   Saltando generación de JSON. Se usará fallback en runtime.');
      return false;
    }

    console.log(`📊 Generando JSON desde Excel: ${path.basename(EXCEL_PATH)}`);

    // Procesar Excel
    const qaData = ExcelQAProcessor.processExcelFile(EXCEL_PATH);

    // Agregar metadata
    const outputData = {
      metadata: {
        version: '1.0',
        source: 'excel',
        generatedAt: new Date().toISOString(),
        excelFile: path.basename(EXCEL_PATH),
      },
      ...qaData,
    };

    // Guardar JSON
    fs.writeFileSync(JSON_OUTPUT_PATH, JSON.stringify(outputData, null, 2));
    console.log(`✅ JSON generado exitosamente: ${path.relative(process.cwd(), JSON_OUTPUT_PATH)}`);
    console.log(`   Tamaño: ${(fs.statSync(JSON_OUTPUT_PATH).size / 1024).toFixed(2)} KB`);

    return true;
  } catch (error) {
    console.error(`❌ Error generando JSON:`, error.message);
    return false;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const success = generateJsonFromExcel();
  process.exit(success ? 0 : 1);
}

module.exports = { generateJsonFromExcel };
