// pages/api/qa-data.js
/**
 * API para obtener datos QA desde SQLite
 * Todos los cálculos se hacen en SQL
 */

import SQLiteQueries from '../../lib/sqlite-queries';

export default async function handler(req, res) {
  try {
    const { type = 'summary' } = req.query;

    let data = {};

    switch (type) {
      case 'summary':
        data = await SQLiteQueries.getExecutiveSummary();
        break;
      case 'bugs-by-status':
        data = await SQLiteQueries.getBugsByStatus();
        break;
      case 'bugs-by-module':
        data = await SQLiteQueries.getBugsByModule();
        break;
      case 'bugs-by-developer':
        data = await SQLiteQueries.getBugsByDeveloper();
        break;
      case 'bugs-by-priority':
        data = await SQLiteQueries.getBugsByPriority();
        break;
      case 'bugs-by-category':
        data = await SQLiteQueries.getBugsByCategory();
        break;
      case 'sprint-trend':
        data = await SQLiteQueries.getSprintTrend();
        break;
      case 'versions':
        data = await SQLiteQueries.getVersions();
        break;
      case 'developers':
        data = await SQLiteQueries.getDevelopersStats();
        break;
      case 'stats':
        data = await SQLiteQueries.getBugStats();
        break;
      default:
        // Retornar datos completos
        data = {
          summary: await SQLiteQueries.getExecutiveSummary(),
          bugsByStatus: await SQLiteQueries.getBugsByStatus(),
          bugsByModule: await SQLiteQueries.getBugsByModule(),
          sprintTrend: await SQLiteQueries.getSprintTrend(),
          developers: await SQLiteQueries.getDevelopersStats()
        };
    }

    res.status(200).json({
      success: true,
      data,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ API Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
