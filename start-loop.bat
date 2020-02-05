@echo off
set ttl=URLShortener
set /a repeat=0
goto loop

:loop
set /a repeat=%repeat% +1
npm start
cls
goto loop 