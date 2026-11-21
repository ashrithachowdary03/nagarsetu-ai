@echo off
title NagarSetu AI Launcher
echo ========================================================
echo Starting NagarSetu AI Platform...
echo ========================================================

cd /d "%~dp0backend"
start "NagarSetu AI - Backend API" cmd /k ".\.venv\Scripts\python.exe -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

cd /d "%~dp0frontend"
start "NagarSetu AI - Frontend UI" cmd /k "npm.cmd run dev -- --host 0.0.0.0"

echo.
echo NagarSetu AI is launching!
echo --------------------------------------------------------
echo  - Frontend UI:  http://localhost:5173
echo  - Direct IP:    http://127.0.0.1:5173
echo  - Backend API:  http://127.0.0.1:8000/docs
echo --------------------------------------------------------
echo You can keep these terminal windows open while testing.
echo ========================================================
pause
