# NagarSetu AI - Quick Start Script
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "Starting NagarSetu AI (Backend + Frontend)..." -ForegroundColor Yellow
Write-Host "==============================================" -ForegroundColor Cyan

# Start Backend in new process
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; & '.\.venv\Scripts\uvicorn.exe' main:app --reload --port 8000"

# Start Frontend in current process
Set-Location "$PSScriptRoot\frontend"
npm.cmd run dev
