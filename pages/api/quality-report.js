// pages/api/quality-report.js
/**
 * API para reporte de calidad con análisis desde SQL
 */

import SQLiteQueries from '../../lib/sqlite-queries';

export default async function handler(req, res) {
  try {
    const report = await SQLiteQueries.getQualityReport();

    // Calcular porcentajes desde SQL
    const totalBugs = report.totalBugs[0]?.count || 0;
    
    const enrichedReport = {
      timestamp: new Date().toISOString(),
      totalBugs,
      bugsByStatus: report.bugsByStatus.map(item => ({
        ...item,
        percentage: totalBugs > 0 ? ((item.count / totalBugs) * 100).toFixed(2) : 0
      })),
      bugsByModule: report.bugsByModule,
      topDevelopers: report.topDevelopers,
      sprintMetrics: report.sprintMetrics,
      recommendations: generateRecommendations(report)
    };

    res.status(200).json({
      success: true,
      report: enrichedReport
    });

  } catch (error) {
    console.error('❌ Report API Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

function generateRecommendations(report) {
  const recommendations = [];

  // Analizar bugs pendientes
  const todoItems = report.bugsByStatus.find(s => s.status === 'Tareas por hacer');
  if (todoItems && todoItems.count > 50) {
    recommendations.push({
      type: 'high',
      title: 'Alto número de tareas pendientes',
      description: `Hay ${todoItems.count} bugs sin asignar. Considere distribuir la carga.`
    });
  }

  // Analizar bugs en code review
  const codeReview = report.bugsByStatus.find(s => s.status === 'Code Review');
  if (codeReview && codeReview.count > 10) {
    recommendations.push({
      type: 'medium',
      title: 'Cuello de botella en Code Review',
      description: `${codeReview.count} bugs en revisión. Acelere el proceso de review.`
    });
  }

  // Analizar módulos con más bugs
  if (report.bugsByModule.length > 0) {
    const maxBugsModule = report.bugsByModule[0];
    if (maxBugsModule.bugs > 50) {
      recommendations.push({
        type: 'high',
        title: `Módulo crítico: ${maxBugsModule.module}`,
        description: `El módulo ${maxBugsModule.module} tiene ${maxBugsModule.bugs} bugs. Priorizar.`
      });
    }
  }

  return recommendations;
}
