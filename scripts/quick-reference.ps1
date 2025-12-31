# scripts/quick-reference.ps1
# Referencia rápida de comandos (Windows)

Write-Host ""
Write-Host "======== TableroQA - Referencia Rapida (Windows) ========" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1] INSTALACION Y SETUP" -ForegroundColor Yellow
Write-Host "  npm install" -ForegroundColor Gray
Write-Host "  npm install sqlite3" -ForegroundColor Gray
Write-Host "  node scripts\load-xlsx-to-sqlite.js" -ForegroundColor Gray
Write-Host ""

Write-Host "[2] DESARROLLO" -ForegroundColor Yellow
Write-Host "  npm run dev              (Inicia servidor)" -ForegroundColor Gray
Write-Host "  npm run build            (Compilacion)" -ForegroundColor Gray
Write-Host ""

Write-Host "[3] DEBUG" -ForegroundColor Yellow
Write-Host "  node lib\db-status.js    (Estado BD)" -ForegroundColor Gray
Write-Host "  dir data\tableroqua.db   (Verificar BD)" -ForegroundColor Gray
Write-Host ""

Write-Host "[4] APIs DISPONIBLES" -ForegroundColor Yellow
Write-Host "  GET /api/qa-data-v2              (Todos los datos)" -ForegroundColor Gray
Write-Host "  GET /api/qa-data-v2?type=summary (Resumen)" -ForegroundColor Gray
Write-Host "  GET /api/search-bugs              (Buscar)" -ForegroundColor Gray
Write-Host "  GET /api/quality-report          (Reporte)" -ForegroundColor Gray
Write-Host ""

Write-Host "[5] DATOS" -ForegroundColor Yellow
Write-Host "  Bugs: 138" -ForegroundColor Gray
Write-Host "  Sprints: 7" -ForegroundColor Gray
Write-Host "  Desarrolladores: 17" -ForegroundColor Gray
Write-Host "  Modulos: 13" -ForegroundColor Gray
Write-Host ""

Write-Host "========== Ver documentacion ==========" -ForegroundColor Cyan
Write-Host "  IMPLEMENTACION_COMPLETA.md" -ForegroundColor Gray
Write-Host "  ARQUITECTURA_SIMPLIFICADA.md" -ForegroundColor Gray
Write-Host "  SQLITE_SETUP_GUIDE.md" -ForegroundColor Gray
Write-Host ""
