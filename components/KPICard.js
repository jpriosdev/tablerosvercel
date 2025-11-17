import { TrendingUp, TrendingDown, Info, ChevronRight, Construction } from 'lucide-react';
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
  tooltip,
  onClick,
  detailData,
  sparklineData,
  isEstimated = false
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  
  const isClickable = onClick || detailData;
  
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
    <div 
      className={`kpi-card relative ${getStatusStyles()} ${
        isClickable ? 'cursor-pointer hover:-translate-y-1 hover:shadow-2xl transition-all duration-300' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        {icon}
        <div className="relative">
          {tooltip && (
            <span
              className="ml-2 cursor-pointer"
              onClick={(e) => e.stopPropagation()}
              onMouseEnter={e => {
                const rect = e.currentTarget.getBoundingClientRect();
                setTooltipPos({ x: rect.right + 8, y: rect.top });
                setShowTooltip(true);
              }}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <Info className="w-3.5 h-3.5 text-gray-400 hover:text-blue-500" />
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
      <div className="flex items-center justify-between mb-1">
        <h3 className="metric-label">{title}</h3>
        {isEstimated && (
          <span className="inline-flex items-center text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full border border-orange-200">
            <Construction className="w-3 h-3 mr-1" />
            <span>*</span>
          </span>
        )}
      </div>
      <div className="metric-value">{value}{isEstimated && <span className="text-orange-500 ml-1">*</span>}</div>
      {formula && (
        <div className="text-xs text-gray-400 mt-0.5">{formula}</div>
      )}
      {subtitle && (
        <p className="text-xs text-gray-600 mt-1">{subtitle}</p>
      )}
      
      {isClickable && (
        <div className="absolute bottom-2 right-2 text-gray-400 hover:text-[#754bde] transition-colors">
          <ChevronRight className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}
