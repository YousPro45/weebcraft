@echo off
title WebCraft - Stop Dev Server
cd /d "%~dp0"

echo.
echo  Stopping WebCraft dev server...
npx pm2 stop webcraft
npx pm2 delete webcraft

echo.
echo  [OK] Server stopped.
echo.
pause
