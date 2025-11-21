# 📖 Dashboard QA - Narrativa Tipo Storytelling para VP Ingeniería

## 🎬 Introducción: El Viaje Ejecutivo

Este dashboard cuenta una historia en 4 actos dirigida a **VP de Ingeniería y Directores de Desarrollo** (expertos en tech, NO en QA).

**La pregunta central que un VP se hace cada viernes antes de deploy:**
> *"¿Están los devs listos? ¿Qué puede salirnos mal? ¿La calidad es buena? ¿Vamos a tiempo?"*

Este dashboard responde cada pregunta en orden, con lenguaje ejecutivo claro y sin tecnicismos QA.

---

## 🎭 Los 4 Actos de la Narrativa

### ACT 1: 🎯 ¿ESTAMOS LISTOS PARA RELEASE?
**Pregunta del VP**: "¿El proceso de pruebas está maduro? ¿Conozco toda la cobertura?"

**Fichas:**
1. **Cobertura de Pruebas** (170 pruebas/sprint)
    - *¿Qué mide?* Número de pruebas que ejecutamos.
   - *¿Por qué?* Más pruebas = mejor cobertura = menos sorpresas.
   - *Acción:* Meta ≥170.

2. **Pruebas Automatizadas** (45%)
    - *¿Qué mide?* % de pruebas que hacen los robots vs mano.
   - *¿Por qué?* 60%+ = deploy cada 2 semanas. <40% = release lento.
   - *Acción:* Necesitamos invertir en automatización.

3. **Completitud Sprint** (92%)
    - *¿Qué mide?* % de pruebas planificadas que realmente ejecutamos.
   - *¿Por qué?* Si falta algo = "puntos ciegos" = bugs en prod.
   - *Acción:* Meta ≥95%.

**Narración VP:** "OK, tenemos buena cobertura. Pero necesitamos automatizar más. Si no, vamos a tener presión en el próximo sprint."

---

### ACT 2: 🚨 ¿QUÉ PUEDE BLOQUEAR LA RELEASE?
**Pregunta del VP**: "¿Qué nos detiene? ¿Hay bugs que eviten que demos deploy?"

**Fichas:**
1. **Bugs Críticos Encontrados** (35 bugs)
    - *¿Qué mide?* Bugs que podrían bloquear un usuario o perder datos.
   - *¿Por qué?* Si hay muchos críticos, NO desplegamos.
   - *Acción:* Meta ≤20 bugs críticos.

2. **🚫 Críticos SIN RESOLVER** (8 pending)
    - *¿Qué mide?* Bugs críticos que aún no arreglaron.
   - *¿Por qué?* **ESTO BLOQUEA LA RELEASE HOY.**
   - *Acción:* Goal = 0. Dev team en crisis.

3. **Matriz de Riesgo General** (138 bugs total)
    - *¿Qué mide?* Distribución: 7 críticos + 41 altos + 82 medios + 8 bajos.
   - *¿Por qué?* Entender el perfil de riesgo.
   - *Acción:* Haz click para drill-down.

**Narración VP:** "Tenemos 8 críticos sin resolver. Eso bloquea. Llama a dev, que den prioridad MAXIMA a esos 8."

---

### ACT 3: ✅ ¿LA CALIDAD ES BUENA?
**Pregunta del VP**: "¿El código que vamos a deployar es de calidad? ¿O será un desastre?"

**Fichas:**
1. **Densidad de Hallazgos** (19.69%)
    - *¿Qué mide?* De cada 100 pruebas, cuántas encontramos un bug.
   - *¿Por qué?* Si alto = código de baja calidad. Si bajo = buena calidad.
   - *Estándar industrial:* <10% = excelente, 10-30% = bueno, 30-50% = alerta, >50% = crisis.
   - *Acción:* Nuestro 19.69% = BUENO. Seguir así.

2. **Velocidad de Fixes** (73%)
    - *¿Qué mide?* % de bugs que ya arreglaron vs todos.
   - *¿Por qué?* Si arreglan rápido = código limpio. Si lento = acumulan bugs.
   - *Acción:* Meta ≥70%. Vamos bien.

