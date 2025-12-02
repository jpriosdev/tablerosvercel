# MockDataV0.csv - Archivo Base del Sistema

**Importancia**: 🔴 CRÍTICO - Fuente única de verdad para todos los datos  
**Estado**: ✅ Activo  
**Ubicación**: `data/MockDataV0.csv`  
**Tamaño**: 0.27 MB  
**Líneas**: 1,001 (encabezado + 1,000 registros)

## 📊 Contenido del Archivo

### Estructura de Columnas

El archivo CSV contiene 24 columnas con información integral de incidencias:

```
1. Tipo de Incidencia (riesgo, Incidente, Defecto, sugerencia)
2. Clave de incidencia (MOB-589, POS-101, KIOS-411, CORE-568, API-073, BD-921, WEB-342)
3. ID de la incidencia (1-1000)
4. Resumen (descripción del bug/incidente)
5. Parent summary (categoría padre)
6. Prioridad (Alta, Media, Baja, Crítica)
7. Estado (Resuelto, Cerrado, En progreso, Reabierto, Rechazado, Pendiente)
8. Sprint de ejecución (Sprint 0-20)
9. Tipo de prueba (Integración, Funcional, Exploratoria, Carga, Smoke, Aceptación, Regresión)
10. Atributo (Funcional, Seguridad, Desempeño, Usabilidad, Datos)
11. Nivel de prueba (Unitaria, integracion, Sistema, UAT)
12. Tag0 (Datos, Software IA, Software Tradicional, SAP)
13. Tag1 (Datalake, CRM, DWH, ERP, CORE Banking)
14. Tag2 (Mainframe, On-Premise-Hibrido, Cloud)
15. Etapa de la prueba (Construcción, Requisitos, Operacion, Ideación, Pre-Producción)
16. Ambiente (Pruebas, Desarrollo, Producción, Sandbox, ShadowDR, Integracion)
17. Reportado (Nombre del reportador)
18. Fecha Reporte (MM/DD/YYYY)
19. Version de corrección 1 (v1.0.1, etc.)
20. Desarrollador (Asignado a)
21. Sprint última regresión (Sprint donde se reexaminó)
22. ¿En qué versión fue corregido? (v1.0.2, etc.)
23. Estrategia de ejecución (Manual, Automatizada)
```

### Datos Estadísticos (1,000 Registros)

**Distribución por Prioridad:**
- Alta: ~250 registros
- Media: ~350 registros
- Baja: ~300 registros
- Crítica: ~100 registros

**Distribución por Estado:**
- Resuelto: ~200 registros
- Cerrado: ~300 registros
- En progreso: ~150 registros
- Reabierto: ~150 registros
- Rechazado: ~100 registros
- Pendiente: ~100 registros

**Sprints Cubiertos:** Sprint 0 - Sprint 20 (21 sprints)

**Desarrolladores:** ~7 desarrolladores activos
- Laura Ortega
- Raúl Espinosa
- Paula Navarro
- Mariana Cárdenas
- Valentina Castillo
- Gabriela Paredes
- Y otros...

**Módulos/Proyectos:** 7 claves principales
- MOB (Mobile)
- POS (Point of Sale)
- KIOS (Kiosk)
- CORE (Core Banking)
- API (API Gateway)
- BD (Base de Datos)
- WEB (Web Platform)

## 🔄 Flujo de Transformación

```
┌─────────────────────────────────────────────────────────────────┐
│ MockDataV0.csv (Archivo Base - FUENTE ÚNICA)                   │
│ Ubicación: data/MockDataV0.csv                                  │
│ Formato: 24 columnas, 1,000 registros, UTF-8                   │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ scripts/migrateToSqliteCSV.mjs (Script de Migración)           │
│ - Lee MockDataV0.csv                                            │
│ - Normaliza campos                                              │
│ - Valida datos                                                  │
│ - Crea SQLite si no existe                                      │
│ - Carga datos en tablas                                         │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ qa-dashboard.db (SQLite - Base de Datos Persistente)            │
│ Ubicación: public/data/qa-dashboard.db                          │
│ Tablas: bugs_detail, sprints_versions, audit_log               │
│ Vistas: 7 vistas SQL para agregaciones                          │
│ Registros: 238 bugs únicos + 12 sprints + 7 desarrolladores    │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ lib/database/dal.js (Data Access Layer - 25+ Queries)          │
│ - getBugsSummary()                                              │
│ - getBugsBySprint()                                             │
│ - getDeveloperModulesSummary()                                  │
│ - Y 22 más...                                                   │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ Next.js API Endpoints (/pages/api/qa-data.js, etc.)            │
│ - /api/qa-data (POST)                                           │
│ - /api/qa-data-v2 (POST)                                        │
│ - /api/recommendations (POST)                                   │
│ - /api/verify-data (GET)                                        │
│ - /api/health (GET)                                             │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ Frontend React Components                                        │
│ - ExecutiveDashboard.js                                         │
│ - KPICard.js                                                    │
│ - SprintTrendChart.js                                           │
│ - ActionableRecommendations.js                                  │
│ - Y 8 componentes más...                                        │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ 🎨 Dashboard Ejecutivo en Navegador                              │
│ http://localhost:3000/qa-dashboard                              │
└─────────────────────────────────────────────────────────────────┘
```

## 🔑 Por Qué MockDataV0.csv es CRÍTICO

### 1. **Fuente Única de Verdad (Single Source of Truth)**
- Es el **único archivo que el usuario puede editar** directamente
- Todos los datos del sistema provienen de este archivo
- No hay datos hardcodeados en el código
- No hay múltiples fuentes de datos conflictivas

