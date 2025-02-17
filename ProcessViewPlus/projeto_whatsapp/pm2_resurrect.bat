@echo off
timeout /t 30 /nobreak >nul
pm2 resurrect
exit
