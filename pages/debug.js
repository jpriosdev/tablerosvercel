// pages/debug.js
import { useState, useEffect } from 'react';

export default function DebugPage() {
  const [qaData, setQaData] = useState(null);
  const [config, setConfig] = useState(null);
  const [processed, setProcessed] = useState(null);

  useEffect(() => {
    // Cargar datos
    Promise.all([
      fetch('/api/qa-data').then(r => r.json()),
      fetch('/api/config').then(r => r.json())
    ]).then(([data, cfg]) => {
      setQaData(data);
      setConfig(cfg);
      
      // Procesar datos
      import('../utils/dataProcessor').then(({ QADataProcessor }) => {
        const result = QADataProcessor.processQAData(data, cfg);
        setProcessed(result);
      });
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Debug Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Datos Raw</h2>
          <pre className="text-xs overflow-auto h-64 bg-gray-100 p-2 rounded">
            {JSON.stringify(qaData, null, 2)}
          </pre>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Configuración</h2>
          <pre className="text-xs overflow-auto h-64 bg-gray-100 p-2 rounded">
            {JSON.stringify(config, null, 2)}
          </pre>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Datos Procesados</h2>
          <pre className="text-xs overflow-auto h-64 bg-gray-100 p-2 rounded">
            {JSON.stringify(processed, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
