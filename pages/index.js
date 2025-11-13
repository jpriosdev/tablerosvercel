import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import ExecutiveDashboard from '../components/ExecutiveDashboard';
import { processQAData } from '../utils/dataProcessor';

export default function Home() {
  const [qaData, setQaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [error, setError] = useState(null);

  const fetchQAData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/qa-data');
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const rawData = await response.json();
      const processedData = processQAData(rawData);
      
      setQaData(processedData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching QA data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQAData();
    
    const interval = setInterval(fetchQAData, 1800000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !qaData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner w-12 h-12 border-4 border-executive-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando Dashboard Ejecutivo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar datos</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchQAData}
            className="px-4 py-2 bg-executive-600 text-white rounded-lg hover:bg-executive-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ExecutiveDashboard 
        data={qaData} 
        lastUpdated={lastUpdated}
        onRefresh={fetchQAData}
        loading={loading}
      />
    </div>
  );
}
