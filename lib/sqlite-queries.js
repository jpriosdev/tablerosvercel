// lib/sqlite-queries.js
/**
 * Consultas SQL y vistas para cálculos de métricas
 * Todas las métricas se calculan desde SQL
 */

const { getDatabase } = require('./sqlite-db');

class SQLiteQueries {
  /**
   * BUGS - Estadísticas generales
   */
  static async getBugStats() {
    const db = await getDatabase();
    const stats = await db.all(`
      SELECT 
        COUNT(*) as total_bugs,
        COUNT(CASE WHEN status = 'READY FOR UAT' THEN 1 END) as ready_for_uat,
        COUNT(CASE WHEN status = 'Tareas por hacer' THEN 1 END) as todo,
        COUNT(CASE WHEN status = 'Code Review' THEN 1 END) as code_review,
        COUNT(CASE WHEN status = 'Cancelado' THEN 1 END) as canceled,
        COUNT(CASE WHEN status = 'Blocked' THEN 1 END) as blocked,
        COUNT(CASE WHEN status = 'En curso' THEN 1 END) as in_progress,
        COUNT(CASE WHEN priority = 'Alta' THEN 1 END) as high_priority,
        COUNT(CASE WHEN priority = 'Más alta' THEN 1 END) as critical_priority
      FROM bugs
    `);
    return stats[0] || {};
  }

  /**
   * BUGS por ESTADO (para gráficos)
   */
  static async getBugsByStatus() {
    const db = await getDatabase();
    return await db.all(`
      SELECT 
        status,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM bugs), 2) as percentage
      FROM bugs
      WHERE status IS NOT NULL AND status != ''
      GROUP BY status
      ORDER BY count DESC
    `);
  }

  /**
   * BUGS por MÓDULO
   */
  static async getBugsByModule() {
    const db = await getDatabase();
    return await db.all(`
      SELECT 
        module,
        COUNT(*) as bugs,
        COUNT(CASE WHEN status = 'READY FOR UAT' THEN 1 END) as ready_for_uat,
        COUNT(CASE WHEN status = 'Cancelado' THEN 1 END) as canceled,
        COUNT(CASE WHEN status = 'Tareas por hacer' THEN 1 END) as todo
      FROM bugs
      WHERE module IS NOT NULL AND module != ''
      GROUP BY module
      ORDER BY bugs DESC
    `);
  }

  /**
   * BUGS por DESARROLLADOR
   */
  static async getBugsByDeveloper() {
    const db = await getDatabase();
    return await db.all(`
      SELECT 
        developer,
        COUNT(*) as total_bugs,
        COUNT(CASE WHEN status = 'READY FOR UAT' THEN 1 END) as ready_for_uat,
        COUNT(CASE WHEN status = 'Tareas por hacer' THEN 1 END) as todo,
        COUNT(CASE WHEN status = 'Code Review' THEN 1 END) as code_review,
        COUNT(CASE WHEN status = 'Cancelado' THEN 1 END) as canceled,
        COUNT(CASE WHEN status = 'Blocked' THEN 1 END) as blocked,
        COUNT(CASE WHEN priority = 'Alta' OR priority = 'Más alta' THEN 1 END) as high_priority_bugs
      FROM bugs
      WHERE developer IS NOT NULL AND developer != ''
      GROUP BY developer
      ORDER BY total_bugs DESC
    `);
  }

  /**
   * BUGS por PRIORIDAD
   */
  static async getBugsByPriority() {
    const db = await getDatabase();
    return await db.all(`
      SELECT 
        priority,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM bugs), 2) as percentage
      FROM bugs
      WHERE priority IS NOT NULL AND priority != ''
      GROUP BY priority
      ORDER BY 
        CASE 
          WHEN priority = 'Más alta' THEN 1
          WHEN priority = 'Alta' THEN 2
          WHEN priority = 'Medio' THEN 3
          WHEN priority = 'Baja' THEN 4
        END
    `);
  }

  /**
   * BUGS por CATEGORÍA
   */
  static async getBugsByCategory() {
    const db = await getDatabase();
    return await db.all(`
      SELECT 
        category,
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'READY FOR UAT' THEN 1 END) as ready_for_uat,
        COUNT(CASE WHEN status = 'Tareas por hacer' THEN 1 END) as todo,
        COUNT(CASE WHEN status = 'Cancelado' THEN 1 END) as canceled
      FROM bugs
      WHERE category IS NOT NULL AND category != ''
      GROUP BY category
      ORDER BY total DESC
    `);
  }

  /**
   * SPRINTS - Tendencia de pruebas
   */
  static async getSprintTrend() {
    const db = await getDatabase();
    return await db.all(`
      SELECT 
        sprint_name,
        test_cases_executed,
        test_cases_pending,
        bugs_found,
        bugs_canceled,
        bugs_solved,
        bugs_pending,
        ROUND(percent_failed, 2) as percent_failed,
        ROUND(percent_pending_bugs, 2) as percent_pending_bugs
      FROM sprints
      ORDER BY sprint_name
    `);
  }

