// pages/api/qa-data.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const dataPath = path.join(process.cwd(), 'public/data/qa-data.json');
      
      if (fs.existsSync(dataPath)) {
        const fileContents = fs.readFileSync(dataPath, 'utf8');
        const data = JSON.parse(fileContents);
        res.status(200).json(data);
      } else {
        // Datos de ejemplo
        const sampleData = {
          summary: {
            totalBugs: 156,
            bugsClosed: 124,
            bugsPending: 32,
            testCasesTotal: 450,
            testCasesExecuted: 380,
            testCasesPassed: 340,
            testCasesFailed: 40
          },
          bugsByPriority: {
            'Más alta': { count: 8, pending: 3, resolved: 5 },
            'Alta': { count: 24, pending: 8, resolved: 16 },
            'Media': { count: 64, pending: 15, resolved: 49 },
            'Baja': { count: 45, pending: 4, resolved: 41 },
            'Más baja': { count: 15, pending: 2, resolved: 13 }
          },
          bugsByModule: {
            'POS': { count: 68, percentage: 44, pending: 15 },
            'Inventory': { count: 42, percentage: 27, pending: 8 },
            'Reports': { count: 28, percentage: 18, pending: 6 },
            'Admin': { count: 18, percentage: 11, pending: 3 }
          },
          developerData: [
            { name: 'Juan Pérez', assigned: 25, resolved: 20, pending: 5 },
            { name: 'María García', assigned: 22, resolved: 18, pending: 4 },
            { name: 'Carlos López', assigned: 28, resolved: 22, pending: 6 }
          ],
          sprintData: [
            { sprint: 'Sprint 1', bugs: 45, bugsResolved: 38, bugsPending: 7, testCases: 120, velocity: 32, change: 0 },
            { sprint: 'Sprint 2', bugs: 52, bugsResolved: 44, bugsPending: 8, testCases: 135, velocity: 28, change: 15.6 },
            { sprint: 'Sprint 3', bugs: 38, bugsResolved: 32, bugsPending: 6, testCases: 98, velocity: 35, change: -26.9 },
            { sprint: 'Sprint 4', bugs: 41, bugsResolved: 36, bugsPending: 5, testCases: 110, velocity: 31, change: 7.9 }
          ],
          qualityMetrics: {
            testAutomation: 45,
            cycleTime: 2.5
          },
          metadata: {
            lastUpdated: new Date().toISOString(),
            version: "1.0",
            source: "api-generated"
          }
        };
        res.status(200).json(sampleData);
      }
    } catch (error) {
      console.error('Error loading QA data:', error);
      res.status(500).json({ error: 'Error loading QA data' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
