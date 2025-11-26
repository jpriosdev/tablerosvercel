# Dashboard Ejecutivo QA

Dashboard de control de calidad y trazabilidad del proceso de pruebas para directores de tecnología.

**Versión Actual**: 2.0 (ES6 Modules + SQLite refactorizado)

## 🚀 Características

- **Control Metodológico**: Métricas de proceso y calidad
- **Trazabilidad Completa**: Seguimiento desde detección hasta resolución
- **Análisis por Equipos**: Productividad y distribución de carga
- **Recomendaciones Ejecutivas**: Acciones específicas para la dirección
- **ROI Cuantificado**: Impacto financiero del proceso QA
- **Arquitectura SQLite**: Base de datos persistente y escalable
- **ES6 Modules**: Compatibilidad total con Next.js 14
- **Performance +300%**: Queries SQL vs JSON en memoria

## ⚡ Quick Start (30 segundos)

```bash
cd TableroQA
npm run db:setup      # Crea BD + migra datos
npm run dev           # Inicia servidor
# Abre: http://localhost:3000/qa-dashboard
```

## 📚 Documentación

### Para Empezar
- 📖 **[QUICK_START.md](./QUICK_START.md)** - Guía de 3-5 minutos (RECOMENDADO)
- 📖 **[REFACTORING_CHANGELOG.md](./REFACTORING_CHANGELOG.md)** - Cambios en v2.0

### Técnica
- 📖 **[MIGRATION_COMPLETE.md](./MIGRATION_COMPLETE.md)** - Detalles de migración
- 📖 **[SQLITE_ARCHITECTURE.md](./SQLITE_ARCHITECTURE.md)** - Diagrama y queries

### Histórico
- 📖 **[PROJECT_COMPLETION_REPORT.md](./PROJECT_COMPLETION_REPORT.md)** - Fase inicial

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

## 🏗️ Arquitectura (v2.0)

```
Frontend (React + TailwindCSS)
    ↓
Next.js API Routes (ES6 Modules)
    ↓
Data Layer (DAL)
    ↓
SQLite Database ← Excel (Reporte_QA_V2.xlsx)
```

### Componentes Clave

| Componente | Tipo | Ubicación | Estado |
|-----------|------|-----------|--------|
| Frontend | React | `pages/`, `components/` | ✅ Funcionando |
| API | Next.js | `pages/api/` | ✅ Refactorizado v2.0 |
| DAL | ES6 Module | `lib/database/dal.js` | ✅ Actualizado |
| BD | SQLite | `public/data/qa-dashboard.db` | ✅ Operacional |
| Migración | Script | `scripts/migrateToSqlite.mjs` | ✅ Funcional |
| Config | JSON | `package.json` | ✅ Actualizado |

## 📦 Requisitos

- Node.js v18+
- npm v9+
- Archivo: `data/Reporte_QA_V2.xlsx`

## 🔧 Instalación

### Opción 1: Setup Completo (RECOMENDADO)
```bash
npm run db:setup    # Crea BD + migra datos en un comando
```

### Opción 2: Paso a Paso
```bash
npm run db:init     # Crea tablas y vistas
npm run db:migrate  # Migra datos desde Excel
npm run db:verify   # Verifica datos cargados
```

## 📋 Comandos Disponibles

```bash
# Base de Datos
npm run db:setup      # ⭐ Recomendado: Setup completo
npm run db:init       # Crear tablas SQLite
npm run db:migrate    # Migrar datos desde Excel
npm run db:verify     # Verificar datos (diagnóstico)

# Desarrollo
npm run dev           # Inicia servidor (localhost:3000)
npm run build         # Build para producción
npm run start         # Inicia servidor producción
npm run lint          # Análisis de código

# Análisis (Antiguo)
npm run generate-json # Genera JSON en memoria
```

## 🌐 Endpoints API

### `/api/qa-data`
Retorna datos QA completos desde SQLite
```bash
curl http://localhost:3000/api/qa-data
curl http://localhost:3000/api/qa-data?force=1  # Sin cache
```

