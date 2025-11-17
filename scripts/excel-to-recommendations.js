// scripts/excel-to-recommendations.js
// Script para convertir hoja "Recomendaciones" de Excel a JSON

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

/**
 * Convierte archivo Excel con recomendaciones a formato JSON
 * @param {string} excelPath - Ruta al archivo Excel
 * @param {string} outputPath - Ruta donde guardar el JSON (opcional)
 */
function convertExcelToRecommendations(excelPath, outputPath) {
  try {
    console.log('📖 Leyendo archivo Excel:', excelPath);
    
    // Leer el archivo Excel
    const workbook = XLSX.readFile(excelPath);
    
    // Buscar hoja "Recomendaciones"
    if (!workbook.Sheets['Recomendaciones']) {
      throw new Error('No se encontró la hoja "Recomendaciones" en el archivo Excel');
    }
    
    const sheet = workbook.Sheets['Recomendaciones'];
    
    // Convertir a JSON
    let data = XLSX.utils.sheet_to_json(sheet);
    
    // Intentar con diferentes rangos si está vacío
    if (data.length === 0 || !data[0]['Metrica']) {
      data = XLSX.utils.sheet_to_json(sheet, { range: 1 });
    }
    if (data.length === 0 || !data[0]['Metrica']) {
      data = XLSX.utils.sheet_to_json(sheet, { range: 2 });
    }
    
    console.log(`✅ Se encontraron ${data.length} recomendaciones`);
    
    // Agrupar por métrica
    const recommendations = {};
    
    data.forEach((row, index) => {
      const metricKey = row['Metrica'] || row['Métrica'];
      const condition = row['Condicion'] || row['Condición'] || 'default';
      const text = row['Recomendacion'] || row['Recomendación'];
      const priority = (row['Prioridad'] || 'media').toLowerCase();
      
      if (!metricKey || !text) {
        console.warn(`⚠️  Fila ${index + 2} ignorada: falta métrica o recomendación`);
        return;
      }
      
      if (!recommendations[metricKey]) {
        recommendations[metricKey] = [];
      }
      
      recommendations[metricKey].push({
        condition: condition.trim(),
        text: text.trim(),
        priority: priority.trim()
      });
    });
    
    // Mostrar resumen
    console.log('\n📊 Resumen de recomendaciones por métrica:');
    Object.keys(recommendations).forEach(metric => {
      console.log(`   • ${metric}: ${recommendations[metric].length} recomendaciones`);
    });
    
    // Guardar JSON
    const output = outputPath || path.join(__dirname, '../public/data/recommendations.json');
    fs.writeFileSync(output, JSON.stringify(recommendations, null, 2), 'utf-8');
    
    console.log(`\n✅ Archivo JSON generado: ${output}`);
    console.log('🎉 Conversión completada exitosamente\n');
    
    return recommendations;
    
  } catch (error) {
    console.error('❌ Error al convertir Excel a JSON:', error.message);
    throw error;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
📝 Uso: node excel-to-recommendations.js <ruta-excel> [ruta-salida-json]

Ejemplo:
  node excel-to-recommendations.js ./data/Recomendaciones.xlsx
  node excel-to-recommendations.js ./data/Recomendaciones.xlsx ./public/data/recommendations.json

📋 Estructura esperada en Excel (hoja "Recomendaciones"):
  ┌──────────────┬────────────┬─────────────────┬───────────┐
  │ Metrica      │ Condicion  │ Recomendacion   │ Prioridad │
  ├──────────────┼────────────┼─────────────────┼───────────┤
  │ testCases    │ avg >= 200 │ Excelente...    │ baja      │
  │ cycleTime    │ avg > 10   │ Alto Cycle...   │ alta      │
  └──────────────┴────────────┴─────────────────┴───────────┘

Métricas soportadas:
  • testCases
  • resolutionEfficiency
  • criticalBugs
  • criticalBugsStatus
  • cycleTime
  • defectDensity
    `);
    process.exit(1);
  }
  
  const excelPath = args[0];
  const outputPath = args[1];
  
  convertExcelToRecommendations(excelPath, outputPath);
}

module.exports = { convertExcelToRecommendations };
