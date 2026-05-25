@echo off
chcp 65001 >nul
cd /d "%~dp0docs"
echo Ovarian Signature Explorer
echo.
echo Сайт: http://localhost:8765
echo Закройте это окно чтобы остановить сервер.
echo.
start http://localhost:8765
python -m http.server 8765
