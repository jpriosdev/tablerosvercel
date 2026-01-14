// scripts/sync-xlsx-to-db.js
/**
 * Script para sincronizar datos del XLSX a la BD SQL
 * Valida datos y proporciona un reporte de sincronización
 */

const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const excelPath = path.join(__dirname, '../data/Reporte_QA_V1.xlsx');

function extractDataFromExcel() {
  console.log('\n📊 EXTRACCIÓN Y SINCRONIZACIÓN XLSX → BD SQL\n');
  console.log('='.repeat(80));

  try {
    if (!fs.existsSync(excelPath)) {
      throw new Error(`Archivo no encontrado: ${excelPath}`);
    }

    const workbook = XLSX.readFile(excelPath);
    const result = {
      timestamp: new Date().toISOString(),
      status: 'success',
      data: {
        general: {},
        bugs: [],
        sprints: [],
        versions: [],
        developers: [],
        modules: [],
        categories: [],
        recommendations: []
      },
      summary: {
        totalBugs: 0,
        bugsByState: {},
        bugsByModule: {},
        bugsByPriority: {},
        sprintCount: 0,
        versionCount: 0,
        developerCount: 0,
        moduleCount: 0
      }
    };

    // 1. Extraer datos generales
    console.log('1️⃣  Extrayendo datos generales...');
    const reporteGral = XLSX.utils.sheet_to_json(workbook.Sheets['Reporte_Gral']);
    result.data.bugs = reporteGral.map(row => ({
      id: row['ID de la incidencia'],
      key: row['Clave de incidencia'],
      summary: row['Resumen'],
      priority: row['Prioridad'],
      status: row['Estado'],
      sprint: row['Sprint'],
      module: row['Módulo'],
      developer: row['Desarrollador'],
      foundIn: row['¿En que Sprint fue encontrado?'],
      fixedIn: row['¿En que Sprint fue corregido?'],
      category: row['Categoría'],
      createdDate: row['Creada']
    }));

    // Estadísticas
    reporteGral.forEach(row => {
      if (row['Estado']) result.summary.bugsByState[row['Estado']] = (result.summary.bugsByState[row['Estado']] || 0) + 1;
      if (row['Módulo']) result.summary.bugsByModule[row['Módulo']] = (result.summary.bugsByModule[row['Módulo']] || 0) + 1;
      if (row['Prioridad']) result.summary.bugsByPriority[row['Prioridad']] = (result.summary.bugsByPriority[row['Prioridad']] || 0) + 1;
    });

    result.summary.totalBugs = reporteGral.length;
    console.log(`   ✓ ${reporteGral.length} bugs encontrados`);

    // 2. Extraer versiones
    console.log('\n2️⃣  Extrayendo versiones...');
    const versionesData = XLSX.utils.sheet_to_json(workbook.Sheets['Versiones']);
    result.data.versions = versionesData
      .filter(row => row['Versión'] && row['Sprint'])
      .map(row => ({
        version: row['Versión'],
        sprint: row['Sprint'],
        date: row['Fecha'],
        environment: row['Environment'],
        testPlan: row['Test Plan'],
        tags: [row['Etiquetas'], row['__EMPTY_1']].filter(Boolean).join(', ')
      }));
    result.summary.versionCount = result.data.versions.length;
    console.log(`   ✓ ${result.data.versions.length} versiones encontradas`);

    // 3. Extraer desarrolladores
    console.log('\n3️⃣  Extrayendo desarrolladores...');
    const devData = XLSX.utils.sheet_to_json(workbook.Sheets['BUGS X DESARROLLADOR']);
    result.data.developers = devData
      .slice(1) // Saltar encabezado
      .filter(row => row['Reporte por DESARROLLADOR'] && row['Reporte por DESARROLLADOR'] !== 'Total general')
      .map(row => ({
        name: row['Reporte por DESARROLLADOR'],
        cancelado: row['__EMPTY'] || 0,
        tareasporhacer: row['__EMPTY_1'] || 0,
        codereview: row['__EMPTY_2'] || 0,
        insit: row['__EMPTY_3'] || 0,
        readyfortesting: row['__EMPTY_4'] || 0,
        readyforuat: row['__EMPTY_5'] || 0,
        blocked: row['__EMPTY_6'] || 0,
        encurso: row['__EMPTY_7'] || 0,
        tobedeployed: row['__EMPTY_8'] || 0,
        total: row['__EMPTY_9'] || 0
      }));
    result.summary.developerCount = result.data.developers.length;
    console.log(`   ✓ ${result.data.developers.length} desarrolladores encontrados`);

    // 4. Extraer módulos
    console.log('\n4️⃣  Extrayendo módulos...');
    const moduleData = XLSX.utils.sheet_to_json(workbook.Sheets['BUG X MÓDULO']);
    result.data.modules = moduleData
      .slice(1)
      .filter(row => row['Reporte por Módulo: POS, BOT, CDM'])
      .map(row => ({
        module: row['Reporte por Módulo: POS, BOT, CDM'],
        bugs: row['__EMPTY'] || 0
      }));
    result.summary.moduleCount = result.data.modules.length;
    console.log(`   ✓ ${result.data.modules.length} módulos encontrados`);

    // 5. Extraer sprints
    console.log('\n5️⃣  Extrayendo sprints...');
    const tendenciaData = XLSX.utils.sheet_to_json(workbook.Sheets['Tendencia']);
    result.data.sprints = tendenciaData
      .filter(row => row['__EMPTY_1'] && String(row['__EMPTY_1']).includes('Sprint'))
      .map(row => ({
        sprint: row['__EMPTY_1'],
        casosEjecutados: row['__EMPTY_2'] || 0,
        casosPendientes: row['__EMPTY_3'] || 0,
        bugsEncontrados: row['__EMPTY_4'] || 0,
        porcentajeFallidos: row['__EMPTY_5'] || 0,
        bugsCancelados: row['__EMPTY_6'] || 0,
        bugsSolucionados: row['__EMPTY_7'] || 0,
        bugsPendientes: row['__EMPTY_8'] || 0,
        porcentajePendientes: row['__EMPTY_9'] || 0
      }));
    result.summary.sprintCount = result.data.sprints.length;
    console.log(`   ✓ ${result.data.sprints.length} sprints encontrados`);

    // 6. Mostrar resumen
    console.log('\n📈 RESUMEN DE DATOS:\n');
    console.log(`Total de BUGS: ${result.summary.totalBugs}`);
    console.log(`\nBUGS por ESTADO:`);
    Object.entries(result.summary.bugsByState).forEach(([state, count]) => {
      console.log(`  ${state}: ${count}`);
    });

    console.log(`\nBUGS por MÓDULO:`);
    Object.entries(result.summary.bugsByModule).forEach(([module, count]) => {
      console.log(`  ${module}: ${count}`);
    });

    console.log(`\nBUGS por PRIORIDAD:`);
    Object.entries(result.summary.bugsByPriority).forEach(([priority, count]) => {
      console.log(`  ${priority}: ${count}`);
    });

    console.log(`\nOTROS DATOS:`);
    console.log(`  Sprints: ${result.summary.sprintCount}`);
    console.log(`  Versiones: ${result.summary.versionCount}`);
    console.log(`  Desarrolladores: ${result.summary.developerCount}`);
    console.log(`  Módulos: ${result.summary.moduleCount}`);

    // Guardar JSON para sincronización
    const syncPath = path.join(__dirname, '../data/sync-data.json');
    fs.writeFileSync(syncPath, JSON.stringify(result, null, 2));

    console.log('\n' + '='.repeat(80));
    console.log('✅ EXTRACCIÓN COMPLETADA');
    console.log(`📁 Datos listos para sincronizar: sync-data.json`);
    console.log(`📁 Este archivo contiene todos los datos del XLSX listos para cargar a la BD SQL`);
    console.log('='.repeat(80) + '\n');

    return result;

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

// Ejecutar
extractDataFromExcel();