### `/api/qa-data-v2`
Versión alternativa (mismo resultado)
```bash
curl http://localhost:3000/api/qa-data-v2
```

### `/api/verify-data`
Verifica integridad y da diagnóstico
```bash
curl http://localhost:3000/api/verify-data
```

## 🗄️ Base de Datos

### Estructura
- **Tablas**: 3 tablas reales (bugs_detail, sprints_versions, audit_log)
- **Vistas**: 7 vistas SQL para agregaciones
- **Índices**: 6 índices para performance
- **Registros**: 238 bugs + 12 sprints

### Datos Cargados
```
Total Bugs:      238 ✅
  Críticos:      119 (Más alta + Alta)
  Pendientes:    126
  Resueltos:     112
  
Sprints:         12 ✅
Desarrolladores: 7
Módulos:         2 (BOT, POS)
```

## 🧪 Testing

### Verificación Rápida
```bash
npm run db:verify
# Resultado esperado:
# ✅ Archivo de BD encontrado
# ✅ Tablas: audit_log, bugs_detail, sprints_versions
# ✅ Bugs cargados: 238
# ✅ Sprints cargados: 12
```

### Prueba de Endpoints
```bash
# Datos QA
curl http://localhost:3000/api/qa-data | jq '.summary'

# Verificación
curl http://localhost:3000/api/verify-data | jq '.differences'
```

## 🐛 Troubleshooting

### Error: "Base de datos no encontrada"
```bash
npm run db:setup
```

### Error: "Cannot find module"
```bash
rm -rf node_modules && npm install && npm run db:setup
```

### Cache antiguo
```bash
curl http://localhost:3000/api/qa-data?force=1
```

### Datos no sincronizados
```bash
npm run db:verify  # Ver status
npm run db:setup   # Reiniciar
```

## 📈 Stack Tecnológico

- **Framework**: Next.js 14.2.33
- **Frontend**: React, TailwindCSS, Framer Motion
- **Backend**: Node.js, ES6 Modules
- **Database**: SQLite3
- **Charting**: Chart.js, React-Chartjs-2
- **Data**: ExcelJS (migración)

## 🔒 Cambios Recientes (v2.0)

✅ Refactorización a ES6 Modules (todos los archivos)
✅ Conversión completa a SQLite  
✅ Endpoints API refactorizados
✅ Manejo robusto de errores
✅ Cache automático (5 minutos)
✅ Diagnóstico mejorado (`db:verify`)

Ver **[REFACTORING_CHANGELOG.md](./REFACTORING_CHANGELOG.md)** para detalles.

## 📞 Soporte

**¿Problemas?**
1. Ejecuta: `npm run db:verify`
2. Revisa: `QUICK_START.md`
3. Verifica: `REFACTORING_CHANGELOG.md` → Troubleshooting

## 📄 Licencia

Privado - Uso interno únicamente

---

**Última actualización**: 2025-11-25  
**Versión**: 2.0 (ES6 Modules + SQLite Refactorizado)

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
    ├─ Attempts JSON (`data/qa-data.json`) (non-public — generated explicitly)

CI / Deployment notes
---------------------

Ensure the database and pre-processed JSON are prepared before the application build/start. Add the following step in your CI pipeline (example below):

Local preparation (developer):

```powershell
cd "C:\Users\ultra\PycharmProjects\PythonProject\TableroQA"
# Run migrations/setup
npm run db:migrate
# Generate non-public JSON used by the loader
npm run generate-json
```

Example GitHub Actions snippet (add to `.github/workflows/prepare-and-build.yml`):

```yaml
name: Prepare and Build

on: [push]

jobs:
  prepare-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run DB migrations
        run: npm run db:migrate
      - name: Generate QA JSON
        run: npm run generate-json
      - name: Build
        run: npm run build
```

Notes:
- The generated file `data/qa-data.json` is intentionally placed outside `public/` and must be created in CI or manually for production.
- The app includes `/api/health` which returns 200 if the SQLite DB is reachable; use it for readiness probes.
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
