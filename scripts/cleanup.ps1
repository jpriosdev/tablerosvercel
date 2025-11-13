<#
.SYNOPSIS
  Limpia el proyecto localmente: elimina `node_modules` local, desindexa `node_modules` de git y crea un commit.

.DESCRIPTION
  Este script realiza pasos seguros para dejar el repositorio sin los módulos instalados.
  No reescribe el historial ni hace force-push. Para eliminar archivos grandes del historial debes usar
  `git-filter-repo` o BFG; el script muestra instrucciones para eso.

.NOTES
  Ejecutar desde: C:\Users\ultra\PycharmProjects\PythonProject\TableroQA
#>

param(
    [switch]$DeleteNodeModulesLocal = $true
)

Write-Output "== Cleanup script for TableroQA =="

# Check for git
try {
    git --version > $null 2>&1
} catch {
    Write-Error "Git no está instalado o no está en PATH. Instala Git y reintenta. https://git-scm.com/"
    exit 1
}

# Ensure we are inside a git repo
$isRepo = (git rev-parse --is-inside-work-tree 2>$null) -eq 'true'
if (-not $isRepo) {
    Write-Error "No parece que estés en un repositorio Git. Asegúrate de ejecutar este script desde la carpeta del repo."
    exit 1
}

if ($DeleteNodeModulesLocal) {
    if (Test-Path -LiteralPath "node_modules") {
        Write-Output "Eliminando carpeta local node_modules..."
        Remove-Item -Recurse -Force -LiteralPath "node_modules"
        Write-Output "node_modules eliminado localmente."
    } else {
        Write-Output "No existe carpeta node_modules localmente."
    }
}

Write-Output "Desindexando node_modules del índice de git (git rm --cached)..."
try {
    git rm -r --cached node_modules 2>&1 | Write-Output
} catch {
    Write-Warning "No se pudo desindexar node_modules (posible que no esté en el índice). Continuando..."
}

Write-Output "Creando commit que elimina node_modules del repositorio (solo en el working tree)..."
try {
    git add .gitignore 2>$null
    $status = git status --porcelain
    if ($status) {
        git commit -m "chore: remove node_modules from repo and add .gitignore" 2>&1 | Write-Output
        Write-Output "Commit creado."
    } else {
        Write-Output "No hay cambios para commitear."
    }
} catch {
    Write-Warning "Error al crear commit: $_"
}

Write-Output "\nIMPORTANTE: Esto elimina node_modules del índice en el commit actual, pero SI el archivo grande ya está en la historia remota, el push seguirá siendo rechazado."
Write-Output "Para eliminar archivos grandes del historial remoto sigue uno de estos métodos (haz un respaldo primero):"
Write-Output "  - Usar git-filter-repo (recomendado): https://github.com/newren/git-filter-repo"
Write-Output "  - Usar BFG Repo-Cleaner: https://rtyley.github.io/bfg-repo-cleaner/"

Write-Output "Ejemplo (usar desde la raíz del repo, crear antes un mirror como backup):"
Write-Output "  git clone --mirror <repo-url> repo-mirror.git"
Write-Output "  # luego en repo-mirror.git usar git-filter-repo o BFG para eliminar rutas/archivos grandes"

Write-Output "Si quieres, puedo generar instrucciones exactas para git-filter-repo o BFG y ayudarte a preparar el push forzado. Dime cómo prefieres proceder."

Write-Output "== Fin del script =="
