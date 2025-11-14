// components/ExecutiveDashboard.js
import { useState, useEffect } from 'react';
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
  Settings
} from 'lucide-react';

import KPICard from './KPICard';
import SprintTrendChart from './SprintTrendChart';
import RiskMatrix from './RiskMatrix';
import DeveloperAnalysis from './DeveloperAnalysis';
import ModuleAnalysis from './ModuleAnalysis';
import ExecutiveRecommendations from './ExecutiveRecommendations';
import QualityMetrics from './QualityMetrics';
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
  enableParametricMode = false,
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

  // Determinar qué datos usar
  const isParametricMode = enableParametricMode && !externalData;
  const currentData = isParametricMode ? parametricData : externalData;
  const currentLoading = isParametricMode ? parametricLoading : externalLoading;
  const currentLastUpdated = isParametricMode ? parametricLastUpdated : externalLastUpdated;

  // Cargar configuración para modo paramétrico
  useEffect(() => {
    if (isParametricMode) {
      loadConfiguration();
    }
  }, [isParametricMode, configSource]);

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
    } catch (error) {
      console.warn('Using default configuration:', error);
      setConfig({
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
    { id: 'trends', label: 'Tendencias', icon: <Activity className="w-4 h-4" /> },
    { id: 'recommendations', label: 'Recomendaciones', icon: <CheckCircle className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-executive">
      {/* Header mejorado */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  Dashboard Ejecutivo QA
                </h1>
                {isParametricMode && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    Modo Paramétrico
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                Control de Calidad y Trazabilidad del Proceso de Pruebas
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Indicador de error */}
              {error && (
                <div className="flex items-center text-red-600">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  <span className="text-xs">Error de conexión</span>
                </div>
              )}
              
              <div className="text-right">
                <p className="text-sm text-gray-500">Última actualización</p>
                <p className="text-sm font-medium text-gray-900">
                  {currentLastUpdated ? format(currentLastUpdated, 'dd/MM/yyyy HH:mm', { locale: es }) : 'Nunca'}
                </p>
              </div>
              
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-3 py-1 text-xs rounded-full border ${
                  autoRefresh 
                    ? 'bg-green-50 text-green-700 border-green-200' 
                    : 'bg-gray-50 text-gray-700 border-gray-200'
                }`}
              >
                Auto: {autoRefresh ? 'ON' : 'OFF'}
              </button>
              
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navegación por tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-executive-500 text-executive-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon}
                  <span className="ml-2">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Contenido por tabs */}
        <div className="animate-fade-in">
          {activeTab === 'overview' && <OverviewTab data={currentData} />}
          {activeTab === 'quality' && <QualityTab data={currentData} />}
          {activeTab === 'teams' && <TeamsTab data={currentData} />}
          {activeTab === 'trends' && <TrendsTab data={currentData} />}
          {activeTab === 'recommendations' && <RecommendationsTab data={currentData} />}
        </div>
      </div>
    </div>
  );
}

// ===============================
// COMPONENTES DE TABS (mantén los existentes)
// ===============================

function OverviewTab({ data }) {
  const { kpis, summary } = data;
  
  return (
    <div className="space-y-8">
      {/* KPIs Principales con datos mejorados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Cobertura de Pruebas"
          value={`${kpis.testCoverage || 0}%`}
          icon={<Target className="w-8 h-8 text-executive-600" />}
          trend={kpis.testCoverageTrend || 0}
          status={kpis.testCoverage >= 80 ? "success" : "warning"}
          subtitle={`${summary.testCasesExecuted || 0} de ${summary.testCasesTotal || 0} casos`}
        />
        
        <KPICard
          title="Eficiencia de Resolución"
          value={`${kpis.resolutionEfficiency || 0}%`}
          icon={<CheckCircle className="w-8 h-8 text-success-600" />}
          trend={kpis.resolutionTrend || 0}
          status={kpis.resolutionEfficiency >= 70 ? "success" : "warning"}
          subtitle={`${summary.bugsClosed || 0} bugs resueltos`}
        />
        
        <KPICard
          title="Índice de Calidad"
          value={`${kpis.qualityIndex || 0}%`}
          icon={<BarChart3 className="w-8 h-8 text-warning-600" />}
          trend={kpis.sprintTrend || 0}
          status={kpis.qualityIndex >= 75 ? "success" : "warning"}
          subtitle="Tendencia general"
        />
        
        <KPICard
          title="Bugs Críticos"
          value={`${kpis.criticalBugsRatio || 0}%`}
          icon={<Bug className="w-8 h-8 text-danger-600" />}
          trend={kpis.criticalBugsTrend || 0}
          status={kpis.criticalBugsRatio <= 20 ? "success" : "danger"}
          subtitle="Requieren atención"
        />
      </div>

      {/* Nuevas métricas si están disponibles */}
      {kpis.averageResolutionTime && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KPICard
            title="Tiempo Promedio de Resolución"
            value={`${kpis.averageResolutionTime} días`}
            icon={<Clock className="w-8 h-8 text-blue-600" />}
            trend={0}
            status="info"
            subtitle="Tiempo promedio"
          />
          
          {kpis.testExecutionRate && (
            <KPICard
              title="Tasa de Ejecución"
              value={`${kpis.testExecutionRate}%`}
              icon={<Activity className="w-8 h-8 text-purple-600" />}
              trend={0}
              status="info"
              subtitle="Pruebas ejecutadas"
            />
          )}
          
          {kpis.bugLeakageRate !== undefined && (
            <KPICard
              title="Tasa de Fuga"
              value={`${kpis.bugLeakageRate}%`}
              icon={<TrendingUp className="w-8 h-8 text-orange-600" />}
              trend={0}
              status={kpis.bugLeakageRate <= 5 ? "success" : "warning"}
              subtitle="Bugs en producción"
            />
          )}
        </div>
      )}

      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SprintTrendChart data={data.sprintData || data.trends?.bugsPerSprint} />
        <RiskMatrix data={data.bugsByPriority} />
      </div>

      {/* Análisis por módulos */}
      <ModuleAnalysis data={data.bugsByModule} />
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

function TrendsTab({ data }) {
  const sprintData = data.sprintData || data.trends?.bugsPerSprint || [];
  
  return (
    <div className="space-y-8">
      {/* Tendencias de Sprint */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="executive-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Evolución de Bugs por Sprint
          </h3>
          <div className="space-y-4">
            {sprintData.map((sprint, index) => (
              <div key={sprint.sprint || index} className="flex items-center">
                <span className="w-16 text-sm font-medium text-gray-600">
                  S{sprint.sprint || index + 1}:
                </span>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-4 relative">
                    <div
                      className={`h-4 rounded-full ${
                        sprint.bugs > 30 ? 'bg-red-500' :
                        sprint.bugs > 20 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min((sprint.bugs / 50) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <span className="w-16 text-sm font-medium text-gray-900">
                  {sprint.bugs} bugs
                </span>
                {sprint.change !== 0 && (
                  <span className={`w-16 text-xs ml-2 ${
                    sprint.change > 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {sprint.change > 0 ? '+' : ''}{sprint.change}%
                  </span>
                )}
              </div>
            ))}
          </div>
          
          {sprintData.length > 1 && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <TrendingDown className="w-5 h-5 text-green-600 mr-2" />
                <p className="text-sm text-green-800 font-medium">
                  Tendencia: {data.kpis?.sprintTrend > 0 ? 'ASCENDENTE' : 'DESCENDENTE'} 
                  ({data.kpis?.sprintTrend || 0}%)
                </p>
              </div>
            </div>
          )}
        </div>
        
        <div className="executive-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Tasa de Resolución por Sprint
          </h3>
          <div className="space-y-4">
            {sprintData.map((sprint, index) => {
              const total = (sprint.bugsResolved || 0) + (sprint.bugsPending || 0);
              const resolved = sprint.bugsResolved || 0;
              const rate = total > 0 ? Math.round((resolved / total) * 100) : 0;
              
              return (
                <div key={sprint.sprint || index} className="flex items-center">
                  <span className="w-16 text-sm font-medium text-gray-600">
                    S{sprint.sprint || index + 1}:
                  </span>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-executive-500 h-4 rounded-full"
                        style={{ width: `${rate}%` }}
                      />
                    </div>
                  </div>
                  <span className="w-16 text-sm font-medium text-gray-900">
                    {rate}%
                  </span>
                  <span className="w-20 text-xs text-gray-500 ml-2">
                    {resolved}/{total}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Análisis de categorías */}
      {data.bugsByCategory && (
        <div className="executive-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Distribución por Categorías
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(data.bugsByCategory).map(([category, categoryData]) => (
              <div key={category} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-executive-600 mb-1">
                  {categoryData.count || 0}
                </div>
                <div className="text-xs text-gray-600 mb-1">{category}</div>
                <div className="text-xs font-medium text-gray-900">
                  {categoryData.percentage || 0}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function RecommendationsTab({ data }) {
  // Usar tanto recomendaciones existentes como nuevas
  const recommendations = data.recommendations || [];
  
  return (
    <div className="space-y-8">
      {/* Recomendaciones mejoradas */}
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
    </div>
  );
}