### 2. **Reproducibilidad**
- Cualquier usuario puede ejecutar `npm run db:setup` con el mismo CSV
- Todos obtienen exactamente los mismos datos
- Facilita debugging y testing
- Ideal para demostraciones y capacitación

### 3. **Escalabilidad**
- Fácil de reemplazar con nuevos datos
- Soporta hasta 1000s de registros sin problema
- Estructura normalizada permite agregar/modificar registros
- CSV es formato estándar (Excel, Google Sheets, Python, etc.)

### 4. **Mantenibilidad**
- No requiere modificar código para cambiar datos
- Todos los cambios en un solo archivo
- Control de versiones claro
- Fácil de validar y verificar

## 📝 Campos Normalizados

### Durante la Migración CSV → SQLite:

```javascript
// Normalización de campos críticos:

// Sprint
"Sprint de ejecución" → sprint_number (extrae número)
"Sprint última regresión" → sprint_last_regression

// Bugs
"Prioridad" → priority (Alta→HIGH, Media→MEDIUM, etc.)
"Estado" → status (normalizado a minúsculas)

// Desarrollador
"Desarrollador" → developer_assigned
"Reportado" → reported_by

// Fechas
"Fecha Reporte" → report_date (parsing de MM/DD/YYYY)

// Módulos
"Clave de incidencia" → module_key (MOB, POS, KIOS, etc.)
```

## 🔍 Verificación de Integridad

Para verificar que MockDataV0.csv está correctamente cargado en SQLite:

```bash
# Verificar carga de datos
npm run db:verify

# O realizar query manual:
sqlite3 public/data/qa-dashboard.db "SELECT COUNT(*) FROM bugs_detail;"
# Esperado: 238 (bugs únicos después de deduplicación)
```

## 📊 Métricas Derivadas de MockDataV0.csv

Todas estas métricas se calculan **directamente de los datos en el CSV**:

### KPIs Calculados
- **Densidad de Defectos**: bugs_count / sprint_effort
- **Eficiencia de Resolución**: resolved_bugs / total_bugs
- **Ciclo de Tiempo**: days_from_report_to_resolution
- **Cobertura de Automatización**: automated_tests / total_tests
- **Ratio de Bugs Críticos**: critical_bugs / total_bugs

### Por Sprint
- Total de bugs reportados
- Bugs resueltos en ese sprint
- Bugs pendientes al final del sprint
- Casos de prueba ejecutados
- Distribución por prioridad

### Por Desarrollador
- Bugs asignados
- Bugs resueltos
- Módulos principales donde trabaja
- Tasa de eficiencia en resolución

## ⚙️ Cómo Editar MockDataV0.csv

### Opción 1: Editor de Texto (recomendado para cambios pequeños)
```bash
# Editar directamente
code data/MockDataV0.csv
```

### Opción 2: Microsoft Excel
```bash
# Abrir en Excel
start data\MockDataV0.csv
```

### Opción 3: Google Sheets
1. Subir archivo a Google Drive
2. Abrir con Google Sheets
3. Editar online
4. Descargar como CSV nuevamente

### Después de Editar:
```bash
# Recargar datos en SQLite
npm run db:setup

# Verificar cambios
npm run db:verify
```

## ⚠️ Reglas de Integridad

Cuando edites MockDataV0.csv, mantén estas reglas:

1. **Primera línea**: Encabezado (no modificar nombres de columnas)
2. **ID único**: Cada registro debe tener ID único en columna 3
3. **Prioridad**: Solo valores válidos (Alta, Media, Baja, Crítica)
4. **Estado**: Solo valores válidos (Resuelto, Cerrado, etc.)
5. **Fechas**: Formato MM/DD/YYYY
6. **Sprints**: Sprint 0-20 son válidos
7. **UTF-8**: Guardar siempre en codificación UTF-8
8. **Comillas**: Usar comillas dobles para valores con comas

## 🔗 Relación con Otros Archivos

```
MockDataV0.csv (FUENTE)
    ├─ → lib/database/init.js (esquema SQL)
    ├─ → scripts/migrateToSqliteCSV.mjs (importación)
    ├─ → public/data/qa-dashboard.db (BD destino)
    ├─ → lib/database/dal.js (queries)
    ├─ → pages/api/qa-data.js (endpoints)
    └─ → components/*.js (visualización)

Documentation:
    ├─ → DATA_MAPPING.md (describe mapeo de campos)
    ├─ → ARCHITECTURE.md (flujo completo)
    ├─ → QUICK_START.md (cómo usar)
    └─ → README.md (overview)
```

## ✅ Checklist de Validación

```
☑ MockDataV0.csv existe en data/
☑ Archivo tiene 1,001 líneas (header + 1000 datos)
☑ Tamaño ~0.27 MB
☑ Encoding UTF-8
☑ Primera línea es encabezado
☑ 24 columnas en cada fila
☑ IDs únicos (1-1000)
☑ npm run db:setup ejecuta sin errores
☑ npm run db:verify retorna 238 bugs
☑ Dashboard carga correctamente
☑ Todas las métricas se calculan
```

## 📞 Troubleshooting

**Problema**: "Base de datos no encontrada"  
**Solución**: `npm run db:setup` (lee MockDataV0.csv y crea BD)

**Problema**: Datos desactualizados en dashboard  
**Solución**: Editar MockDataV0.csv y ejecutar `npm run db:setup`

**Problema**: Errores de encoding/caracteres raros  
**Solución**: Guardar MockDataV0.csv en UTF-8, no ANSI

---

**Conclusión**: MockDataV0.csv es el corazón del sistema. Todos los datos, métricas y visualizaciones dependen de este archivo. Es la única fuente que el usuario necesita mantener.

**Última actualización**: 2025-12-02  
**Versión**: 2.1  
**Estado**: ✅ Crítico - Fuente Única de Verdad
