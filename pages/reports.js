// pages/reports.js
import { useState } from 'react';

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('summary');

  const reports = [
    { id: 'summary', name: 'Resumen Ejecutivo', description: 'Visión general del QA' },
    { id: 'metrics', name: 'Métricas de Calidad', description: 'Análisis de métricas' },
    { id: 'trends', name: 'Tendencias', description: 'Análisis de tendencias en el tiempo' },
    { id: 'issues', name: 'Problemas Detectados', description: 'Listado de issues' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Reportes</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {reports.map((report) => (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedReport === report.id
                  ? 'border-executive-500 bg-executive-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <h3 className="font-semibold text-gray-900 mb-1">{report.name}</h3>
              <p className="text-sm text-gray-600">{report.description}</p>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {reports.find(r => r.id === selectedReport)?.name}
          </h2>
          
          <div className="text-center py-12">
            <p className="text-gray-600">Contenido del reporte: {selectedReport}</p>
            <p className="text-sm text-gray-500 mt-2">Los datos se cargarán aquí según el reporte seleccionado.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
