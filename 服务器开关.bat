@echo off

title '服务器开关'

choice /c 123 /m "1.关闭Apache服务, 2.开启Apache服务, 3.重启Apache服务"

if errorlevel 3 goto restart

if errorlevel 2 goto start

if errorlevel 1 goto stop

:restart
net stop apache
net start apache
goto end

:start
net start apache
goto end

:stop
net stop apache
goto end

pause