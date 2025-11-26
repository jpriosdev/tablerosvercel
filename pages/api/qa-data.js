// pages/api/qa-data.js
import { getQAData, clearQADataCache } from '../../lib/qaDataLoader.js';
import DAL from '../../lib/database/dal.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({
      error: `Method ${req.method} not allowed`
    });
  }

  try {
    const forceReload = req.query.force === '1' || req.query.force === 'true';

    // Limpiar cache si se solicita force reload
    if (forceReload) {
      clearQADataCache?.();
    }

    const qaData = await getQAData({ forceReload });

    // Intentar enriquecer con información de desarrolladores desde la BD (si existe)
    try {
      const devs = await DAL.getDevelopersAnalysis();
      if (devs && Array.isArray(devs) && devs.length > 0) {
        qaData.developerData = devs.map(d => {
          const total = Number(d.total_bugs || d.total_bugs === 0 ? d.total_bugs : 0);
          const pending = Number(d.pending || 0);
          const assigned = total; // fallback: assign total as assigned count
          const resolved = Math.max(0, total - pending);

          return {
            name: d.developer_name,
            assigned: assigned,
            resolved: resolved,
            pending: pending,
            totalBugs: total,
            // keep extended fields for future use
            inProgress: d.in_progress,
            codeReview: d.code_review,
            readyForTesting: d.ready_for_testing,
            readyForUat: d.ready_for_uat,
            canceled: d.canceled,
            efficiency: d.efficiency_percentage,
            workload: d.workload_level
          };
        });
      }
    } catch (err) {
      console.warn('⚠️ No se pudo obtener desarrolladores desde BD:', err?.message || err);
    }

    // Agregar desglose por módulo por desarrollador
    try {
      const devModules = await DAL.getDeveloperModulesSummary();
      if (Array.isArray(devModules)) {
        const developerModules = {};
        devModules.forEach(row => {
          const name = row.developer_name || 'Unknown';
          if (!developerModules[name]) developerModules[name] = [];
          developerModules[name].push({
            module: row.modulo,
            count: row.count,
            pending: row.pending,
            resolved: row.resolved
          });
        });
        qaData.developerModules = developerModules;
      }
    } catch (err) {
      console.warn('⚠️ No se pudo obtener desglose por módulo:', err?.message || err);
    }

    // Configurar headers de cache
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'public, max-age=300'); // 5 minutos

    return res.status(200).json(qaData);

  } catch (error) {
    console.error('❌ Error loading QA data:', error);
    
    return res.status(500).json({
      status: 'error',
      error: 'No QA data is available right now',
      message: error.message,
      timestamp: new Date().toISOString(),
      suggestion: 'Verify that npm run db:setup has been executed'
    });
  }
}
