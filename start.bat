@echo off
setlocal enabledelayedexpansion

title XemStreak - Fullstack Launcher
color 0B

echo ================================================================
echo           XemStreak: Focus, Streak Garden ^& Study Rooms
echo ================================================================
echo.

:: 1. Check Node.js installation
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not found in PATH!
    echo Please download and install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

:: 2. Check Python installation
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not found in PATH!
    echo Please install Python 3.10+ and add it to your environment PATH.
    pause
    exit /b 1
)

:: 3. Optional Virtualenv Detection
if exist ".venv\Scripts\activate.bat" (
    echo [INFO] Activating virtual environment (.venv)...
    call .venv\Scripts\activate.bat
) else if exist "venv\Scripts\activate.bat" (
    echo [INFO] Activating virtual environment (venv)...
    call venv\Scripts\activate.bat
)

:: 4. Verify node_modules
if not exist "node_modules" (
    echo [INFO] node_modules not found. Installing dependencies...
    call npm install
)

echo.
echo [STATUS] Starting services concurrently:
echo   - Frontend:  http://localhost:5173/
echo   - Backend:   http://127.0.0.1:8000/
echo   - API Docs:  http://127.0.0.1:8000/docs
echo.
echo Press Ctrl+C in this window to stop both servers.
echo ================================================================
echo.

npm run dev:all

if %errorlevel% neq 0 (
    echo.
    echo [WARNING] Application stopped with exit code %errorlevel%.
    pause
)
