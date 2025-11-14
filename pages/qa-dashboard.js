// pages/qa-dashboard.js
import { useState } from 'react';
import ExecutiveDashboard from '../components/ExecutiveDashboard';

export default function QADashboardPage() {
  const [mode, setMode] = useState('parametric'); // 'parametric' o 'static'

  return (
    <div>
      {/* Selector de modo (opcional, para testing) */}
      <div className="fixed top-4 right-4 z-50">
        <select 
          value={mode} 
          onChange={(e) => setMode(e.target.value)}
          className="px-3 py-1 text-sm border rounded-lg bg-white shadow"
        >
          <option value="parametric">Modo Paramétrico</option>
          <option value="static">Modo Estático</option>
        </select>
      </div>

      <ExecutiveDashboard 
        enableParametricMode={mode === 'parametric'}
        dataSource="/api/qa-data"
        configSource="/api/config"
        refreshInterval={300000} // 5 minutos
      />
    </div>
  );
}
