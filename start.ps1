# XemStreak - Fullstack PowerShell Launcher
$Host.UI.RawUI.WindowTitle = "XemStreak - Fullstack Launcher"

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "         XemStreak: Focus, Streak Garden & Study Rooms          " -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Check Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Node.js is not installed or not found in PATH!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit..."
    exit 1
}

# 2. Check Python
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Python is not installed or not found in PATH!" -ForegroundColor Red
    Write-Host "Please install Python 3.10+ and add it to your environment PATH." -ForegroundColor Yellow
    Read-Host "Press Enter to exit..."
    exit 1
}

# 3. Virtual Environment Check
if (Test-Path ".venv\Scripts\Activate.ps1") {
    Write-Host "[INFO] Activating virtual environment (.venv)..." -ForegroundColor Yellow
    & .venv\Scripts\Activate.ps1
} elseif (Test-Path "venv\Scripts\Activate.ps1") {
    Write-Host "[INFO] Activating virtual environment (venv)..." -ForegroundColor Yellow
    & venv\Scripts\Activate.ps1
}

# 4. node_modules check
if (-not (Test-Path "node_modules")) {
    Write-Host "[INFO] node_modules not found. Running npm install..." -ForegroundColor Yellow
    npm install
}

Write-Host ""
Write-Host "[STATUS] Starting services concurrently:" -ForegroundColor Green
Write-Host "  - Frontend:  http://localhost:5173/" -ForegroundColor Cyan
Write-Host "  - Backend:   http://127.0.0.1:8000/" -ForegroundColor Magenta
Write-Host "  - API Docs:  http://127.0.0.1:8000/docs" -ForegroundColor Gray
Write-Host ""
Write-Host "Press Ctrl+C in this terminal to stop both servers." -ForegroundColor DarkGray
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

npm run dev:all
