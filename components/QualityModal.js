import React, { useMemo, useState } from 'react';

export default function QualityModal({ title = 'Detalles', bugs = [], open, onClose }) {
  const [selectedModule, setSelectedModule] = useState('Todos');

  const modules = ['Todos', 'POS', 'BOT', 'Otros'];

  const filtered = useMemo(() => {
    if (!bugs || !Array.isArray(bugs)) return [];
    if (selectedModule === 'Todos') return bugs;
    if (selectedModule === 'Otros') return bugs.filter(b => b.module !== 'POS' && b.module !== 'BOT');
    return bugs.filter(b => (b.module || '').toUpperCase() === selectedModule);
  }, [bugs, selectedModule]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose} />

      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-3xl mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">Cerrar</button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-3">
            {modules.map(m => (
              <button
                key={m}
                onClick={() => setSelectedModule(m)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${selectedModule===m? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                {m}
              </button>
            ))}
            <div className="ml-auto text-sm text-gray-600">Resultados: {filtered.length}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              {filtered.slice(0, 10).map(b => (
                <div key={b.id} className="p-3 border rounded-lg">
                  <div className="text-sm font-medium">{b.bug_key} — {b.priority}</div>
                  <div className="text-sm text-gray-600">{b.summary}</div>
                  <div className="text-xs text-gray-500 mt-1">Módulo: {b.module || 'N/A'} · Estado: {b.status || 'N/A'}</div>
                </div>
              ))}
            </div>

            <div className="p-3 border rounded-lg bg-gray-50">
              <h4 className="font-medium text-gray-900 mb-2">Resumen</h4>
              <div className="text-sm text-gray-700">Total en filtro: {filtered.length}</div>
              <div className="text-sm text-gray-700">Por prioridad:</div>
              <ul className="text-sm text-gray-600 list-disc pl-5">
                {['Más alta','Alta','Medio','Baja'].map(p => (
                  <li key={p}>{p}: {filtered.filter(x => x.priority===p).length}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
