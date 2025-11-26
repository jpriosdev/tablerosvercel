# 🚀 QUICK START - SQLite Migration (Refactorizado v2.0)

## ✅ Requisitos Previos

- Node.js v18+
- npm v9+
- `data/Reporte_QA_V2.xlsx` (archivo Excel con datos)

---

## Paso 1: Inicializar Base de Datos

```bash
cd TableroQA
npm run db:setup
```

**Resultado esperado:**
```
🚀 SETUP COMPLETO: SQLite
✅ Base de datos creada: public/data/qa-dashboard.db
✅ Schema creado exitosamente
✅ 12 versiones/sprints cargados
✅ 238 bugs/incidencias cargados
✅ MIGRACIÓN COMPLETADA
```

---

## Paso 2: Verificar Configuración

```bash
npm run db:verify
```

**Resultado esperado:**
```
🔍 Verificando configuración de SQLite...
✅ Archivo de BD encontrado
✅ Tablas encontradas:
   ✅ audit_log
   ✅ bugs_detail
   ✅ sprints_versions
📈 Bugs cargados: 238
📈 Sprints cargados: 12
✅ CONFIGURACIÓN CORRECTA - Todo listo para usar
```

---

## Paso 3: Iniciar Servidor

```bash
npm run dev
```

**Resultado esperado:**
```
▲ Next.js 14.2.33
- Local: http://localhost:3000
- Environment: development
- API Routes: /api/* endpoints available
```

---

## Paso 4: Verificar Endpoints

### Test 1: Datos QA
```bash
curl http://localhost:3000/api/qa-data | jq '.summary'
```

**Respuesta esperada:**
```json
{
  "totalBugs": 238,
  "bugsClosed": 112,
  "bugsPending": 126
}
```

### Test 2: Verificación de Integridad
```bash
curl http://localhost:3000/api/verify-data | jq '.sources'
```

**Respuesta esperada:**
```json
{
  "sqlite": {
    "totalBugs": 238,
    "totalSprints": 12,
    "criticalBugs": 119
  },
  "json": {
    "totalBugs": 238,
    "sprints": 12
  }
}
```

---

## Paso 5: Acceder al Dashboard

Abre en navegador:
```
http://localhost:3000/qa-dashboard
```

✅ Debe mostrar:
- **238 bugs totales**
- **119 críticos** (Más alta + Alta)
- **126 pendientes**
- **12 sprints** en filtros
- Todos los módulos, desarrolladores, categorías

---

## 📊 Comandos Disponibles

```bash
# ✅ RECOMENDADO: Setup completo (crea BD + migra datos)
npm run db:setup

# Componentes individuales (si necesitas)
npm run db:init      # Solo crear tablas y vistas
npm run db:migrate   # Solo migrar datos desde Excel
npm run db:verify    # Verificación de datos

# Desarrollo
npm run dev          # Inicia servidor (localhost:3000)
npm run build        # Build para producción
npm run start        # Inicia servidor producción

# Análisis (antiguo - opcional)
npm run generate-json # Genera JSON en memoria
```

---

## 🔧 Solución de Problemas

### Error: "Base de datos no encontrada"
```bash
# Solución:
npm run db:setup
```

### Error: "Cannot find module"
```bash
# Solución:
rm -rf node_modules
npm install
npm run db:setup
```

### Cache antiguo
```bash
# Forzar recarga desde BD:
curl http://localhost:3000/api/qa-data?force=1
```

### Datos no actualizados
```bash
# Verificar que datos están en BD:
npm run db:verify

# Si faltan datos, reiniciar:
npm run db:setup
```

---

## 📈 Monitoreo de Datos

### Contar registros en BD
```bash
# Desde terminal:
npm run db:verify

# Respuesta incluye:
# - Cantidad de bugs en BD
# - Cantidad de sprints
# - Status general
```

### Verificar sincronización
```bash
curl http://localhost:3000/api/verify-data | jq '.differences'
```

**Respuesta esperada:**
```json
{
  "totalBugsMatch": true,
  "sprintsMatch": true,
  "matchPercentage": 100
}
```

