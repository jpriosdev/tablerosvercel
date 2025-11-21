import fs from 'fs';
import path from 'path';

const CACHE_DURATION_MS = 5 * 60 * 1000; // Cache results for 5 minutes
const cache = { timestamp: 0, payload: null };

function getJsonPath() {
  return path.join(process.cwd(), 'public', 'data', 'qa-data.json');
}

function getExcelPath() {
  return path.join(process.cwd(), 'data', 'Reporte_QA_V1.xlsx');
}

function createFallbackData() {
  return {
    metadata: {
      version: 'fallback',
      source: 'internal',
      lastUpdated: new Date().toISOString(),
    },
    summary: {
      totalBugs: 138,
      bugsClosed: 52,
      bugsPending: 54,
      testCasesTotal: 692,
      testCasesExecuted: 692,
      testCasesPassed: 580,
      testCasesFailed: 112,
    },
    bugsByPriority: {
      'Más alta': { count: 7, pending: 2, resolved: 5 },
      Alta: { count: 41, pending: 23, resolved: 18 },
      Media: { count: 82, pending: 38, resolved: 44 },
      Baja: { count: 8, pending: 7, resolved: 1 },
    },
    bugsByModule: {
      POS: { count: 86, percentage: 62, pending: 32 },
      BOT: { count: 51, percentage: 37, pending: 21 },
      Otros: { count: 1, percentage: 1, pending: 1 },
    },
    developerData: [],
    sprintData: [],
    bugsByCategory: {},
    qualityMetrics: {},
  };
}

function loadJsonFile(jsonPath) {
  if (!fs.existsSync(jsonPath)) {
    return null;
  }
  const payload = fs.readFileSync(jsonPath, 'utf-8');
  return JSON.parse(payload);
}

async function loadExcelFile(excelPath) {
  if (!fs.existsSync(excelPath)) {
    throw new Error(`Excel file not found: ${excelPath}`);
  }
  const imported = await import('./excelProcessor.cjs');
  const processor =
    imported.ExcelQAProcessor ||
    (imported.default && imported.default.ExcelQAProcessor);

  if (!processor) {
    throw new Error('ExcelQAProcessor not found in lib/excelProcessor.cjs');
  }

  return processor.processExcelFile(excelPath);
}

export async function getQAData({ forceReload = false } = {}) {
  const now = Date.now();
  if (!forceReload && cache.payload && now - cache.timestamp < CACHE_DURATION_MS) {
    return { ...cache.payload, _cached: true };
  }

  try {
    const jsonData = loadJsonFile(getJsonPath());
    if (jsonData) {
      // Marcar datos como reales (del Excel/JSON)
      cache.payload = {
        ...jsonData,
        _dataSource: 'excel',
        _isRealData: true,
        _timestamp: now,
      };
      return cache.payload;
    }
    
    // Intentar cargar del Excel
    const excelData = await loadExcelFile(getExcelPath());
    cache.payload = {
      ...excelData,
      _dataSource: 'excel',
      _isRealData: true,
      _timestamp: now,
    };
  } catch (error) {
    console.warn('Falling back to built-in data:', error.message);
    // Marcar como datos ficticios
    cache.payload = {
      ...createFallbackData(),
      _dataSource: 'fallback',
      _isRealData: false,
      _timestamp: now,
      _warning: 'Usando datos de demostración. Los datos reales no están disponibles.',
    };
  }

  cache.timestamp = now;
  return cache.payload;
}
