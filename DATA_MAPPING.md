# Mapeo de Datos Reales vs. Ficticios

## ✅ Datos REALES (del Excel)

### Tendencia (Hoja "Tendencia")
- `sprint` - Nombre del sprint
- `casosEjecutados` - Casos de prueba ejecutados
- `casosPendientes` - Casos pendientes
- `bugsEncontrados` - Bugs encontrados (reportes/hallazgos)
- `bugsCancelados` - Bugs cancelados
- `bugsSolucionados` - Bugs solucionados
- `bugsPendientes` - Bugs pendientes por resolver
- `porcentajeFallidos` - % de casos fallidos
- `porcentajePendientes` - % de bugs pendientes

### Sprint Data (Desde Tendencia + Versiones)
- `sprint` - Identificador del sprint
- `bugs` - Total de bugs encontrados en el sprint ✅ **DATO REAL**
- `bugsResolved` - Bugs resueltos en el sprint ✅ **DATO REAL**
- `bugsPending` - Bugs pendientes al final del sprint ✅ **DATO REAL**
- `testCases` - Casos de prueba ejecutados ✅ **DATO REAL**
- `velocity` - Velocidad del equipo ✅ **DATO REAL**
- `version` - Versión asociada ✅ **DATO REAL**
- `environment` - Ambiente (DEV, SIT, UAT) ✅ **DATO REAL**

### Desarrolladores (Hoja "BUGS X DESARROLLADOR")
- `name` - Nombre del desarrollador
- `cancelados` - Estado de bugs
- `tareasPorHacer` - Tasks pending
- `codeReview` - Bugs en code review
- `inSit`, `readyForTesting`, `readyForUat` - Estados
- `blocked`, `enCurso`, `toBeDeployed` - Estados adicionales
- `total` - Total de bugs asignados

### Módulos (Hoja "BUGS X MÓDULO")
- Distribución de bugs por módulo del sistema

### Versiones (Hoja "Versiones")
- `sprint` - Sprint asociado
- `version` - Número de versión
- `startDate` - Fecha de inicio
- `environment` - Ambiente (DEV, SIT, UAT, PROD)
- `testPlan` - Plan de pruebas
- `tags` - Etiquetas/labels

### Categorías (Hoja "BUGS X CATEGORÍA")
- `priority` - Prioridad
- `funcional` - Bugs funcionales
- `contenidoDatos` - Bugs de contenido/datos
- `eventosIoT` - Bugs de eventos IoT
- `lookFeel` - Bugs de UI/UX
- `integracion` - Bugs de integración
- `configuracion` - Bugs de configuración

### Reporte General (Hoja "Reporte_Gral")
- Datos completos de bugs (prioridad, estado, módulo, desarrollador, categoría)

---

## ⚠️ Datos FICTICIOS (en desarrollo)

### Métricas Derivadas NO en el Excel
- **Cycle Time** - Tiempo promedio de resolución (NO está en el archivo)
- **Test Automation Coverage** - % de cobertura de automatización (NO está en el archivo)
- **Quality Score** - Puntuación general de calidad (CALCULADA)
- **ROI del QA** - Return on Investment (NO está en el archivo)
- **Process Maturity** - Madurez del proceso (NO está en el archivo)
- **Predictions** - Predicciones futuras (NO está en el archivo)

### ✅ Métricas REALES (derivadas de datos del Excel)
- **Defect Density** = `bugs / testCases` (Hallazgos por caso de prueba) ✅ **AHORA REAL**
- **Resolution Efficiency** = `bugsResolved / bugs` (% de bugs resueltos) ✅ **YA REAL**
- **Sprint Velocity** = `velocity` de datos del sprint ✅ **YA REAL**

### Componentes con Datos Ficticios
- `UnderConstructionCard` - Para marcar estas métricas
- Color: Azul (bg-blue-50, border-blue-200)
- Icono: Construction
- Badge: "En desarrollo"

---

## 🔄 Cómo Agregar Nuevos Datos Reales

1. **Agregar hoja al Excel** con los datos
2. **Actualizar `excelProcessor.cjs`** con método `process<HojaName>Sheet()`
3. **Actualizar `transformToQAFormat()`** para incluir los datos
4. **Remover datos ficticios** y usar `UnderConstructionCard` si no están listos
5. **Generar JSON** con `npm run generate-json`
6. **Actualizar componentes** para usar los datos reales

---

## 📊 Estructura de Datos Real

```javascript
{
  metadata: {
    version: '1.0',
    source: 'excel', // 'excel' = datos reales
    generatedAt: '2025-11-20T22:00:00Z',
    excelFile: 'Reporte_QA_V1.xlsx'
  },
  _dataSource: 'excel',        // 'excel' o 'fallback'
  _isRealData: true,           // true = datos reales, false = ficticios
  _timestamp: 1234567890,      // Cuándo se cargaron
  
  // Datos reales del Excel:
  summary: { totalBugs, bugsClosed, bugsPending, ... },
  bugsByPriority: { 'Más alta': {...}, 'Alta': {...}, ... },
  bugsByModule: { ... },
  developerData: [ ... ],
  sprintData: [ ... ],
  bugsByCategory: { ... },
  versionsData: [ ... ]
}
```

---

## ✅ Checklist para Validar Datos Reales

- [ ] Todos los datos en fichas vienen de `data._isRealData === true`
- [ ] Fichas con datos ficticios usan `<UnderConstructionCard>`
- [ ] El archivo Excel tiene todas las hojas necesarias
- [ ] `npm run generate-json` ejecuta sin errores
- [ ] No hay `console.error` por datos faltantes
- [ ] Las métricas sin datos muestran el icono de construcción

