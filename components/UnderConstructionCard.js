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
  className = ''
}) {
  return (
    <div className={`
      kpi-card relative border-2 border-blue-200 bg-blue-50 
      opacity-80 cursor-not-allowed
      ${className}
    `}>
      {/* Badge de Construction */}
      <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1.5">
        <Construction className="w-4 h-4" />
      </div>

      {/* Content */}
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
          {icon}
        </div>
        <span className="text-xs font-semibold text-blue-600 bg-white px-2 py-1 rounded">
          En desarrollo
        </span>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-gray-700 mb-3 line-through">
        {title}
      </h3>

      {/* Value or Children */}
      {children ? (
        children
      ) : (
        <>
          <div className="mb-4">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold text-blue-400">
                {value}
              </span>
            </div>
            {subtitle && (
              <p className="text-xs text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>

          {/* Placeholder Bar */}
          <div className="mb-3">
            <div className="bg-white bg-opacity-50 rounded-full h-2 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-300 to-blue-100 animate-pulse" />
            </div>
          </div>
        </>
      )}

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-blue-200 border-opacity-50">
        <p className="text-xs text-blue-600 font-medium">
          ⚠️ Esta métrica aún está en desarrollo y usa datos de demostración.
        </p>
      </div>
    </div>
  );
}
