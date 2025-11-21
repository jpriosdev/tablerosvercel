/**
 * UnderConstructionCard Component
 * 
 * Wrapper para fichas que usan datos ficticios o no están completamente implementadas.
 * Muestra icono de construcción y fondo azul.
 */

import React from 'react';
import { Construction } from 'lucide-react';

export default function UnderConstructionCard({ 
  title, 
  value, 
  icon,
  subtitle,
  children,
  onClick,
  className = ''
}) {
  return (
    <div className={`
      kpi-card relative border-2 border-blue-200 bg-blue-50 
      opacity-80 cursor-not-allowed px-3 py-2.5
      ${onClick ? 'cursor-pointer hover:opacity-90 hover:shadow-lg transition-all' : ''}
      ${className}
    `}
    onClick={onClick}
    >
      {/* Badge de Construction */}
      <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full p-1">
        <Construction className="w-3 h-3" />
      </div>

      {/* Content */}
      <div className="flex items-center justify-between mb-1">
        <div className="p-1 rounded-lg bg-blue-100 text-blue-600">
          {icon}
        </div>
        <span className="text-xs font-semibold text-blue-600 bg-white px-1.5 py-0 rounded">
          En desarrollo
        </span>
      </div>

      {/* Title */}
      <h3 className="text-xs font-semibold text-gray-700 mb-0.5 line-through leading-tight">
        {title}
      </h3>

      {/* Value or Children */}
      {children ? (
        children
      ) : (
        <>
          <div className="mb-1.5">
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold text-blue-400">
                {value}
              </span>
            </div>
            {subtitle && (
              <p className="text-xs text-gray-600 mt-0.5 leading-tight">{subtitle}</p>
            )}
          </div>

          {/* Placeholder Bar */}
          <div className="mb-1">
            <div className="bg-white bg-opacity-50 rounded-full h-1 overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-blue-300 to-blue-100 animate-pulse" />
            </div>
          </div>
        </>
      )}

    </div>
  );
}
