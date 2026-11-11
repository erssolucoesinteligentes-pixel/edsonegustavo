@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
 echo Instale o Node.js 22.13 ou superior.
 pause
 exit /b 1
)
echo Abra http://localhost:3000 no navegador.
node scripts/serve-web.mjs
pause
