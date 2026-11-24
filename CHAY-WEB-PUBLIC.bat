@echo off
chcp 65001 >nul
title GIA HUY PORTFOLIO - APPLE OS 26 SERVER & PUBLIC WEB
echo =====================================================================
echo   [LOG HE THONG] DANG KHOI CHAY MAY CHU PORTFOLIO GIA HUY...
echo =====================================================================
set "PATH=%USERPROFILE%\.local\tools\node-v22.14.0-win-x64;%USERPROFILE%\.local\tools\mingit\cmd;%USERPROFILE%\.local\tools;%PATH%"
cd /d "f:\AI"

start "NextJS Production Server" cmd /c "npm run start"
timeout /t 3 >nul
echo.
echo [LOG DEPLOY] Dang mo duong link Public HTTPS qua Cloudflare Tunnel...
echo Hay copy duong link https://....trycloudflare.com hien ra ben duoi de gui khach hang:
echo.
"%USERPROFILE%\.local\tools\cloudflared.exe" tunnel --url http://localhost:3000 --no-autoupdate
pause