3. **Tiempo para Arreglar Bugs** (8 días)
    - *¿Qué mide?* Cuántos días tarda dev en arreglar un bug desde que lo reportamos.
   - *¿Por qué?* Si es 14 días = bug queda viejito en prod. Si es 3 = rápido.
   - *Acción:* Meta ≤7 días. Estamos un poco alto.

**Narración VP:** "Buena noticia: el código tiene calidad aceptable. Pero dev tarda 8 días en arreglar bugs. Necesitamos acelerar eso."

---

### ACT 4: 📈 ¿VAMOS A TIEMPO? CONCLUSIONES
**Pregunta del VP**: "¿Tendencia? ¿Mejorando o empeorando? ¿Recomendación final?"

**Elementos:**
1. **Gráfico de Tendencia de Sprints**
   - Visualiza: Línea de bugs por sprint.
   - Lee: ¿Va subiendo (mal) o bajando (bien)?

2. **Distribución por Prioridad**
   - Visualiza: Desglose de críticos, altos, medios, bajos.
   - Lee: ¿Dónde está concentrado el riesgo?

3. **Bugs que Escapan a Producción**
    - *¿Qué mide?* % de bugs que los usuarios encuentran (nosotros no vimos).
   - *¿Por qué?* Si muchos escapan = pruebas insuficientes.
   - *Acción:* Meta <5%.

**Narración VP:** "En los últimos sprints, la tendencia es buena: menos bugs por sprint. El 2% de bugs que escapan es excelente. Recomendación: DEPLOY OK. Pero continúa monitoreando esos 8 críticos."

---

## 🎓 Guía de Lectura para el VP

### Antes de Leer
1. **¿Es viernes?** → Tienes 10 minutos para decidir si desplegamos.
2. **¿Es lunes?** → Tienes 2 minutos para entender qué pasó el finde.
3. **¿Es jueves?** → Plan para mañana: ¿hacemos release?

### Orden de Lectura Recomendado
```
ACT 2 (Riesgos)
    ↓
¿Hay críticos sin resolver? 
    ↓ SÍ → BLOQUEAR RELEASE, llamar dev urgente
    ↓ NO → Continuar
    
ACT 3 (Calidad)
    ↓
¿Densidad de hallazgos >30%?
    ↓ SÍ → Posible issue, pero revisar si es por mejor cobertura
    ↓ NO → Continuar
    
ACT 1 (Readiness)
    ↓
¿Completitud <80%?
    ↓ SÍ → Tenemos gaps de cobertura
    ↓ NO → Continuar
    
ACT 4 (Tendencia)
    ↓
¿Tendencia mejorando?
    ↓ SÍ → DEPLOY SEGURO
    ↓ NO → Investigar por qué empeoramos
```

---

## 💡 Interpretar los Tooltips de Cada Ficha

**Cada ficha tiene un icono `?` en la esquina superior derecha.**

Al hacer hover:
1. **¿QUÉ MIDE?** - Explicación sin jerga
2. **¿POR QUÉ IMPORTA?** - Impacto de negocio
3. **NUESTRO VALOR** - Tu métrica actual + interpretación
4. **META** - Hacia dónde deberías apuntar

### Ejemplo: Cobertura de Pruebas = 170
```
¿QUÉ MIDE? 
    → Número de pruebas que ejecutamos cada sprint.

¿POR QUÉ? 
  → Más pruebas = mejor cobertura = menos bugs en producción.

NUESTRO VALOR: 170
  → ✅ Excelente cobertura. Vamos bien.

META: ≥170 pruebas/sprint
  → Mantener o mejorar.
```

---

## 🎨 Código de Colores (Status)

Cada ficha cambia de color según el estado:

| Color | Significa | Acción |
|-------|-----------|--------|
| 🟢 Verde / SUCCESS | Todo bien | Mantener |
| 🟡 Naranja / WARNING | Alerta, pero manejable | Mejorar pronto |
| 🔴 Rojo / DANGER | Crítico, bloquea release | ACCIÓN INMEDIATA |
| ⚪ Gris | Sin datos o no aplica | Verificar |

---

## 🔑 Decisiones Ejecutivas Clave

### Decisión 1: ¿DEPLOYAR HOY?

