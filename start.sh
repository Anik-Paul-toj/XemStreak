#!/usr/bin/env bash
# XemStreak - Fullstack Launcher (Linux / macOS / Git Bash)

echo "================================================================"
echo "         XemStreak: Focus, Streak Garden & Study Rooms          "
echo "================================================================"
echo ""

# 1. Check Node.js
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed or not in PATH!"
    exit 1
fi

# 2. Check Python
if command -v python3 &> /dev/null; then
    PYTHON_CMD=python3
elif command -v python &> /dev/null; then
    PYTHON_CMD=python
else
    echo "[ERROR] Python is not installed or not in PATH!"
    exit 1
fi

# 3. Virtual environment
if [ -f ".venv/bin/activate" ]; then
    echo "[INFO] Activating .venv..."
    source .venv/bin/activate
elif [ -f "venv/bin/activate" ]; then
    echo "[INFO] Activating venv..."
    source venv/bin/activate
fi

# 4. Install node_modules if needed
if [ ! -d "node_modules" ]; then
    echo "[INFO] Installing npm dependencies..."
    npm install
fi

echo ""
echo "[STATUS] Starting services concurrently:"
echo "  - Frontend:  http://localhost:5173/"
echo "  - Backend:   http://127.0.0.1:8000/"
echo "  - API Docs:  http://127.0.0.1:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers."
echo "================================================================"
echo ""

npm run dev:all
