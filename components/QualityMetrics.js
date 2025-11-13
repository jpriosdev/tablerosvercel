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
  
  export default function QualityMetrics({ data }) {
    const metrics = [
      {
        key: 'defectDensity',
        title: 'Densidad de Defectos',
        value: data.defectDensity,
        unit: 'bugs/caso',
        icon: <Target className="w-6 h-6" />,
        target: 0.15,
        status: data.defectDensity <= 0.15 ? 'success' : data.defectDensity <= 0.25 ? 'warning' : 'danger',
        description: 'Número de bugs por caso de prueba ejecutado'
      },
      {
        key: 'testEfficiency',
        title: 'Eficiencia de Pruebas',
        value: data.testEfficiency,
        unit: '%',
        icon: <CheckCircle className="w-6 h-6" />,
        target: 85,
        status: data.testEfficiency >= 85 ? 'success' : data.testEfficiency >= 70 ? 'warning' : 'danger',
        description: 'Porcentaje de casos de prueba que detectan defectos'
      },
      {
        key: 'bugLeakage',
        title: 'Fuga de Bugs',
        value: data.bugLeakage,
        unit: '%',
        icon: <Shield className="w-6 h-6" />,
        target: 5,
        status: data.bugLeakage <= 5 ? 'success' : data.bugLeakage <= 10 ? 'warning' : 'danger',
        description: 'Porcentaje de bugs que escapan a producción'
      },
      {
        key: 'testAutomation',
        title: 'Automatización',
        value: data.testAutomation,
        unit: '%',
        icon: <Zap className="w-6 h-6" />,
        target: 60,
        status: data.testAutomation >= 60 ? 'success' : data.testAutomation >= 40 ? 'warning' : 'danger',
        description: 'Porcentaje de pruebas automatizadas'
      },
      {
        key: 'codeCoverage',
        title: 'Cobertura de Código',
        value: data.codeCoverage,
        unit: '%',
        icon: <BarChart3 className="w-6 h-6" />,
        target: 80,
        status: data.codeCoverage >= 80 ? 'success' : data.codeCoverage >= 65 ? 'warning' : 'danger',
        description: 'Porcentaje de código cubierto por pruebas'
      },
      {
        key: 'cycleTime',
        title: 'Tiempo de Ciclo',
        value: data.cycleTime,
        unit: 'días',
        icon: <Clock className="w-6 h-6" />,
        target: 2,
        status: data.cycleTime <= 2 ? 'success' : data.cycleTime <= 3 ? 'warning' : 'danger',
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
      if (isReverse) {
        // Para métricas donde menor es mejor (como defectDensity, bugLeakage, cycleTime)
        return Math.max(0, Math.min(100, ((target / value) * 100)));
      } else {
        // Para métricas donde mayor es mejor
        return Math.max(0, Math.min(100, (value / target) * 100));
      }
    };
  
    const isReverseMetric = (key) => {
      return ['defectDensity', 'bugLeakage', 'cycleTime'].includes(key);
    };
  
    return (
      <div className="space-y-8">
        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((metric) => {
            const colors = getStatusColor(metric.status);
            const progressPercentage = getProgressPercentage(
              metric.value, 
              metric.target, 
              isReverseMetric(metric.key)
            );
  
            return (
              <div key={metric.key} className={`executive-card border-2 ${colors.border} ${colors.bg}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-white ${colors.icon}`}>
                    {metric.icon}
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${colors.text}`}>
                      {metric.value}{metric.unit}
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
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                    metric.status === 'success' ? 'bg-success-100 text-success-800' :
                    metric.status === 'warning' ? 'bg-warning-100 text-warning-800' :
                    'bg-danger-100 text-danger-800'
                  }`}>
                    {metric.status === 'success' ? (
                      <CheckCircle className="w-3 h-3 mr-1" />
                    ) : (
                      <AlertTriangle className="w-3 h-3 mr-1" />
                    )}
                    {metric.status === 'success' ? 'En Meta' :
                     metric.status === 'warning' ? 'Atención' : 'Crítico'}
                  </span>
                  
                  <TrendingUp className={`w-4 h-4 ${
                    metric.status === 'success' ? 'text-success-500' :
                    metric.status === 'warning' ? 'text-warning-500' : 'text-danger-500'
                  }`} />
                </div>
              </div>
            );
          })}
        </div>
  
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
                        metric.status === 'success' ? 'bg-success-500' :
                        metric.status === 'warning' ? 'bg-warning-500' : 'bg-danger-500'
                      }`} />
                      <span className="text-sm font-medium text-gray-900">
                        {metric.value}{metric.unit}
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
      </div>
    );
  }
  