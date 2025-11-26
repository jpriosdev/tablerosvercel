// This module was archived (implementation moved to archive/) because exports were
// not referenced by the application. Provide lightweight stubs so any accidental
// runtime imports do not crash the app.

function warnOnce(key) {
  if (typeof window !== 'undefined') {
    if (!window.__archivedWarnings) window.__archivedWarnings = new Set();
    if (!window.__archivedWarnings.has(key)) {
      console.warn(`Archived module: utils/defectDensity.js - function ${key} is archived.`);
      window.__archivedWarnings.add(key);
    }
  } else {
    // Server-side: log once per process
    try {
      if (!global.__archivedWarnings) global.__archivedWarnings = new Set();
      if (!global.__archivedWarnings.has(key)) {
        console.warn(`Archived module: utils/defectDensity.js - function ${key} is archived.`);
        global.__archivedWarnings.add(key);
      }
    } catch (e) {}
  }
}

export function calculateDefectDensity(/* sprintData */) {
  warnOnce('calculateDefectDensity');
  return {
    avg: 0,
    avgPercent: 0,
    total: 0,
    totalTestCases: 0,
    max: 0,
    min: 0,
    sprints: 0,
    bySprint: [],
    trend: 0,
    status: 'no-data',
    description: 'Archived'
  };
}

export function getDefectDensitySparkline(/* sprintData */) {
  warnOnce('getDefectDensitySparkline');
  return [];
}

export function compareDefectDensity(/* sprintData */) {
  warnOnce('compareDefectDensity');
  return null;
}
