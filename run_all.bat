@echo off
title AICTE Pravah - Complete System Launcher
echo =====================================================================
echo    AICTE PRAVAH - SMART APPROVAL WORKFLOW & COMPLIANCE SYSTEM
echo             Problem Statement ID: 26262 (SIH Round 2)
echo =====================================================================
echo.
echo [1/2] Starting Backend Server on http://localhost:5000 ...
start "AICTE Pravah Backend (5000)" cmd /k "cd /d "%~dp0\backend" && node server.js"

timeout /t 3 /nobreak >nul

echo [2/2] Starting React Vite Frontend on http://localhost:5173 ...
start "AICTE Pravah Frontend (5173)" cmd /k "cd /d "%~dp0\frontend" && npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo [System Ready] Opening AICTE Pravah in default browser...
start http://localhost:5173

echo.
echo Application running smoothly! Keep terminal windows open.
pause
