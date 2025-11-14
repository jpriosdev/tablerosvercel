// pages/config-dashboard.js
import { useState, useEffect } from 'react';

export default function ConfigDashboard() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/config')
      .then(r => r.json())
      .then(data => {
        setConfig(data);
        setLoading(false);
      });
  }, []);

  const saveConfig = async () => {
    try {
      await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      alert('Configuración guardada ✅');
    } catch (error) {
      alert('Error guardando configuración ❌');
    }
  };

  if (loading) return <div>Cargando configuración...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Configuración del Dashboard</h1>
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Pesos de KPIs</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tasa de Resolución</label>
            <input 
              type="number" 
              step="0.01" 
              min="0" 
              max="1"
              value={config.weights.resolutionRate}
              onChange={(e) => setConfig({
                ...config,
                weights: { ...config.weights, resolutionRate: parseFloat(e.target.value) }
              })}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Cobertura de Pruebas</label>
            <input 
              type="number" 
              step="0.01" 
              min="0" 
              max="1"
              value={config.weights.testCoverage}
              onChange={(e) => setConfig({
                ...config,
                weights: { ...config.weights, testCoverage: parseFloat(e.target.value) }
              })}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Umbrales de Alerta</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Bugs Críticos Máximo</label>
            <input 
              type="number" 
              value={config.thresholds.criticalBugsAlert}
              onChange={(e) => setConfig({
                ...config,
                thresholds: { ...config.thresholds, criticalBugsAlert: parseInt(e.target.value) }
              })}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Cobertura Mínima (%)</label>
            <input 
              type="number" 
              value={config.thresholds.minTestCoverage}
              onChange={(e) => setConfig({
                ...config,
                thresholds: { ...config.thresholds, minTestCoverage: parseInt(e.target.value) }
              })}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>
      </div>

      <button 
        onClick={saveConfig}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Guardar Configuración
      </button>
    </div>
  );
}
