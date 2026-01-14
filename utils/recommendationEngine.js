// utils/recommendationEngine.js

/**
 * Motor de recomendaciones que obtiene recomendaciones paramétricas desde los datos
 * o usa valores por defecto si no están disponibles en Excel
 */

const DEFAULT_RECOMMENDATIONS = {
  testCases: [
    { condition: 'avg >= 200', text: 'Cobertura excelente: conservar y documentar los casos; programar revisiones periódicas por módulo', priority: 'baja' },
    { condition: 'avg >= 150 && avg < 200', text: 'Cobertura aceptable: aumentar casos en módulos críticos y planificar automatización incremental', priority: 'media' },
    { condition: 'avg < 150', text: 'Cobertura baja: plan de acción inmediato para incrementar casos y priorizar automatización en áreas clave', priority: 'alta' },
    { condition: 'default', text: 'Configurar métricas de cobertura por módulo y medir semanalmente', priority: 'media' },
    { condition: 'default', text: 'Automatizar casos repetitivos para reducir esfuerzo manual y mejorar consistencia', priority: 'media' },
    { condition: 'default', text: 'Priorizar pruebas para funcionalidades críticas del negocio y documentar criterios de aceptación', priority: 'media' }
  ],
  resolutionEfficiency: [
    { condition: 'efficiency >= 80', text: 'Eficiencia alta: mantener prácticas actuales y documentar mejoras replicables', priority: 'baja' },
    { condition: 'efficiency >= 70 && efficiency < 80', text: 'Eficiencia buena: monitorizar para evitar degradación y optimizar cuellos de botella', priority: 'baja' },
    { condition: 'efficiency < 70', text: 'Eficiencia baja: identificar bloqueadores, reasignar recursos y reducir backlog prioritario', priority: 'alta' },
    { condition: 'efficiency < 70', text: 'Priorizar cierre de bugs antiguos y limpiar backlog antes de añadir nuevas features', priority: 'alta' },
    { condition: 'default', text: 'Establecer sincronizaciones breves QA-Dev (dailies) para acelerar resolución de impedimentos', priority: 'media' },
    { condition: 'default', text: 'Definir SLAs por prioridad para tiempo de resolución y seguimiento', priority: 'media' },
    { condition: 'default', text: 'Evaluar capacidad del equipo y contratar/redistribuir si el backlog lo requiere', priority: 'baja' }
  ],
  criticalBugs: [
    { condition: 'total > 30', text: 'Nivel crítico: convocar acción inmediata y reasignar recursos hasta estabilizar', priority: 'alta' },
    { condition: 'total > 20 && total <= 30', text: 'Alta presión: asignar recursos adicionales y programar war room hasta bajar la curva', priority: 'alta' },
    { condition: 'total <= 20', text: 'Volumen manejable: mantener prácticas de control y seguimiento', priority: 'baja' },
    { condition: 'default', text: 'Establecer war room para bugs de máxima prioridad y seguimiento horario', priority: 'media' },
    { condition: 'default', text: 'Implementar smoke tests automáticos en pipelines principales', priority: 'media' },
    { condition: 'default', text: 'Analizar módulos con alta concentración de bugs críticos y planear refactor', priority: 'media' },
    { condition: 'default', text: 'Aumentar code reviews en funcionalidades core y documentar decisiones', priority: 'media' }
  ],
  criticalBugsStatus: [
    { condition: 'pending > 15', text: 'Urgente: convocar daily enfocado y redistribuir trabajo para reducir backlog crítico', priority: 'alta' },
    { condition: 'pending > 15', text: 'Escalar recursos: reasignar desarrolladores senior a bugs críticos hasta estabilizar', priority: 'alta' },
    { condition: 'pending > 10 && pending <= 15', text: 'Alta prioridad: acelerar cierre de bugs críticos y revisar bloqueo de dependencias', priority: 'alta' },
    { condition: 'pending <= 10 && pending > 0', text: 'Volumen manejable: mantener velocidad de cierre y monitorización diaria', priority: 'baja' },
    { condition: 'pending === 0', text: 'Excelente: todos los bugs críticos resueltos; formalizar buenas prácticas mantenidas', priority: 'baja' },
    { condition: 'default', text: 'Definir SLA (ej. 48h) para bugs de máxima prioridad y medir cumplimiento', priority: 'media' },
    { condition: 'default', text: 'Implementar triage diario con due owner para cada bug crítico', priority: 'media' },
    { condition: 'default', text: 'Automatizar alertas para bugs críticos sin actualización en 24h', priority: 'baja' }
  ],
  cycleTime: [
    { condition: 'avg > 10', text: 'Cycle Time alto: introducir dailies focalizados y eliminar bloqueadores dentro de 48h', priority: 'alta' },
    { condition: 'byPriority.critical > 5', text: 'Críticos lentos: establecer SLA de 48h y asignar recursos dedicados a críticos', priority: 'alta' },
    { condition: 'avg <= 7', text: 'Velocidad óptima: mantener prácticas y documentar procesos eficientes', priority: 'baja' },
    { condition: 'default', text: 'Aumentar automatización de testing para detectar defectos en fases tempranas', priority: 'media' },
    { condition: 'default', text: 'Revisar y estandarizar triage para priorizar correctamente', priority: 'media' }
  ],
  defectDensity: [
    { condition: 'avg > 2.0', text: 'Alta densidad: imponer code reviews y aumentar cobertura de unit tests al 80% mínimo', priority: 'alta' },
    { condition: 'avg > 2.0', text: 'Alta densidad: priorizar fixes en módulos con mayor incidencia y plan de refactor', priority: 'alta' },
    { condition: 'avg > 1.0 && avg <= 2.0', text: 'Densidad moderada: definir Definition of Done con criterios de calidad claros', priority: 'media' },
    { condition: 'avg > 1.0 && avg <= 2.0', text: 'Promover pair programming en HUs complejas para reducir regresiones', priority: 'media' },
    { condition: 'default', text: 'Analizar módulos con alta concentración de bugs y planificar refactorizaciones por prioridad', priority: 'media' },
    { condition: 'default', text: 'Establecer métricas de calidad de código (complejidad, code smells, deuda técnica)', priority: 'media' },
    { condition: 'default', text: 'Capacitar al equipo en TDD para mejorar prevención de defectos', priority: 'media' },
    { condition: 'critical > 0.3', text: 'Crítico: alta proporción de bugs críticos; investigar arquitectura y requisitos', priority: 'alta' },
    { condition: 'avg <= 1.0', text: 'Densidad adecuada: mantener prácticas actuales y monitorizar tendencia', priority: 'baja' }
  ]
};

