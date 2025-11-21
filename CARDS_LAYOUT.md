# 📊 Estructura de Fichas del Dashboard Ejecutivo

## Narrativa Gerencial: De Cobertura → Riesgo → Calidad → Capacidad

El dashboard está reorganizado para contar una historia clara al ejecutivo sobre el estado de QA:

```
┌─────────────────────────────────────────────────────────────────────┐
│ 📊 PRODUCTIVIDAD & COBERTURA                                         │
├─────────────────────────────────────────────────────────────────────┤
│ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐     │
│ │ 📈 Media Casos   │ │ ⚙️ Automatización │ │ ✓ Tasa Ejecución │     │
│ │ ~170 casos/sprint│ │ 45% automatizado │ │ 92% ejecutadas   │     │
│ │ ✅ GOOD          │ │ ⚠️ WARNING       │ │ ℹ️ INFO         │     │
│ └──────────────────┘ └──────────────────┘ └──────────────────┘     │
│ ¿Qué tan productivo es el equipo de QA? ¿Ejecutamos suficientes    │
│ pruebas? ¿Tenemos automatización?                                  │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ ⚠️ RIESGO & CRITICIDAD                                              │
├─────────────────────────────────────────────────────────────────────┤
│ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐     │
│ │ 🐛 Bugs Críticos │ │ ⚠️ Estado Crítico │ │ 📊 Matriz Riesgo │     │
│ │ 35 críticos      │ │ 8 pendientes     │ │ 127 bugs total   │     │
│ │ 🔴 DANGER        │ │ 🔴 DANGER        │ │ 27% críticos     │     │
│ └──────────────────┘ └──────────────────┘ └──────────────────┘     │
│ ¿Qué riesgos críticos tenemos? ¿Cuántos están sin resolver?        │
│ ¿Cuál es el perfil de prioridades?                                 │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ ✓ CALIDAD & DEFECTOS                                                │
├─────────────────────────────────────────────────────────────────────┤
│ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐     │
│ │ 🎯 Densidad      │ │ ✓ Eficiencia     │ │ ⏱️ Tiempo Resolv. │     │
│ │ 24.5% bugs/casos │ │ 73% resueltos    │ │ 8 días promedio  │     │
│ │ ✅ GOOD          │ │ ✅ SUCCESS       │ │ ⚠️ WARNING       │     │
│ └──────────────────┘ └──────────────────┘ └──────────────────┘     │
│ ¿Qué calidad tiene el producto? ¿Resolvemos rápido los bugs?       │
│ ¿El equipo es eficiente cerrando incidencias?                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ 📈 ANÁLISIS COMPLEMENTARIOS                                         │
├─────────────────────────────────────────────────────────────────────┤
│ ┌──────────────────┐                                               │
│ │ 📉 Tasa de Fuga  │                                               │
│ │ 2% bugs en prod. │                                               │
│ │ ✅ GOOD          │                                               │
│ └──────────────────┘                                               │
│ ¿Qué bugs escaparon a producción?                                  │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ 📊 TENDENCIAS & DISTRIBUCIÓN (GRÁFICOS)                             │
├─────────────────────────────────────────────────────────────────────┤
│ ┌────────────────────────────┐ ┌────────────────────────────┐      │
│ │ Tendencia Sprints Selecc.  │ │ Distribución por Prioridad │      │
│ │ (Evolución de bugs/sprint) │ │ (Críticos/Altos/Med/Bajos) │      │
│ └────────────────────────────┘ └────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📋 Fichas Detalladas

### FILA 1: PRODUCTIVIDAD & COBERTURA
**Pregunta gerencial**: "¿Qué tan efectivo es nuestro equipo de QA?"

| Posición | Ficha | Métrica | Fórmula | Objetivo |
|----------|-------|---------|---------|----------|
| 1 | Media de Casos | 170 casos/sprint | Total casos ÷ sprints | ≥150 |
| 2 | Automatización | 45% | Automatizados ÷ total | ≥60% |
| 3 | Ejecución | 92% | Ejecutados ÷ planificados | ≥90% |

**Lógica**: Mide la capacidad y velocidad del equipo. El KPI de Media Casos indica productividad bruta, Automatización muestra eficiencia relativa, y Ejecución mide cumplimiento del plan.

---

### FILA 2: RIESGO & CRITICIDAD
**Pregunta gerencial**: "¿Cuáles son los mayores riesgos del producto?"

| Posición | Ficha | Métrica | Fórmula | Acción |
|----------|-------|---------|---------|--------|
| 1 | Bugs Críticos | 35 bugs | Más Alta + Alta | ⏰ Resolver inmediatamente |
| 2 | Estado Críticos | 8 pendientes | Total - Resueltos | 🚨 Bloquea release |
| 3 | Matriz Riesgo | 127 bugs total | Desglose por prioridad | 📊 Ver distribución |

**Lógica**: Alerta temprana sobre riesgos que podrían impactar la release. Bugs Críticos = volumen de riesgo, Estado Críticos = urgencia, Matriz Riesgo = visión holística.

**Narrativa**: Si ves números altos aquí, es necesario **tomar acción inmediata**.

---

### FILA 3: CALIDAD & DEFECTOS
**Pregunta gerencial**: "¿Qué tan buena es la calidad del producto?"

| Posición | Ficha | Métrica | Fórmula | Ideal |
|----------|-------|---------|---------|-------|
| 1 | Densidad Defectos | 24.5% | Bugs ÷ TestCases | ≤20% |
| 2 | Eficiencia Resolución | 73% | Resueltos ÷ Total | ≥70% |
| 3 | Tiempo Resolución | 8 días | Promedio ciclo | ≤7 días |

**Lógica**: Mide la **capacidad de control de calidad** del producto:
- **Densidad**: Proporción de defectos encontrados (bugs/caso). Menor es mejor.
- **Eficiencia**: Capacidad del equipo de cerrar bugs.
- **Tiempo**: Velocidad de respuesta ante problemas.

**Narrativa**: Si todos los KPIs de esta fila están en verde, **el producto es confiable**.

---

### FILA 4: ANÁLISIS COMPLEMENTARIOS
**Pregunta gerencial**: "¿Qué escapa a nuestro control de QA?"

| Posición | Ficha | Métrica | Fórmula | Riesgo |
|----------|-------|---------|---------|--------|
| 1 | Tasa de Fuga | 2% | Bugs producción ÷ total | <5% = ✅ |

**Lógica**: Mide la **efectividad general** del proceso QA. Bugs que escapan a producción son fallos de QA.

---

### GRÁFICOS: TENDENCIAS & DISTRIBUCIÓN

#### Gráfico 1: Tendencia de Sprints Seleccionados
- **Tipo**: Línea temporal
- **Eje Y**: Cantidad de bugs/casos
- **Eje X**: Sprint
- **Propósito**: Ver **tendencias**. ¿Mejoramos o empeoramos?

#### Gráfico 2: Distribución por Prioridad
- **Tipo**: Desglose RiskMatrix
- **Contenido**: Críticos (Más Alta + Alta), Medios, Bajos
- **Propósito**: Entender el **perfil de riesgo** actual

---

## 🎯 Cómo Leer el Dashboard como Ejecutivo

### Escenario 1: Todo verde
```
Productividad: ✅ | Riesgo: ✅ | Calidad: ✅ | Fuga: ✅
→ "El equipo está controlado. Podemos hacer release."
```

### Escenario 2: Rojo en Riesgo
```
Productividad: ✅ | Riesgo: 🔴 | Calidad: ⚠️ | Fuga: ✅
→ "Hay muchos bugs críticos pendientes. NO hacer release hasta resolver."
```

### Escenario 3: Rojo en Calidad
```
Productividad: ✅ | Riesgo: ✅ | Calidad: 🔴 | Fuga: 🔴
→ "La densidad de defectos está alta y están escapando bugs a producción."
→ "Necesitamos mejorar el proceso QA (más casos, mejor cobertura)."
```

---

## 📐 Estructura Técnica

**4 Filas de KPIs + 2 Gráficos Contextuales**

```javascript
// FILA 1: Productividad (3 fichas)
- Media Casos (blue) + Automatización (purple) + Ejecución (purple)

