/**
 * RiskMatrix Component (Redesigned)
 * 
 * Compact KPI card showing critical bugs summary.
 * Displays total bugs, critical count, and overall status.
 * Click to open detail modal with priority breakdown and recommendations.
 * 
 * @param {Object} props
 * @param {Object} props.data - Bugs keyed by priority
 * @param {Function} props.onDetailClick - Callback when card is clicked
 */
import { AlertTriangle, AlertCircle, TrendingUp } from 'lucide-react';

export default function RiskMatrix({ data, onDetailClick }) {
  // Calcular métricas resumen
  const totalBugs = Object.values(data).reduce((sum, item) => sum + item.count, 0);
  const criticalBugs = (data['Más alta']?.count || 0) + (data['Alta']?.count || 0);
  const criticalPercentage = totalBugs > 0 ? Math.round((criticalBugs / totalBugs) * 100) : 0;
  const pendingBugs = Object.values(data).reduce((sum, item) => sum + item.pending, 0);
  
  // Determinar estado basado en porcentaje crítico
  let status = 'success';
  let statusColor = 'text-green-600';
  let bgColor = 'bg-green-50';
  let borderColor = 'border-green-200';
  let icon = <AlertCircle className="w-6 h-6" />;
  
  if (criticalPercentage >= 40) {
    status = 'danger';
    statusColor = 'text-red-600';
    bgColor = 'bg-red-50';
    borderColor = 'border-red-200';
    icon = <AlertTriangle className="w-6 h-6" />;
  } else if (criticalPercentage >= 25) {
    status = 'warning';
    statusColor = 'text-amber-600';
    bgColor = 'bg-amber-50';
    borderColor = 'border-amber-200';
  }
  
  return (
    <div
      className={`kpi-card border-2 ${borderColor} ${bgColor} cursor-pointer hover:-translate-y-1 hover:shadow-2xl transition-all duration-300`}
      onClick={onDetailClick}
    >
      {/* Header con Icono y Acción */}
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${statusColor} bg-white`}>
          {icon}
        </div>
        <TrendingUp className="w-4 h-4 text-gray-400" />
      </div>

      {/* Título */}
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Matriz de Riesgo</h3>

      {/* Valor Principal */}
      <div className="mb-4">
        <div className="flex items-baseline justify-between">
          <span className={`text-3xl font-bold ${statusColor}`}>
            {criticalBugs}
          </span>
          <span className="text-sm text-gray-600">críticos</span>
        </div>
        <p className="text-xs text-gray-600 mt-1">
          de {totalBugs} bugs ({criticalPercentage}%)
        </p>
      </div>

      {/* Barra de Progreso */}
      <div className="mb-3">
        <div className="bg-white bg-opacity-50 rounded-full h-2 overflow-hidden">
          <div
            className={`h-2 ${
              status === 'danger'
                ? 'bg-red-500'
                : status === 'warning'
                ? 'bg-amber-500'
                : 'bg-green-500'
            } transition-all duration-700`}
            style={{ width: `${Math.min(criticalPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Métricas Secundarias */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-white bg-opacity-60 rounded p-2">
          <span className="text-gray-600">Pendientes</span>
          <p className="font-bold text-gray-800">{pendingBugs}</p>
        </div>
        <div className="bg-white bg-opacity-60 rounded p-2">
          <span className="text-gray-600">Resueltos</span>
          <p className="font-bold text-green-600">
            {totalBugs - pendingBugs}
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-4 pt-3 border-t border-gray-200 border-opacity-50 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-600">Ver detalles</span>
        <span className={`text-xs font-bold ${statusColor}`}>
          {status === 'danger'
            ? '🚨 CRÍTICO'
            : status === 'warning'
            ? '⚠️ ALERTA'
            : '✅ OK'}
        </span>
      </div>
    </div>
  );
}
