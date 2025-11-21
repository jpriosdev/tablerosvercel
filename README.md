# Dashboard Ejecutivo QA

Dashboard de control de calidad y trazabilidad del proceso de pruebas para directores de tecnología.

## 🚀 Características

- **Control Metodológico**: Métricas de proceso y calidad
- **Trazabilidad Completa**: Seguimiento desde detección hasta resolución
- **Análisis por Equipos**: Productividad y distribución de carga
- **Recomendaciones Ejecutivas**: Acciones específicas para la dirección
- **ROI Cuantificado**: Impacto financiero del proceso QA
- **Arquitectura Optimizada**: Backend con caché y fallback de datos

## 📊 Funcionalidades

### Resumen Ejecutivo
- KPIs críticos de calidad
- Tendencias por sprint
- Matriz de riesgo por prioridad
- Análisis por módulos

### Métricas de Calidad
- Densidad de defectos
- Eficiencia de pruebas
- Cobertura de automatización
- Tiempo de ciclo

### Análisis de Equipos
- Distribución de carga por desarrollador
- Eficiencia de resolución
- Recomendaciones de balanceo

### Tendencias
- Evolución de bugs por sprint
- Tasa de resolución
- Distribución por categorías

### Recomendaciones
- Plan de acción ejecutivo
- Métricas de seguimiento
- ROI del proceso QA

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Gráficos**: Chart.js, Recharts
- **Iconos**: Lucide React
- **Fechas**: date-fns
- **Animaciones**: Framer Motion
- **Data Loading**: Custom ESM/CJS loader with 5-min cache & fallback data

## 🏗️ Arquitectura

### Backend Data Layer
```
pages/api/qa-data.js
    ↓
lib/qaDataLoader.js (NEW - Centralized)
    ├─ Attempts JSON (public/data/qa-data.json)
    ├─ Falls back to Excel (data/Reporte_QA_V1.xlsx)
    ├─ Built-in seed data as final fallback
    └─ 5-minute caching for performance
```

**Benefits:**
- **Single Source**: All QA data flows through `qaDataLoader`
- **Resilient**: Multiple data sources with graceful degradation
- **Performant**: 5-minute in-memory cache prevents file I/O on every request
- **Maintainable**: Complex loading logic isolated from API handlers

### Frontend Components
```
ExecutiveDashboard (pages/index.js)
    ├─ RiskMatrix.js          (enhanced UX, a11y, responsive)
    ├─ SprintTrendChart.js    (optimized visuals, multi-axis)
    ├─ ModuleAnalysis.js
    ├─ QualityMetrics.js
    └─ ExecutiveRecommendations.js
```

## ⚙️ Configuración

El dashboard puede configurarse mediante el archivo `config/qa-config.json`:

```json
{
  "autoRefresh": true,        // Actualización automática habilitada por defecto
  "refreshInterval": 300000,  // Intervalo de actualización en ms (5 minutos)
  "useParametricMode": true,  // Usar modo paramétrico (true) o legacy (false)
  "weights": { ... },         // Pesos para cálculo de métricas
  "thresholds": { ... }       // Umbrales para alertas
}
```

### Parámetros de Configuración

- **autoRefresh** (boolean): Activa/desactiva la actualización automática de datos
  - `true`: Los datos se actualizan automáticamente cada refreshInterval
  - `false`: Los datos solo se actualizan manualmente
  - Por defecto: `true`

- **refreshInterval** (number): Tiempo en milisegundos entre actualizaciones automáticas
  - Por defecto: `300000` (5 minutos)
  - Rango recomendado: 60000 (1 min) - 600000 (10 min)

- **useParametricMode** (boolean): Define el modo de procesamiento de datos
  - `true`: Modo paramétrico con configuración dinámica (recomendado)
  - `false`: Modo legacy con lógica fija
  - Por defecto: `true`

### Recomendaciones Paramétricas

El dashboard lee recomendaciones desde el archivo **`public/data/recommendations.json`**. Este archivo puede ser:

1. **Editado manualmente** (formato JSON)
2. **Generado desde Excel** usando el script de conversión

**Actualizar Recomendaciones desde Excel:**

1. **Crear archivo Excel** con hoja llamada **"Recomendaciones"**:

| Metrica | Condicion | Recomendacion | Prioridad |
|---------|-----------|---------------|-----------|
| testCases | avg >= 200 | Excelente cobertura: El equipo mantiene un volumen robusto de testing | baja |
| resolutionEfficiency | efficiency < 70 | Eficiencia baja: Analizar causas de bugs no resueltos | alta |

2. **Convertir Excel a JSON**:

```bash
# Método 1: Script independiente
node scripts/excel-to-recommendations.js ./data/Recomendaciones.xlsx

# Método 2: Incluir en Excel principal (agregar hoja "Recomendaciones")
node scripts/update-excel-data.js
```

El script generará automáticamente `public/data/recommendations.json`.

**Métricas disponibles:**
- `testCases`: Media de casos ejecutados por sprint
- `resolutionEfficiency`: Eficiencia de resolución
- `criticalBugs`: Bugs críticos detectados
- `criticalBugsStatus`: Estado de bugs críticos
- `cycleTime`: Cycle Time promedio
- `defectDensity`: Defect Density por HU

**Condiciones:**
- Expresiones JavaScript evaluables (ej: `avg >= 200`, `total > 30`, `pending === 0`)
- `default`: Se aplica siempre (para recomendaciones generales)
- Variables disponibles por métrica: ver [RECOMENDACIONES_ESTRUCTURA.md](./RECOMENDACIONES_ESTRUCTURA.md)

**Prioridades:**
- `alta`: 🚨 Requiere atención urgente
- `media`: ⚠️ Importante pero no crítico
- `baja`: ✅ Informativo o buenas prácticas

Si no existe la hoja "Recomendaciones", el sistema usa valores por defecto integrados.

## 📦 Instalación

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/qa-executive-dashboard.git
cd qa-executive-dashboard

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
npm start
