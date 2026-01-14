import React, { useState } from 'react';
import QualityModal from '../QualityModal';

export default function OverviewWire({ sampleData }) {
  const [open, setOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('Detalles');

  const openModal = (title) => {
    setModalTitle(title);
    setOpen(true);
  };

  const bugs = sampleData?.bugs || [];

  return (
    <div className="executive-card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Overview Ejecutivo (Wireframe)</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <div className="font-medium mb-2">KPICard (Bugs críticos)</div>
          <button className="mt-2 text-sm text-blue-600" onClick={() => openModal('Bugs críticos')}>Ver detalles</button>
        </div>

        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <div className="font-medium mb-2">KPICard (MTTR)</div>
          <button className="mt-2 text-sm text-blue-600" onClick={() => openModal('MTTR')}>Ver detalles</button>
        </div>

        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <div className="font-medium mb-2">KPICard (Readiness %)</div>
          <button className="mt-2 text-sm text-blue-600" onClick={() => openModal('Readiness')}>Ver detalles</button>
        </div>

        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <div className="font-medium mb-2">KPICard (Tendencia)</div>
          <button className="mt-2 text-sm text-blue-600" onClick={() => openModal('Tendencia')}>Ver detalles</button>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        Este wireframe sirve como placeholder para el Overview. Cada KPICard abre un modal con la lista de bugs relevantes.
      </div>

      <QualityModal title={modalTitle} bugs={bugs} open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
