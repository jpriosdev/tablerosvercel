# Estructura de Recomendaciones - SQLite + CSV (v2.0)

##  Cómo Funcionan las Recomendaciones

Las recomendaciones se generan dinámicamente basadas en los datos reales de SQLite usando `utils/recommendationEngine.js`.

### Flujo de Datos

```
MockDataV0.csv  scripts/migrateToSqliteCSV.mjs  qa-dashboard.db
                                                        
                    lib/database/dal.js (getBugsSummary, getBugsBySprint, etc.)
                                    
                      /api/qa-data endpoint  Frontend components
                                    
                    utils/recommendationEngine.js (evalúa condiciones)
                                    
                      ActionableRecommendations.js (muestra recomendaciones)
```

## Cómo Funcionan las Recomendaciones

1. **Recopilación de Datos**: Se consultan datos reales de SQLite usando funciones de `dal.js`
2. **Evaluación de Condiciones**: El engine evalúa expresiones JavaScript contra los datos actuales
3. **Generación de Recomendaciones**: Se seleccionan recomendaciones basadas en las condiciones que se cumplen
4. **Visualización**: Se muestran agrupadas por prioridad en `ActionableRecommendations.js`

## Variables Disponibles por Métrica

### testCases (Casos de Prueba Ejecutados)
- `avg`: Promedio de casos ejecutados por sprint
- `total`: Total de casos ejecutados en todos los sprints
- `sprints`: Número de sprints con datos

### resolutionEfficiency (Eficiencia de Resolución)
- `efficiency`: Porcentaje de bugs resueltos vs total (0-100)
- `total`: Total de bugs registrados
- `resolved`: Bugs resueltos
- `pending`: Bugs pendientes

### criticalBugs (Bugs Críticos Detectados)
- `total`: Total de bugs con prioridad crítica
- `highest`: Bugs de prioridad "Más alta"
- `high`: Bugs de prioridad "Alta"
- `totalBugs`: Total de todos los bugs

### criticalBugsStatus (Estado de Bugs Críticos)
- `total`: Total de bugs críticos
- `pending`: Bugs críticos pendientes de resolver
- `resolved`: Bugs críticos resueltos

### cycleTime (Tiempo de Ciclo)
- `avg`: Promedio de días desde reporte hasta resolución
- `byPriority.critical`: Promedio de días para bugs críticos
- `byPriority.high`: Promedio de días para bugs altos
- `byPriority.medium`: Promedio de días para bugs medios
- `byPriority.low`: Promedio de días para bugs bajos

### defectDensity (Densidad de Defectos)
- `avg`: Promedio de bugs por Historia de Usuario
- `total`: Total de Historias de Usuario
- `critical`: Promedio de bugs críticos por HU

## Ejemplos de Recomendaciones

### testCases (Media de Casos Ejecutados)

Condición  Recomendación
- `avg >= 200`  Excelente cobertura: El equipo mantiene un volumen robusto de testing
- `avg >= 150 && avg < 200`  Cobertura aceptable: Considerar incrementar casos para módulos críticos
- `avg < 150`  Baja cobertura: Urgente aumentar volumen de casos de prueba
- `default`  Implementar métricas de cobertura de código para validar completitud

### resolutionEfficiency (Eficiencia de Resolución)

Condición  Recomendación
- `efficiency >= 80`  Excelente eficiencia: Equipo altamente productivo en resolución
- `efficiency >= 70 && efficiency < 80`  Buena eficiencia: Mantener el ritmo actual
- `efficiency < 70`  Eficiencia baja: Analizar causas de bugs no resueltos
- `default`  Establecer SLAs por prioridad de bug

### criticalBugs (Bugs Críticos Detectados)

Condición  Recomendación
- `total > 30`  Nivel crítico: Volumen muy alto - requiere atención inmediata
- `total > 20 && total <= 30`  Alta presión: Considerar asignación de recursos adicionales
- `total <= 20`  Bajo control: Volumen manejable de bugs críticos
- `default`  Establecer war room para bugs de prioridad "Más alta"

### criticalBugsStatus (Estado de Bugs Críticos)

Condición  Recomendación
- `pending > 15`  Urgente: Backlog crítico excesivo - convocar daily enfocado
- `pending > 10 && pending <= 15`  Alta prioridad: Acelerar cierre de bugs críticos
- `pending === 0`  ¡Excelente: Todos los bugs críticos están resueltos!
- `default`  Establecer SLA de 48h máximo para bugs de prioridad "Más alta"

### cycleTime (Tiempo de Ciclo)

Condición  Recomendación
- `avg > 10`  Alto Cycle Time: Implementar dailies para acelerar resolución
- `byPriority.critical > 5`  Críticos lentos: Establecer SLA de 48h para bugs críticos
- `avg <= 7`  Excelente velocidad: El equipo mantiene un ritmo óptimo
- `default`  Revisar proceso de triage para priorizar efectivamente

### defectDensity (Densidad de Defectos)

Condición  Recomendación
- `avg > 2.0`  Urgente: Implementar code reviews obligatorios antes de cada commit
- `avg > 1.0 && avg <= 2.0`  Establecer Definition of Done con criterios de calidad
- `avg <= 1.0`  Mantener las prácticas actuales de calidad - están funcionando bien
- `critical > 0.3`  Crítico: Alta densidad de bugs críticos indica problemas de arquitectura
- `default`  Capacitar al equipo en TDD (Test-Driven Development)

## Sintaxis de Condiciones

- **Operadores soportados**: `>`, `<`, `>=`, `<=`, `===`, `!==`, `&&`, `||`
- **Sintaxis**: Expresiones JavaScript válidas (ej: `avg >= 200`, `pending > 15`, `efficiency >= 80 && efficiency < 90`)
- **Valor especial**: `default` se aplica siempre como fallback general
- **Evaluación**: Las condiciones más específicas se evalúan primero; si coinciden, se usan esas recomendaciones

## Ubicación del Código

- **Engine de Recomendaciones**: `utils/recommendationEngine.js`
  - Función `generateRecommendations(data)` que evalúa todas las condiciones
  - Retorna array de recomendaciones ordenadas por prioridad

- **Visualización**: `components/ActionableRecommendations.js`
  - Consume las recomendaciones del API endpoint `/api/recommendations`
  - Agrupa por prioridad (Alta, Media, Baja)
  - Muestra en tarjetas con iconos visuales

- **API Endpoint**: `/api/recommendations` (POST)
  - Endpoint que recibe datos de SQLite
  - Llama a `recommendationEngine.generateRecommendations()`
  - Retorna array de recomendaciones formateado

## Notas Importantes

1. **Datos en Tiempo Real**: Las recomendaciones se basan en datos actuales de SQLite, no en valores estáticos
2. **Fallback Seguro**: Si falta alguna métrica, se usan recomendaciones genéricas (condición `default`)
3. **Performance**: La evaluación de condiciones es rápida y se cachea por 5 minutos
4. **Flexibilidad**: Las recomendaciones se pueden actualizar sin cambiar código - solo modificando las condiciones en el engine

## Cómo Agregar Nuevas Recomendaciones

1. Edita `utils/recommendationEngine.js`
2. Localiza la sección de la métrica correspondiente
3. Agrega nueva condición y recomendación
4. La plataforma se actualizará automáticamente en el próximo ciclo de datos

Ejemplo:
```javascript
if (data.testCases?.avg >= 180 && data.testCases.avg < 200) {
  recommendations.push({
    metric: 'testCases',
    condition: 'avg >= 180 && avg < 200',
    message: 'Cobertura muy buena: Mantener enfoque en módulos críticos',
    priority: 'media'
  });
}
```
