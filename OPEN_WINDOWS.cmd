@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
 echo Install Node.js LTS from https://nodejs.org/en/download then reopen this file.
 pause
 exit /b 1
)
node app/preflight.mjs
if errorlevel 1 (
 pause
 exit /b 1
)
node app/server.mjs
pause
