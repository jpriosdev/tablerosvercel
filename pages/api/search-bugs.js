// pages/api/search-bugs.js
/**
 * API para buscar bugs con filtros desde SQLite
 */

import SQLiteQueries from '../../lib/sqlite-queries';

export default async function handler(req, res) {
  try {
    const { status, module, developer, priority, sprint, search } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (module) filters.module = module;
    if (developer) filters.developer = developer;
    if (priority) filters.priority = priority;
    if (sprint) filters.sprint = sprint;
    if (search) filters.search = search;

    const results = await SQLiteQueries.searchBugs(filters);

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
      filters
    });

  } catch (error) {
    console.error('❌ Search API Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
