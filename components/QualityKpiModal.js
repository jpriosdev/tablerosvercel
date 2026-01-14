import React, { useMemo, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function QualityKpiModal({ metricKey, title = 'Detalle KPI', sourceData = {}, open, onClose }) {
  const [selectedModule, setSelectedModule] = useState('Todos');

  // Evitar scroll del fondo cuando el modal está abierto
  React.useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  const bugs = Array.isArray(sourceData.bugs) ? sourceData.bugs : [];
  const modules = ['Todos', 'POS', 'BOT', 'Otros'];

  const filtered = useMemo(() => {
    if (!bugs) return [];
    if (selectedModule === 'Todos') return bugs;
    if (selectedModule === 'Otros') return bugs.filter(b => {
      const m = (b.module || '').toUpperCase();
      return m !== 'POS' && m !== 'BOT';
    });
    return bugs.filter(b => (b.module || '').toUpperCase() === selectedModule);
  }, [bugs, selectedModule]);

  const aggregates = useMemo(() => {
    const byPriority = {};
    let pending = 0;
    let resolved = 0;
    const moduleCounts = { BOT: 0, POS: 0, Otros: 0 };
    const moduleBreakdown = { BOT: { pending: 0, resolved: 0 }, POS: { pending: 0, resolved: 0 }, Otros: { pending: 0, resolved: 0 } };

    for (const b of filtered) {
      const p = b.priority || 'Medio';
      byPriority[p] = (byPriority[p] || 0) + 1;

      const fixed = b.fixed_in_sprint && b.fixed_in_sprint !== 'No encontrado' && b.fixed_in_sprint !== '';
      const st = (b.status || '').toString().toLowerCase();
      const isResolved = fixed || st.includes('resuelto') || st.includes('cerr') || st.includes('fixed') || st.includes('closed');
      if (isResolved) resolved += 1; else pending += 1;

      const mRaw = (b.module || '').toUpperCase();
      const m = mRaw === 'BOT' ? 'BOT' : mRaw === 'POS' ? 'POS' : 'Otros';
      if (m === 'BOT') moduleCounts.BOT += 1;
      else if (m === 'POS') moduleCounts.POS += 1;
      else moduleCounts.Otros += 1;

      if (isResolved) moduleBreakdown[m].resolved += 1; else moduleBreakdown[m].pending += 1;
    }

    return { total: filtered.length, byPriority, pending, resolved, moduleCounts, moduleBreakdown };
  }, [filtered]);

  // Serie de tendencia: usar sourceData.sprintData si existe, si no derivar desde los bugs filtrados
  const trendSeries = useMemo(() => {
    const sprints = sourceData.sprintData || sourceData.trends || [];
    if (Array.isArray(sprints) && sprints.length) {
      const labels = sprints.map(s => s.sprint || s.name || s.label || String(s.id || ''));
      const values = sprints.map(s => s.bugs || s.bugCount || s.count || 0);
      return { labels, values };
    }

    // Derivar desde filtered (agrupar por campo sprint si existe)
    const bySprint = {};
    for (const b of filtered) {
      const sp = b.sprint || b.sprintName || b.sprint_id || 'Sin sprint';
      bySprint[sp] = (bySprint[sp] || 0) + 1;
    }
    const labels = Object.keys(bySprint);
    const values = labels.map(l => bySprint[l]);
    return { labels, values };
  }, [sourceData, filtered]);

  if (!open) return null;

  const metricTitleMap = {
    defectDensity: 'Densidad de Defectos',
    testEfficiency: 'Eficiencia de Pruebas',
    bugLeakage: 'Tasa de Fuga',
    testAutomation: 'Automatización',
    codeCoverage: 'Cobertura de Código',
    cycleTime: 'Tiempo de Ciclo'
  };

  const metricTitle = metricTitleMap[metricKey] || title;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose} />

      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-5xl mx-3 max-h-[90vh] overflow-auto">
        <div className="flex items-start justify-between px-6 py-4 border-b">
          <div>
            <h3 className="text-lg font-semibold">{metricTitle}</h3>
            <div className="text-sm text-gray-600">Fuente: {sourceData.source || 'qa-data.json'}</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-700 text-right">
              <div className="text-xs text-gray-500">Filtrados</div>
              <div className="font-bold">{aggregates.total}</div>
            </div>
            <div className="text-sm text-gray-700 text-right">
              <div className="text-xs text-gray-500">Pendientes</div>
              <div className="font-bold text-orange-600">{aggregates.pending}</div>
            </div>
            <div className="text-sm text-gray-700 text-right">
              <div className="text-xs text-gray-500">Resueltos</div>
              <div className="font-bold text-green-600">{aggregates.resolved}</div>
            </div>
            <button onClick={onClose} className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">Cerrar</button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            {modules.map(m => (
              <button
                key={m}
                onClick={() => setSelectedModule(m)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${selectedModule===m? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                {m} {m === 'Todos' ? `(${aggregates.total})` : m === 'BOT' ? `(${aggregates.moduleCounts.BOT})` : m === 'POS' ? `(${aggregates.moduleCounts.POS})` : `(${aggregates.moduleCounts.Otros})`}
              </button>
            ))}
            <div className="ml-auto text-sm text-gray-600">Última actualización: {sourceData.lastUpdated ? sourceData.lastUpdated : '—'}</div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Visión rápida</h4>
                <div className="flex gap-6 items-center">
                  <div>
                    <div className="text-xs text-gray-500">Total</div>
                    <div className="text-2xl font-bold">{aggregates.total}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Pendientes</div>
                    <div className="text-xl font-semibold text-orange-600">{aggregates.pending}</div>
                  </div>
                  <div>
                      <div className="text-xs text-gray-500">Resueltos</div>
                      <div className="text-xl font-semibold text-green-600">{aggregates.resolved}</div>
                  </div>
                    <div className="flex-1 text-sm text-gray-600">Descripción: {sourceData.description || 'Detalle y análisis por métrica.'}</div>
                </div>
              </div>
                  <div className="p-3 mt-3 bg-gray-50 rounded-lg">
                    <h5 className="text-sm font-medium mb-2">Desglose por Módulo (Pend / Res)</h5>
                    <div className="grid grid-cols-3 gap-2 text-sm text-gray-700">
                      <div className="text-center">
                        <div className="text-xs text-gray-500">BOT</div>
                        <div className="font-semibold text-orange-600">{aggregates.moduleBreakdown.BOT.pending}</div>
                        <div className="font-semibold text-green-600">{aggregates.moduleBreakdown.BOT.resolved}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500">POS</div>
                        <div className="font-semibold text-orange-600">{aggregates.moduleBreakdown.POS.pending}</div>
                        <div className="font-semibold text-green-600">{aggregates.moduleBreakdown.POS.resolved}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500">Otros</div>
                        <div className="font-semibold text-orange-600">{aggregates.moduleBreakdown.Otros.pending}</div>
                        <div className="font-semibold text-green-600">{aggregates.moduleBreakdown.Otros.resolved}</div>
                      </div>
                    </div>

                    {/* Gráfico de barras sencillo: totales por módulo */}
                    {(() => {
                      const botTotal = (aggregates.moduleBreakdown.BOT.pending || 0) + (aggregates.moduleBreakdown.BOT.resolved || 0);
                      const posTotal = (aggregates.moduleBreakdown.POS.pending || 0) + (aggregates.moduleBreakdown.POS.resolved || 0);
                      const otrosTotal = (aggregates.moduleBreakdown.Otros.pending || 0) + (aggregates.moduleBreakdown.Otros.resolved || 0);

                      const chartData = {
                        labels: ['BOT', 'POS', 'Otros'],
                        datasets: [
                          {
                            label: 'Total Bugs',
                            data: [botTotal, posTotal, otrosTotal],
                            backgroundColor: ['#f97316', '#3b82f6', '#9ca3af']
                          }
                        ]
                      };

                      const options = {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false },
                          title: { display: false }
                        },
                        scales: {
                          x: { grid: { display: false } },
                          y: { beginAtZero: true }
                        }
                      };

                      return (
                        <div className="mt-4 h-44">
                          <Bar data={chartData} options={options} />
                        </div>
                      );
                    })()}
                  </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Tendencia / Gráfico</h4>
                <div className="h-40">
                  {trendSeries.labels && trendSeries.labels.length > 0 ? (
                    <Line
                      data={{
                        labels: trendSeries.labels,
                        datasets: [
                          {
                            label: 'Bugs',
                            data: trendSeries.values,
                            borderColor: '#3b82f6',
                            backgroundColor: 'rgba(59,130,246,0.2)',
                            tension: 0.35,
                            fill: true,
                            pointRadius: 3
                          }
                        ]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: { x: { grid: { display: false } }, y: { beginAtZero: true } }
                      }}
                    />
                  ) : (
                    <div className="h-40 bg-gray-50 rounded flex items-center justify-center text-sm text-gray-500">Sin datos de tendencia</div>
                  )}
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Top {Math.min(50, aggregates.total)} items</h4>
                <div className="overflow-auto max-h-80">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-gray-500 border-b">
                        <th className="py-2">ID</th>
                        <th className="py-2">Prioridad</th>
                        <th className="py-2">Módulo</th>
                        <th className="py-2">Estado</th>
                        <th className="py-2">Resumen</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.slice(0,50).map(b => (
                        <tr key={b.id} className="border-b hover:bg-gray-50">
                          <td className="py-2 font-medium">{b.bug_key || b.id}</td>
                          <td className="py-2">{b.priority || '—'}</td>
                          <td className="py-2">{b.module || 'Otros'}</td>
                          <td className="py-2">{b.status || 'N/A'}</td>
                          <td className="py-2 text-gray-700">{(b.summary || '').slice(0,120)}</td>
                        </tr>
                      ))}
                      {filtered.length === 0 && (
                        <tr><td colSpan={5} className="py-4 text-center text-gray-500">No hay registros</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Aside eliminado: resumen integrado en la parte superior para reducir espacio */}
          </div>
        </div>
      </div>
    </div>
  );
}
