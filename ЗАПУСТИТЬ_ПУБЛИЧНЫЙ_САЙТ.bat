@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Запуск локального сервера и публичного туннеля...
start "HTTP 8765" /min cmd /c "cd /d %~dp0docs && python -m http.server 8765"
timeout /t 2 /nobreak >nul
start "Cloudflare tunnel" /min "%~dp0cloudflared.exe" tunnel --url http://localhost:8765
echo.
echo Через ~10 сек откройте cf_tunnel_err.log — там строка trycloudflare.com
echo Локально: http://localhost:8765
pause
