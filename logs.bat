@echo off
title WebCraft - Live Logs
cd /d "%~dp0"

echo.
echo  Streaming live logs (Ctrl+C to stop)...
echo.
npx pm2 logs webcraft
