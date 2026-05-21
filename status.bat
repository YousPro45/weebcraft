@echo off
title WebCraft - Server Status
cd /d "%~dp0"

echo.
echo  WebCraft Dev Server Status:
echo  ===========================
npx pm2 status
echo.
pause