  /**
   * VERSIONES - Historial
   */
  static async getVersions() {
    const db = await getDatabase();
    return await db.all(`
      SELECT 
        v.id,
        v.version_name,
        v.version_date,
        v.environment,
        v.test_plan,
        v.tags,
        s.sprint_name,
        COUNT(b.id) as bugs_in_version
      FROM versions v
      LEFT JOIN sprints s ON v.sprint_id = s.id
      LEFT JOIN bugs b ON b.found_in_sprint = s.sprint_name
      GROUP BY v.id
      ORDER BY v.version_name DESC
    `);
  }

  /**
   * DESARROLLADORES - Detalle
   */
  static async getDevelopersStats() {
    const db = await getDatabase();
    return await db.all(`
      SELECT 
        developer,
        COUNT(*) as total_bugs,
        COUNT(CASE WHEN status = 'READY FOR UAT' THEN 1 END) as ready_for_uat,
        COUNT(CASE WHEN status = 'Tareas por hacer' THEN 1 END) as todo,
        COUNT(CASE WHEN status = 'Code Review' THEN 1 END) as code_review,
        COUNT(CASE WHEN status = 'IN SIT' THEN 1 END) as in_sit,
        COUNT(CASE WHEN status = 'READY FOR TESTING' THEN 1 END) as ready_for_testing,
        COUNT(CASE WHEN status = 'Blocked' THEN 1 END) as blocked,
        COUNT(CASE WHEN status = 'En curso' THEN 1 END) as in_progress,
        COUNT(CASE WHEN status = 'TO BE DEPLOYED-SIT' THEN 1 END) as to_be_deployed,
        COUNT(CASE WHEN status = 'Cancelado' THEN 1 END) as canceled
      FROM bugs
      WHERE developer IS NOT NULL AND developer != ''
      GROUP BY developer
      ORDER BY total_bugs DESC
    `);
  }

  /**
   * RESUMEN EJECUTIVO - KPIs principales
   */
  static async getExecutiveSummary() {
    const db = await getDatabase();
    const summary = {};

    // Total de bugs
    const bugs = await db.get(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'Cancelado' THEN 1 END) as canceled,
        COUNT(CASE WHEN status = 'READY FOR UAT' THEN 1 END) as resolved,
        COUNT(CASE WHEN status = 'Tareas por hacer' THEN 1 END) as pending,
        ROUND(COUNT(CASE WHEN priority = 'Alta' OR priority = 'Más alta' THEN 1 END) * 100.0 / COUNT(*), 2) as high_priority_percent
      FROM bugs
    `);
    summary.bugs = bugs;

    // Módulos
    const modules = await db.all(`
      SELECT module, COUNT(*) as bugs
      FROM bugs
      WHERE module IS NOT NULL
      GROUP BY module
    `);
    summary.modules = modules;

    // Sprints activos
    const sprints = await db.get(`
      SELECT 
        COUNT(*) as total,
        AVG(percent_failed) as avg_failure_rate,
        AVG(percent_pending_bugs) as avg_pending_rate
      FROM sprints
    `);
    summary.sprints = sprints;

    // Desarrolladores
    const developers = await db.get(`
      SELECT COUNT(DISTINCT developer) as count
      FROM bugs
      WHERE developer IS NOT NULL
    `);
    summary.developers = developers;

    return summary;
  }

  /**
   * BÚSQUEDA - Bugs por filtros
   */
  static async searchBugs(filters = {}) {
    const db = await getDatabase();
    let sql = 'SELECT * FROM bugs WHERE 1=1';
    const params = [];

    if (filters.status) {
      sql += ' AND status = ?';
      params.push(filters.status);
    }
    if (filters.module) {
      sql += ' AND module = ?';
      params.push(filters.module);
    }
    if (filters.developer) {
      sql += ' AND developer = ?';
      params.push(filters.developer);
    }
    if (filters.priority) {
      sql += ' AND priority = ?';
      params.push(filters.priority);
    }
    if (filters.sprint) {
      sql += ' AND sprint = ?';
      params.push(filters.sprint);
    }
    if (filters.search) {
      sql += ' AND (summary LIKE ? OR bug_key LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    sql += ' ORDER BY created_date DESC LIMIT 100';
    return await db.all(sql, params);
  }

  /**
   * ANÁLISIS - Reporte de calidad
   */
  static async getQualityReport() {
    const db = await getDatabase();
    
    const report = {
      totalBugs: await db.get('SELECT COUNT(*) as count FROM bugs'),
      bugsByStatus: await db.all(`
        SELECT status, COUNT(*) as count FROM bugs GROUP BY status
      `),
      bugsByModule: await db.all(`
        SELECT module, COUNT(*) as count FROM bugs WHERE module IS NOT NULL GROUP BY module
      `),
      topDevelopers: await db.all(`
        SELECT developer, COUNT(*) as bugs FROM bugs WHERE developer IS NOT NULL GROUP BY developer ORDER BY bugs DESC LIMIT 10
      `),
      sprintMetrics: await db.all(`
        SELECT sprint_name, test_cases_executed, test_cases_pending, bugs_found, bugs_pending FROM sprints
      `)
    };

    return report;
  }
}

module.exports = SQLiteQueries;
