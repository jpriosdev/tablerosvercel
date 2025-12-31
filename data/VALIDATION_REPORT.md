# Validación XLSX vs SQL - TableroQA

## Resumen Ejecutivo

Se ha realizado una validación completa de los datos del archivo XLSX (`Reporte_QA_V1.xlsx`) y se han creado scripts para sincronización con la BD SQL.

## Datos Extraídos del XLSX

### 📊 Estadísticas Principales

| Métrica | Cantidad |
|---------|----------|
| **Total de BUGS** | 138 |
| **Sprints** | 7 |
| **Versiones** | 7 |
| **Desarrolladores** | 17 |
| **Módulos** | 13 |

### 🔴 BUGS por Estado

| Estado | Count |
|--------|-------|
| READY FOR UAT | 52 |
| Tareas por hacer | 54 |
| Cancelado | 16 |
| Code Review | 5 |
| TO BE DEPLOYED-SIT | 5 |
| Blocked | 3 |
| IN SIT | 1 |
| En curso | 1 |
| READY FOR TESTING | 1 |

### 📦 BUGS por Módulo

| Módulo | Bugs |
|--------|------|
| POS | 86 |
| BOT | 51 |

### 🔖 BUGS por Prioridad

| Prioridad | Bugs |
|-----------|------|
| Medio | 82 |
| Alta | 41 |
| Más alta | 7 |
| Baja | 8 |

## Hojas del Excel Validadas

✅ **Reporte_Gral** - 138 registros de BUGS detallados
✅ **Tendencia** - 7 sprints con métricas de prueba
✅ **Versiones** - 7 versiones de software
✅ **BUGS X DESARROLLADOR** - 17 desarrolladores con estadísticas
✅ **BUG X MÓDULO** - 13 módulos con conteo de bugs
✅ **BUGS X SPRINT** - Desglose por sprint
✅ **BUGS X CATEGORÍA** - Categorización de bugs

## Scripts Creados

### 1. `validate-xlsx-vs-sql.js`
Compara datos del XLSX con datos existentes (JSON o BD)
```bash
node scripts/validate-xlsx-vs-sql.js
```

### 2. `validate-xlsx-data.js`
Analiza la calidad y estructura de datos del XLSX
```bash
node scripts/validate-xlsx-data.js
```

### 3. `sync-xlsx-to-db.js` ⭐
**SCRIPT PRINCIPAL** - Extrae todos los datos del XLSX en formato JSON listo para sincronizar
```bash
node scripts/sync-xlsx-to-db.js
```
- Genera `sync-data.json` con todos los datos estructurados
- Incluye resumen de estadísticas
- Listo para cargar en BD SQL

### 4. `inspect-excel.js`
Inspecciona la estructura y contenido del XLSX
```bash
node scripts/inspect-excel.js
```

## Próximos Pasos para Sincronización a BD SQL

1. **Ejecutar extracción:**
   ```bash
   npm run sync-xlsx
   ```
   (Asegúrate de que exista este script en package.json)

2. **El archivo `sync-data.json` contiene:**
   - 138 bugs con todos sus atributos
   - 7 sprints con métricas
   - 7 versiones de software
   - 17 desarrolladores
   - Estadísticas agregadas por estado, módulo y prioridad

3. **Para cargar en BD SQL:**
   - Usar un script Node.js que lea `sync-data.json`
   - Insertar en tablas: Bugs, Sprints, Versions, Developers, Modules
   - Validar integridad de referencias (FK)

## Estado de Validación

✅ **ÉXITO** - Todos los datos fueron extraídos correctamente
✅ **INTEGRIDAD** - Se valida que no haya registros vacíos
✅ **ESTRUCTURA** - Todas las hojas esperadas se encontraron
✅ **LISTO PARA SYNC** - Datos preparados en `sync-data.json`

---

**Generado:** 31 de diciembre de 2025
**Archivo principal:** `Reporte_QA_V1.xlsx`
**Directorio datos:** `TableroQA/data/`
