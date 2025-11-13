export default function handler(req, res) {
    const qaData = {
      summary: {
        totalBugs: 138,
        bugsClosed: 52,
        bugsPending: 54,
        bugsBlocked: 3,
        testCasesExecuted: 692,
        testCasesTotal: 875,
        currentSprint: 21,
        lastUpdated: new Date().toISOString()
      },
      
      sprintData: [
        { sprint: 16, bugs: 46, testCases: 135, bugsResolved: 25, bugsPending: 14, change: 0 },
        { sprint: 17, bugs: 19, testCases: 139, bugsResolved: 13, bugsPending: 4, change: -58 },
        { sprint: 18, bugs: 28, testCases: 105, bugsResolved: 12, bugsPending: 15, change: 47 },
        { sprint: 19, bugs: 21, testCases: 142, bugsResolved: 2, bugsPending: 17, change: -25 },
        { sprint: 20, bugs: 19, testCases: 136, bugsResolved: 0, bugsPending: 15, change: -10 },
        { sprint: 21, bugs: 5, testCases: 35, bugsResolved: 0, bugsPending: 5, change: -74 }
      ],
  
      bugsByPriority: {
        'Más alta': { count: 7, pending: 2, resolved: 5 },
        'Alta': { count: 41, pending: 23, resolved: 18 },
        'Medio': { count: 82, pending: 38, resolved: 44 },
        'Baja': { count: 8, pending: 7, resolved: 1 }
      },
  
      bugsByModule: {
        'POS': { total: 86, pending: 45, resolved: 41, percentage: 62 },
        'BOT': { total: 51, pending: 28, resolved: 23, percentage: 37 },
        'CDM': { total: 1, pending: 1, resolved: 0, percentage: 1 }
      },
  
      bugsByCategory: {
        'Funcional': { count: 75, percentage: 54 },
        'Look&Feel': { count: 32, percentage: 23 },
        'Contenido/Datos': { count: 16, percentage: 12 },
        'Eventos_iOT': { count: 12, percentage: 9 },
        'Integración': { count: 2, percentage: 1 },
        'Configuración': { count: 1, percentage: 1 }
      },
  
      developerData: [
        { name: 'Juan Munoz', totalBugs: 31, pending: 16, resolved: 15, workload: 'Alto' },
        { name: 'Andres Vergara', totalBugs: 22, pending: 6, resolved: 16, workload: 'Medio' },
        { name: 'Juan C. Collantes', totalBugs: 19, pending: 8, resolved: 11, workload: 'Medio' },
        { name: 'Sergio Ordaz', totalBugs: 12, pending: 8, resolved: 4, workload: 'Medio' },
        { name: 'Emiliano Fraile', totalBugs: 7, pending: 6, resolved: 1, workload: 'Bajo' },
        { name: 'Ludovic Hern', totalBugs: 7, pending: 1, resolved: 6, workload: 'Bajo' },
        { name: 'Nicolas Dubiansky', totalBugs: 7, pending: 1, resolved: 6, workload: 'Bajo' }
      ],
  
      qualityMetrics: {
        defectDensity: 0.2,
        testEfficiency: 79,
        bugLeakage: 5,
        testAutomation: 25,
        codeCoverage: 68,
        cycleTime: 2.3
      },
  
      riskAreas: [
        { area: 'POS Payment Flow', risk: 'Alto', bugs: 15, impact: 'Crítico' },
        { area: 'BOT Inventory Management', risk: 'Medio', bugs: 8, impact: 'Alto' },
        { area: 'IoT Event Integration', risk: 'Alto', bugs: 12, impact: 'Alto' },
        { area: 'User Authentication', risk: 'Medio', bugs: 6, impact: 'Medio' }
      ],
  
      recommendations: [
        {
          type: 'Inmediata',
          title: 'Redistribuir Carga de Trabajo',
          description: 'Juan Munoz tiene 22% de todos los bugs. Redistribuir tareas.',
          priority: 'Alta',
          effort: 'Bajo',
          impact: 'Alto'
        },
        {
          type: 'Inmediata',
          title: 'Review Bugs Críticos',
          description: 'Revisar y priorizar los 2 bugs de máxima prioridad pendientes.',
          priority: 'Crítica',
          effort: 'Medio',
          impact: 'Crítico'
        },
        {
          type: 'Corto Plazo',
          title: 'Refactoring Módulo POS',
          description: 'El módulo POS concentra 62% de los defectos. Necesita refactoring.',
          priority: 'Alta',
          effort: 'Alto',
          impact: 'Alto'
        },
        {
          type: 'Mediano Plazo',
          title: 'Incrementar Automatización',
          description: 'Aumentar cobertura de pruebas automatizadas del 25% al 60%.',
          priority: 'Media',
          effort: 'Alto',
          impact: 'Alto'
        }
      ]
    };
  
    setTimeout(() => {
      res.status(200).json(qaData);
    }, Math.random() * 500 + 200);
  }
  