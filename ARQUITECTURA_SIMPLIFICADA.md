# Arquitectura Simplificada: XLSX → SQLite → Dashboard

## Descripción General

Modelo simplificado donde:
- **Fuente de datos**: XLSX (`Reporte_QA_V1.xlsx`)
- **Base de datos**: SQLite local (`tableroqua.db`)
- **Cálculos**: 100% en SQL (vistas, subconsultas)
- **APIs**: Consultan directamente SQLite
- **Dashboard**: Consume APIs REST

## Flujo de Datos

```
┌─────────────────────┐
│  Reporte_QA_V1.xlsx │
│   (Datos crudos)    │
└──────────┬──────────┘
           │
           │ load-xlsx-to-sqlite.js
           ▼
┌─────────────────────┐
│   tableroqua.db     │
│   (SQLite local)    │
│                     │
│ - bugs              │
│ - sprints           │
│ - versions          │
│ - developers        │
│ - modules           │
│ - categories        │
└──────────┬──────────┘
           │
           │ sqlite-queries.js
           │ (Vistas SQL + cálculos)
           ▼
┌─────────────────────┐
│   APIs REST         │
│                     │
│ - qa-data-v2        │
│ - search-bugs       │
│ - quality-report    │
└──────────┬──────────┘
           │
           │
           ▼
┌─────────────────────┐
│  React Dashboard    │
│  (Next.js UI)       │
└─────────────────────┘
```

## Estructura de BD

### Tabla: `bugs` (138 registros)
```sql
- id (PK)
- bug_key (único)
- bug_id
- summary
- priority (Alta, Medio, Baja, Más alta)
- status (READY FOR UAT, Tareas por hacer, etc.)
- sprint
- module (BOT, POS)
- developer
- found_in_sprint
- fixed_in_sprint
- category
- created_date
- created_at, updated_at
```

### Tabla: `sprints` (7 registros)
```sql
- id (PK)
- sprint_name (único)
- test_cases_executed
- test_cases_pending
- bugs_found
- bugs_canceled, bugs_solved, bugs_pending
- percent_failed, percent_pending_bugs
```

### Tabla: `versions` (7 registros)
```sql
- id (PK)
- version_name (único)
- sprint_id (FK)
- version_date
- environment
- test_plan
- tags
```

### Tabla: `developers` (17 registros)
```sql
- id (PK)
- name (único)
- canceled, todo, code_review, in_sit, ready_for_testing, etc.
- total
```

### Tabla: `modules` (13 registros)
```sql
- id (PK)
- module_name (único)
- total_bugs
```

## Ejemplos de Consultas SQL

### Bugs por Estado (con porcentaje)
```sql
SELECT 
  status,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM bugs), 2) as percentage
FROM bugs
GROUP BY status
ORDER BY count DESC
```

### Top Desarrolladores
```sql
SELECT 
  developer,
  COUNT(*) as total_bugs,
  COUNT(CASE WHEN status = 'READY FOR UAT' THEN 1 END) as ready_for_uat,
  COUNT(CASE WHEN priority IN ('Alta', 'Más alta') THEN 1 END) as high_priority
FROM bugs
WHERE developer IS NOT NULL
GROUP BY developer
ORDER BY total_bugs DESC
```

### Tendencia de Sprints
```sql
SELECT 
  sprint_name,
  test_cases_executed,
  bugs_found,
  bugs_solved,
  ROUND(percent_failed, 2) as percent_failed
FROM sprints
ORDER BY sprint_name
```

## APIs Disponibles

### 1. **GET /api/qa-data-v2?type=summary**
Resumen ejecutivo con KPIs principales
```json
{
  "success": true,
  "data": {
    "bugs": {
      "total": 138,
      "canceled": 16,
      "resolved": 52,
      "pending": 70
    },
    "modules": [...],
    "sprints": {...}
  }
}
```

### 2. **GET /api/qa-data-v2?type=bugs-by-status**
Bugs agrupados por estado (para gráficos)
```json
[
  { "status": "READY FOR UAT", "count": 52, "percentage": 37.68 },
  { "status": "Tareas por hacer", "count": 54, "percentage": 39.13 }
]
```

### 3. **GET /api/qa-data-v2?type=bugs-by-module**
Bugs por módulo con breakdown de estados
```json
[
  { "module": "POS", "bugs": 86, "ready_for_uat": 32, "todo": 40, "canceled": 10 },
  { "module": "BOT", "bugs": 51, "ready_for_uat": 20, "todo": 14, "canceled": 6 }
]
```

### 4. **GET /api/search-bugs?status=READY%20FOR%20UAT&module=BOT**
Búsqueda con filtros
```json
{
  "success": true,
  "count": 20,
  "data": [...],
  "filters": { "status": "READY FOR UAT", "module": "BOT" }
}
```

### 5. **GET /api/quality-report**
Reporte completo de calidad con recomendaciones
```json
{
  "totalBugs": 138,
  "bugsByStatus": [...],
  "topDevelopers": [...],
  "recommendations": [
    { "type": "high", "title": "Alto número de tareas pendientes" }
  ]
}
```

## Instalación y Setup

### 1. Instalar dependencia
```bash
npm install sqlite3
```

### 2. Cargar datos XLSX → SQLite (Primera vez)
```bash
node scripts/load-xlsx-to-sqlite.js
```
Esto:
- Crea `data/tableroqua.db`
- Carga 138 bugs, 7 sprints, 7 versiones, etc.
- Genera `data/load-info.json`

### 3. Iniciar aplicación
```bash
npm run dev
```

Las APIs consumirán automáticamente de SQLite.

## Ventajas del Modelo Simplificado

✅ **Rendimiento**: SQL calcula todo en BD  
✅ **Mantenibilidad**: No hay lógica dispersa en JS  
✅ **Escalabilidad**: Índices en SQLite optimizan consultas  
✅ **Consistencia**: Una sola fuente de verdad  
✅ **Simplicidad**: Sin caché, sin transformaciones en memoria  
✅ **Reproducibilidad**: Misma BD en dev y prod  

## Próximos Pasos

1. ✅ Crear esquema SQLite
2. ✅ Crear script de carga XLSX
3. ✅ Crear consultas SQL para métricas
4. ✅ Actualizar APIs
5. ✅ Actualizar componentes React para consumir nuevas APIs (ya aplicado en `components/ExecutiveRecommendations.js` para mostrar iconos y notas de recomendaciones)
6. ⏳ Agregar exportación de reportes en PDF
7. ⏳ Implementar refresh automático de BD

Notas adicionales:
- El motor de recomendaciones añade `icon`, `warningIcon` y `note` a las recomendaciones accionables. Ver `utils/recommendationEngine.js`.
- Se agregó manejo de error en `pages/api/recommendations.js` que devuelve un objeto vacío `{}` si `public/data/recommendations.json` no parsea correctamente; la aplicación usa valores por defecto del motor en ese caso.
- Copias de seguridad de `public/data/recommendations.json` se almacenan en `public/data/backups/`.

## Notas

- BD se crea automáticamente al iniciar la app
- Script de carga es idempotente (INSERT OR REPLACE)
- Índices están creados para optimizar búsquedas
- Se pueden ejecutar queries custom si es necesario

---

**Creado**: 31 de diciembre de 2025  
**Versión**: 2.0 (Simplificada con SQLite)
