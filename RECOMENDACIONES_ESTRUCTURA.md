# Estructura de la hoja "Recomendaciones" en Excel

## Formato de la hoja "Recomendaciones"

La hoja debe tener las siguientes columnas:

| Metrica | Condicion | Recomendacion | Prioridad |
|---------|-----------|---------------|-----------|

## Descripción de columnas:

- **Metrica**: Identificador de la métrica (testCases, resolutionEfficiency, criticalBugs, criticalBugsStatus, cycleTime, defectDensity)
- **Condicion**: Expresión JavaScript que se evalúa (ej: "avg >= 200", "total > 30", "pending === 0", "default")
- **Recomendacion**: Texto de la recomendación que se mostrará
- **Prioridad**: alta, media, o baja

## Ejemplos de filas:

### testCases (Media de Casos Ejecutados)
```
Metrica          | Condicion           | Recomendacion                                                          | Prioridad
testCases        | avg >= 200          | Excelente cobertura: El equipo mantiene un volumen robusto de testing | baja
testCases        | avg >= 150 && avg < 200 | Cobertura aceptable: Considerar incrementar casos para módulos críticos | media
testCases        | avg < 150           | Baja cobertura: Urgente aumentar volumen de casos de prueba          | alta
testCases        | default             | Implementar métricas de cobertura de código para validar completitud  | media
testCases        | default             | Automatizar casos repetitivos para aumentar eficiencia                | media
```

### resolutionEfficiency (Eficiencia de Resolución)
```
Metrica              | Condicion                    | Recomendacion                                                    | Prioridad
resolutionEfficiency | efficiency >= 80             | Excelente eficiencia: Equipo altamente productivo en resolución  | baja
resolutionEfficiency | efficiency >= 70 && efficiency < 80 | Buena eficiencia: Mantener el ritmo actual de resolución | baja
resolutionEfficiency | efficiency < 70              | Eficiencia baja: Analizar causas de bugs no resueltos           | alta
resolutionEfficiency | efficiency < 70              | Revisar backlog: Priorizar cierre de bugs antiguos               | alta
resolutionEfficiency | default                      | Implementar dailies para desbloquear impedimentos rápidamente    | media
resolutionEfficiency | default                      | Establecer SLAs por prioridad de bug                             | media
```

### criticalBugs (Bugs Críticos Detectados)
```
Metrica        | Condicion          | Recomendacion                                                               | Prioridad
criticalBugs   | total > 30         | Nivel crítico: Volumen muy alto de bugs graves - requiere atención inmediata | alta
criticalBugs   | total > 20 && total <= 30 | Alta presión: Considerar asignación de recursos adicionales        | alta
criticalBugs   | total <= 20        | Bajo control: Volumen manejable de bugs críticos                            | baja
criticalBugs   | default            | Establecer war room para bugs de prioridad "Más alta"                       | media
criticalBugs   | default            | Implementar smoke tests automáticos para prevención                         | media
```

### criticalBugsStatus (Estado de Bugs Críticos)
```
Metrica              | Condicion        | Recomendacion                                                          | Prioridad
criticalBugsStatus   | pending > 15     | Urgente: Backlog crítico excesivo - convocar daily enfocado            | alta
criticalBugsStatus   | pending > 15     | Escalar recursos: Reasignar desarrolladores senior a bugs críticos     | alta
criticalBugsStatus   | pending > 10 && pending <= 15 | Alta prioridad: Acelerar cierre de bugs críticos pendientes | alta
criticalBugsStatus   | pending <= 10 && pending > 0  | Bajo control: Volumen manejable, mantener velocidad de cierre  | baja
criticalBugsStatus   | pending === 0    | ¡Excelente: Todos los bugs críticos están resueltos!                  | baja
criticalBugsStatus   | default          | Establecer SLA de 48h máximo para bugs de prioridad "Más alta"        | media
```

### cycleTime (Cycle Time Promedio)
```
Metrica    | Condicion                | Recomendacion                                                                      | Prioridad
cycleTime  | avg > 10                 | Alto Cycle Time: Implementar daily stand-ups para acelerar resolución de bloqueadores | alta
cycleTime  | byPriority.critical > 5  | Críticos lentos: Establecer SLA de 48h para bugs críticos y asignar recursos dedicados | alta
cycleTime  | avg <= 7                 | Excelente velocidad: El equipo mantiene un ritmo óptimo de resolución              | baja
cycleTime  | default                  | Considerar automatización de testing para detectar bugs más temprano               | media
cycleTime  | default                  | Revisar proceso de triage para priorizar efectivamente                             | media
```

### defectDensity (Defect Density por HU)
```
Metrica        | Condicion        | Recomendacion                                                                          | Prioridad
defectDensity  | avg > 2.0        | Urgente: Implementar code reviews obligatorios antes de cada commit                    | alta
defectDensity  | avg > 2.0        | Urgente: Aumentar cobertura de unit tests al 80% mínimo                                | alta
defectDensity  | avg > 1.0 && avg <= 2.0 | Establecer Definition of Done con criterios de calidad claros                   | media
defectDensity  | avg > 1.0 && avg <= 2.0 | Implementar pair programming para HUs complejas                                 | media
defectDensity  | default          | Analizar módulos con alta concentración de bugs para refactorización                  | media
defectDensity  | default          | Capacitar al equipo en TDD (Test-Driven Development)                                   | media
defectDensity  | critical > 0.3   | Crítico: Alta densidad de bugs críticos indica problemas en arquitectura o requerimientos | alta
defectDensity  | avg <= 1.0       | Mantener las prácticas actuales de calidad - están funcionando bien                    | baja
```

## Variables disponibles por métrica:

### testCases:
- `avg`: Promedio de casos ejecutados
- `total`: Total de casos ejecutados
- `sprints`: Número de sprints

### resolutionEfficiency:
- `efficiency`: Porcentaje de eficiencia
- `total`: Total de bugs
- `resolved`: Bugs resueltos
- `pending`: Bugs pendientes

### criticalBugs:
- `total`: Total de bugs críticos
- `highest`: Bugs de prioridad "Más alta"
- `high`: Bugs de prioridad "Alta"
- `totalBugs`: Total de todos los bugs

### criticalBugsStatus:
- `total`: Total de bugs críticos
- `pending`: Bugs críticos pendientes
- `resolved`: Bugs críticos resueltos

### cycleTime:
- `avg`: Promedio de días
- `byPriority.critical`: Días para bugs críticos
- `byPriority.high`: Días para bugs altos
- `byPriority.medium`: Días para bugs medios
- `byPriority.low`: Días para bugs bajos

### defectDensity:
- `avg`: Promedio de bugs por HU
- `total`: Total de HUs
- `critical`: Bugs críticos por HU

## Notas:
- La condición "default" se aplica siempre (para recomendaciones generales)
- Las condiciones se evalúan como expresiones JavaScript
- Se pueden usar operadores: >, <, >=, <=, ===, !==, &&, ||
- El orden importa: las recomendaciones más específicas primero, luego las generales
