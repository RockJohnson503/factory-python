@echo off

title '����������'

choice /c 123 /m "1.�ر�Apache����, 2.����Apache����, 3.����Apache����"

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