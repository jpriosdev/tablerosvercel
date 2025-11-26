import fs from 'fs';
import path from 'path';
import { JSON_PATH } from './config.js';

const CACHE_DURATION_MS = 5 * 60 * 1000; // Cache results for 5 minutes
const cache = { timestamp: 0, payload: null };

function getJsonPath() {
  return JSON_PATH;
}

function getExcelPath() {
  return path.join(process.cwd(), 'data', 'Reporte_QA_V1.xlsx');
}

function createFallbackData() {
  // Fallback mínimo y seguro
  return {
    metadata: {
      version: 'fallback-minimal',
      source: 'none',
      lastUpdated: new Date().toISOString(),
    },
    summary: {
      totalBugs: 0,
      bugsClosed: 0,
      bugsPending: 0,
      testCasesTotal: 0,
      testCasesExecuted: 0,
      testCasesPassed: 0,
      testCasesFailed: 0,
    },
    bugsByPriority: {},
    bugsByModule: {},
    developerData: [],
    sprintData: [],
    bugsByCategory: {},
    qualityMetrics: {},
    _warning: 'Database not available; returning minimal safe payload.'
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

export function clearQADataCache() {
  cache.payload = null;
  cache.timestamp = 0;
}
