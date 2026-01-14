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
  donutPercent, // 0-100 optional mini-donut
  progressPercent, // 0-100 optional progress bar
  breakdown, // { BOT, POS, Total }
  isEstimated = false
  , valueLabel, secondaryValue, secondaryLabel
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
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          {icon}
          {/* Delta badge */}
          {trend !== undefined && (
            <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${trend > 0 ? 'bg-green-100 text-green-700' : trend < 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
              {trend > 0 ? '▲' : trend < 0 ? '▼' : '•'} {trend !== 0 ? `${Math.abs(trend)}%` : '0%'}
            </span>
          )}
        </div>
        <div className="relative">
          {tooltip && (
            <span
              className="ml-2 cursor-pointer"
              onClick={(e) => { e.stopPropagation(); setShowTooltip(s => !s); }}
              onMouseEnter={e => {
                const rect = e.currentTarget.getBoundingClientRect();
                const tooltipWidth = 256; // 16rem
                // Prefer showing to the right, but keep inside viewport
                let left = rect.right + 8;
                if (typeof window !== 'undefined' && left + tooltipWidth > window.innerWidth) {
                  left = Math.max(8, rect.left - tooltipWidth - 8);
                }
                const top = (rect.bottom || rect.top) + 8;
                setTooltipPos({ x: left, y: top });
                setShowTooltip(true);
              }}
              onMouseLeave={() => {
                // small delay to allow moving pointer into the portal tooltip
                setTimeout(() => { if (document) setShowTooltip(false); }, 100);
              }}
            >
              <Info className="w-3.5 h-3.5 text-gray-400 hover:text-blue-500" />
            </span>
          )}
          {tooltip && showTooltip && createPortal(
            <div
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              style={{
                position: 'fixed',
                left: tooltipPos.x,
                top: tooltipPos.y,
                zIndex: 99999,
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
                padding: '0.75rem',
                fontSize: '0.875rem',
                color: '#374151',
                width: '16rem',
                maxWidth: 'calc(100vw - 16px)',
                pointerEvents: 'auto'
              }}
            >
              {tooltip}
            </div>, document.body
          )}
        </div>
      </div>
      {/* legacy trend removed from here - shown as badge near title */}
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
      {(valueLabel || (secondaryLabel && secondaryValue !== undefined)) && (
        <div className="mt-2 flex items-center gap-3 text-xs">
          {valueLabel && (
            <div className="bg-gray-50 px-2 py-1 rounded">
              <div className="text-gray-500">{valueLabel}</div>
              <div className="font-semibold text-gray-800">{value}</div>
            </div>
          )}
          {secondaryLabel && secondaryValue !== undefined && (
            <div className="bg-gray-50 px-2 py-1 rounded">
              <div className="text-gray-500">{secondaryLabel}</div>
              <div className="font-semibold text-gray-800">{secondaryValue}</div>
            </div>
          )}
        </div>
      )}
      {formula && (
        <div className="text-xs text-gray-400 mt-0.5">{formula}</div>
      )}
      {subtitle && (
        <p className="text-xs text-gray-600 mt-1">{subtitle}</p>
      )}
      {/* Breakdown by module: BOT / POS / Total */}
      {breakdown && (
        <div className="mt-2 text-xs text-gray-600 grid grid-cols-3 gap-2">
          {(() => {
            const renderCell = (key, label) => {
              const val = breakdown[key];
              if (val && typeof val === 'object') {
                const pend = val.pending ?? 0;
                const res = val.resolved ?? 0;
                return (
                  <div key={key} className="text-center bg-gray-50 p-1 rounded">
                    <div className="text-xs text-gray-500">{label}</div>
                    <div className="mt-1">
                      <span className="font-semibold text-orange-600 mr-2">{pend}</span>
                      <span className="text-gray-400">/</span>
                      <span className="font-semibold text-green-600 ml-2">{res}</span>
                    </div>
                    <div className="text-[10px] text-gray-500 mt-1">Pend / Res</div>
                  </div>
                );
              }
              return (
                <div key={key} className="text-center bg-gray-50 p-1 rounded">
                  {label}<br/>
                  <span className="font-semibold text-gray-800">{val ?? 0}</span>
                </div>
              );
            };

            return [renderCell('BOT', 'BOT'), renderCell('POS', 'POS'), renderCell('Total', 'Total')];
          })()}
        </div>
      )}
      {/* Mini donut (top-right) */}
      {donutPercent !== undefined && (
        <div className="absolute top-3 right-3 w-10 h-10">
          <svg viewBox="0 0 36 36" className="w-10 h-10">
            <path d="M18 2.0845a15.9155 15.9155 0 1 0 0 31.831A15.9155 15.9155 0 1 0 18 2.0845" fill="#f3f4f6" />
            <path
              stroke="#754bde"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={`${donutPercent} ${100 - donutPercent}`}
              d="M18 2.0845a15.9155 15.9155 0 1 0 0 31.831A15.9155 15.9155 0 1 0 18 2.0845"
            />
            <text x="18" y="20" textAnchor="middle" fontSize="6" fill="#111827">{`${Math.round(donutPercent)}%`}</text>
          </svg>
        </div>
      )}

      {/* Sparkline */}
      {sparklineData && Array.isArray(sparklineData) && sparklineData.length > 0 && (
        <div className="mt-3">
          <Sparkline data={sparklineData} width={120} height={32} stroke="#754bde" />
        </div>
      )}

      {/* Progress bar for target-based KPIs */}
      {progressPercent !== undefined && (
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className={`h-2 rounded-full`} style={{ width: `${Math.max(0, Math.min(100, progressPercent))}%`, background: progressPercent >= 75 ? '#16a34a' : progressPercent >= 50 ? '#f59e0b' : '#ef4444' }} />
          </div>
          <div className="text-xs text-gray-500 mt-1">{Math.round(progressPercent)}% objetivo</div>
        </div>
      )}
      
      {isClickable && (
        <div className="absolute bottom-2 right-2 text-gray-400 hover:text-[#754bde] transition-colors">
          <ChevronRight className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}

function Sparkline({ data, width = 120, height = 32, stroke = '#666' }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline fill="none" stroke={stroke} strokeWidth="2" points={points} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
