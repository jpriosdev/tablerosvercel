export function processQAData(rawData) {
    const totalBugs = rawData.summary.totalBugs;
    const bugsClosed = rawData.summary.bugsClosed;
    const bugsPending = rawData.summary.bugsPending;
    
    const processedData = {
      ...rawData,
      
      kpis: {
        testCoverage: Math.round((rawData.summary.testCasesExecuted / rawData.summary.testCasesTotal) * 100),
        resolutionEfficiency: Math.round((bugsClosed / totalBugs) * 100),
        qualityIndex: calculateQualityIndex(rawData),
        sprintTrend: calculateSprintTrend(rawData.sprintData),
        defectDensity: (totalBugs / rawData.summary.testCasesExecuted).toFixed(2),
        criticalBugsRatio: Math.round(((rawData.bugsByPriority['Más alta'].count + rawData.bugsByPriority['Alta'].count) / totalBugs) * 100)
      },
      
      trends: {
        bugsPerSprint: calculateBugTrend(rawData.sprintData),
        resolutionRate: calculateResolutionTrend(rawData.sprintData),
        qualityImprovement: calculateQualityTrend(rawData.sprintData)
      },
      
      alerts: generateAlerts(rawData),
      
      processedAt: new Date().toISOString()
    };
    
    return processedData;
  }
  
  function calculateQualityIndex(data) {
    const weights = {
      resolutionRate: 0.3,
      testCoverage: 0.25,
      bugDensity: 0.2,
      criticalBugs: 0.25
    };
    
    const resolutionRate = (data.summary.bugsClosed / data.summary.totalBugs) * 100;
    const testCoverage = (data.summary.testCasesExecuted / data.summary.testCasesTotal) * 100;
    const bugDensity = Math.max(0, 100 - (data.summary.totalBugs / data.summary.testCasesExecuted) * 50);
    const criticalBugs = Math.max(0, 100 - ((data.bugsByPriority['Más alta'].count + data.bugsByPriority['Alta'].count) / data.summary.totalBugs) * 100);
    
    const qualityIndex = 
      (resolutionRate * weights.resolutionRate) +
      (testCoverage * weights.testCoverage) +
      (bugDensity * weights.bugDensity) +
      (criticalBugs * weights.criticalBugs);
    
    return Math.round(qualityIndex);
  }
  
  function calculateSprintTrend(sprintData) {
    if (sprintData.length < 2) return 0;
    
    const firstSprint = sprintData[0];
    const lastSprint = sprintData[sprintData.length - 1];
    
    return Math.round(((lastSprint.bugs - firstSprint.bugs) / firstSprint.bugs) * 100);
  }
  
  function calculateBugTrend(sprintData) {
    return sprintData.map(sprint => ({
      sprint: sprint.sprint,
      bugs: sprint.bugs,
      trend: sprint.change || 0
    }));
  }
  
  function calculateResolutionTrend(sprintData) {
    return sprintData.map(sprint => ({
      sprint: sprint.sprint,
      resolved: sprint.bugsResolved,
      pending: sprint.bugsPending,
      rate: sprint.bugsResolved > 0 ? Math.round((sprint.bugsResolved / (sprint.bugsResolved + sprint.bugsPending)) * 100) : 0
    }));
  }
  
  function calculateQualityTrend(sprintData) {
    return sprintData.map((sprint, index) => {
      const baseQuality = 100;
      const bugPenalty = sprint.bugs * 2;
      const testBonus = Math.min(sprint.testCases / 10, 20);
      
      return {
        sprint: sprint.sprint,
        quality: Math.max(0, Math.min(100, baseQuality - bugPenalty + testBonus))
      };
    });
  }
  
  function generateAlerts(data) {
    const alerts = [];
    
    const criticalBugs = data.bugsByPriority['Más alta'].pending + data.bugsByPriority['Alta'].pending;
    if (criticalBugs > 20) {
      alerts.push({
        type: 'critical',
        title: 'Bugs Críticos Elevados',
        message: `${criticalBugs} bugs críticos pendientes requieren atención inmediata`,
        action: 'Revisar y priorizar resolución'
      });
    }
    
    const maxBugsDeveloper = Math.max(...data.developerData.map(d => d.pending));
    if (maxBugsDeveloper > 15) {
      const developer = data.developerData.find(d => d.pending === maxBugsDeveloper);
      alerts.push({
        type: 'warning',
        title: 'Concentración de Bugs',
        message: `${developer.name} tiene ${maxBugsDeveloper} bugs pendientes`,
        action: 'Considerar redistribución de carga'
      });
    }
    
    const posModule = data.bugsByModule['POS'];
    if (posModule.percentage > 60) {
      alerts.push({
        type: 'warning',
        title: 'Módulo POS Crítico',
        message: `El módulo POS concentra ${posModule.percentage}% de los bugs`,
        action: 'Planificar refactoring del módulo'
      });
    }
    
    return alerts;
  }
  