---

## 🚀 Características Nuevas v2.0

| Feature | Antes | Ahora |
|---------|-------|-------|
| Almacenamiento | JSON en memoria | SQLite en disco |
| Persistencia | Solo en sesión | Permanente |
| Performance | +300ms | Queries directas |
| Escalabilidad | Limitado | Ilimitado |
| Cache | Manual | Automático (5 min) |
| Verificación | Manual | Automática (`db:verify`) |

---

## 📚 Documentación Completa

- **REFACTORING_CHANGELOG.md** - Cambios realizados (v2.0)
- **MIGRATION_COMPLETE.md** - Detalles técnicos de migración
- **SQLITE_ARCHITECTURE.md** - Diagrama de schema y queries
- **PROJECT_COMPLETION_REPORT.md** - Reporte ejecutivo

---

## ✨ Tips Avanzados

### Force reload de caché
```bash
# API ignorará cache de 5 minutos
curl http://localhost:3000/api/qa-data?force=1
```

### Ver endpoint alternativo
```bash
# Mismo resultado pero diferente implementación
curl http://localhost:3000/api/qa-data-v2
```

### Filtros avanzados
```javascript
// En componentes React:
import DAL from '@/lib/database/dal';

const bugs = await DAL.getBugsFiltered({
  sprint: '18',
  prioridad: 'Alta',
  estado: 'Tareas por hacer'
});
```

---

## 🎯 Próximos Pasos

1. ✅ Base de datos configurada
2. ✅ Servidor funcionando
3. ✅ Dashboard accesible

**Listo para:**
- Agregar nuevas métricas
- Crear reportes personalizados
- Integrar con otros sistemas
- Escalar a base de datos más grande

---

**¿Problemas?** → Ejecuta: `npm run db:verify`  
**¿Necesitas resetear?** → Ejecuta: `npm run db:setup`  
**¿Necesitas logs?** → Ejecuta: `npm run dev` y revisa consola

(async () => {
  const stats = await DAL.getStatistics();
  console.log(stats);
})();
"
```

### Ver bugs de un sprint
```bash
node -e "
const DAL = require('./lib/database/dal.js');
(async () => {
  const bugs = await DAL.getBugsBySprintNumber(16);
  console.log(bugs);
})();
"
```

### Ver bugs de un desarrollador
```bash
node -e "
const DAL = require('./lib/database/dal.js');
(async () => {
  const bugs = await DAL.getBugsByDeveloper();
  console.log(bugs);
})();
"
```

---

## 📋 Checklist de Verificación

- [ ] BD creada: `public/data/qa-dashboard.db` existe
- [ ] Datos migrados: 238 bugs cargados
- [ ] API funciona: `/api/verify-data` retorna 200
- [ ] Dashboard accesible: http://localhost:3000/qa-dashboard
- [ ] Filtros funcionan: Puede seleccionar sprints y tipos de prueba
- [ ] Métricas correctas: 238 bugs, 119 críticos, 126 pendientes

---

## ⚠️ Troubleshooting

### Error: "BD no encontrada"
```bash
npm run db:setup
```

### Error: "Módulo DAL no encontrado"
```bash
# Asegurar que estamos en TableroQA
cd TableroQA
npm run dev
```

### Datos no actualizados
```bash
curl "http://localhost:3000/api/qa-data?force=1"
```

### Limpiar y comenzar de cero
```bash
rm public/data/qa-dashboard.db
npm run db:setup
npm run dev
```

---

## 📞 Información Técnica

**Base de Datos:** SQLite3  
**Archivo:** `public/data/qa-dashboard.db`  
**Tablas:** 3 (sprints_versions, bugs_detail, audit_log)  
**Vistas:** 7 vistas SQL para agregaciones  
**DAL:** 25+ funciones en `lib/database/dal.js`  

**Compatibilidad:** 100% con versión anterior (JSON)  
**API Endpoints:** `/api/qa-data`, `/api/verify-data`, `/api/qa-data-v2`

---

¡Listo! SQLite está configurado y funcionando. 🎉
