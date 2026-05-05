@echo off
REM Monroe v2 - Quick Start Setup Script for Windows
REM This script sets up Monroe v2 for development on Windows

echo.
echo ========================================================
echo  Monroe v2 - Production-Ready Trading Dashboard
echo ========================================================
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python not found. Please install Python 3.8^+
    exit /b 1
)

REM Check Node
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js not found. Please install Node.js 16^+
    exit /b 1
)

echo Checking prerequisites...
python --version
node --version
npm --version
echo.

REM Setup backend
echo Setting up backend...
cd backend

REM Create virtual environment
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing Python packages...
pip install --upgrade pip >nul 2>&1
pip install -r requirements.txt >nul 2>&1

REM Setup .env
if not exist ".env" (
    echo Creating .env file...
    copy .env.example .env
    echo Warning: Update backend\.env with your database URL if needed
)

cd ..

echo Backend setup complete
echo.

REM Setup frontend
echo Setting up frontend...
cd frontend

REM Install dependencies
if not exist "node_modules" (
    echo Installing npm packages...
    npm install >nul 2>&1
)

cd ..

echo Frontend setup complete
echo.

REM Summary
echo ========================================================
echo  Monroe v2 Setup Complete!
echo ========================================================
echo.
echo Next Steps:
echo.
echo 1. Start Backend (PowerShell 1):
echo    cd backend
echo    venv\Scripts\activate.bat
echo    python -m uvicorn app.main:app --reload
echo.
echo 2. Start Frontend (PowerShell 2):
echo    cd frontend
echo    npm run dev
echo.
echo 3. Open Dashboard:
echo    http://localhost:5173
echo.
echo 4. API Documentation:
echo    http://localhost:8000/docs
echo.
echo Documentation:
echo - README.md - Project overview and features
echo - DEVELOPMENT.md - Development guide
echo - DEPLOYMENT.md - Production deployment
echo.
echo Happy trading! 
echo.
pause
