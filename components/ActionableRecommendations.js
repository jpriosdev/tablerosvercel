// components/ActionableRecommendations.js
import React from 'react';
import { Lightbulb, AlertTriangle, TrendingUp, CheckCircle, Target, Users, Code, Clock } from 'lucide-react';

export default function ActionableRecommendations({ data, filteredSprintData }) {
  if (!data || !filteredSprintData || filteredSprintData.length === 0) {
    return null;
  }

  // Calcular métricas para generar recomendaciones
  const totalBugs = filteredSprintData.reduce((acc, s) => acc + (s.bugs || s.bugsFound || 0), 0);
  const bugsClosed = filteredSprintData.reduce((acc, s) => acc + (s.bugsResolved || s.bugsClosed || 0), 0);
  const totalTestCases = filteredSprintData.reduce((acc, s) => acc + (s.testCases || s.testCasesExecuted || 0), 0);
  
  const resolutionEfficiency = totalBugs > 0 ? Math.round((bugsClosed / totalBugs) * 100) : 0;
  const avgTestCasesPerSprint = filteredSprintData.length > 0 ? Math.round(totalTestCases / filteredSprintData.length) : 0;
  
  // Calcular bugs críticos
  const criticalBugsTotal = filteredSprintData.reduce((acc, s) => {
    const priorities = s.bugsByPriority || {};
    return acc + (priorities['Más alta'] || 0) + (priorities['Alta'] || 0);
  }, 0);
  
  const criticalBugsPercent = totalBugs > 0 ? (criticalBugsTotal / totalBugs) * 100 : 0;
  
  // Calcular cycle time estimado
  const sprintDays = 14;
  const avgEfficiency = filteredSprintData.reduce((acc, s) => {
    const total = s.bugs || s.bugsFound || 0;
    const resolved = s.bugsResolved || s.bugsClosed || 0;
    return acc + (total > 0 ? resolved / total : 0);
  }, 0) / filteredSprintData.length;
  const cycleTime = Math.round(sprintDays * (1 - avgEfficiency * 0.5));
  
  // Calcular defect density
  const estimatedHUsPerSprint = 6;
  const totalHUs = filteredSprintData.length * estimatedHUsPerSprint;
  const defectDensity = totalBugs / totalHUs;

  // Generar recomendaciones basadas en umbrales
  const recommendations = [];

  // Recomendaciones de Cycle Time
  if (cycleTime > 2) {
    recommendations.push({
      category: 'velocity',
      priority: 'high',
      icon: <Clock className="w-5 h-5" />,
      title: 'Reducir Tiempo de Resolución',
      description: `El tiempo promedio de resolución es de ${cycleTime} días, superando el umbral de 10 días.`,
      actions: [
        'Implementar reuniones diarias de 15 min para resolver bloqueadores',
        'Asignar bugs críticos a desarrolladores senior dedicados',
        'Establecer SLA de 48h para bugs de prioridad crítica',
        'Revisar proceso de deployment para agilizar releases de fixes'
      ],
      impact: 'Alto',
      effort: 'Medio'
    });
  } else if (cycleTime > 7) {
    recommendations.push({
      category: 'velocity',
      priority: 'medium',
      icon: <Clock className="w-5 h-5" />,
      title: '🚧  Generico - Optimizar Velocidad de liberaciones',
      description: `Hoy se tiene un tiempo aceptable pero implmentando las practicas CI/CD pueden acelerarse  .`,
      actions: [
        'Documentar bugs con mayor detalle para acelerar diagnóstico',
        'Implementar hotfix pipeline para bugs urgentes',
        'Capacitar al equipo en técnicas de debugging eficiente'
      ],
      impact: 'Medio',
      effort: 'Bajo'
    });
  }

  // Recomendaciones de Defect Density
  if (defectDensity > 2.0) {
    recommendations.push({
      category: 'quality',
      priority: 'high',
      icon: <Code className="w-5 h-5" />,
      title: '🚧  Generico - Definir criterios de Calidad de Código',
      description: `Densidad de bugs indica problemas necesidad de estrategia de calidad en desarrollo.`,
      actions: [
        'Implementar pipelines con unit test automaticos y practicas CI/CD',
        'Aumentar cobertura de unit tests al 80% mínimo',
        'Implementar análisis estático de código automatico(SonarQube/ESLint)',
        'Pair programming obligatorio para HUs complejas',
        'Refactorizar módulos con alta concentración de bugs'
      ],
      impact: 'Muy Alto',
      effort: 'Alto'
    });
  } else if (defectDensity  => 0.0) {
    recommendations.push({
      category: 'quality',
      priority: 'medium',
      icon: <Code className="w-5 h-5" />,
      title: '🚧  Generico - Fortalecer Prácticas de Calidad',
      description: `Densidad de ${defectDensity.toFixed(2)} bugs/HU sugiere espacio para mejora.`,
      actions: [
        'Establecer Definition of Done con criterios de calidad',
        'Incrementar cobertura de integration tests',
        'Realizar sesiones de mob programming semanales',
        'Implementar checklist de calidad pre-commit'
      ],
      impact: 'Medio',
      effort: 'Medio'
    });
  }

  // Recomendaciones de Eficiencia de Resolución
  if (resolutionEfficiency < 40) {
    recommendations.push({
      category: 'efficiency',
      priority: 'high',
      icon: <Target className="w-5 h-5" />,
      title: 'Mejorar Eficiencia de Resolución Crítica',
      description: `Solo ${resolutionEfficiency}% de bugs resueltos - muy por debajo del objetivo de 70%.`,
      actions: [
        'Analizar causas raíz de bugs no resueltos (falta de recursos, complejidad, priorización)',
        'Aumentar capacidad del equipo o redistribuir carga',
        'Establecer reuniones de triage bi-semanales',
        'Implementar sistema de escalación para bugs estancados',
        'Considerar traer consultores externos para bugs complejos'
      ],
      impact: 'Crítico',
      effort: 'Alto'
    });
  } else if (resolutionEfficiency < 50) {
    recommendations.push({
      category: 'efficiency',
      priority: 'medium',
      icon: <Target className="w-5 h-5" />,
      title: '🚧  Generico -Incrementar Tasa de Resolución',
      description: `Eficiencia del ${resolutionEfficiency}% está por debajo del objetivo de 70%.`,
      actions: [
        'Revisar priorización de backlog de bugs',
        'Asignar tiempo dedicado del sprint a resolución de bugs',
        'Implementar rotación de "bug master" semanal',
        'Automatizar bugs repetitivos cuando sea posible'
      ],
      impact: 'Alto',
      effort: 'Medio'
    });
  }

  // Recomendaciones de Bugs Críticos
  if (criticalBugsPercent > 20) {
    recommendations.push({
      category: 'critical',
      priority: 'high',
      icon: <AlertTriangle className="w-5 h-5" />,
      title: '🚧  Generico - Alto Volumen de Bugs Críticos',
      description: `${criticalBugsPercent.toFixed(1)}% de bugs son críticos - requiere atención inmediata.`,
      actions: [
        'Revisar arquitectura de componentes más afectados',
        'Implementar smoke tests automáticos pre-deployment',
        'Mejorar criterios de aceptación en historias de usuario',
        'Realizar análisis de causa raíz de bugs críticos recurrentes',
        'Establecer sesión de retrospectiva enfocada en calidad'
      ],
      impact: 'Muy Alto',
      effort: 'Alto'
    });
  } else if (criticalBugsPercent > 20) {
    recommendations.push({
      category: 'critical',
      priority: 'medium',
      icon: <AlertTriangle className="w-5 h-5" />,
      title: '🚧  Generico - Reducir Proporción de Bugs Críticos',
      description: `${criticalBugsPercent.toFixed(1)}% de bugs críticos supera el objetivo de 20%.`,
      actions: [
        'Mejorar proceso de testing pre-producción',
        'Implementar checklist de QA para funcionalidades core',
        'Aumentar cobertura de pruebas de regresión'
      ],
      impact: 'Alto',
      effort: 'Medio'
    });
  }

  // Recomendaciones de Cobertura de Testing
  if (avgTestCasesPerSprint < 150) {
    recommendations.push({
      category: 'testing',
      priority: 'medium',
      icon: <CheckCircle className="w-5 h-5" />,
      title: '🚧  Generico - Aumentar Cobertura de Testing',
      description: `Solo ${avgTestCasesPerSprint} casos ejecutados por sprint - por debajo de objetivo de 200.`,
      actions: [
        'Automatizar casos de prueba manuales repetitivos',
        'Aumentar equipo de QA o capacitar devs en testing',
        'Implementar CI/CD con tests automáticos en cada PR',
        'Crear suite de regression tests automatizada'
      ],
      impact: 'Alto',
      effort: 'Alto'
    });
  }

  // Recomendaciones positivas cuando todo va bien
  if (resolutionEfficiency >= 80 && defectDensity <= 1.0 && cycleTime <= 7) {
    recommendations.push({
      category: 'excellence',
      priority: 'low',
      icon: <TrendingUp className="w-5 h-5" />,
      title: '🚧  Generico - Excelente Desempeño - Mantener Prácticas',
      description: 'El equipo muestra métricas sobresalientes en calidad y velocidad.',
      actions: [
        'Documentar prácticas exitosas para otros equipos',
        'Compartir aprendizajes en sesiones de knowledge sharing',
        'Considerar aumentar complejidad de features con esta base sólida',
        'Explorar oportunidades de innovación técnica'
      ],
      impact: 'Medio',
      effort: 'Bajo'
    });
  }

  // Ordenar por prioridad
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-danger-500 bg-danger-50';
      case 'medium': return 'border-warning-500 bg-warning-50';
      case 'low': return 'border-success-500 bg-success-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getPriorityTextColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-danger-700';
      case 'medium': return 'text-warning-700';
      case 'low': return 'text-success-700';
      default: return 'text-gray-700';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'velocity': return <Clock className="w-5 h-5" />;
      case 'quality': return <Code className="w-5 h-5" />;
      case 'efficiency': return <Target className="w-5 h-5" />;
      case 'critical': return <AlertTriangle className="w-5 h-5" />;
      case 'testing': return <CheckCircle className="w-5 h-5" />;
      case 'excellence': return <TrendingUp className="w-5 h-5" />;
      default: return <Lightbulb className="w-5 h-5" />;
    }
  };

  return (
    <div className="executive-card">
      <div className="mb-6 flex items-center">
        <Lightbulb className="w-6 h-6 text-executive-600 mr-3" />
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Recomendaciones Accionables
          </h3>
          <p className="text-sm text-gray-600">
            Basadas en análisis automático de métricas y umbrales de calidad
          </p>
        </div>
      </div>

      {recommendations.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <CheckCircle className="w-12 h-12 mx-auto mb-3 text-success-500" />
          <p>No hay recomendaciones críticas en este momento. ¡Buen trabajo!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className={`border-l-4 ${getPriorityColor(rec.priority)} rounded-lg p-5 shadow-sm`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <div className={`${getPriorityTextColor(rec.priority)} mr-3`}>
                    {getCategoryIcon(rec.category)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{rec.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                  </div>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className={`px-3 py-1 rounded-full font-semibold ${
                    rec.priority === 'high' ? 'bg-danger-100 text-danger-700' :
                    rec.priority === 'medium' ? 'bg-warning-100 text-warning-700' :
                    'bg-success-100 text-success-700'
                  }`}>
                    {rec.priority === 'high' ? 'Alta' : rec.priority === 'medium' ? 'Media' : 'Baja'}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <div className="font-semibold text-sm text-gray-700 mb-2">Acciones sugeridas:</div>
                <ul className="space-y-2">
                  {rec.actions.map((action, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-700">
                      <span className="text-executive-600 mr-2 mt-0.5">▸</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 flex gap-4 text-xs">
                <div>
                  <span className="font-semibold text-gray-600">Impacto:</span>
                  <span className="ml-2 text-gray-900">{rec.impact}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-600">Esfuerzo:</span>
                  <span className="ml-2 text-gray-900">{rec.effort}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
