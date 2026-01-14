import React, { useEffect, useState } from 'react';
import { 
    Target, 
    Clock, 
    TrendingUp, 
    Shield, 
    Zap, 
    CheckCircle,
    AlertTriangle,
    BarChart3
  } from 'lucide-react';
  import OverviewWire from './quality-wires/OverviewWire';
  import ReadinessWire from './quality-wires/ReadinessWire';
  import HotspotsWire from './quality-wires/HotspotsWire';
  import QualityKpiModal from './QualityKpiModal';
  
  export default function QualityMetrics({ data }) {
    // Aceptar ausencia de datos: usar wireframes y placeholders si es necesario
    const [sourceData, setSourceData] = useState(data || {});
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMetric, setModalMetric] = useState(null);

    useEffect(() => {
      // Si no se pasó data completa, intentar cargar el JSON local
      if (!data || Object.keys(data).length === 0) {
        fetch('/data/qa-data.json')
          .then(res => res.json())
          .then(json => setSourceData(json))
          .catch(() => setSourceData(data || {}));
      } else {
        setSourceData(data);
      }
    }, [data]);

    // Derivar métricas a partir de sourceData
    const summary = sourceData.summary || {};
    const totalBugs = summary.totalBugs || (Array.isArray(sourceData.bugs) ? sourceData.bugs.length : 0);
    const testExecuted = summary.testCasesExecuted || summary.testCasesTotal || 0;
    const testPassed = summary.testCasesPassed || 0;
    const bugsPending = summary.bugsPending || 0;

    const computed = {
      // Defect density: prefer value precomputed in kpis (now avg bugs per sprint),
      // otherwise derive as average bugs per sprint from sprintData
      defectDensity: sourceData.kpis?.defectDensity !== undefined
        ? Number(sourceData.kpis.defectDensity)
        : (sourceData.sprintData && sourceData.sprintData.length > 0
          ? +(sourceData.sprintData.reduce((sum, s) => sum + (s.bugs || s.bugsFound || 0), 0) / sourceData.sprintData.length).toFixed(1)
          : (totalBugs || 0)),
      testEfficiency: testExecuted ? Math.round((testPassed / testExecuted) * 100) : 0,
      bugLeakage: totalBugs ? Math.round((bugsPending / totalBugs) * 100) : 0,
      testAutomation: sourceData.kpis?.testAutomation || sourceData.testAutomation || 0,
      codeCoverage: sourceData.kpis?.codeCoverage || sourceData.codeCoverage || 0,
      cycleTime: sourceData.kpis?.averageResolutionTime || sourceData.cycleTime || 0
    };

    const metrics = [
      {
        key: 'defectDensity',
        title: 'Densidad de Defectos',
        value: computed.defectDensity,
        unit: 'bugs/sprint',
        icon: <Target className="w-6 h-6" />,
        // Target and thresholds chosen as reasonable defaults for bugs/sprint
        target: 20,
        status: (computed.defectDensity || 0) <= 20 ? 'success' : (computed.defectDensity || 0) <= 30 ? 'warning' : 'danger',
        description: 'Promedio de bugs detectados por sprint'
      },
      {
        key: 'testEfficiency',
        title: 'Eficiencia de Pruebas',
        value: computed.testEfficiency,
        development: true,
        unit: '%',
        icon: <CheckCircle className="w-6 h-6" />,
        target: 85,
        status: computed.testEfficiency >= 85 ? 'success' : computed.testEfficiency >= 70 ? 'warning' : 'danger',
        description: 'Porcentaje de casos de prueba que detectan defectos'
      },
      {
        key: 'bugLeakage',
        title: 'Fuga de Bugs',
        value: computed.bugLeakage,
        unit: '%',
        icon: <Shield className="w-6 h-6" />,
        target: 5,
        status: computed.bugLeakage <= 5 ? 'success' : computed.bugLeakage <= 10 ? 'warning' : 'danger',
        description: 'Porcentaje de bugs que escapan a producción'
      },
      {
        key: 'testAutomation',
        title: 'Automatización',
        value: computed.testAutomation,
        unit: '%',
        icon: <Zap className="w-6 h-6" />,
        target: 60,
        status: computed.testAutomation >= 60 ? 'success' : computed.testAutomation >= 40 ? 'warning' : 'danger',
        development: true,
        description: 'Porcentaje de pruebas automatizadas'
      },
      {
        key: 'codeCoverage',
        title: 'Cobertura de Código',
        value: computed.codeCoverage,
        unit: '%',
        icon: <BarChart3 className="w-6 h-6" />,
        target: 80,
        status: computed.codeCoverage >= 80 ? 'success' : computed.codeCoverage >= 65 ? 'warning' : 'danger',
        development: true,
        description: 'Porcentaje de código cubierto por pruebas'
      },
      {
        key: 'cycleTime',
        title: 'Tiempo de Ciclo',
        value: computed.cycleTime,
        unit: 'días',
        icon: <Clock className="w-6 h-6" />,
        target: 2,
        status: computed.cycleTime <= 2 ? 'success' : computed.cycleTime <= 3 ? 'warning' : 'danger',
        description: 'Tiempo promedio desde detección hasta resolución'
      }
    ];
  
    const getStatusColor = (status) => {
      switch (status) {
        case 'success':
          return {
            bg: 'bg-success-50',
            border: 'border-success-200',
            text: 'text-success-600',
            icon: 'text-success-600'
          };
        case 'warning':
          return {
            bg: 'bg-warning-50',
            border: 'border-warning-200',
            text: 'text-warning-600',
            icon: 'text-warning-600'
          };
        case 'danger':
          return {
            bg: 'bg-danger-50',
            border: 'border-danger-200',
            text: 'text-danger-600',
            icon: 'text-danger-600'
          };
        default:
          return {
            bg: 'bg-gray-50',
            border: 'border-gray-200',
            text: 'text-gray-600',
            icon: 'text-gray-600'
          };
      }
    };
  
    const getProgressPercentage = (value, target, isReverse = false) => {
      // Evitar division por cero y manejar valores ausentes
      if (value === null || value === undefined) return 0;
      if (isReverse) {
        // Para métricas donde menor es mejor (como defectDensity, bugLeakage, cycleTime)
        if (value === 0) return 100; // ideal
        return Math.max(0, Math.min(100, ((target / value) * 100)));
      } else {
        // Para métricas donde mayor es mejor
        if (target === 0) return 0;
        return Math.max(0, Math.min(100, (value / target) * 100));
      }
    };
  
    const isReverseMetric = (key) => {
      return ['defectDensity', 'bugLeakage', 'cycleTime'].includes(key);
    };
  
    return (
      <div className="space-y-8">
        {/* Encabezado: logo 'men at work' + mensaje */}
        <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200">
          <div className="w-16 h-16 flex-shrink-0 rounded-lg bg-yellow-50/80 flex items-center justify-center">
            <svg width="52" height="52" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <rect x="0" y="0" width="24" height="24" rx="5" fill="#FEF3C7" />
              <polygon points="12,4 20,20 4,20" fill="#F59E0B" />
              <rect x="11" y="9" width="2" height="6" rx="1" fill="#111827" />
              <circle cx="12" cy="17" r="1" fill="#111827" />
            </svg>
          </div>

          <div className="flex-1 text-center px-4">
            <div className="text-2xl font-bold text-blue-600">En desarrollo: datos no consistentes</div>
          </div>

          <div className="w-16 h-16 flex-shrink-0 rounded-lg bg-yellow-50/70 flex items-center justify-center">
            <svg width="52" height="52" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <rect x="0" y="0" width="24" height="24" rx="5" fill="#FEF3C7" />
              <polygon points="12,4 20,20 4,20" fill="#F59E0B" />
              <rect x="11" y="9" width="2" height="6" rx="1" fill="#111827" />
              <circle cx="12" cy="17" r="1" fill="#111827" />
            </svg>
          </div>
        </div>
        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((metric) => {
            let colors = getStatusColor(metric.status);
            const progressPercentage = getProgressPercentage(
              metric.value, 
              metric.target, 
              isReverseMetric(metric.key)
            );
  
            const isDev = metric.development === true;
            if (isDev) {
              colors = {
                bg: 'bg-blue-50',
                border: 'border-blue-200',
                text: 'text-blue-600',
                icon: 'text-blue-600'
              };
            }
            const displayValue = metric.value !== null && metric.value !== undefined && metric.value !== '' ? metric.value : '—';
            const badgeClass = isDev ? 'bg-blue-100 text-blue-800' : (
              metric.status === 'success' ? 'bg-success-100 text-success-800' :
              metric.status === 'warning' ? 'bg-warning-100 text-warning-800' : 'bg-danger-100 text-danger-800'
            );

            const badgeIcon = isDev ? (
              <span className="w-3 h-3 mr-1 bg-blue-600 rounded-full" />
            ) : (
              metric.status === 'success' ? (
                <CheckCircle className="w-3 h-3 mr-1" />
              ) : (
                <AlertTriangle className="w-3 h-3 mr-1" />
              )
            );

            const badgeText = isDev ? 'En desarrollo' : (
              metric.status === 'success' ? 'En Meta' : metric.status === 'warning' ? 'Atención' : 'Crítico'
            );

            return (
              <div key={metric.key} className={`executive-card border-2 ${colors.border} ${colors.bg}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-white ${colors.icon}`}>
                    {metric.icon}
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${colors.text}`}>
                      {displayValue}{typeof displayValue === 'number' ? metric.unit : ''}
                    </div>
                    <div className="text-xs text-gray-500">
                      Meta: {metric.target}{metric.unit}
                    </div>
                  </div>
                </div>
                
                <h4 className="font-semibold text-gray-900 mb-2">{metric.title}</h4>
                <p className="text-sm text-gray-600 mb-4">{metric.description}</p>
                
                {/* Barra de progreso hacia el objetivo */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progreso hacia meta</span>
                    <span>{Math.round(progressPercentage)}%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                        metric.status === 'success' ? 'bg-success-500' :
                        metric.status === 'warning' ? 'bg-warning-500' : 'bg-danger-500'
                      }`}
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
                
                {/* Indicador de estado */}
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${badgeClass}`}>
                    {badgeIcon}
                    {badgeText}
                  </span>
                  
                  <TrendingUp className={`w-4 h-4 ${isDev ? 'text-blue-500' : (
                    metric.status === 'success' ? 'text-success-500' :
                    metric.status === 'warning' ? 'text-warning-500' : 'text-danger-500'
                  )}`} />
                </div>
                <div className="mt-3 flex justify-end">
                  <button
                    className="text-sm text-blue-600 hover:text-blue-800"
                    onClick={() => { setModalMetric(metric.key); setModalOpen(true); }}
                  >
                    Ver detalles
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <QualityKpiModal
          metricKey={modalMetric}
          title={modalMetric ? `Detalle - ${modalMetric}` : 'Detalle KPI'}
          sourceData={sourceData}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
  
        {/* Resumen de calidad general */}
        <div className="executive-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Índice de Calidad General
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Estado Actual</h4>
              <div className="space-y-3">
                {metrics.map((metric) => (
                  <div key={metric.key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{metric.title}</span>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        metric.development ? 'bg-blue-500' : (
                        metric.status === 'success' ? 'bg-success-500' :
                        metric.status === 'warning' ? 'bg-warning-500' : 'bg-danger-500')
                      }`} />
                      <span className="text-sm font-medium text-gray-900">
                        {metric.value !== null && metric.value !== undefined ? `${metric.value}${metric.unit}` : '—'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Objetivos 2025</h4>
              <div className="space-y-3">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h5 className="font-medium text-blue-800 mb-2">Q1 2025</h5>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Automatización: 45% → 60%</li>
                    <li>• Tiempo de ciclo: 2.3 → 2.0 días</li>
                    <li>• Cobertura código: 68% → 75%</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h5 className="font-medium text-green-800 mb-2">Meta Anual</h5>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Automatización: 80%</li>
                    <li>• Fuga de bugs: &lt; 3%</li>
                    <li>• Eficiencia pruebas: &gt; 90%</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Wireframes para MVP de Métricas de Calidad */}
        <div className="space-y-6">
          <OverviewWire sampleData={data} />
          <ReadinessWire sampleData={data} />
          <HotspotsWire sampleData={data} />
        </div>
      </div>
    );
  }
  