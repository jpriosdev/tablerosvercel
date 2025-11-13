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
  Clock
} from 'lucide-react';

import KPICard from './KPICard';
import SprintTrendChart from './SprintTrendChart';
import RiskMatrix from './RiskMatrix';
import DeveloperAnalysis from './DeveloperAnalysis';
import ModuleAnalysis from './ModuleAnalysis';
import ExecutiveRecommendations from './ExecutiveRecommendations';
import QualityMetrics from './QualityMetrics';

export default function ExecutiveDashboard({ data, lastUpdated, onRefresh, loading }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      onRefresh();
    }, 300000); // 5 minutos
    
    return () => clearInterval(interval);
  }, [autoRefresh, onRefresh]);

  if (!data) return null;

  const { kpis, summary, alerts } = data;

  const tabs = [
    { id: 'overview', label: 'Resumen Ejecutivo', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'quality', label: 'Métricas de Calidad', icon: <Target className="w-4 h-4" /> },
    { id: 'teams', label: 'Análisis de Equipos', icon: <Users className="w-4 h-4" /> },
    { id: 'trends', label: 'Tendencias', icon: <Activity className="w-4 h-4" /> },
    { id: 'recommendations', label: 'Recomendaciones', icon: <CheckCircle className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-executive">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard Ejecutivo QA
              </h1>
              <p className="text-sm text-gray-500">
                Control de Calidad y Trazabilidad del Proceso de Pruebas
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Última actualización</p>
                <p className="text-sm font-medium text-gray-900">
                  {format(lastUpdated, 'dd/MM/yyyy HH:mm', { locale: es })}
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
                onClick={onRefresh}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-executive-600 text-white rounded-lg hover:bg-executive-700 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Alertas Críticas */}
      {alerts && alerts.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex">
              <AlertTriangle className="w-5 h-5 text-red-400 mr-3 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-red-800 mb-2">
                  Alertas Críticas ({alerts.filter(a => a.type === 'critical').length})
                </h3>
                <div className="space-y-1">
                  {alerts.slice(0, 2).map((alert, index) => (
                    <p key={index} className="text-sm text-red-700">
                      • {alert.message}
                    </p>
                  ))}
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
          {activeTab === 'overview' && <OverviewTab data={data} />}
          {activeTab === 'quality' && <QualityTab data={data} />}
          {activeTab === 'teams' && <TeamsTab data={data} />}
          {activeTab === 'trends' && <TrendsTab data={data} />}
          {activeTab === 'recommendations' && <RecommendationsTab data={data} />}
        </div>
      </div>
    </div>
  );
}

// ===============================
// COMPONENTES DE TABS
// ===============================