// FILA 2: Riesgo (3 fichas - CRÍTICA)
- Bugs Críticos (red) + Estado Críticos (warning) + Matriz Riesgo (red)

// FILA 3: Calidad (3 fichas)
- Densidad Defectos (orange) + Eficiencia (green) + Tiempo Resolución (blue)

// FILA 4: Complementarios (1 ficha)
- Tasa Fuga (red)

// Gráficos de contexto (2 gráficos)
- Tendencia + Distribución Prioridades
```

**Total**: 11 fichas KPI + 2 gráficos de análisis = **Dashboard ejecutivo completo en 1 pantalla**.

---

## ✅ Checklist para Validar Coherencia

- [x] **Narrativa clara**: Productividad → Riesgo → Calidad → Complementarios
- [x] **Colores consistentes**: Rojo=Riesgo crítico, Orange=Defectos, Green=Eficiencia, Blue=Productividad
- [x] **Progresión lógica**: De "¿Cuánto hacemos?" → "¿Qué problemas?" → "¿Qué calidad?" → "¿Qué escapa?"
- [x] **RiskMatrix integrada**: Ahora es una ficha estándar en Fila 2, no un gráfico separado
- [x] **Objetivos claros**: Cada ficha tiene un objetivo (≥150, ≤20%, ≥70%, etc.)
- [x] **Acciones posibles**: El gerente sabe qué hacer si algo está rojo

---

## 🚀 Próximos Pasos

1. ✅ Reorganizar fichas en orden coherente
2. ✅ Integrar RiskMatrix como KPI card
3. ⏳ Validar visualmente en navegador
4. ⏳ Agregar iconos descriptivos para cada sección
5. ⏳ Considerar agregar botones de acción rápida (ej: "Ver bugs críticos pendientes")
