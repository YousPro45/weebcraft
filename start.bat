@echo off
title WebCraft - Start Dev Server
cd /d "%~dp0"

echo.
echo  ==========================================
echo   WebCraft Maroc - Starting Dev Server
echo  ==========================================
echo.

:: Check if already running
npx pm2 describe webcraft >nul 2>&1
if %errorlevel% equ 0 (
    echo  [INFO] Server is already running.
    echo  [INFO] Visit: http://localhost:3000
    echo.
    npx pm2 status webcraft
    echo.
    pause
    exit /b 0
)

echo  [INFO] Starting server in background via PM2...
npx pm2 start ecosystem.config.cjs

echo.
echo  [OK] Server started! It will keep running even if you close this window.
echo  [OK] Visit: http://localhost:3000
echo.
echo  Other commands:
echo    stop.bat    - Stop the server
echo    status.bat  - Check if it's running
echo    logs.bat    - View live logs
echo.
pause
