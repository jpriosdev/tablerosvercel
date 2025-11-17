// pages/api/qa-data.js
import path from 'path';
import fs from 'fs';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Intentar leer primero el JSON pre-procesado
      const jsonPath = path.join(process.cwd(), 'public/data/qa-data.json');
      
      if (fs.existsSync(jsonPath)) {
        const rawData = fs.readFileSync(jsonPath, 'utf-8');
        const qaData = JSON.parse(rawData);
        return res.status(200).json(qaData);
      }
      
      // Si no existe el JSON, procesar el Excel
      const excelPath = path.join(process.cwd(), 'data/Reporte_QA_V1.xlsx');
      
      // Dynamically import the CommonJS processor (exports via module.exports)
      const imported = await import('../../lib/excelProcessor.cjs');
      // import() of a .cjs may expose exports on the namespace or under .default
      const ExcelQAProcessor = imported.ExcelQAProcessor || (imported.default && imported.default.ExcelQAProcessor);
      if (!ExcelQAProcessor) throw new Error('ExcelQAProcessor not found in module ../../lib/excelProcessor.cjs');

      // Procesar el Excel
      const qaData = ExcelQAProcessor.processExcelFile(excelPath);

      res.status(200).json(qaData);
      
    } catch (error) {
      console.error('Error procesando Excel:', error);
      
      // Datos de fallback basados en tu estructura
      const fallbackData = {
        summary: {
          totalBugs: 138,
          bugsClosed: 52,
          bugsPending: 54,
          testCasesTotal: 692,
          testCasesExecuted: 692,
          testCasesPassed: 580,
          testCasesFailed: 112
        },
        
        bugsByPriority: {
          'Más alta': { count: 7, pending: 2, resolved: 5 },
          'Alta': { count: 41, pending: 23, resolved: 18 },
          'Media': { count: 82, pending: 38, resolved: 44 },
          'Baja': { count: 8, pending: 7, resolved: 1 }
        },
        
        bugsByModule: {
          'POS': { count: 86, percentage: 62, pending: 32 },
          'BOT': { count: 51, percentage: 37, pending: 21 },
          'Otros': { count: 1, percentage: 1, pending: 1 }
        },
        
        developerData: [
          { name: 'Juan Munoz', assigned: 31, resolved: 13, pending: 18, totalBugs: 31, workload: 'Alto' },
          { name: 'Andres Vergara', assigned: 22, resolved: 11, pending: 11, totalBugs: 22, workload: 'Alto' },
          { name: 'Juan Camilo Collantes Tovar', assigned: 19, resolved: 8, pending: 11, totalBugs: 19, workload: 'Medio' },
          { name: 'Sergio Ordaz Romero', assigned: 12, resolved: 2, pending: 10, totalBugs: 12, workload: 'Medio' },
          { name: 'Emiliano Fraile', assigned: 7, resolved: 0, pending: 7, totalBugs: 7, workload: 'Bajo' },
          { name: 'Nicolas Dubiansky', assigned: 7, resolved: 3, pending: 4, totalBugs: 7, workload: 'Bajo' },
          { name: 'Ludovic Hern', assigned: 7, resolved: 4, pending: 3, totalBugs: 7, workload: 'Bajo' }
        ],
        
        sprintData: [
          { sprint: 'Sprint 16', bugs: 46, bugsResolved: 25, bugsPending: 13, testCases: 135, velocity: 19, change: 0 },
          { sprint: 'Sprint 17', bugs: 19, bugsResolved: 13, bugsPending: 4, testCases: 139, velocity: 20, change: -59 },
          { sprint: 'Sprint 18', bugs: 28, bugsResolved: 12, bugsPending: 14, testCases: 105, velocity: 15, change: 47 },
          { sprint: 'Sprint 19', bugs: 21, bugsResolved: 6, bugsPending: 13, testCases: 142, velocity: 20, change: -25 },
          { sprint: 'Sprint 20', bugs: 19, bugsResolved: 1, bugsPending: 17, testCases: 136, velocity: 19, change: -10 },
          { sprint: 'Sprint 21', bugs: 5, bugsResolved: 0, bugsPending: 5, testCases: 35, velocity: 5, change: -74 }
        ],
        
        bugsByCategory: {
          'Funcional': { count: 75, percentage: 54 },
          'Look&Feel': { count: 32, percentage: 23 },
          'Contenido/Datos': { count: 16, percentage: 12 },
          'Eventos_iOT': { count: 12, percentage: 9 },
          'Integración': { count: 2, percentage: 1 },
          'Configuración': { count: 1, percentage: 1 }
        },
        
        qualityMetrics: {
          testAutomation: 45,
          cycleTime: 2.8
        },
        
        riskAreas: [
          { area: 'POS', bugs: 86, percentage: 62, risk: 'Alto', impact: 'Crítico' },
          { area: 'BOT', bugs: 51, percentage: 37, risk: 'Medio', impact: 'Alto' }
        ],
        
        metadata: {
          lastUpdated: new Date().toISOString(),
          source: 'excel-fallback',
          version: '1.0'
        }
      };
      
      res.status(200).json(fallbackData);
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
