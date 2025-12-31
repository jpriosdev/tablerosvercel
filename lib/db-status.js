// lib/db-status.js
/**
 * Verificador de estado de BD SQLite
 * Útil para debugging
 */

const { getDatabase } = require('./sqlite-db');

async function checkDatabaseStatus() {
  try {
    const db = await getDatabase();

    const status = {
      database: {
        path: require('path').join(process.cwd(), 'data', 'tableroqua.db'),
        initialized: db.initialized
      },
      tables: {}
    };

    // Contar registros por tabla
    const tables = ['bugs', 'sprints', 'versions', 'developers', 'modules', 'categories'];
    
    for (const table of tables) {
      const result = await db.get(`SELECT COUNT(*) as count FROM ${table}`);
      status.tables[table] = result.count;
    }

    // Estadísticas de bugs
    const bugStats = await db.get(`
      SELECT 
        COUNT(*) as total,
        COUNT(DISTINCT module) as modules,
        COUNT(DISTINCT developer) as developers,
        COUNT(DISTINCT status) as statuses,
        COUNT(DISTINCT priority) as priorities
      FROM bugs
    `);
    status.bugStatistics = bugStats;

    // Estado más común
    const topStatus = await db.get(`
      SELECT status, COUNT(*) as count
      FROM bugs
      GROUP BY status
      ORDER BY count DESC
      LIMIT 1
    `);
    status.mostCommonStatus = topStatus;

    return status;

  } catch (error) {
    console.error('❌ Error checking database:', error);
    return null;
  }
}

// Si se ejecuta directamente
if (require.main === module) {
  checkDatabaseStatus().then(status => {
    console.log('\n📊 ESTADO DE BD SQLITE\n');
    console.log(JSON.stringify(status, null, 2));
    process.exit(0);
  });
}

module.exports = { checkDatabaseStatus };
