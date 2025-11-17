// scripts/update-excel-data.js
const { ExcelQAProcessor } = require('../lib/excelProcessor.cjs');
const fs = require('fs');
const path = require('path');

async function updateDataFromExcel() {
  try {
    console.log('📊 Procesando archivo Excel...');
    
    const excelPath = path.join(__dirname, '../data/Reporte_QA_V1.xlsx');
    
    // Verificar que el archivo existe
    if (!fs.existsSync(excelPath)) {
      throw new Error(`Archivo no encontrado: ${excelPath}`);
    }
    console.log(`✓ Archivo encontrado: ${excelPath}`);
    
    const qaData = ExcelQAProcessor.processExcelFile(excelPath);
    
    // Verificar que qaData no es null/undefined
    if (!qaData) {
      throw new Error('El procesamiento retornó datos vacíos');
    }
    
    // Crear directorio si no existe
    const outputDir = path.join(__dirname, '../public/data');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log(`✓ Directorio creado: ${outputDir}`);
    }
    
    // Guardar como JSON para respaldo
    const outputPath = path.join(outputDir, 'qa-data.json');
    fs.writeFileSync(outputPath, JSON.stringify(qaData, null, 2));
    console.log(`✓ Datos guardados en: ${outputPath}`);
    
    // Guardar recomendaciones por separado si existen
    if (qaData.recommendations && Object.keys(qaData.recommendations).length > 0) {
      const recsPath = path.join(outputDir, 'recommendations.json');
      fs.writeFileSync(recsPath, JSON.stringify(qaData.recommendations, null, 2));
      console.log(`✓ Recomendaciones guardadas en: ${recsPath}`);
      console.log(`📝 Métricas con recomendaciones: ${Object.keys(qaData.recommendations).join(', ')}`);
    } else {
      console.log('ℹ️  No se encontró hoja "Recomendaciones" en Excel, usando valores por defecto');
    }
    
    console.log('✅ Datos procesados y guardados');
    console.log(`📄 Total bugs: ${qaData.summary?.totalBugs || 0}`);
    console.log(`📈 Sprints: ${qaData.sprintData?.length || 0}`);
    console.log(`👥 Desarrolladores: ${qaData.developerData?.length || 0}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

updateDataFromExcel();
