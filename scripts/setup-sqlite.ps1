# scripts/setup-sqlite.ps1
# Script de setup para inicializar BD SQLite con datos (Windows)

Write-Host "📊 Setup TableroQA con SQLite" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js no está instalado" -ForegroundColor Red
    exit 1
}

Write-Host "1️⃣  Instalando dependencias..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error instalando dependencias" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "2️⃣  Cargando datos XLSX a SQLite..." -ForegroundColor Yellow
node scripts/load-xlsx-to-sqlite.js

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error cargando datos" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "3️⃣  Setup completado!" -ForegroundColor Green
Write-Host ""
Write-Host "Próximos pasos:" -ForegroundColor Cyan
Write-Host "  npm run dev   # Inicia la aplicación" -ForegroundColor Gray
Write-Host ""
Write-Host "URLs disponibles:" -ForegroundColor Cyan
Write-Host "  http://localhost:3000                  # Dashboard" -ForegroundColor Gray
Write-Host "  http://localhost:3000/api/qa-data-v2  # Datos QA" -ForegroundColor Gray
Write-Host "  http://localhost:3000/api/search-bugs # Búsqueda" -ForegroundColor Gray
Write-Host "  http://localhost:3000/api/quality-report # Reporte" -ForegroundColor Gray