export class RecommendationEngine {
  
  // Mapeo de nombres antiguos a nuevos
  static METRIC_NAME_MAP = {
    'testCases': 'mediaCasosEjecutados',
    'defectDensity': 'densidadDefectos',
    'cycleTime': 'tiempoPromedioResolucion',
    'criticalBugs': 'bugsCriticosDetectados',
    'criticalBugsStatus': 'estadoBugsCriticos',
    'resolutionEfficiency': 'eficienciaResolucion'
  };
  
  /**
   * Obtiene recomendaciones para una métrica específica
   * @param {string} metricType - Tipo de métrica (testCases, resolutionEfficiency, etc.)
   * @param {object} data - Datos de la métrica para evaluar condiciones
   * @param {object} excelRecommendations - Recomendaciones desde Excel (opcional)
   * @returns {array} Lista de recomendaciones aplicables
   */
  static getRecommendations(metricType, data, excelRecommendations = null) {
    // Mapear nombre antiguo a nuevo si existe
    const newMetricName = this.METRIC_NAME_MAP[metricType] || metricType;
    
    // Intentar obtener recomendaciones desde Excel con nombre nuevo o antiguo
    const recommendations = 
      excelRecommendations?.[newMetricName] || 
      excelRecommendations?.[metricType] || 
      DEFAULT_RECOMMENDATIONS[metricType] || [];
    
    // Filtrar recomendaciones aplicables según las condiciones
    return recommendations
      .filter(rec => this.evaluateCondition(rec.condition, data))
      .map(rec => {
        const priority = rec.priority || 'media';
        // Marcar recomendaciones accionables (alta/media) con badge 'bajo construcción'
        const isActionable = (priority.toLowerCase() === 'alta' || priority.toLowerCase() === 'media');
        const actionBadge = isActionable ? '🚧' : null;
        const baseIcon = this.getPriorityIcon(rec.priority);
        // Nota para recomendaciones accionables: indicar que son generales y están en desarrollo
        const defaultNote = 'En desarrollo: recomendación general — requiere especificación y priorización.';
        const note = isActionable ? (rec.note || defaultNote) : null;
        const warningIcon = isActionable ? '⚠️' : null;

        return {
          text: rec.text,
          priority: priority,
          // icon personalizado: badge de construcción + icono por prioridad (si aplica)
          icon: actionBadge ? `${actionBadge} ${baseIcon}` : baseIcon,
          // badge de advertencia y nota explicativa cuando es accionable
          warningIcon,
          note,
          parametros: rec.parametros // Incluir parámetros de rangos si existen
        };
      });
  }
  
  /**
   * Evalúa si una condición se cumple con los datos actuales
   */
  static evaluateCondition(condition, data) {
    if (condition === 'default') return true;
    
    try {
      // Crear función que evalúa la condición
      const conditionFn = new Function(...Object.keys(data), `return ${condition}`);
      return conditionFn(...Object.values(data));
    } catch (error) {
      console.warn('Error evaluating condition:', condition, error);
      return false;
    }
  }
  
  /**
   * Obtiene el icono correspondiente a la prioridad
   */
  static getPriorityIcon(priority) {
    switch (priority?.toLowerCase()) {
      case 'alta':
        return '🚨';
      case 'media':
        return '⚠️';
      case 'baja':
        return '✅';
      default:
        return '•';
    }
  }
  
  /**
   * Formatea recomendaciones para mostrar en el modal
   */
  static formatRecommendations(recommendations) {
    return recommendations.map(rec => {
      const icon = rec.icon || this.getPriorityIcon(rec.priority);
      const boldText = rec.text.includes(':') ? rec.text.split(':')[0] : '';
      
      if (boldText) {
        const restText = rec.text.substring(boldText.length + 1);
        return `${icon} <strong>${boldText}:</strong>${restText}`;
      }
      
      return `${icon} ${rec.text}`;
    });
  }
}

export default RecommendationEngine;