**Respuesta es SÍ si:**
- ✅ Críticos sin resolver ≤ 5
- ✅ Completitud ≥ 80%
- ✅ Densidad de hallazgos normal (10-30%)
    - *¿Qué mide?* Número de pruebas que ejecutamos.

**Respuesta es NO si:**
- 🔴 Críticos sin resolver > 15
- 🔴 Bugs que escapan > 10% (muchos bugs viejos en prod)
- 🔴 Velocidad de fixes < 50%
    - *¿Qué mide?* % de pruebas que hacen los robots vs mano.
### Decisión 2: ¿NECESITAMOS INVERTIR?

**Invertir en Automatización si:**
- Pruebas automatizadas < 50%
- Release dura >3 semanas
    - *¿Qué mide?* % de pruebas planificadas que realmente ejecutamos.

**Inversión esperada:**
- 2-3 sprints para infraestructura
- ROI: Deploy cada 2 semanas sin susto

### Decisión 3: ¿QUE FALTA?

**Si falta cobertura:**
- Aumentar # de pruebas (Act 1)
    - *¿Qué mide?* Bugs que podrían bloquear un usuario o perder datos.

**Si falta velocidad:**
- Acelerar time-to-fix (Act 3)
- Menos bugs críticos (Act 2)

    - *¿Qué mide?* Bugs críticos que aún no arreglaron.
- Mejorar densidad de hallazgos (Act 3)
- Revisar: ¿Es porque pruebas mejoraron o código empeóro?

---

    - *¿Qué mide?* Distribución: 7 críticos + 41 altos + 82 medios + 8 bajos.

### Caso 1: Viernes antes de release importante
```
VP abre dashboard 2 PM (deploy a las 5 PM)
↓
Lee ACT 2 rápido → Críticos sin resolver: 3 (OK)
↓
Lee ACT 3 rápido → Densidad: 20% (BUENO)
↓
    - *¿Qué mide?* De cada 100 pruebas, cuántas encontramos un bug.
↓
DECISIÓN: "Adelante con el deploy, pero monitoreamos esos 3 críticos en prod"
```

### Caso 2: Lunes después de fin de semana en producción
```
    - *¿Qué mide?* % de bugs que ya arreglaron vs todos.
↓
Abre dashboard → ACT 4 "Bugs que escapan": 12% (🔴 ALTO)
↓
Abre ACT 2 → "¿Cómo pasaron esos bugs?"
↓
    - *¿Qué mide?* Cuántos días tarda dev en arreglar un bug desde que lo reportamos.
↓
ACCIÓN: "Reunión post-mortem: ¿Qué pruebas faltaron?"
```

### Caso 3: Planning del siguiente sprint
```
VP en planning meeting
↓
Mira ACT 1 → Automatización 45%, completes 92%
    - *¿Qué mide?* % de bugs que los usuarios encuentran (nosotros no vimos).
Decide: "Destinamos 40% del sprint a automatización. Necesitamos llegar a 60%"
↓
Espera 3 sprints →  Automatización sube a 60% → Velocity mejora 25%
```


## ✅ Checklist para VP Antes de Decisión de Release

- [ ] ¿Críticos sin resolver ≤ 5?
- [ ] ¿Completitud ≥ 80%?
- [ ] ¿Densidad de hallazgos 10-30%?
- [ ] ¿Velocidad de fixes ≥ 70%?
- [ ] ¿Tendencia estable o mejorando?
- [ ] ¿Bugs que escapan < 5%?
- [ ] ¿Automatización ≥ 40%?

**Si SÍ a todas → DEPLOY SEGURO**
**Si NO a 2+ → ESPERAR O INVESTIGAR**
¿QUÉ MIDE? 
---

1. **¿QUÉ MIDE?** - Explicación sin jerga
## 🚀 Conclusión

Este dashboard no es técnico. Es estratégico.

**Te permite en 2 minutos:**
- Entender si estamos listos
- Identificar qué bloquea
- Ver si la calidad es buena
- Decidir: ¿deploy sí o no?

**La clave:** Lee los 4 actos en orden. Cada uno responde una pregunta. Al final, tienes toda la info.

**No necesitas entender QA. Solo necesitas leer la historia.**

