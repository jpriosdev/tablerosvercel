/**
 * RiskMatrixDetailModal Component
 * 
 * Modal that displays detailed breakdown of bugs by priority
 * with recommendations and resolution tracking.
 */

import React from 'react';
import { X, AlertTriangle, CheckCircle, Clock, XCircle, TrendingUp, TrendingDown } from 'lucide-react';

const PRIORITY_CONFIG = [
  {
    key: 'Más alta',
    label: 'MÁS ALTA',
    color: 'bg-red-500',
    textColor: 'text-red-800',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    icon: <XCircle className="w-5 h-5" />,
    description: 'Impacto crítico, requiere resolución inmediata',
  },
  {
    key: 'Alta',
    label: 'ALTA',
    color: 'bg-orange-500',
    textColor: 'text-orange-800',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    icon: <AlertTriangle className="w-5 h-5" />,
    description: 'Impacto significativo, resolver urgentemente',
  },
  {
    key: 'Media',
    label: 'MEDIA',
    color: 'bg-yellow-500',
    textColor: 'text-yellow-800',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    icon: <Clock className="w-5 h-5" />,
    description: 'Impacto moderado, planificar resolución',
  },
  {
    key: 'Baja',
    label: 'BAJA',
    color: 'bg-green-500',
    textColor: 'text-green-800',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    icon: <CheckCircle className="w-5 h-5" />,
    description: 'Impacto bajo, resolver cuando sea posible',
  },
];

export default function RiskMatrixDetailModal({ data, onClose, recommendations }) {
  if (!data) return null;

  const totalBugs = Object.values(data).reduce((sum, item) => sum + item.count, 0);
  const totalPending = Object.values(data).reduce((sum, item) => sum + item.pending, 0);
  const totalResolved = Object.values(data).reduce((sum, item) => sum + item.resolved, 0);
  const criticalBugs = (data['Más alta']?.count || 0) + (data['Alta']?.count || 0);
  const resolutionRate = totalBugs > 0 ? Math.round((totalResolved / totalBugs) * 100) : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-red-500 to-orange-500 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Matriz de Riesgo - Detalles</h2>
            <p className="text-red-100 text-sm mt-1">Análisis detallado de bugs por nivel de prioridad</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Resumen General */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 font-medium">Total Bugs</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{totalBugs}</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 font-medium">Críticos</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{criticalBugs}</p>
              <p className="text-xs text-red-600 mt-1">
                {totalBugs > 0 ? Math.round((criticalBugs / totalBugs) * 100) : 0}% del total
              </p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 font-medium">Pendientes</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{totalPending}</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 font-medium">Tasa Resolución</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{resolutionRate}%</p>
            </div>
          </div>

          {/* Desglose por Prioridad */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Desglose por Prioridad</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PRIORITY_CONFIG.map((priority) => {
                const bugData = data[priority.key] || { count: 0, pending: 0, resolved: 0 };
                const percentage = totalBugs > 0 ? Math.round((bugData.count / totalBugs) * 100) : 0;
                const resolutionPct = bugData.count > 0 ? Math.round((bugData.resolved / bugData.count) * 100) : 0;

                return (
                  <div
                    key={priority.key}
                    className={`border-2 ${priority.borderColor} ${priority.bgColor} rounded-lg p-4`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${priority.color} text-white`}>
                          {priority.icon}
                        </div>
                        <div>
                          <p className={`font-bold ${priority.textColor}`}>{priority.label}</p>
                          <p className="text-xs text-gray-600">{priority.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${priority.textColor}`}>{bugData.count}</p>
                        <p className="text-xs text-gray-600">{percentage}%</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="bg-white bg-opacity-50 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 ${priority.color} transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <p className="text-gray-600">Resueltos</p>
                        <p className={`font-bold ${priority.textColor}`}>{bugData.resolved}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600">Pendientes</p>
                        <p className={`font-bold ${priority.textColor}`}>{bugData.pending}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600">Tasa</p>
                        <p className="font-bold text-blue-600">{resolutionPct}%</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recomendaciones */}
          {recommendations && recommendations.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recomendaciones</h3>
              <div className="space-y-3">
                {recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className={`border-l-4 p-4 rounded-lg ${
                      rec.priority === 'alta'
                        ? 'border-red-500 bg-red-50'
                        : rec.priority === 'media'
                        ? 'border-yellow-500 bg-yellow-50'
                        : 'border-green-500 bg-green-50'
                    }`}
                  >
                    <p className="font-semibold text-gray-900">{rec.title || rec.recommendation}</p>
                    {rec.description && (
                      <p className="text-sm text-gray-700 mt-1">{rec.description}</p>
                    )}
                    {rec.impact && (
                      <p className="text-xs text-gray-600 mt-2">
                        <strong>Impacto:</strong> {rec.impact}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