function OverviewTab({ data }) {
  const { kpis, summary } = data;
  
  return (
    <div className="space-y-8">
      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Cobertura de Pruebas"
          value={`${kpis.testCoverage}%`}
          icon={<Target className="w-8 h-8 text-executive-600" />}
          trend={+5}
          status="success"
          subtitle={`${summary.testCasesExecuted} de ${summary.testCasesTotal} casos`}
        />
        
        <KPICard
          title="Eficiencia de Resolución"
          value={`${kpis.resolutionEfficiency}%`}
          icon={<CheckCircle className="w-8 h-8 text-success-600" />}
          trend={+8}
          status="success"
          subtitle={`${summary.bugsClosed} bugs resueltos`}
        />
        
        <KPICard
          title="Índice de Calidad"
          value={`${kpis.qualityIndex}%`}
          icon={<BarChart3 className="w-8 h-8 text-warning-600" />}
          trend={kpis.sprintTrend}
          status="warning"
          subtitle="Tendencia general"
        />
        
        <KPICard
          title="Bugs Críticos"
          value={`${kpis.criticalBugsRatio}%`}
          icon={<Bug className="w-8 h-8 text-danger-600" />}
          trend={-12}
          status="danger"
          subtitle="Requieren atención"
        />
      </div>

      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SprintTrendChart data={data.sprintData} />
        <RiskMatrix data={data.bugsByPriority} />
      </div>

      {/* Análisis por módulos */}
      <ModuleAnalysis data={data.bugsByModule} />
    </div>
  );
}

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
              {data.kpis.defectDensity}
            </div>
            <p className="text-sm text-gray-600">bugs por caso de prueba</p>
          </div>
        </div>
        
        <div className="executive-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Automatización</h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-success-600 mb-2">
              {data.qualityMetrics.testAutomation}%
            </div>
            <p className="text-sm text-gray-600">cobertura automatizada</p>
          </div>
        </div>
        
        <div className="executive-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tiempo de Ciclo</h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-warning-600 mb-2">
              {data.qualityMetrics.cycleTime}
            </div>
            <p className="text-sm text-gray-600">días promedio</p>
          </div>
        </div>
      </div>
      
      {/* Áreas de riesgo */}
      <div className="executive-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Áreas de Riesgo</h3>
        <div className="space-y-4">
          {data.riskAreas.map((area, index) => (
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
            {data.developerData.map((dev, index) => (
              <div key={index} className="flex items-center">
                <span className="w-32 text-sm font-medium text-gray-600 truncate">
                  {dev.name}
                </span>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-3 relative">
                    <div
                      className={`h-3 rounded-full ${
                        dev.workload === 'Alto' ? 'bg-red-500' :
                        dev.workload === 'Medio' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${(dev.pending / 20) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-16">
                  {dev.pending} bugs
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
            {data.developerData.map((dev, index) => {
              const efficiency = dev.totalBugs > 0 ? Math.round((dev.resolved / dev.totalBugs) * 100) : 0;
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
  return (
    <div className="space-y-8">
      {/* Tendencias de Sprint */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="executive-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Evolución de Bugs por Sprint
          </h3>
          <div className="space-y-4">
            {data.sprintData.map((sprint, index) => (
              <div key={sprint.sprint} className="flex items-center">
                <span className="w-16 text-sm font-medium text-gray-600">
                  S{sprint.sprint}:
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
          
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <TrendingDown className="w-5 h-5 text-green-600 mr-2" />
              <p className="text-sm text-green-800 font-medium">
                Tendencia: DESCENDENTE (-89% desde Sprint 16)
              </p>
            </div>
          </div>
        </div>
        
        <div className="executive-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Tasa de Resolución por Sprint
          </h3>
          <div className="space-y-4">
            {data.sprintData.map((sprint) => {
              const total = sprint.bugsResolved + sprint.bugsPending;
              const rate = total > 0 ? Math.round((sprint.bugsResolved / total) * 100) : 0;
              
              return (
                <div key={sprint.sprint} className="flex items-center">
                  <span className="w-16 text-sm font-medium text-gray-600">
                    S{sprint.sprint}:
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
                    {sprint.bugsResolved}/{total}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Análisis de categorías */}
      <div className="executive-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Distribución por Categorías
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(data.bugsByCategory).map(([category, data]) => (
            <div key={category} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-executive-600 mb-1">
                {data.count}
              </div>
              <div className="text-xs text-gray-600 mb-1">{category}</div>
              <div className="text-xs font-medium text-gray-900">
                {data.percentage}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RecommendationsTab({ data }) {
  return (
    <div className="space-y-8">
      <ExecutiveRecommendations data={data.recommendations} />
      
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
                $276,000
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">
                Mejora en Velocidad
              </span>
              <span className="text-lg font-bold text-blue-600">
                +15%
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">
                Reducción Hotfixes
              </span>
              <span className="text-lg font-bold text-purple-600">
                -80%
              </span>
            </div>
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
                <span>3/5 (Definido)</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div className="bg-executive-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
            
            <div className="text-sm text-gray-600 space-y-2">
              <p>• <strong>Objetivo Q1 2025:</strong> 4/5 (Gestionado Cuantitativamente)</p>
              <p>• <strong>Meta Anual:</strong> 5/5 (Optimizado)</p>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">Próximos Hitos</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Automatización 60% (actual: 25%)</li>
                <li>• Reducir tiempo ciclo a 1.5 días</li>
                <li>• Implementar métricas predictivas</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
