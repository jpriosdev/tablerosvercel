import { TrendingUp, TrendingDown, Info } from 'lucide-react';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';

export default function KPICard({
  title, 
  value, 
  icon, 
  trend, 
  status = 'neutral', 
  subtitle,
  formula,
  tooltip
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
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
  }
  return (
    <div className={`kpi-card relative ${getStatusStyles()}`}>
      <div className="flex items-center justify-between mb-4">
        {icon}
        <div className="relative">
          {tooltip && (
            <span
              className="ml-2 cursor-pointer"
              onMouseEnter={e => {
                const rect = e.currentTarget.getBoundingClientRect();
                setTooltipPos({ x: rect.right + 8, y: rect.top });
                setShowTooltip(true);
              }}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <Info className="w-4 h-4 text-gray-400 hover:text-blue-500" />
            </span>
          )}
          {tooltip && showTooltip && createPortal(
            <div
              style={{
                position: 'fixed',
                left: tooltipPos.x,
                top: tooltipPos.y,
                zIndex: 9999,
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                padding: '0.75rem',
                fontSize: '0.875rem',
                color: '#374151',
                width: '16rem',
                pointerEvents: 'none',
              }}
            >
              {tooltip}
            </div>, document.body
          )}
        </div>
      </div>
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
      <h3 className="metric-label mb-2">{title}</h3>
      <div className="metric-value">{value}</div>
      {formula && (
        <div className="text-xs text-gray-400 mt-1">{formula}</div>
      )}
      {subtitle && (
        <p className="text-sm text-gray-600 mt-2">{subtitle}</p>
      )}
    </div>
  );
}
