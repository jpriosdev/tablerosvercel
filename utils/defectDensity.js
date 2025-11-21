/**
 * Defect Density Calculator
 * 
 * Calcula la densidad de defectos (hallazgos por caso de prueba)
 * basada en datos reales del Excel/JSON.
 */

/**
 * Calcula la densidad de defectos por sprint
 * 
 * @param {Array} sprintData - Array de objetos con {sprint, bugs, testCases, ...}
 * @returns {Object} Métricas de densidad de defectos
 * 
 * Fórmula: Defect Density = Bugs Encontrados / Casos de Prueba Ejecutados
 */
export function calculateDefectDensity(sprintData) {
  if (!sprintData || sprintData.length === 0) {
    return {
      avg: 0,
      total: 0,
      max: 0,
      min: 0,
      sprints: 0,
      bySprint: [],
      trend: [],
      status: 'no-data'
    };
  }

  // Calcular densidad por sprint
  const densities = sprintData.map(sprint => {
    const bugs = sprint.bugs || 0;
    const testCases = sprint.testCases || 0;
    const density = testCases > 0 ? bugs / testCases : 0;
    
    return {
      sprint: sprint.sprint,
      bugs,
      testCases,
      density: parseFloat(density.toFixed(4)), // Redondear a 4 decimales
      densityPercent: parseFloat((density * 100).toFixed(2)) // Como porcentaje
    };
  });

  // Estadísticas generales
  const totalBugs = densities.reduce((sum, d) => sum + d.bugs, 0);
  const totalTestCases = densities.reduce((sum, d) => sum + d.testCases, 0);
  const avgDensity = totalTestCases > 0 ? totalBugs / totalTestCases : 0;
  const maxDensity = Math.max(...densities.map(d => d.density), 0);
  const minDensity = Math.min(...densities.map(d => d.density > 0 ? d.density : Infinity), 0);

  // Tendencia (comparar primera mitad vs segunda mitad)
  const midPoint = Math.floor(densities.length / 2);
  const firstHalf = densities.slice(0, midPoint);
  const secondHalf = densities.slice(midPoint);
  
  const firstHalfAvg = firstHalf.length > 0 
    ? firstHalf.reduce((sum, d) => sum + d.density, 0) / firstHalf.length 
    : 0;
  const secondHalfAvg = secondHalf.length > 0 
    ? secondHalf.reduce((sum, d) => sum + d.density, 0) / secondHalf.length 
    : 0;
  
  const trend = firstHalfAvg > 0 
    ? Math.round(((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100)
    : 0;

  // Determinar estado
  let status = 'good';
  if (avgDensity > 0.5) status = 'critical'; // Más de 0.5 bugs por caso
  else if (avgDensity > 0.3) status = 'warning'; // Más de 0.3 bugs por caso
  else if (avgDensity > 0) status = 'good'; // Menos de 0.3 bugs por caso

  return {
    avg: parseFloat(avgDensity.toFixed(4)),
    avgPercent: parseFloat((avgDensity * 100).toFixed(2)),
    total: totalBugs,
    totalTestCases,
    max: parseFloat(maxDensity.toFixed(4)),
    min: parseFloat(minDensity === Infinity ? 0 : minDensity.toFixed(4)),
    sprints: densities.length,
    bySprint: densities,
    trend, // Porcentaje de cambio entre mitades
    status, // 'good' | 'warning' | 'critical'
    description: getDefectDensityDescription(avgDensity)
  };
}

/**
 * Obtiene una descripción textual de la densidad de defectos
 */
function getDefectDensityDescription(density) {
  if (density <= 0) return 'Sin datos';
  if (density < 0.1) return 'Excelente: Muy pocos defectos encontrados';
  if (density < 0.3) return 'Bueno: Densidad de defectos dentro de lo normal';
  if (density < 0.5) return 'Alerta: Densidad de defectos elevada';
  return 'Crítico: Densidad de defectos muy alta';
}

/**
 * Obtiene datos de sparkline para gráfico de tendencia
 */
export function getDefectDensitySparkline(sprintData) {
  if (!sprintData || sprintData.length === 0) return [];
  
  return sprintData.map(sprint => {
    const bugs = sprint.bugs || 0;
    const testCases = sprint.testCases || 0;
    return testCases > 0 ? parseFloat((bugs / testCases).toFixed(4)) : 0;
  });
}

/**
 * Compara densidad de defectos entre sprints
 */
export function compareDefectDensity(sprintData) {
  if (!sprintData || sprintData.length < 2) return null;

  const first = sprintData[0];
  const last = sprintData[sprintData.length - 1];

  const firstDensity = first.testCases > 0 ? first.bugs / first.testCases : 0;
  const lastDensity = last.testCases > 0 ? last.bugs / last.testCases : 0;

  const change = firstDensity > 0 
    ? Math.round(((lastDensity - firstDensity) / firstDensity) * 100)
    : 0;

  return {
    firstSprint: first.sprint,
    lastSprint: last.sprint,
    firstDensity: parseFloat(firstDensity.toFixed(4)),
    lastDensity: parseFloat(lastDensity.toFixed(4)),
    change, // Porcentaje de cambio
    improved: change < 0 // true si mejoró (menos defectos)
  };
}
