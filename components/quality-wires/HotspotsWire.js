import React, { useState } from 'react';
import QualityModal from '../QualityModal';

export default function HotspotsWire({ sampleData }) {
  const [open, setOpen] = useState(false);
  const bugs = sampleData?.bugs || [];

  return (
    <div className="executive-card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Hotspots & Root Cause (Wireframe)</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-2">Pareto - Top componentes</h4>
          <div className="text-sm text-gray-600">Bar chart placeholder: componentes con más bugs</div>
          <button className="mt-3 text-sm text-blue-600" onClick={() => setOpen(true)}>Ver detalles</button>
        </div>

        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-2">Sunburst / Distribución por tipo</h4>
          <div className="text-sm text-gray-600">Interacción: click filtra KPIs y abre `DetailModal`</div>
          <button className="mt-3 text-sm text-blue-600" onClick={() => setOpen(true)}>Ver detalles</button>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">Acciones rápidas: "Crear ticket", "Asignar dueño" y "Marcar mitigación"</div>

      <QualityModal title="Hotspots - Detalles" bugs={bugs} open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
