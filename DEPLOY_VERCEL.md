# Despliegue en Vercel con DB pre-poblada

Instrucciones rápidas para desplegar este proyecto en Vercel usando la base de datos SQLite pre-poblada incluida en el repositorio.

1) Incluir la DB en el repo

- El archivo `data/tableroqua.db` ya existe en la rama. Asegúrese de commitearlo:

```bash
git add data/tableroqua.db
git commit -m "chore: add prepopulated SQLite DB for Vercel read-only deployments"
git push origin Version-Mejorada
```

2) Configurar variables de entorno en Vercel

- En el Dashboard de Vercel, en Settings > Environment Variables, añada al menos las siguientes variables:
  - `DB_READ_ONLY` = `true`
  - `AUTH_COOKIE_SECRET` = `<random-long-secret>` (obligatorio para producción)
  - `NEXT_PUBLIC_BASE_URL` = `https://your-vercel-app.vercel.app`
  - (opcional) `VERCEL` = `1`

El servidor detectará `DB_READ_ONLY` o `VERCEL` y abrirá la DB en modo lectura para evitar escrituras en el sistema de archivos. `AUTH_COOKIE_SECRET` se usa para firmar/validar las sesiones JWT.

Si vas a usar el proveedor OIDC corporativo (Abstracta), añade también:
  - `ABSTRA_ISSUER` = `https://id.abstracta.us` (o el issuer real de Abstracta)
  - `ABSTRA_CLIENT_ID` = `...`
  - `ABSTRA_CLIENT_SECRET` = `...`
  - `ABSTRA_REDIRECT_URI` = `https://your-vercel-app.vercel.app/api/auth/callback`

3) `.vercelignore`

- Este repositorio incluye una `.vercelignore` que excluye `node_modules`, `.next`, `out`, etc., pero contiene una negación para `data/tableroqua.db` para asegurar que la DB se suba al despliegue.

4) Alternativa recomendada

- Para producción a largo plazo, considere migrar a una DB administrada (Postgres, Cloud SQL). Incluir una DB SQLite en el repo es rápido para prototipos pero tiene limitaciones en producción.
