import { AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function RiskMatrix({ data }) {
  const priorities = [
    { 
      key: 'Más alta', 
      label: 'MÁS ALTA', 
      color: 'bg-red-500', 
      textColor: 'text-red-800',
      bgColor: 'bg-red-50',
      icon: <XCircle className="w-4 h-4" />
    },
    { 
      key: 'Alta', 
      label: 'ALTA', 
      color: 'bg-orange-500', 
      textColor: 'text-orange-800',
      bgColor: 'bg-orange-50',
      icon: <AlertTriangle className="w-4 h-4" />
    },
    { 
      key: 'Medio', 
      label: 'MEDIA', 
      color: 'bg-yellow-500', 
      textColor: 'text-yellow-800',
      bgColor: 'bg-yellow-50',
      icon: <Clock className="w-4 h-4" />
    },
    { 
      key: 'Baja', 
      label: 'BAJA', 
      color: 'bg-green-500', 
      textColor: 'text-green-800',
      bgColor: 'bg-green-50',
      icon: <CheckCircle className="w-4 h-4" />
    }
  ];

  const totalBugs = Object.values(data).reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="executive-card">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Matriz de Riesgo - Bugs por Prioridad</h3>
      
      <div className="space-y-4">
        {priorities.map((priority) => {
          const bugData = data[priority.key] || { count: 0, pending: 0, resolved: 0 };
          const percentage = totalBugs > 0 ? Math.round((bugData.count / totalBugs) * 100) : 0;
          const pendingPercentage = bugData.count > 0 ? Math.round((bugData.pending / bugData.count) * 100) : 0;
          
          return (
            <div key={priority.key} className={`p-4 rounded-lg border-2 ${priority.bgColor} border-opacity-50`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className={`p-1 rounded-full ${priority.color} text-white`}>
                    {priority.icon}
                  </div>
                  <span className={`font-semibold ${priority.textColor}`}>
                    {priority.label}
                  </span>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${priority.textColor}`}>
                    {bugData.count}
                  </div>
                  <div className="text-xs text-gray-600">
                    {percentage}% del total
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="bg-white bg-opacity-50 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-3 ${priority.color} transition-all duration-1000 ease-out`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
                <div className="text-sm space-x-4">
                  <span className={`${priority.textColor} font-medium`}>
                    Pendientes: {bugData.pending}
                  </span>
                  <span className="text-green-600 font-medium">
                    Resueltos: {bugData.resolved}
                  </span>
                </div>
              </div>
              
              {bugData.pending > 0 && (
                <div className="mt-2 text-xs text-gray-600">
                  {pendingPercentage}% de esta prioridad está pendiente
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Total de Bugs:</span>
          <span className="text-lg font-bold text-gray-900">{totalBugs}</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-sm font-medium text-gray-700">Bugs Críticos (Alta + Más Alta):</span>
          <span className="text-lg font-bold text-red-600">
            {(data['Más alta']?.count || 0) + (data['Alta']?.count || 0)}
          </span>
        </div>
      </div>
    </div>
  );
}
