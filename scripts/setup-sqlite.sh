#!/bin/bash
# scripts/setup-sqlite.sh
# Script de setup para inicializar BD SQLite con datos

echo "📊 Setup TableroQA con SQLite"
echo "=============================="
echo ""

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    exit 1
fi

echo "1️⃣  Instalando dependencias..."
npm install

echo ""
echo "2️⃣  Cargando datos XLSX a SQLite..."
node scripts/load-xlsx-to-sqlite.js

echo ""
echo "3️⃣  Setup completado!"
echo ""
echo "Próximos pasos:"
echo "  npm run dev   # Inicia la aplicación"
echo ""
echo "URLs disponibles:"
echo "  http://localhost:3000              # Dashboard"
echo "  http://localhost:3000/api/qa-data-v2       # Datos QA"
echo "  http://localhost:3000/api/search-bugs      # Búsqueda"
echo "  http://localhost:3000/api/quality-report   # Reporte"
