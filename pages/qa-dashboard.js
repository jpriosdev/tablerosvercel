// pages/qa-dashboard.js
import { useState } from 'react';
import ExecutiveDashboard from '../components/ExecutiveDashboard';

export default function QADashboardPage() {
  const [mode, setMode] = useState('parametric');

  return (
    <div>
      {/* Control de modo */}
      <div className="fixed top-4 right-4 z-50 bg-white p-3 rounded-lg shadow-lg border">
        <div className="text-sm font-medium text-gray-700 mb-2">Modo:</div>
        <label className="flex items-center mb-2">
          <input 
            type="radio" 
            value="parametric" 
            checked={mode === 'parametric'}
            onChange={(e) => setMode(e.target.value)}
            className="mr-2"
          />
          <span className="text-sm">Paramétrico</span>
        </label>
        <label className="flex items-center">
          <input 
            type="radio" 
            value="legacy" 
            checked={mode === 'legacy'}
            onChange={(e) => setMode(e.target.value)}
            className="mr-2"
          />
          <span className="text-sm">Legacy</span>
        </label>
      </div>

      <ExecutiveDashboard 
        enableParametricMode={mode === 'parametric'}
        dataSource="/api/qa-data"
        configSource="/api/config"
        refreshInterval={300000}
      />
    </div>
  );
}

