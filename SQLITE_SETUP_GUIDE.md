# 📊 TableroQA - Modelo Simplificado con SQLite

## Resumen de Cambios

Se implementó una arquitectura simplificada donde:

- ✅ **XLSX** es la fuente de datos única
- ✅ **SQLite** es la BD local que almacena datos
- ✅ **SQL** calcula todas las métricas (sin lógica en JS)
- ✅ **APIs REST** consultan SQLite directamente

### Antes vs Después

| Aspecto | Antes | Ahora |
|---------|-------|-------|
| Fuente de datos | XLSX + múltiples procesadores | XLSX → SQLite |
| Cálculos de métricas | JS (disperso) | SQL (centralizado) |
| BD | JSON archivos | SQLite local |
| Rendimiento | Lento (procesa en memoria) | Rápido (SQL optimizado) |
| Mantenibilidad | Compleja | Simple |

## 🚀 Instalación Rápida

### Opción 1: Windows (PowerShell)
```powershell
# Ejecutar setup
& .\scripts\setup-sqlite.ps1

# O manualmente:
npm install
node scripts\load-xlsx-to-sqlite.js
npm run dev
```

### Opción 2: macOS/Linux
```bash
# Ejecutar setup
bash scripts/setup-sqlite.sh

# O manualmente:
npm install
node scripts/load-xlsx-to-sqlite.js
npm run dev
```

## 📁 Nuevos Archivos

### Librerías
- `lib/sqlite-db.js` - Gestor de BD SQLite
- `lib/sqlite-queries.js` - Todas las consultas SQL

### Scripts
- `scripts/load-xlsx-to-sqlite.js` - Carga XLSX → SQLite
- `scripts/setup-sqlite.ps1` - Setup automático (Windows)
- `scripts/setup-sqlite.sh` - Setup automático (macOS/Linux)

### APIs
- `pages/api/qa-data-v2.js` - Datos QA desde SQL
- `pages/api/search-bugs.js` - Búsqueda de bugs
- `pages/api/quality-report.js` - Reporte de calidad

### Documentación
- `ARQUITECTURA_SIMPLIFICADA.md` - Documentación técnica completa

## 📊 Flujo de Datos

```
1. Reporte_QA_V1.xlsx (Datos crudos)
                ↓
2. load-xlsx-to-sqlite.js (Script de carga)
                ↓
3. data/tableroqua.db (BD SQLite)
                ↓
4. sqlite-queries.js (Consultas SQL)
                ↓
5. APIs REST (qa-data-v2, search-bugs, quality-report)
                ↓
6. React Components (Dashboard)
```

## 💾 BD SQLite - Tablas

| Tabla | Registros | Propósito |
|-------|-----------|----------|
| `bugs` | 138 | Detalles de cada bug |
| `sprints` | 7 | Métricas de sprints |
| `versions` | 7 | Versiones de software |
| `developers` | 17 | Estadísticas por desarrollador |
| `modules` | 13 | Bugs por módulo |
| `categories` | - | Bugs por categoría |

## 🔌 APIs Disponibles

### 1. Resumen Ejecutivo
```bash
GET /api/qa-data-v2?type=summary
```
Retorna KPIs principales: total de bugs, módulos, sprints, developers

### 2. Bugs por Estado
```bash
GET /api/qa-data-v2?type=bugs-by-status
```
Gráfico de distribución de bugs por estado

### 3. Bugs por Módulo
```bash
GET /api/qa-data-v2?type=bugs-by-module
```
Análisis de bugs por módulo (POS, BOT, etc.)

### 4. Bugs por Desarrollador
```bash
GET /api/qa-data-v2?type=bugs-by-developer
```
Cargas de trabajo por desarrollador

### 5. Bugs por Prioridad
```bash
GET /api/qa-data-v2?type=bugs-by-priority
```
Distribución por nivel de criticidad

### 6. Búsqueda Avanzada
```bash
GET /api/search-bugs?status=READY%20FOR%20UAT&module=BOT&developer=Juan
```
Filtros: status, module, developer, priority, sprint, search

### 7. Reporte de Calidad
```bash
GET /api/quality-report
```
 
## Notas sobre recomendaciones y datos adicionales

- El dashboard carga recomendaciones desde `public/data/recommendations.json`. Si el JSON está corrupto, el endpoint `/api/recommendations` hace fallback a `{}` y la UI utiliza los valores por defecto del motor en `utils/recommendationEngine.js`.
- Se recomienda mantener backups en `public/data/backups/` y validar cualquier edición del JSON antes de desplegar.
Análisis completo + recomendaciones automáticas

## 🛠️ Desarrollo

### Cargar datos nuevamente
```bash
node scripts/load-xlsx-to-sqlite.js
```

### Ver estructura BD
```bash
# Necesitas sqlite3 CLI
sqlite3 data/tableroqua.db ".schema"
```

### Agregar nueva métrica
1. Crear consulta SQL en `lib/sqlite-queries.js`
2. Exponerla en API en `pages/api/qa-data-v2.js`
3. Actualizar componentes React

### Consultas SQL Útiles

**Bugs más críticos**
```sql
SELECT * FROM bugs 
WHERE priority IN ('Alta', 'Más alta') 
AND status != 'Cancelado'
ORDER BY created_date DESC
LIMIT 20;
```

**Carga de trabajo por desarrollador**
```sql
SELECT developer, COUNT(*) as bugs, 
  COUNT(CASE WHEN status='Tareas por hacer' THEN 1 END) as pending
FROM bugs
GROUP BY developer
ORDER BY bugs DESC;
```

**Progreso de sprints**
```sql
SELECT sprint_name, 
  ROUND(bugs_solved * 100.0 / bugs_found, 2) as progress_percent
FROM sprints
ORDER BY sprint_name;
```

## 📈 Estadísticas Actuales

```
Total de Bugs: 138
├─ READY FOR UAT: 52 (37.68%)
├─ Tareas por hacer: 54 (39.13%)
├─ Cancelado: 16 (11.59%)
├─ Code Review: 5 (3.62%)
└─ Otros: 11 (7.97%)

Por Módulo:
├─ POS: 86 bugs
└─ BOT: 51 bugs

Por Prioridad:
├─ Medio: 82 (59.42%)
├─ Alta: 41 (29.71%)
├─ Más alta: 7 (5.07%)
└─ Baja: 8 (5.80%)

Sprints: 7
Versiones: 7
Desarrolladores: 17
Módulos: 13
```

## ⚡ Rendimiento

SQLite es muy rápido para este volumen de datos:
- Queries simples: < 10ms
- Aggregations: < 20ms
- Búsquedas complejas: < 50ms

Para más de 1M de registros, considerar PostgreSQL.

## 🔒 Seguridad

- BD SQLite es local (no expuesta)
- Todas las queries usan parámetros (evita SQL injection)
- Validación de entrada en APIs

## 📚 Documentación Completa

Ver `ARQUITECTURA_SIMPLIFICADA.md` para:
- Diagrama de flujo
- Esquema de BD detallado
- Ejemplos de queries SQL
- Plan de escalabilidad

## 🤝 Soporte

Problemas comunes:

**Q: "Error: Cannot find module 'sqlite3'"**
```bash
npm install sqlite3
```

**Q: "DB file is locked"**
- Cerrar todas las conexiones
- Borrar `data/tableroqua.db` y regenerar

**Q: "No data in APIs"**
```bash
# Recargar datos
node scripts/load-xlsx-to-sqlite.js
```

---

**Última actualización**: 31 de diciembre de 2025  
**Versión**: 2.0 (Arquitectura Simplificada)
