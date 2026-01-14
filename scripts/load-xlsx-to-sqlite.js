// scripts/load-xlsx-to-sqlite.js
/**
 * Script para cargar datos del XLSX a SQLite
 * Convierte Reporte_QA_V1.xlsx en tablas SQLite
 */

const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const { getDatabase } = require('../lib/sqlite-db');

const excelPath = path.join(__dirname, '../data/Reporte_QA_V1.xlsx');

async function loadXlsxToSqlite() {
  console.log('\n📊 CARGANDO XLSX → SQLite\n');
  console.log('='.repeat(80));

  try {
    if (!fs.existsSync(excelPath)) {
      throw new Error(`Archivo no encontrado: ${excelPath}`);
    }

    // Inicializar BD
    const db = await getDatabase();
    console.log('✓ BD SQLite inicializada\n');

    const workbook = XLSX.readFile(excelPath);

    // 1. Cargar BUGS
    console.log('1️⃣  Cargando BUGS desde Reporte_Gral...');
    const reporteGral = XLSX.utils.sheet_to_json(workbook.Sheets['Reporte_Gral']);
    let bugCount = 0;
    for (const row of reporteGral) {
      await db.run(`
        INSERT OR REPLACE INTO bugs (
          bug_key, bug_id, summary, priority, status, sprint, module, developer,
          found_in_sprint, fixed_in_sprint, category, created_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        row['Clave de incidencia'],
        row['ID de la incidencia'],
        row['Resumen'],
        row['Prioridad'],
        row['Estado'],
        row['Sprint'],
        row['Módulo'],
        row['Desarrollador'],
        row['¿En que Sprint fue encontrado?'],
        row['¿En que Sprint fue corregido?'],
        row['Categoría'],
        row['Creada']
      ]);
      bugCount++;
    }
    console.log(`   ✓ ${bugCount} bugs cargados\n`);

    // 2. Cargar SPRINTS
    console.log('2️⃣  Cargando SPRINTS desde Tendencia...');
    const tendencia = XLSX.utils.sheet_to_json(workbook.Sheets['Tendencia']);
    let sprintCount = 0;
    for (const row of tendencia) {
      if (row['__EMPTY_1'] && String(row['__EMPTY_1']).includes('Sprint')) {
        await db.run(`
          INSERT OR REPLACE INTO sprints (
            sprint_name, test_cases_executed, test_cases_pending, bugs_found,
            bugs_canceled, bugs_solved, bugs_pending, percent_failed, percent_pending_bugs
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          row['__EMPTY_1'],
          row['__EMPTY_2'] || 0,
          row['__EMPTY_3'] || 0,
          row['__EMPTY_4'] || 0,
          row['__EMPTY_6'] || 0,
          row['__EMPTY_7'] || 0,
          row['__EMPTY_8'] || 0,
          row['__EMPTY_5'] || 0,
          row['__EMPTY_9'] || 0
        ]);
        sprintCount++;
      }
    }
    console.log(`   ✓ ${sprintCount} sprints cargados\n`);

    // 3. Cargar VERSIONES
    console.log('3️⃣  Cargando VERSIONES...');
    const versiones = XLSX.utils.sheet_to_json(workbook.Sheets['Versiones']);
    let versionCount = 0;
    for (const row of versiones) {
      if (row['Versión'] && row['Sprint']) {
        // Obtener sprint_id
        const sprint = await db.get(
          'SELECT id FROM sprints WHERE sprint_name = ?',
          [row['Sprint']]
        );

        await db.run(`
          INSERT OR REPLACE INTO versions (
            version_name, sprint_id, version_date, environment, test_plan, tags
          ) VALUES (?, ?, ?, ?, ?, ?)
        `, [
          row['Versión'],
          sprint ? sprint.id : null,
          row['Fecha'],
          row['Environment'],
          row['Test Plan'],
          [row['Etiquetas'], row['__EMPTY_1']].filter(Boolean).join(', ')
        ]);
        versionCount++;
      }
    }
    console.log(`   ✓ ${versionCount} versiones cargadas\n`);

    // 4. Cargar DESARROLLADORES
    console.log('4️⃣  Cargando DESARROLLADORES...');
    const devData = XLSX.utils.sheet_to_json(workbook.Sheets['BUGS X DESARROLLADOR']);
    let devCount = 0;
    for (const row of devData.slice(1)) {
      if (row['Reporte por DESARROLLADOR'] && row['Reporte por DESARROLLADOR'] !== 'Total general') {
        await db.run(`
          INSERT OR REPLACE INTO developers (
            name, canceled, todo, code_review, in_sit, ready_for_testing,
            ready_for_uat, blocked, in_progress, to_be_deployed, total
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          row['Reporte por DESARROLLADOR'],
          row['__EMPTY'] || 0,
          row['__EMPTY_1'] || 0,
          row['__EMPTY_2'] || 0,
          row['__EMPTY_3'] || 0,
          row['__EMPTY_4'] || 0,
          row['__EMPTY_5'] || 0,
          row['__EMPTY_6'] || 0,
          row['__EMPTY_7'] || 0,
          row['__EMPTY_8'] || 0,
          row['__EMPTY_9'] || 0
        ]);
        devCount++;
      }
    }
    console.log(`   ✓ ${devCount} desarrolladores cargados\n`);

    // 5. Cargar MÓDULOS
    console.log('5️⃣  Cargando MÓDULOS...');
    const moduleData = XLSX.utils.sheet_to_json(workbook.Sheets['BUG X MÓDULO']);
    let moduleCount = 0;
    for (const row of moduleData.slice(1)) {
      if (row['Reporte por Módulo: POS, BOT, CDM']) {
        await db.run(`
          INSERT OR REPLACE INTO modules (module_name, total_bugs)
          VALUES (?, ?)
        `, [
          row['Reporte por Módulo: POS, BOT, CDM'],
          row['__EMPTY'] || 0
        ]);
        moduleCount++;
      }
    }
    console.log(`   ✓ ${moduleCount} módulos cargados\n`);

    // Resumen
    console.log('='.repeat(80));
    console.log('✅ CARGA COMPLETADA\n');
    console.log('Estadísticas:');
    console.log(`  📌 Bugs: ${bugCount}`);
    console.log(`  📅 Sprints: ${sprintCount}`);
    console.log(`  📦 Versiones: ${versionCount}`);
    console.log(`  👨‍💻 Desarrolladores: ${devCount}`);
    console.log(`  🔧 Módulos: ${moduleCount}`);
    console.log('\n' + '='.repeat(80) + '\n');

    // Guardar info de carga
    const loadInfo = {
      timestamp: new Date().toISOString(),
      xlsxFile: excelPath,
      database: path.join(process.cwd(), 'data', 'tableroqua.db'),
      loaded: {
        bugs: bugCount,
        sprints: sprintCount,
        versions: versionCount,
        developers: devCount,
        modules: moduleCount
      }
    };

    fs.writeFileSync(
      path.join(__dirname, '../data/load-info.json'),
      JSON.stringify(loadInfo, null, 2)
    );

    console.log('💾 BD lista en: data/tableroqua.db');
    console.log('📋 Info de carga: data/load-info.json\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

// Ejecutar
loadXlsxToSqlite();
