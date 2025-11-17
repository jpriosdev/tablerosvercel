// scripts/create-excel-recommendations.js
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

console.log('📋 Generando archivo Excel de Recomendaciones...\n');

try {
  // Leer recommendations.json
  const recommendationsPath = path.join(__dirname, '../public/data/recommendations.json');
  const recommendations = JSON.parse(fs.readFileSync(recommendationsPath, 'utf8'));

  // Crear array para la hoja
  const rows = [['Metrica', 'Condicion', 'Recomendacion', 'Prioridad', 'Parametros_Rangos']];

  // Convertir cada métrica a filas (filtrar _legacy)
  Object.keys(recommendations).filter(key => key !== '_legacy').forEach(metricKey => {
    const metricRecs = recommendations[metricKey];
    if (Array.isArray(metricRecs)) {
      metricRecs.forEach(rec => {
        const parametrosStr = rec.parametros ? JSON.stringify(rec.parametros) : '';
        rows.push([
          metricKey,
          rec.condition,
          rec.text,
          rec.priority,
          parametrosStr
        ]);
      });
    }
  });

  // Crear workbook
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Ajustar anchos de columna
  ws['!cols'] = [
    { wch: 30 },  // Metrica (más ancho para nombres en español)
    { wch: 25 },  // Condicion
    { wch: 80 },  // Recomendacion
    { wch: 10 },  // Prioridad
    { wch: 40 }   // Parametros_Rangos
  ];

  // Agregar hoja al workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Recomendaciones');

  // Guardar archivo
  const outputPath = path.join(__dirname, '../data/Recomendaciones.xlsx');
  XLSX.writeFile(wb, outputPath);

  console.log('✅ Archivo Excel creado exitosamente!');
  console.log(`📁 Ubicación: ${outputPath}`);
  console.log(`📊 Total de recomendaciones: ${rows.length - 1}`);
  console.log('\n📋 Resumen por métrica:');
  
  Object.keys(recommendations).filter(key => key !== '_legacy').forEach(key => {
    const count = Array.isArray(recommendations[key]) ? recommendations[key].length : 0;
    console.log(`   - ${key}: ${count} recomendaciones`);
  });

} catch (error) {
  console.error('❌ Error al crear el archivo Excel:', error.message);
  process.exit(1);
}
