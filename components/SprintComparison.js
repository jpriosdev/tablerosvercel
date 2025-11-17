// components/SprintComparison.js
import React from 'react';
import { TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react';

export default function SprintComparison({ sprintData, selectedSprints }) {
  if (!sprintData || sprintData.length < 2) {
    return null; // No mostrar nada si no hay suficientes datos
  }

  // Usar los últimos 2 sprints si hay más de 2 seleccionados
  const sprints = sprintData.slice(-2);
  const [sprintA, sprintB] = sprints;

  const calculateMetric = (sprint, metric) => {
    switch (metric) {
      case 'bugs':
        return sprint.bugs || sprint.bugsFound || 0;
      case 'bugsResolved':
        return sprint.bugsResolved || sprint.bugsClosed || 0;
      case 'testCases':
        return sprint.testCases || sprint.testCasesExecuted || 0;
      case 'resolutionRate':
        const total = sprint.bugs || sprint.bugsFound || 0;
        const resolved = sprint.bugsResolved || sprint.bugsClosed || 0;
        return total > 0 ? Math.round((resolved / total) * 100) : 0;
      case 'criticalBugs':
        const priorities = sprint.bugsByPriority || {};
        return (priorities['Más alta'] || 0) + (priorities['Alta'] || 0);
      default:
        return 0;
    }
  };

  const metrics = [
    { key: 'bugs', label: 'Total Bugs', format: val => val, inverse: true },
    { key: 'bugsResolved', label: 'Bugs Resueltos', format: val => val, inverse: false },
    { key: 'testCases', label: 'Casos Ejecutados', format: val => val, inverse: false },
    { key: 'resolutionRate', label: 'Tasa Resolución', format: val => `${val}%`, inverse: false },
    { key: 'criticalBugs', label: 'Bugs Críticos', format: val => val, inverse: true }
  ];

  const ComparisonRow = ({ metric }) => {
    const valueA = calculateMetric(sprintA, metric.key);
    const valueB = calculateMetric(sprintB, metric.key);
    const delta = valueB - valueA;
    const deltaPercent = valueA !== 0 ? Math.round((delta / valueA) * 100) : 0;
    
    // Determinar si el cambio es positivo (inverso para bugs - menos es mejor)
    const isPositive = metric.inverse ? delta < 0 : delta > 0;
    const isNeutral = delta === 0;

    return (
      <div className="grid grid-cols-5 gap-4 py-4 border-b border-gray-200 last:border-b-0 items-center">
        {/* Métrica */}
        <div className="font-medium text-gray-700">{metric.label}</div>
        
        {/* Sprint A */}
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{metric.format(valueA)}</div>
          <div className="text-xs text-gray-500">{sprintA.sprint || sprintA.name}</div>
        </div>
        
        {/* Flecha */}
        <div className="flex justify-center">
          <ArrowRight className="w-6 h-6 text-gray-400" />
        </div>
        
        {/* Sprint B */}
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{metric.format(valueB)}</div>
          <div className="text-xs text-gray-500">{sprintB.sprint || sprintB.name}</div>
        </div>
        
        {/* Delta */}
        <div className="text-center">
          {isNeutral ? (
            <div className="flex items-center justify-center">
              <Minus className="w-5 h-5 text-gray-400" />
              <span className="ml-2 text-sm text-gray-500">Sin cambio</span>
            </div>
          ) : (
            <div className={`flex items-center justify-center ${isPositive ? 'text-success-600' : 'text-danger-600'}`}>
              {isPositive ? (
                <TrendingUp className="w-5 h-5" />
              ) : (
                <TrendingDown className="w-5 h-5" />
              )}
              <div className="ml-2">
                <div className="text-lg font-bold">
                  {delta > 0 ? '+' : ''}{delta}
                </div>
                <div className="text-xs">
                  {deltaPercent > 0 ? '+' : ''}{deltaPercent}%
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="executive-card">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Comparativa Sprint a Sprint
        </h3>
        <p className="text-sm text-gray-600">
          Análisis de evolución entre {sprintA.sprint || sprintA.name} y {sprintB.sprint || sprintB.name}
        </p>
      </div>

      <div className="space-y-0">
        {/* Header */}
        <div className="grid grid-cols-5 gap-4 pb-3 border-b-2 border-executive-200 text-sm font-semibold text-gray-600">
          <div>Métrica</div>
          <div className="text-center">Sprint Anterior</div>
          <div className="text-center"></div>
          <div className="text-center">Sprint Actual</div>
          <div className="text-center">Variación</div>
        </div>

        {/* Rows */}
        {metrics.map(metric => (
          <ComparisonRow key={metric.key} metric={metric} />
        ))}
      </div>

      {/* Resumen ejecutivo */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-semibold text-gray-800 mb-3">Resumen Ejecutivo</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(() => {
            const bugsA = calculateMetric(sprintA, 'bugs');
            const bugsB = calculateMetric(sprintB, 'bugs');
            const bugsDelta = bugsB - bugsA;
            
            const resolvedA = calculateMetric(sprintA, 'bugsResolved');
            const resolvedB = calculateMetric(sprintB, 'bugsResolved');
            const resolvedDelta = resolvedB - resolvedA;
            
            const rateA = calculateMetric(sprintA, 'resolutionRate');
            const rateB = calculateMetric(sprintB, 'resolutionRate');
            const rateDelta = rateB - rateA;

            return (
              <>
                {bugsDelta < 0 && (
                  <div className="flex items-start p-3 bg-success-50 rounded-lg border border-success-200">
                    <TrendingUp className="w-5 h-5 text-success-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-success-900">Reducción en Bugs Totales</div>
                      <div className="text-sm text-success-700">
                        Se redujo en {Math.abs(bugsDelta)} bugs ({Math.abs(Math.round((bugsDelta / bugsA) * 100))}%) - tendencia positiva en calidad
                      </div>
                    </div>
                  </div>
                )}
                
                {bugsDelta > 0 && (
                  <div className="flex items-start p-3 bg-warning-50 rounded-lg border border-warning-200">
                    <TrendingDown className="w-5 h-5 text-warning-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-warning-900">Incremento en Bugs</div>
                      <div className="text-sm text-warning-700">
                        Aumentó en {bugsDelta} bugs ({Math.round((bugsDelta / bugsA) * 100)}%) - revisar complejidad del sprint
                      </div>
                    </div>
                  </div>
                )}

                {resolvedDelta > 0 && (
                  <div className="flex items-start p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-blue-900">Mejora en Resolución</div>
                      <div className="text-sm text-blue-700">
                        Se resolvieron {resolvedDelta} bugs más ({Math.round((resolvedDelta / resolvedA) * 100)}%) - equipo más eficiente
                      </div>
                    </div>
                  </div>
                )}

                {rateDelta > 0 && (
                  <div className="flex items-start p-3 bg-success-50 rounded-lg border border-success-200">
                    <TrendingUp className="w-5 h-5 text-success-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-success-900">Mejora en Tasa de Resolución</div>
                      <div className="text-sm text-success-700">
                        La eficiencia subió {rateDelta} puntos porcentuales - cerrando brechas más rápido
                      </div>
                    </div>
                  </div>
                )}

                {rateDelta < 0 && (
                  <div className="flex items-start p-3 bg-danger-50 rounded-lg border border-danger-200">
                    <TrendingDown className="w-5 h-5 text-danger-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-danger-900">Reducción en Tasa de Resolución</div>
                      <div className="text-sm text-danger-700">
                        La eficiencia bajó {Math.abs(rateDelta)} puntos - considerar aumentar capacidad del equipo
                      </div>
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
