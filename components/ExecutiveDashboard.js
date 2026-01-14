// components/ExecutiveDashboard.js
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  RefreshCw, 
  AlertTriangle,
  BarChart3,
  Target,
  Users,
  Activity,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Bug,
  Clock,
  Settings,
  Filter,
  X,
  ChevronDown
} from 'lucide-react';

import KPICard from './KPICard';
import SprintTrendChart from './SprintTrendChart';
import RiskMatrix from './RiskMatrix';
import DeveloperAnalysis from './DeveloperAnalysis';
import ModuleAnalysis from './ModuleAnalysis';
import ExecutiveRecommendations from './ExecutiveRecommendations';
import QualityMetrics from './QualityMetrics';
import DetailModal from './DetailModal';
import QualityRadarChart from './QualityRadarChart';
import SprintComparison from './SprintComparison';
import ActionableRecommendations from './ActionableRecommendations';
import { QADataProcessor } from '../utils/dataProcessor'; // Nueva importación

export default function ExecutiveDashboard({ 
  // Props originales
  data: externalData, 
  lastUpdated: externalLastUpdated, 
  onRefresh: externalOnRefresh, 
  loading: externalLoading,
  
  // Nuevas props para modo paramétrico
  dataSource = '/api/qa-data',
  configSource = '/api/config',
  refreshInterval = 300000
}) {
  // Estados originales
  const [activeTab, setActiveTab] = useState('overview');
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  // Nuevos estados para modo paramétrico
  const [parametricData, setParametricData] = useState(null);
  const [config, setConfig] = useState(null);
  const [parametricLoading, setParametricLoading] = useState(false);
  const [parametricLastUpdated, setParametricLastUpdated] = useState(null);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [useParametricMode, setUseParametricMode] = useState(false);

  // Determinar qué datos usar
  const isParametricMode = useParametricMode && !externalData;
  const currentData = isParametricMode ? parametricData : externalData;
  const currentLoading = isParametricMode ? parametricLoading : externalLoading;
  const currentLastUpdated = isParametricMode ? parametricLastUpdated : externalLastUpdated;

  // Cargar configuración para modo paramétrico
  useEffect(() => {
    loadConfiguration();
  }, [configSource]);

  // Cargar recomendaciones al montar
  useEffect(() => {
    loadRecommendations();
  }, []);

  // Auto-refresh mejorado
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      if (isParametricMode) {
        loadParametricData();
      } else if (externalOnRefresh) {
        externalOnRefresh();
      }
    }, refreshInterval);
    
    return () => clearInterval(interval);
  }, [autoRefresh, isParametricMode, externalOnRefresh, refreshInterval]);

  // Cargar datos paramétricos cuando hay configuración
  useEffect(() => {
    if (isParametricMode && config) {
      loadParametricData();
    }
  }, [isParametricMode, config, dataSource]);

  const loadConfiguration = async () => {
    try {
      const response = await fetch(configSource);
      if (!response.ok) throw new Error('Config not found');
      const configData = await response.json();
      setConfig(configData);
      
      // Aplicar configuración de auto-refresh si existe
      if (configData.autoRefresh !== undefined) {
        setAutoRefresh(configData.autoRefresh);
      }
      
      // Aplicar configuración de modo paramétrico si existe
      if (configData.useParametricMode !== undefined) {
        setUseParametricMode(configData.useParametricMode);
      }
    } catch (error) {
      console.warn('Using default configuration:', error);
      setConfig({
        autoRefresh: true,
        refreshInterval: 300000,
        useParametricMode: true,
        weights: {
          resolutionRate: 0.3,
          testCoverage: 0.25,
          bugDensity: 0.2,
          criticalBugs: 0.25
        },
        thresholds: {
          criticalBugsAlert: 20,
          maxBugsDeveloper: 15,
          criticalModulePercentage: 60
        }
      });
    }
  };

  const loadParametricData = async () => {
    setParametricLoading(true);
    setError(null);
    try {
      const response = await fetch(dataSource);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const rawData = await response.json();
      
      if (rawData && config) {
        // Usar el nuevo procesador con configuración
        const processedData = QADataProcessor.processQAData(rawData, config);
        setParametricData(processedData);
        setParametricLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error loading parametric data:', error);
      setError(error.message);
    } finally {
      setParametricLoading(false);
    }
  };

  const loadRecommendations = async () => {
    try {
      const response = await fetch('/api/recommendations');
      if (response.ok) {
        const data = await response.json();
        setRecommendations(data);
        console.log('✅ Recomendaciones cargadas desde archivo');
      } else {
        console.warn('No se pudieron cargar recomendaciones, usando valores por defecto');
      }
    } catch (error) {
      console.warn('Error al cargar recomendaciones:', error);
      // No establecer error porque las recomendaciones son opcionales
    }
  };

  const handleRefresh = () => {
    if (isParametricMode) {
      loadParametricData();
    } else if (externalOnRefresh) {
      externalOnRefresh();
    }
  };

  if (!currentData && !currentLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-xl mb-4">📊</div>
          <p className="text-gray-600 mb-4">No hay datos disponibles</p>
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-executive-600 text-white rounded-lg hover:bg-executive-700"
          >
            Cargar Datos
          </button>
        </div>
      </div>
    );
  }

  if (!currentData) return null;

  const { kpis, summary, alerts } = currentData;

  const tabs = [
    { id: 'overview', label: 'Resumen Ejecutivo', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'quality', label: 'Métricas de Calidad', icon: <Target className="w-4 h-4" /> },
    { id: 'teams', label: 'Análisis de Equipos', icon: <Users className="w-4 h-4" /> },
    { id: 'recommendations', label: 'Roadmap', icon: <CheckCircle className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f6fd] via-white to-[#f8f6fd]">
      {/* Header mejorado con branding */}
      <div className="bg-white/90 backdrop-blur-md shadow-lg border-b sticky top-0 z-40" style={{ borderColor: '#e0e0e0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo y Título */}
            <div className="flex items-center space-x-6">
              {/* Logo Tiendas 3B */}
              <div className="flex-shrink-0">
                <img 
                  src="/logo-3b.jpg" 
                  alt="Tiendas 3B" 
                  className="h-16 w-auto"
                />
              </div>
              
              {/* Separador */}
              <div className="hidden md:block h-12 w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent"></div>
              
              {/* Título */}
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-2xl font-bold" style={{ color: '#754bde' }}>
                    Dashboard Ejecutivo QA
                  </h1>
                  {/* Modo Paramétrico - Oculto temporalmente */}
                  {false && isParametricMode && (
                    <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold rounded-full shadow-sm">
                      Modo Paramétrico
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium mt-0.5" style={{ color: '#80868d' }}>
                  Control de Calidad y Trazabilidad del Proceso de Pruebas
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Indicador de error */}
              {error && (
                <div className="flex items-center px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  <span className="text-xs font-medium">Error de conexión</span>
                </div>
              )}
              
              {/* Última actualización */}
              <div className="text-right hidden sm:block">
                <p className="text-xs text-slate-500 font-medium">Último incidente reportado</p>
                <p className="text-sm font-semibold text-slate-900 mt-0.5">
                  {currentLastUpdated ? format(currentLastUpdated, 'dd/MM/yyyy HH:mm', { locale: es }) : 'Sin reportar'}
                </p>
              </div>
              
              <button
                onClick={handleRefresh}
                disabled={currentLoading}
                className="flex items-center px-4 py-2 bg-executive-600 text-white rounded-lg hover:bg-executive-700 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${currentLoading ? 'animate-spin' : ''}`} />
                Actualizar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Alertas Críticas mejoradas */}
      {alerts && alerts.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex">
              <AlertTriangle className="w-5 h-5 text-red-400 mr-3 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800 mb-2">
                  Alertas Críticas ({alerts.filter(a => a.type === 'critical').length})
                </h3>
                <div className="space-y-1">
                  {alerts.slice(0, 3).map((alert, index) => (
                    <div key={alert.id || index} className="flex items-start justify-between">
                      <p className="text-sm text-red-700 flex-1">
                        • {alert.message || alert.title}
                      </p>
                      {alert.action && (
                        <button className="text-xs text-red-600 hover:text-red-800 ml-4 underline">
                          {alert.action}
                        </button>
                      )}
                    </div>
                  ))}
                  {alerts.length > 3 && (
                    <p className="text-xs text-red-600 mt-2">
                      +{alerts.length - 3} alertas adicionales
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navegación por tabs con estilo moderno */}
        <div className="mb-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-2 shadow-sm border" style={{ borderColor: '#e0e0e0' }}>
            <nav className="flex space-x-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'text-white shadow-lg'
                      : 'hover:bg-[#f8f6fd]'
                  }`}
                  style={activeTab === tab.id ? {
                    background: '#754bde',
                    boxShadow: '0 10px 25px -5px rgba(117, 75, 222, 0.3)'
                  } : { color: '#80868d' }}
                >
                  <span className={`mr-2 ${
                    activeTab === tab.id ? 'text-white' : ''
                  }`} style={activeTab === tab.id ? {} : { color: '#b2b2b2' }}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Contenido por tabs */}
        <div className="animate-fade-in">
          {activeTab === 'overview' && <OverviewTab data={currentData} recommendations={recommendations} />}
          {activeTab === 'quality' && <QualityTab data={currentData} />}
          {activeTab === 'teams' && <TeamsTab data={currentData} />}
          {activeTab === 'recommendations' && <RecommendationsTab data={currentData} />}
        </div>
      </div>
    </div>
  );
}

// ===============================
// COMPONENTES DE TABS (mantén los existentes)
// ===============================

function OverviewTab({ data, recommendations }) {
  const { kpis, summary } = data;
  const sprintList = data.sprintData?.map(s => s.sprint || s.name || s.id) || [];
  const [selectedSprints, setSelectedSprints] = React.useState(['Todos']);
  const [selectedModules, setSelectedModules] = React.useState(['Todos']);
  const [selectedStatus, setSelectedStatus] = React.useState(['Todos']);
  const [selectedPriorities, setSelectedPriorities] = React.useState(['Todos']);
  const [showFilters, setShowFilters] = React.useState(true);
  const [collapsedSections, setCollapsedSections] = React.useState({ sprint: false, module: false, status: false, priority: false });
  const [detailModal, setDetailModal] = React.useState(null);

  // Opciones de filtros derivadas de los datos
  const moduleList = ['POS', 'BOT', 'Otros'];
  const statusList = ['Abierto', 'Resuelto', 'Cerrado', 'Cancelado'];
  const priorityList = ['Más alta', 'Alta', 'Media', 'Baja'];

  // Funciones manejadoras de filtros
  const handleFilterToggle = (filterType, value) => {
    const setterMap = {
      sprint: setSelectedSprints,
      module: setSelectedModules,
      status: setSelectedStatus,
      priority: setSelectedPriorities
    };

    const setter = setterMap[filterType];
    if (value === 'Todos') {
      setter(['Todos']);
    } else {
      setter(prev => {
        if (prev.includes('Todos')) {
          return [value];
        }
        if (prev.includes(value)) {
          const filtered = prev.filter(v => v !== value);
          return filtered.length === 0 ? ['Todos'] : filtered;
        }
        return [...prev, value];
      });
    }
  };

  // Filtro de sprints
  const handleSprintToggle = (sprint) => {
    handleFilterToggle('sprint', sprint);
  };

  // Filtrar datos por sprints seleccionados
  const filteredSprintData = selectedSprints.includes('Todos')
    ? data.sprintData
    : data.sprintData?.filter(s => selectedSprints.includes(s.sprint || s.name || s.id));

  // Función para aplicar filtros de módulo y prioridad a bugsByPriority
  const getFilteredBugsByPriority = () => {
    // Si no hay filtros activos (módulo/sprint/prioridad), devolver el agregado original
    const noModuleFilter = selectedModules.includes('Todos');
    const noPriorityFilter = selectedPriorities.includes('Todos');
    const noSprintFilter = selectedSprints.includes('Todos');
    if (noModuleFilter && noPriorityFilter && noSprintFilter) {
      return { ...data.bugsByPriority };
    }

    // Construir conteo real a partir del listado de bugs para mayor precisión
    const result = {};
    const bugsList = data.bugs || [];

    bugsList.forEach(bug => {
      const bugPriority = bug.priority || 'Sin prioridad';
      const bugModule = bug.module || 'Otros';
      const bugSprint = bug.sprint || bug.found_in_sprint || '';
      const bugStatus = (bug.status || '').toString();

      // Aplicar filtros
      if (!noSprintFilter) {
        if (!selectedSprints.includes(bugSprint)) return;
      }
      if (!noModuleFilter) {
        if (!selectedModules.includes(bugModule)) return;
      }
      if (!noPriorityFilter) {
        if (!selectedPriorities.includes(bugPriority)) return;
      }
      // Aplicar filtro por estado si está activo
      const noStatusFilter = selectedStatus.includes('Todos');
      if (!noStatusFilter) {
        // Normalizar comparaciones: permitir coincidencias parciales y case-insensitive
        const normalizedBugStatus = bugStatus.toString().toLowerCase();
        const matchesStatus = selectedStatus.some(st => {
          const ns = (st || '').toString().toLowerCase();
          return normalizedBugStatus.includes(ns) || ns.includes(normalizedBugStatus);
        });
        if (!matchesStatus) return;
      }

      if (!result[bugPriority]) result[bugPriority] = { count: 0, pending: 0, resolved: 0 };
      result[bugPriority].count = (result[bugPriority].count || 0) + 1;

      // Determinar si está resuelto: usar fixed_in_sprint o status
      const fixed = bug.fixed_in_sprint && bug.fixed_in_sprint !== 'No encontrado' && bug.fixed_in_sprint !== '';
      const status = (bug.status || '').toString().toLowerCase();
      const isResolved = fixed || status.includes('resuelto') || status.includes('cerr') || status.includes('fixed') || status.includes('closed');

      if (isResolved) result[bugPriority].resolved = (result[bugPriority].resolved || 0) + 1;
      else result[bugPriority].pending = (result[bugPriority].pending || 0) + 1;
    });

    // Si después de filtrar no hay resultados, devolver el agregado original
    return Object.keys(result).length > 0 ? result : { ...data.bugsByPriority };
  };

  // Función para aplicar filtro de módulo
  const getFilteredBugsByModule = () => {
    if (selectedModules.includes('Todos')) {
      return data.bugsByModule;
    }

    const filtered = {};
    selectedModules.forEach(mod => {
      if (data.bugsByModule[mod]) {
        filtered[mod] = data.bugsByModule[mod];
      }
    });
    return Object.keys(filtered).length > 0 ? filtered : data.bugsByModule;
  };

  // Obtener datos filtrados
  const filteredBugsByPriority = getFilteredBugsByPriority();
  const filteredBugsByModule = getFilteredBugsByModule();

  // Recalcular KPIs basados en los filtros seleccionados
  const totalTestCases = filteredSprintData?.reduce((acc, s) => acc + (s.testCases || s.testCasesExecuted || 0), 0) || 0;
  const totalBugs = filteredSprintData?.reduce((acc, s) => acc + (s.bugs || s.bugsFound || 0), 0) || summary.totalBugs || 0;
  const bugsClosed = filteredSprintData?.reduce((acc, s) => acc + (s.bugsResolved || s.bugsClosed || 0), 0) || summary.bugsClosed || 0;
  
  // Calcular bugs críticos desde los datos filtrados
  let criticalBugsPending, criticalBugsTotal, criticalBugsMasAlta, criticalBugsAlta;
  
  criticalBugsMasAlta = filteredBugsByPriority['Más alta']?.count || 0;
  criticalBugsAlta = filteredBugsByPriority['Alta']?.count || 0;
  criticalBugsPending = (filteredBugsByPriority['Más alta']?.pending || 0) + (filteredBugsByPriority['Alta']?.pending || 0);
  criticalBugsTotal = criticalBugsMasAlta + criticalBugsAlta;
  
  const avgTestCasesPerSprint = filteredSprintData && filteredSprintData.length > 0
    ? Math.round(totalTestCases / filteredSprintData.length)
    : kpis.avgTestCasesPerSprint || 0;
  
  const resolutionEfficiency = totalBugs > 0 
    ? Math.round((bugsClosed / totalBugs) * 100) 
    : kpis.resolutionEfficiency || 0;
  
  const criticalBugsRatio = totalBugs > 0 
    ? Math.round((criticalBugsPending / totalBugs) * 100) 
    : kpis.criticalBugsRatio || 0;

  // Desglose por módulo (BOT / POS / Total) — usar totales originales para proporciones
  const originalModuleCounts = {
    BOT: data.bugsByModule?.BOT?.count || 0,
    POS: data.bugsByModule?.POS?.count || 0
  };
  originalModuleCounts.Otros = data.bugsByModule?.Otros?.count || 0;
  originalModuleCounts.Total = (originalModuleCounts.BOT || 0) + (originalModuleCounts.POS || 0) + (originalModuleCounts.Otros || 0) || totalBugs || 0;

  // compute breakdown per module using the same source (data.bugs) and current filters
  const computeBreakdownByModule = (predicate = () => true) => {
    const counts = { BOT: 0, POS: 0, Otros: 0, Total: 0 };
    const bugsList = data.bugs || [];
    const sprintNames = (filteredSprintData || []).map(s => s.sprint || s.name || s.id);

    bugsList.forEach(bug => {
      const bugPriority = bug.priority || '';
      const bugModule = bug.module || 'Otros';
      const bugSprint = bug.sprint || bug.found_in_sprint || '';

      // Apply current UI filters (sprints/modules/priorities)
      if (!selectedSprints.includes('Todos')) {
        if (!sprintNames.includes(bugSprint)) return;
      }
      if (!selectedModules.includes('Todos')) {
        if (!selectedModules.includes(bugModule)) return;
      }
      if (!selectedPriorities.includes('Todos')) {
        if (!selectedPriorities.includes(bugPriority)) return;
      }

      // Aplicar filtro por estado si está activo
      const noStatusFilter = selectedStatus.includes('Todos');
      if (!noStatusFilter) {
        const bugStatus = (bug.status || '').toString().toLowerCase();
        const matchesStatus = selectedStatus.some(st => {
          const ns = (st || '').toString().toLowerCase();
          return bugStatus.includes(ns) || ns.includes(bugStatus);
        });
        if (!matchesStatus) return;
      }

      // Apply KPI-specific predicate
      if (!predicate(bug)) return;

      if (bugModule === 'BOT') counts.BOT += 1;
      else if (bugModule === 'POS') counts.POS += 1;
      else counts.Otros += 1;
      counts.Total += 1;
    });

    return counts;
  };

  // Devuelve lista de bugs filtrados según predicate y filtros UI (sprints/modules/priorities)
  const computeFilteredBugs = (predicate = () => true) => {
    const bugsList = data.bugs || [];
    const sprintNames = (filteredSprintData || []).map(s => s.sprint || s.name || s.id);
    const results = [];

    bugsList.forEach(bug => {
      const bugPriority = bug.priority || '';
      const bugModule = bug.module || 'Otros';
      const bugSprint = bug.sprint || bug.found_in_sprint || '';

      if (!selectedSprints.includes('Todos')) {
        if (!sprintNames.includes(bugSprint)) return;
      }
      if (!selectedModules.includes('Todos')) {
        if (!selectedModules.includes(bugModule)) return;
      }
      if (!selectedPriorities.includes('Todos')) {
        if (!selectedPriorities.includes(bugPriority)) return;
      }

      // Aplicar filtro por estado si está activo
      const noStatusFilter = selectedStatus.includes('Todos');
      if (!noStatusFilter) {
        const bugStatus = (bug.status || '').toString().toLowerCase();
        const matchesStatus = selectedStatus.some(st => {
          const ns = (st || '').toString().toLowerCase();
          return bugStatus.includes(ns) || ns.includes(bugStatus);
        });
        if (!matchesStatus) return;
      }

      if (!predicate(bug)) return;
      results.push(bug);
    });

    return results;
  };

  const distributeByModule = (value) => {
    // Si hay un filtro de módulo activo, mostrar el valor directamente en esa columna
    if (!selectedModules.includes('Todos')) {
      // Si sólo una selección (ej. ['POS']) devolverla directamente
      if (selectedModules.length === 1) {
        const only = selectedModules[0];
        if (only === 'POS') return { BOT: 0, POS: value, Total: value };
        if (only === 'BOT') return { BOT: value, POS: 0, Total: value };
      }
      // Si varias seleccionadas, distribuir proporcionalmente entre las seleccionadas
      const includedCounts = selectedModules.reduce((acc, mod) => {
        if (mod === 'POS' || mod === 'BOT') acc[mod] = originalModuleCounts[mod] || 0;
        return acc;
      }, { BOT: 0, POS: 0 });
      const baseIncluded = (includedCounts.BOT || 0) + (includedCounts.POS || 0) || 1;
      const bot = Math.round(((includedCounts.BOT || 0) / baseIncluded) * value) || 0;
      const pos = Math.round(((includedCounts.POS || 0) / baseIncluded) * value) || 0;
      return { BOT: bot, POS: pos, Total: bot + pos };
    }

    // Sin filtro: distribuir según proporción original entre BOT/POS
    const base = originalModuleCounts.Total || totalBugs || 1;
    const bot = Math.round(((originalModuleCounts.BOT || 0) / base) * value) || 0;
    const pos = Math.round(((originalModuleCounts.POS || 0) / base) * value) || 0;
    const otros = Math.round(((originalModuleCounts.Otros || 0) / base) * value) || 0;
    return { BOT: bot, POS: pos, Otros: otros, Total: bot + pos + otros };
  };

  // Calcular tendencias comparando primera mitad vs segunda mitad de sprints seleccionados
  const calculateTrend = (getData) => {
    if (!filteredSprintData || filteredSprintData.length < 2) return 0;
    
    const midPoint = Math.floor(filteredSprintData.length / 2);
    const firstHalf = filteredSprintData.slice(0, midPoint);
    const secondHalf = filteredSprintData.slice(midPoint);
    
    const firstAvg = firstHalf.reduce((acc, s) => acc + getData(s), 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((acc, s) => acc + getData(s), 0) / secondHalf.length;
    
    if (firstAvg === 0) return 0;
    return Math.round(((secondAvg - firstAvg) / firstAvg) * 100);
  };

  const testCasesTrend = calculateTrend(s => s.testCases || s.testCasesExecuted || 0);
  const resolutionTrend = calculateTrend(s => {
    const total = s.bugs || s.bugsFound || 0;
    const resolved = s.bugsResolved || s.bugsClosed || 0;
    return total > 0 ? (resolved / total) * 100 : 0;
  });
  const criticalBugsTrend = calculateTrend(s => s.bugs || s.bugsFound || 0) * -1; // Invertido porque menos bugs es mejor

  // NUEVAS MÉTRICAS ESTRATÉGICAS
  
  // 1. Cycle Time: Tiempo promedio de resolución de bugs
  const calculateCycleTime = () => {
    if (!filteredSprintData || filteredSprintData.length === 0) return { avg: 0, byPriority: {} };
    
    // Usar valor real de qualityMetrics.cycleTime si existe
    const realCycleTime = data.qualityMetrics?.cycleTime || null;
    
    let avgCycleTime;
    if (realCycleTime !== null) {
      // Usar dato real del JSON
      avgCycleTime = realCycleTime;
    } else {
      // Fallback: Estimación basada en eficiencia de resolución
      const sprintDays = 14;
      const avgEfficiency = filteredSprintData.reduce((acc, s) => {
        const total = s.bugs || s.bugsFound || 0;
        const resolved = s.bugsResolved || s.bugsClosed || 0;
        return acc + (total > 0 ? resolved / total : 0);
      }, 0) / filteredSprintData.length;
      
      avgCycleTime = Math.round(sprintDays * (1 - avgEfficiency * 0.5));
    }
    
    return {
      avg: avgCycleTime,
      byPriority: {
        critical: Math.round(avgCycleTime * 0.6), // Críticos se resuelven más rápido
        high: Math.round(avgCycleTime * 0.8),
        medium: avgCycleTime,
        low: Math.round(avgCycleTime * 1.5)
      }
    };
  };
  
  const cycleTimeData = calculateCycleTime();
  
  // Cobertura de Automatización de Pruebas (para ficha 7)
  const calculateAutomationCoverage = () => {
    if (!filteredSprintData || filteredSprintData.length === 0) return { coverage: 0, automated: 0, manual: 0, trend: [] };
    
    const avgCoverage = filteredSprintData.reduce((acc, sprint) => {
      const totalTests = sprint.testCases || 0;
      const velocityFactor = (sprint.velocity || 15) / 20;
      const estimatedAutomated = Math.round(totalTests * (0.35 + velocityFactor * 0.25));
      const coveragePercent = totalTests > 0 ? (estimatedAutomated / totalTests) * 100 : 0;
      return acc + coveragePercent;
    }, 0) / filteredSprintData.length;
    
    const lastSprint = filteredSprintData[filteredSprintData.length - 1] || {};
    const totalTests = lastSprint.testCases || 0;
    const velocityFactor = (lastSprint.velocity || 15) / 20;
    const automatedTests = Math.round(totalTests * (0.35 + velocityFactor * 0.25));
    const manualTests = totalTests - automatedTests;
    
    return {
      coverage: Math.round(avgCoverage),
      automated: automatedTests,
      manual: manualTests,
      total: totalTests,
      trend: filteredSprintData.map(s => {
        const total = s.testCases || 0;
        const vFactor = (s.velocity || 15) / 20;
        const auto = Math.round(total * (0.35 + vFactor * 0.25));
        return total > 0 ? Math.round((auto / total) * 100) : 0;
      })
    };
  };
  
  const automationData = calculateAutomationCoverage();
  
  // 2. Defect Density: Densidad de defectos por sprint (datos reales)
  const calculateDefectDensityPerSprint = () => {
    if (!filteredSprintData || filteredSprintData.length === 0) return { avg: 0, total: 0, max: 0, min: 0 };
    
    // Usar datos reales de bugs por sprint
    const bugsPerSprint = filteredSprintData.map(s => s.bugs || 0);
    const totalBugsInSprints = bugsPerSprint.reduce((acc, bugs) => acc + bugs, 0);
    const avgBugsPerSprint = totalBugsInSprints / filteredSprintData.length;
    const maxBugs = Math.max(...bugsPerSprint);
    const minBugs = Math.min(...bugsPerSprint);
    
    return {
      avg: Math.round(avgBugsPerSprint * 10) / 10, // Redondear a 1 decimal
      total: totalBugsInSprints,
      max: maxBugs,
      min: minBugs,
      sprints: filteredSprintData.length
    };
  };
  
  const defectDensityData = calculateDefectDensityPerSprint();

  // Calcular datos de sparkline para cada métrica
  const getSparklineData = (metric) => {
    if (!filteredSprintData || filteredSprintData.length === 0) return [];
    
    return filteredSprintData.map(sprint => {
      switch(metric) {
        case 'testCases':
          return sprint.testCases || sprint.testCasesExecuted || 0;
        case 'resolutionEfficiency':
          const total = sprint.bugs || sprint.bugsFound || 0;
          const resolved = sprint.bugsResolved || sprint.bugsClosed || 0;
          return total > 0 ? Math.round((resolved / total) * 100) : 0;
        case 'automationCoverage':
          const totalTests = sprint.testCases || 0;
          const velocityFactor = (sprint.velocity || 15) / 20;
          const automated = Math.round(totalTests * (0.35 + velocityFactor * 0.25));
          return totalTests > 0 ? Math.round((automated / totalTests) * 100) : 0;
        case 'criticalBugs':
          // Si existe el dato directo, usarlo
          if (sprint.criticalBugs !== undefined) {
            return sprint.criticalBugs;
          }
          // Si no, estimar basado en proporción de bugs totales
          // Asumiendo ~35% de bugs son críticos (Más alta + Alta)
          const sprintBugs = sprint.bugs || 0;
          return Math.round(sprintBugs * 0.35);
        case 'criticalBugsPending':
          // Si existe el dato directo, usarlo
          if (sprint.criticalBugsPending !== undefined) {
            return sprint.criticalBugsPending;
          }
          // Si no, estimar basado en bugs pendientes
          const pending = sprint.bugsPending || 0;
          return Math.round(pending * 0.35);
        case 'cycleTime':
          const eff = sprint.resolutionEfficiency || 70;
          return Math.round(15 - (eff / 10));
        case 'defectDensity':
          // Retornar bugs por sprint directamente (datos reales)
          return sprint.bugs || 0;
        default:
          return 0;
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Filtro Moderno Estilo DashboardDemo */}
      {/* Encabezado con gradiente */}
      <div 
        onClick={() => setShowFilters(!showFilters)}
        className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 rounded-t-lg p-3 text-white flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow mb-0"
      >
        <div className="flex items-center gap-2">
          <Filter size={20} />
          <h2 className="text-sm font-bold">Filtros de Análisis</h2>
          {(() => {
            const activeFilters = 
              (selectedSprints[0] !== 'Todos' ? selectedSprints.length : 0) +
              (selectedModules[0] !== 'Todos' ? selectedModules.length : 0) +
              (selectedStatus[0] !== 'Todos' ? selectedStatus.length : 0) +
              (selectedPriorities[0] !== 'Todos' ? selectedPriorities.length : 0);
            return activeFilters > 0 ? (
              <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs font-semibold">
                {activeFilters} activo{activeFilters > 1 ? 's' : ''}
              </span>
            ) : null;
          })()}
        </div>
        <div className="flex items-center gap-2">
          {(() => {
            const activeFilters = 
              (selectedSprints[0] !== 'Todos' ? selectedSprints.length : 0) +
              (selectedModules[0] !== 'Todos' ? selectedModules.length : 0) +
              (selectedStatus[0] !== 'Todos' ? selectedStatus.length : 0) +
              (selectedPriorities[0] !== 'Todos' ? selectedPriorities.length : 0);
            return activeFilters > 0 ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSprints(['Todos']);
                  setSelectedModules(['Todos']);
                  setSelectedStatus(['Todos']);
                  setSelectedPriorities(['Todos']);
                }}
                className="flex items-center gap-1 px-2 py-1 bg-white bg-opacity-20 hover:bg-opacity-30 rounded text-xs font-semibold transition-all"
              >
                <X size={14} />
                Limpiar
              </button>
            ) : null;
          })()}
          <ChevronDown 
            size={18} 
            className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`}
          />
        </div>
      </div>

      {/* Grid de Filtros - Colapsable */}
      {showFilters && (
        <div className="bg-gray-50 rounded-b-lg p-4 border border-gray-200 border-t-0 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Sprint Filter Section */}
            <div className="border rounded-lg p-3 bg-indigo-50 border-indigo-200">
              <button
                onClick={() => setCollapsedSections(prev => ({...prev, sprint: !prev.sprint}))}
                className="w-full flex items-center justify-between mb-2"
              >
                <div className="flex items-center gap-1">
                  <span className="text-lg">📅</span>
                  <p className="font-bold uppercase text-xs">Sprint</p>
                  {selectedSprints.length > 0 && selectedSprints[0] !== 'Todos' && (
                    <span className="ml-1 px-2 py-0.5 bg-white bg-opacity-50 text-xs font-bold rounded">
                      {selectedSprints.length}
                    </span>
                  )}
                </div>
                <ChevronDown size={14} className={`transition-transform flex-shrink-0 ${collapsedSections.sprint ? '' : 'rotate-180'}`} />
              </button>

              {!collapsedSections.sprint && (
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => handleSprintToggle('Todos')}
                    className={`px-2 py-1 text-xs font-semibold rounded-full transition-all whitespace-nowrap ${
                      selectedSprints.includes('Todos')
                        ? 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-md'
                        : 'bg-white bg-opacity-70 hover:bg-opacity-100 text-gray-700'
                    }`}
                  >
                    Todos
                  </button>
                  {sprintList.map(sprint => (
                    <button
                      key={sprint}
                      onClick={() => handleSprintToggle(sprint)}
                      className={`px-2 py-1 text-xs font-semibold rounded-full transition-all whitespace-nowrap ${
                        selectedSprints.includes(sprint) && !selectedSprints.includes('Todos')
                          ? 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-md'
                          : 'bg-white bg-opacity-70 hover:bg-opacity-100 text-gray-700'
                      }`}
                    >
                      {sprint}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Module Filter Section (POS/BOT) */}
            <div className="border rounded-lg p-3 bg-red-50 border-red-200">
              <button
                onClick={() => setCollapsedSections(prev => ({...prev, module: !prev.module}))}
                className="w-full flex items-center justify-between mb-2"
              >
                <div className="flex items-center gap-1">
                  <span className="text-lg">⚙️</span>
                  <p className="font-bold uppercase text-xs">Módulo</p>
                  {selectedModules.length > 0 && selectedModules[0] !== 'Todos' && (
                    <span className="ml-1 px-2 py-0.5 bg-white bg-opacity-50 text-xs font-bold rounded">
                      {selectedModules.length}
                    </span>
                  )}
                </div>
                <ChevronDown size={14} className={`transition-transform flex-shrink-0 ${collapsedSections.module ? '' : 'rotate-180'}`} />
              </button>

              {!collapsedSections.module && (
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => handleFilterToggle('module', 'Todos')}
                    className={`px-2 py-1 text-xs font-semibold rounded-full transition-all whitespace-nowrap ${
                      selectedModules.includes('Todos')
                        ? 'bg-red-500 hover:bg-red-600 text-white shadow-md'
                        : 'bg-white bg-opacity-70 hover:bg-opacity-100 text-gray-700'
                    }`}
                  >
                    Todos
                  </button>
                  {moduleList.map(module => (
                    <button
                      key={module}
                      onClick={() => handleFilterToggle('module', module)}
                      className={`px-2 py-1 text-xs font-semibold rounded-full transition-all whitespace-nowrap ${
                        selectedModules.includes(module) && !selectedModules.includes('Todos')
                          ? 'bg-red-500 hover:bg-red-600 text-white shadow-md'
                          : 'bg-white bg-opacity-70 hover:bg-opacity-100 text-gray-700'
                      }`}
                    >
                      {module}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Priority Filter Section */}
            <div className="border rounded-lg p-3 bg-orange-50 border-orange-200">
              <button
                onClick={() => setCollapsedSections(prev => ({...prev, priority: !prev.priority}))}
                className="w-full flex items-center justify-between mb-2"
              >
                <div className="flex items-center gap-1">
                  <span className="text-lg">⚡</span>
                  <p className="font-bold uppercase text-xs">Prioridad</p>
                  {selectedPriorities.length > 0 && selectedPriorities[0] !== 'Todos' && (
                    <span className="ml-1 px-2 py-0.5 bg-white bg-opacity-50 text-xs font-bold rounded">
                      {selectedPriorities.length}
                    </span>
                  )}
                </div>
                <ChevronDown size={14} className={`transition-transform flex-shrink-0 ${collapsedSections.priority ? '' : 'rotate-180'}`} />
              </button>

              {!collapsedSections.priority && (
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => handleFilterToggle('priority', 'Todos')}
                    className={`px-2 py-1 text-xs font-semibold rounded-full transition-all whitespace-nowrap ${
                      selectedPriorities.includes('Todos')
                        ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-md'
                        : 'bg-white bg-opacity-70 hover:bg-opacity-100 text-gray-700'
                    }`}
                  >
                    Todos
                  </button>
                  {priorityList.map(priority => (
                    <button
                      key={priority}
                      onClick={() => handleFilterToggle('priority', priority)}
                      className={`px-2 py-1 text-xs font-semibold rounded-full transition-all whitespace-nowrap ${
                        selectedPriorities.includes(priority) && !selectedPriorities.includes('Todos')
                          ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-md'
                          : 'bg-white bg-opacity-70 hover:bg-opacity-100 text-gray-700'
                      }`}
                    >
                      {priority}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Status Filter Section */}
            <div className="border rounded-lg p-3 bg-green-50 border-green-200">
              <button
                onClick={() => setCollapsedSections(prev => ({...prev, status: !prev.status}))}
                className="w-full flex items-center justify-between mb-2"
              >
                <div className="flex items-center gap-1">
                  <span className="text-lg">✓</span>
                  <p className="font-bold uppercase text-xs">Estado</p>
                  {selectedStatus.length > 0 && selectedStatus[0] !== 'Todos' && (
                    <span className="ml-1 px-2 py-0.5 bg-white bg-opacity-50 text-xs font-bold rounded">
                      {selectedStatus.length}
                    </span>
                  )}
                </div>
                <ChevronDown size={14} className={`transition-transform flex-shrink-0 ${collapsedSections.status ? '' : 'rotate-180'}`} />
              </button>

              {!collapsedSections.status && (
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => handleFilterToggle('status', 'Todos')}
                    className={`px-2 py-1 text-xs font-semibold rounded-full transition-all whitespace-nowrap ${
                      selectedStatus.includes('Todos')
                        ? 'bg-green-500 hover:bg-green-600 text-white shadow-md'
                        : 'bg-white bg-opacity-70 hover:bg-opacity-100 text-gray-700'
                    }`}
                  >
                    Todos
                  </button>
                  {statusList.map(status => (
                    <button
                      key={status}
                      onClick={() => handleFilterToggle('status', status)}
                      className={`px-2 py-1 text-xs font-semibold rounded-full transition-all whitespace-nowrap ${
                        selectedStatus.includes(status) && !selectedStatus.includes('Todos')
                          ? 'bg-green-500 hover:bg-green-600 text-white shadow-md'
                          : 'bg-white bg-opacity-70 hover:bg-opacity-100 text-gray-700'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Primera fila - Métricas principales (reubicadas) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* 1. RIESGO CRÍTICO: Bugs Críticos Detectados */}
        <KPICard
          title="Bugs Críticos Detectados"
          value={criticalBugsTotal}
          icon={<Bug className="w-6 h-6 text-danger-600" />}
          trend={criticalBugsTrend}
          status={criticalBugsTotal <= 20 ? "success" : "danger"}
          subtitle={`${Math.round((criticalBugsTotal / totalBugs) * 100)}% del total de bugs`}
          formula={`Críticos = Más alta (${criticalBugsMasAlta}) + Alta (${criticalBugsAlta})`}
          tooltip={"Total de bugs críticos detectados con prioridad 'Más alta' y 'Alta'. Indica el volumen de incidencias graves que requieren atención inmediata."}
          breakdown={computeBreakdownByModule(bug => {
            const p = (bug.priority || '').toString();
            return p === 'Más alta' || p === 'Alta';
          })}
          onClick={() => setDetailModal({
            type: 'criticalBugs',
            title: 'Análisis de Bugs Críticos Detectados',
            data: {
              total: criticalBugsTotal,
              highest: criticalBugsMasAlta,
              high: criticalBugsAlta,
              totalBugs: totalBugs,
              allPriorities: filteredBugsByPriority,
              breakdown: computeBreakdownByModule(bug => {
                const p = (bug.priority || '').toString();
                return p === 'Más alta' || p === 'Alta';
              }),
              bugsList: computeFilteredBugs(bug => {
                const p = (bug.priority || '').toString();
                return p === 'Más alta' || p === 'Alta';
              })
            },
            sparklineData: getSparklineData('criticalBugs'),
            sprints: filteredSprintData
          })}
          detailData={{ total: criticalBugsTotal }}
        />

        {/* 2. SEGUIMIENTO CRÍTICO: Estado de Bugs Críticos */}
        <KPICard
          title="Estado Bugs Críticos"
          value={`${criticalBugsTotal}`}
          icon={<AlertTriangle className="w-6 h-6 text-warning-600" />}
          trend={criticalBugsTrend}
          status={criticalBugsTotal <= 20 ? "success" : "danger"}
          /* Mostrar total como valor principal y pendientes como secundario */
          valueLabel={'Total'}
          secondaryValue={criticalBugsPending}
          secondaryLabel={'Pendientes'}
          tooltip={"Estado de los bugs críticos: total, con pendientes destacados para atención. Haz clic para ver el desglose Pendientes/Resueltos por módulo."}
          breakdown={(function(){
            // Pending per module
            const pendingPredicate = (bug) => {
              const p = (bug.priority || '').toString();
              const fixed = bug.fixed_in_sprint && bug.fixed_in_sprint !== 'No encontrado' && bug.fixed_in_sprint !== '';
              const status = (bug.status || '').toString().toLowerCase();
              const isResolved = fixed || status.includes('resuelto') || status.includes('cerr') || status.includes('fixed') || status.includes('closed');
              return (p === 'Más alta' || p === 'Alta') && !isResolved;
            };
            // Resolved per module (critical resolved)
            const resolvedPredicate = (bug) => {
              const p = (bug.priority || '').toString();
              const fixed = bug.fixed_in_sprint && bug.fixed_in_sprint !== 'No encontrado' && bug.fixed_in_sprint !== '';
              const status = (bug.status || '').toString().toLowerCase();
              const isResolved = fixed || status.includes('resuelto') || status.includes('cerr') || status.includes('fixed') || status.includes('closed');
              return (p === 'Más alta' || p === 'Alta') && isResolved;
            };

            const pending = computeBreakdownByModule(pendingPredicate);
            const resolved = computeBreakdownByModule(resolvedPredicate);
            return {
              BOT: { pending: pending.BOT || 0, resolved: resolved.BOT || 0 },
              POS: { pending: pending.POS || 0, resolved: resolved.POS || 0 },
              Total: { pending: pending.Total || 0, resolved: resolved.Total || 0 }
            };
          })()}
          onClick={() => setDetailModal({
            type: 'criticalBugsStatus',
            title: 'Estado de Bugs Críticos',
            data: {
              total: criticalBugsTotal,
              pending: criticalBugsPending,
              resolved: criticalBugsTotal - criticalBugsPending,
              allPriorities: filteredBugsByPriority,
              masAlta: criticalBugsMasAlta,
              alta: criticalBugsAlta
            ,
              // Pasar breakdown completo (pendientes + resueltos) y la lista completa de bugs críticos
              breakdown: (function(){
                const all = computeBreakdownByModule(bug => {
                  const p = (bug.priority || '').toString();
                  return p === 'Más alta' || p === 'Alta';
                });
                return { BOT: all.BOT || 0, POS: all.POS || 0, Total: all.Total || 0 };
              })(),
              bugsList: computeFilteredBugs(bug => {
                const p = (bug.priority || '').toString();
                return p === 'Más alta' || p === 'Alta';
              })
            },
            sparklineData: getSparklineData('criticalBugsPending'),
            sprints: filteredSprintData
          })}
          detailData={{ pending: criticalBugsPending }}
        />

        {/* Eficiencia movida a la segunda fila para orden coherente (oculta) */}
        
        {/* 3. VELOCIDAD: Tiempo Promedio de Resolución (movida a la siguiente fila) */}
      </div>

      {/* Segunda fila - Métricas de seguimiento (reubicadas: Densidad + Tasa) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* VELOCIDAD: Tiempo Promedio de Resolución (bajada) */}
        <KPICard
          title="Tiempo Promedio de Resolución"
          value={`${cycleTimeData.avg} días`}
          icon={<Clock className="w-6 h-6 text-executive-600" />}
          trend={cycleTimeData.avg <= 7 ? 10 : -10}
          status={cycleTimeData.avg <= 7 ? "success" : cycleTimeData.avg <= 10 ? "warning" : "danger"}
          subtitle={`Críticos: ${cycleTimeData.byPriority.critical}d | Altos: ${cycleTimeData.byPriority.high}d`}
          formula={`Basado en eficiencia: ${resolutionEfficiency}%`}
          tooltip={"Tiempo de Ciclo: Tiempo promedio desde la detección hasta la resolución de bugs. Métrica clave para medir la velocidad de respuesta del equipo. Objetivo: ≤7 días para mantener agilidad."}
          breakdown={computeBreakdownByModule(() => true)}
          onClick={() => setDetailModal({
            type: 'cycleTime',
            title: 'Análisis Detallado de Tiempo de Resolución',
            data: { ...cycleTimeData, breakdown: computeBreakdownByModule(() => true), bugsList: computeFilteredBugs(() => true) },
            sparklineData: getSparklineData('cycleTime'),
            sprints: filteredSprintData
          })}
          detailData={cycleTimeData}
        />
        {/* EFICIENCIA: Eficiencia de Resolución (reubicada, oculta) */}
        {false && (
        <KPICard
          title="Eficiencia de Resolución"
          value={`${resolutionEfficiency}%`}
          icon={<CheckCircle className="w-6 h-6 text-success-600" />}
          trend={resolutionTrend}
          status={resolutionEfficiency >= 70 ? "success" : "warning"}
          subtitle={`${bugsClosed} resueltos de ${totalBugs} total (${totalBugs - bugsClosed} abiertos)`}
          formula={`Eficiencia = ${bugsClosed} / ${totalBugs} × 100`}
          tooltip={"La eficiencia de resolución mide el porcentaje de bugs solucionados respecto al total reportado. Es clave para evaluar la capacidad del equipo de cerrar incidencias y mantener la calidad del producto."}
          breakdown={computeBreakdownByModule(() => true)}
          onClick={() => setDetailModal({
            type: 'resolutionEfficiency',
            title: 'Análisis de Eficiencia de Resolución',
            data: {
              efficiency: resolutionEfficiency,
              total: totalBugs,
              resolved: bugsClosed,
              pending: totalBugs - bugsClosed,
              breakdown: computeBreakdownByModule(() => true)
            },
            sparklineData: getSparklineData('resolutionEfficiency'),
            sprints: filteredSprintData
          })}
          detailData={{ efficiency: resolutionEfficiency }}
        />
        )}
        {/* Densidad de Defectos */}
        <KPICard
          title="Densidad de Defectos por Sprint"
          value={defectDensityData.avg}
          icon={<Target className="w-6 h-6 text-orange-600" />}
          trend={defectDensityData.avg <= 20 ? 5 : -5}
          status={defectDensityData.avg <= 20 ? "success" : defectDensityData.avg <= 30 ? "warning" : "danger"}
          subtitle={`Máx: ${defectDensityData.max} | Mín: ${defectDensityData.min} bugs/sprint`}
          formula={`Promedio = ${defectDensityData.total} bugs / ${defectDensityData.sprints} sprints`}
          tooltip={"Densidad de Defectos por Sprint: Promedio de bugs detectados por sprint. Objetivo: ≤20 bugs/sprint indica buena calidad. >30 requiere revisión de procesos de desarrollo y testing."}
          breakdown={computeBreakdownByModule(() => true)}
          onClick={() => setDetailModal({
            type: 'defectDensity',
            title: 'Análisis de Densidad de Defectos por Sprint',
            data: { ...defectDensityData, breakdown: computeBreakdownByModule(() => true), bugsList: computeFilteredBugs(() => true) },
            sparklineData: getSparklineData('defectDensity'),
            sprints: filteredSprintData
          })}
          detailData={defectDensityData}
        />

        {/* Tasa de Fuga (ocultada) */}
        {false && kpis.bugLeakageRate !== undefined && (
          <KPICard
            title="Tasa de Fuga"
            value={`${kpis.bugLeakageRate}%`}
            icon={<TrendingUp className="w-6 h-6 text-red-600" />}
            trend={0}
            status={kpis.bugLeakageRate <= 5 ? "success" : "danger"}
            subtitle="Bugs en producción"
            tooltip={"La tasa de fuga mide el porcentaje de bugs que escaparon a producción. Un valor bajo indica buena calidad de pruebas pre-producción."}
          />
        )}

        <div />
      </div>

      {/* Comparación Sprint-over-Sprint */}
      <SprintComparison data={data} filteredSprintData={filteredSprintData} />

      {/* Segunda fila de métricas adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Ficha 7: Cobertura de Automatización (oculta) */}
        {false && (
        <KPICard
          title="Cobertura de Automatización"
          value={`${automationData.coverage}%`}
          icon={<Settings className="w-6 h-6 text-purple-600" />}
          trend={automationData.coverage >= 60 ? 10 : automationData.coverage >= 40 ? 5 : -5}
          status={automationData.coverage >= 60 ? "success" : automationData.coverage >= 40 ? "warning" : "danger"}
          subtitle={`${automationData.automated} automatizados | ${automationData.manual} manuales`}
          tooltip={"Cobertura de Automatización: Porcentaje de casos de prueba automatizados respecto al total. Objetivo: ≥60% para eficiencia y ≥80% para madurez óptima."}
          onClick={() => setDetailModal({
            type: 'automationCoverage',
            title: 'Análisis de Cobertura de Automatización',
            data: automationData,
            sparklineData: getSparklineData('automationCoverage'),
            sprints: filteredSprintData
          })}
          isEstimated={true}
        />
        )}
        
        {false && kpis.testExecutionRate && (
          <KPICard
            title="Tasa de Ejecución"
            value={`${kpis.testExecutionRate}%`}
            icon={<Activity className="w-6 h-6 text-purple-600" />}
            trend={0}
            status="info"
            subtitle="Pruebas ejecutadas"
            tooltip={"La tasa de ejecución muestra el porcentaje de casos de prueba ejecutados respecto al total planificado. Indica el nivel de cobertura alcanzado."}
          />
        )}
        
        {false && kpis.bugLeakageRate !== undefined && (
          <KPICard
            title="Tasa de Fuga"
            value={`${kpis.bugLeakageRate}%`}
            icon={<TrendingUp className="w-6 h-6 text-red-600" />}
            trend={0}
            status={kpis.bugLeakageRate <= 5 ? "success" : "danger"}
            subtitle="Bugs en producción"
            tooltip={"La tasa de fuga mide el porcentaje de bugs que escaparon a producción. Un valor bajo indica buena calidad de pruebas pre-producción."}
          />
        )}
      </div>

      {/* Gráficos principales filtrados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="executive-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Tendencia de Sprints Seleccionados
          </h3>
          <SprintTrendChart data={filteredSprintData || data.sprintData || data.trends?.bugsPerSprint} />
        </div>
        
        <div className="executive-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Matriz de Riesgo
          </h3>
          <RiskMatrix data={filteredBugsByPriority} />
        </div>
      </div>

      {/* Comparativa Sprint a Sprint */}
      {filteredSprintData && filteredSprintData.length >= 2 && (
        <SprintComparison 
          sprintData={filteredSprintData} 
          selectedSprints={selectedSprints}
        />
      )}

      {/* Resumen de módulos críticos */}
      {data.moduleData && (
        <div className="executive-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Análisis de Módulos
          </h3>
          <ModuleAnalysis data={data.moduleData} />
        </div>
      )}

      {/* Recomendaciones Accionables */}
      <ActionableRecommendations data={data} filteredSprintData={filteredSprintData} />

      {/* Modal de detalles */}
      <DetailModal 
        modal={detailModal} 
        onClose={() => setDetailModal(null)} 
        recommendations={recommendations || data?.recommendations || {}}
      />
    </div>
  );
}

// Mantén las otras funciones de tabs exactamente como las tienes...
function QualityTab({ data }) {
  return (
    <div className="space-y-8">
      <QualityMetrics data={data.qualityMetrics} />
      
      {/* Métricas adicionales de calidad */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="executive-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Densidad de Defectos</h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-executive-600 mb-2">
              {data.kpis?.defectDensity || '0.00'}
            </div>
            <p className="text-sm text-gray-600">bugs por caso de prueba</p>
          </div>
        </div>
        
        <div className="executive-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Automatización</h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-success-600 mb-2">
              {data.qualityMetrics?.testAutomation || 0}%
            </div>
            <p className="text-sm text-gray-600">cobertura automatizada</p>
          </div>
        </div>
        
        <div className="executive-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tiempo de Ciclo</h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-warning-600 mb-2">
              {data.qualityMetrics?.cycleTime || data.kpis?.averageResolutionTime || 0}
            </div>
            <p className="text-sm text-gray-600">días promedio</p>
          </div>
        </div>
      </div>
      
      {/* Áreas de riesgo */}
      <div className="executive-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Áreas de Riesgo</h3>
        <div className="space-y-4">
          {(data.riskAreas || []).map((area, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{area.area}</h4>
                <p className="text-sm text-gray-600">{area.bugs} bugs identificados</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  area.risk === 'Alto' ? 'bg-red-100 text-red-800' :
                  area.risk === 'Medio' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {area.risk}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  area.impact === 'Crítico' ? 'bg-red-100 text-red-800' :
                  area.impact === 'Alto' ? 'bg-orange-100 text-orange-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {area.impact}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TeamsTab({ data }) {
  return (
    <div className="space-y-8">
      <DeveloperAnalysis data={data.developerData} />
      
      {/* Análisis de productividad */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="executive-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Distribución de Carga de Trabajo
          </h3>
          <div className="space-y-3">
            {(data.developerData || []).map((dev, index) => (
              <div key={index} className="flex items-center">
                <span className="w-32 text-sm font-medium text-gray-600 truncate">
                  {dev.name}
                </span>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-3 relative">
                    <div
                      className={`h-3 rounded-full ${
                        dev.workload === 'Alto' || dev.pending > 15 ? 'bg-red-500' :
                        dev.workload === 'Medio' || dev.pending > 10 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min((dev.pending / 20) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-16">
                  {dev.pending || 0} bugs
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="executive-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Eficiencia por Desarrollador
          </h3>
          <div className="space-y-3">
            {(data.developerData || []).map((dev, index) => {
              const totalBugs = dev.totalBugs || (dev.resolved + dev.pending) || dev.assigned || 0;
              const resolved = dev.resolved || 0;
              const efficiency = totalBugs > 0 ? Math.round((resolved / totalBugs) * 100) : 0;
              
              return (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {dev.name}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-executive-500 h-2 rounded-full"
                        style={{ width: `${efficiency}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-600 w-10">
                      {efficiency}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}



function RecommendationsTab({ data }) {
  // Usar tanto recomendaciones existentes como nuevas
  const recommendations = data.recommendations || [];
  
  return (
    <div className="space-y-8">
      {/* Recomendaciones (moviéndose al final del tab para mantener orden lógico) */}

      {/* Quality Radar Chart integrado para aportar contexto de madurez y atributos */}
      <div className="executive-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Roadmap de Madurez y Atributos</h3>
        <QualityRadarChart data={data.qualityMetrics || data.processMaturity || {}} />
      </div>
      
      {/* ROI y Métricas de Valor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="executive-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            ROI del Proceso QA
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">
                Bugs Detectados Temprano
              </span>
              <span className="text-lg font-bold text-green-600">
                ${data.roi?.earlyDetection || '276,000'}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">
                Mejora en Velocidad
              </span>
              <span className="text-lg font-bold text-blue-600">
                +{data.roi?.velocityImprovement || '15'}%
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">
                Reducción Hotfixes
              </span>
              <span className="text-lg font-bold text-purple-600">
                -{data.roi?.hotfixReduction || '80'}%
              </span>
            </div>
            {/* Nuevas métricas de ROI si están disponibles */}
            {data.kpis?.averageResolutionTime && (
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  Tiempo Promedio Resolución
                </span>
                <span className="text-lg font-bold text-orange-600">
                  {data.kpis.averageResolutionTime} días
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="executive-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Madurez del Proceso
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                <span>Nivel Actual</span>
                <span>{data.processMaturity?.current || '3/5'} ({data.processMaturity?.currentLevel || 'Definido'})</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-executive-500 h-2 rounded-full" 
                  style={{ width: `${(data.processMaturity?.currentScore || 3) * 20}%` }}
                ></div>
              </div>
            </div>
            
            <div className="text-sm text-gray-600 space-y-2">
              <p>• <strong>Objetivo Q1 2025:</strong> {data.processMaturity?.q1Target || '4/5 (Gestionado Cuantitativamente)'}</p>
              <p>• <strong>Meta Anual:</strong> {data.processMaturity?.yearTarget || '5/5 (Optimizado)'}</p>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">Próximos Hitos</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {data.processMaturity?.milestones ? (
                  data.processMaturity.milestones.map((milestone, index) => (
                    <li key={index}>• {milestone}</li>
                  ))
                ) : (
                  <>
                    <li>• Automatización 60% (actual: {data.qualityMetrics?.testAutomation || 25}%)</li>
                    <li>• Reducir tiempo ciclo a 1.5 días</li>
                    <li>• Implementar métricas predictivas</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Análisis predictivo si está disponible */}
      {data.predictions && (
        <div className="executive-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Análisis Predictivo
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.predictions.map((prediction, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`text-2xl font-bold mb-2 ${
                  prediction.trend === 'up' ? 'text-green-600' :
                  prediction.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {prediction.value}
                </div>
                <div className="text-sm font-medium text-gray-900 mb-1">
                  {prediction.metric}
                </div>
                <div className="text-xs text-gray-600">
                  Próximos 30 días
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recomendaciones mejoradas (movidas después del análisis predictivo) */}
      {recommendations.length > 0 ? (
        <div className="executive-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recomendaciones Inteligentes
          </h3>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={rec.id || index} className="border-l-4 border-blue-500 pl-4 py-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{rec.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        rec.impact === 'high' ? 'bg-red-100 text-red-800' : 
                        rec.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'
                      }`}>
                        Impacto: {rec.impact}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        rec.effort === 'high' ? 'bg-red-100 text-red-800' :
                        rec.effort === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        Esfuerzo: {rec.effort}
                      </span>
                      {rec.type && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                          {rec.type}
                        </span>
                      )}
                    </div>
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium ml-4">
                    Implementar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Usar el componente existente si no hay recomendaciones nuevas
        <ExecutiveRecommendations data={data.recommendations} />
      )}
    </div>
  );
}