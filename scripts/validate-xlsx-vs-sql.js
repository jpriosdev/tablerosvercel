// scripts/validate-xlsx-vs-sql.js
const { ExcelQAProcessor } = require('../lib/excelProcessor.cjs');
const path = require('path');
const fs = require('fs');

// Obtener datos de la BD/JSON
const getDBData = () => {
  try {
    // Primero intenta leer desde el archivo qa-data.json si existe
    const jsonPath = path.join(__dirname, '../data/qa-data.json');
    if (fs.existsSync(jsonPath)) {
      console.log('✓ Usando archivo JSON: qa-data.json');
      return JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    }
    
    // Si no existe, retorna estructura vacía para comparación
    console.log('⚠️  Archivo qa-data.json no encontrado');
    return {
      sprints: [],
      developers: [],
      modules: [],
      categories: [],
      general: null,
      recommendations: null
    };
  } catch (error) {
    console.error('❌ Error leyendo datos:', error.message);
    return null;
  }
};

function deepCompare(xlsxItem, dbItem, keys) {
  const differences = [];
  for (const key of keys) {
    const xlsxVal = xlsxItem?.[key];
    const dbVal = dbItem?.[key];
    if (xlsxVal !== dbVal) {
      differences.push({
        field: key,
        xlsx: xlsxVal,
        database: dbVal
      });
    }
  }
  return differences;
}

