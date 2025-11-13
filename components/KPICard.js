import { TrendingUp, TrendingDown } from 'lucide-react';

export default function KPICard({ 
  title, 
  value, 
  icon, 
  trend, 
  status = 'neutral', 
  subtitle 
}) {
  const getStatusStyles = () => {
    switch (status) {
      case 'success':
        return 'border-success-200 bg-success-50';
      case 'warning':
        return 'border-warning-200 bg-warning-50';
      case 'danger':
        return 'border-danger-200 bg-danger-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  return (
    <div className={`kpi-card ${getStatusStyles()}`}>
      <div className="flex items-center justify-between mb-4">
        {icon}
        {trend !== undefined && (
          <div className={`flex items-center text-sm font-medium ${
            trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600'
          }`}>
            {trend > 0 ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : trend < 0 ? (
              <TrendingDown className="w-4 h-4 mr-1" />
            ) : null}
            {trend !== 0 && `${trend > 0 ? '+' : ''}${trend}%`}
          </div>
        )}
      </div>
      
      <h3 className="metric-label mb-2">{title}</h3>
      <div className="metric-value">{value}</div>
      
      {subtitle && (
        <p className="text-sm text-gray-600 mt-2">{subtitle}</p>
      )}
    </div>
  );
}
