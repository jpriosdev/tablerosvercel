import React, { useState } from 'react';
import QualityModal from '../QualityModal';

export default function ReadinessWire({ sampleData }) {
  const [open, setOpen] = useState(false);
  const bugs = sampleData?.bugs || [];

  return (
    <div className="executive-card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Release Readiness (Wireframe)</h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 p-4 bg-white rounded-lg border border-gray-200">
          <div className="mb-4">`QualityRadarChart` placeholder</div>
          <div className="text-sm text-gray-600">Checklist de readiness (tests críticos, QA signoffs, blockers)</div>
          <button className="mt-3 text-sm text-blue-600" onClick={() => setOpen(true)}>Ver detalles</button>
        </div>

        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-2">Blockers</h4>
          <div className="text-sm text-gray-600">Lista corta de blockers con acciones rápidas (Asignar, Mitigar)</div>
          <button className="mt-3 text-sm text-blue-600" onClick={() => setOpen(true)}>Ver detalles</button>
        </div>
      </div>

      <QualityModal title="Readiness - Detalles" bugs={bugs} open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