function validateXlsxVsSql() {
  console.log('\n📊 VALIDACIÓN: XLSX vs Datos Existentes\n');
  console.log('='.repeat(70));

  try {
    // Leer datos del XLSX
    const excelPath = path.join(__dirname, '../data/Reporte_QA_V1.xlsx');
    if (!fs.existsSync(excelPath)) {
      throw new Error(`Archivo XLSX no encontrado: ${excelPath}`);
    }
    console.log(`✓ Leyendo XLSX: ${excelPath}`);
    const xlsxData = ExcelQAProcessor.processExcelFile(excelPath);

    // Leer datos existentes
    console.log('📡 Leyendo datos existentes (JSON)...');
    const dbData = getDBData();

    if (!dbData) {
      throw new Error('No se pudieron cargar los datos de la BD/JSON');
    }

    // Comparar datos
    const report = {
      timestamp: new Date().toISOString(),
      files: {
        xlsx: excelPath,
        database: 'qa-data.json (si existe)'
      },
      summary: {
        xlsx: {
          sprints: xlsxData.sprints?.length || 0,
          developers: xlsxData.developers?.length || 0,
          modules: xlsxData.modules?.length || 0,
          categories: xlsxData.categories?.length || 0,
          generalData: !!xlsxData.general,
          recommendations: !!xlsxData.recommendations
        },
        database: {
          sprints: dbData.sprints?.length || 0,
          developers: dbData.developers?.length || 0,
          modules: dbData.modules?.length || 0,
          categories: dbData.categories?.length || 0,
          generalData: !!dbData.general,
          recommendations: !!dbData.recommendations
        }
      },
      validation: {},
      detailedDifferences: {}
    };

    // Validar coincidencias
    console.log('\n📈 Comparando datos...\n');

    // Sprints
    const sprintMatch = report.summary.xlsx.sprints === report.summary.database.sprints;
    report.validation.sprints = {
      match: sprintMatch,
      xlsx: report.summary.xlsx.sprints,
      database: report.summary.database.sprints
    };
    console.log(`${sprintMatch ? '✅' : '❌'} Sprints: XLSX=${report.summary.xlsx.sprints} vs DB=${report.summary.database.sprints}`);

    // Desarrolladores
    const devMatch = report.summary.xlsx.developers === report.summary.database.developers;
    report.validation.developers = {
      match: devMatch,
      xlsx: report.summary.xlsx.developers,
      database: report.summary.database.developers
    };
    console.log(`${devMatch ? '✅' : '❌'} Desarrolladores: XLSX=${report.summary.xlsx.developers} vs DB=${report.summary.database.developers}`);

    // Módulos
    const modMatch = report.summary.xlsx.modules === report.summary.database.modules;
    report.validation.modules = {
      match: modMatch,
      xlsx: report.summary.xlsx.modules,
      database: report.summary.database.modules
    };
    console.log(`${modMatch ? '✅' : '❌'} Módulos: XLSX=${report.summary.xlsx.modules} vs DB=${report.summary.database.modules}`);

    // Categorías
    const catMatch = report.summary.xlsx.categories === report.summary.database.categories;
    report.validation.categories = {
      match: catMatch,
      xlsx: report.summary.xlsx.categories,
      database: report.summary.database.categories
    };
    console.log(`${catMatch ? '✅' : '❌'} Categorías: XLSX=${report.summary.xlsx.categories} vs DB=${report.summary.database.categories}`);

    // General Data
    const genMatch = report.summary.xlsx.generalData === report.summary.database.generalData;
    report.validation.generalData = {
      match: genMatch,
      xlsx: report.summary.xlsx.generalData,
      database: report.summary.database.generalData
    };
    console.log(`${genMatch ? '✅' : '❌'} Datos Generales: XLSX=${report.summary.xlsx.generalData} vs DB=${report.summary.database.generalData}`);

    // Recommendations
    const recMatch = report.summary.xlsx.recommendations === report.summary.database.recommendations;
    report.validation.recommendations = {
      match: recMatch,
      xlsx: report.summary.xlsx.recommendations,
      database: report.summary.database.recommendations
    };
    console.log(`${recMatch ? '✅' : '❌'} Recomendaciones: XLSX=${report.summary.xlsx.recommendations} vs DB=${report.summary.database.recommendations}`);

    // Comparar datos detallados si existen
    if (xlsxData.sprints && dbData.sprints && xlsxData.sprints.length > 0 && dbData.sprints.length > 0) {
      console.log('\n📋 Validación detallada de Sprints:');
      const sprintKeys = ['sprint', 'casosEjecutados', 'casosPendientes', 'bugsEncontrados'];
      for (let i = 0; i < Math.min(xlsxData.sprints.length, dbData.sprints.length); i++) {
        const diffs = deepCompare(xlsxData.sprints[i], dbData.sprints[i], sprintKeys);
        if (diffs.length > 0) {
          report.detailedDifferences[`sprint_${i}`] = diffs;
          console.log(`  Sprint ${i}: ${diffs.length} diferencias encontradas`);
        }
      }
    }

    // Resumen final
    const allMatch = Object.values(report.validation).every(v => v.match);
    console.log('\n' + '='.repeat(70));
    if (allMatch) {
      console.log('✅ VALIDACIÓN EXITOSA: Todos los datos coinciden o BD está vacía');
    } else {
      console.log('⚠️  VALIDACIÓN CON DISCREPANCIAS: Hay diferencias entre XLSX y datos almacenados');
    }
    console.log('='.repeat(70) + '\n');

    // Guardar reporte
    const reportPath = path.join(__dirname, '../data/validation-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📁 Reporte detallado guardado en: validation-report.json\n`);

    // Mostrar datos del XLSX leídos
    console.log('📝 DATOS LEÍDOS DEL XLSX:\n');
    console.log(`  • Sprints: ${xlsxData.sprints?.length || 0}`);
    if (xlsxData.sprints && xlsxData.sprints.length > 0) {
      console.log(`    - Ejemplo: ${JSON.stringify(xlsxData.sprints[0], null, 4)}`);
    }
    console.log(`\n  • Desarrolladores: ${xlsxData.developers?.length || 0}`);
    if (xlsxData.developers && xlsxData.developers.length > 0) {
      console.log(`    - Ejemplo: ${JSON.stringify(xlsxData.developers[0], null, 4)}`);
    }
    console.log(`\n  • Módulos: ${xlsxData.modules?.length || 0}`);
    console.log(`\n  • Categorías: ${xlsxData.categories?.length || 0}\n`);

    return report;

  } catch (error) {
    console.error('\n❌ Error en validación:', error.message);
    process.exit(1);
  }
}

// Ejecutar validación
validateXlsxVsSql();
