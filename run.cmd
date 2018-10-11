@ECHO off
IF NOT DEFINED IS_CHILD_PROCESS (CMD /K SET IS_CHILD_PROCESS=1 ^& %0 %*) & EXIT )
TITLE ESXBot Bot
CLS
COLOR 0F
ECHO.

SET cwd=%~dp0

ECHO [ESXBot]: Checking System...
IF EXIST esxbot.js (
  ECHO [ESXBot]: System Checked. O7. Booting up...
  node .
) ELSE (
  TITLE [ERROR] System Check Failed
  ECHO [ESXBot]: System check failed. Check if you ESXBot BOT installed correctly.
  GOTO :EXIT
)
ECHO.

EXIT /B 0

:EXIT
ECHO.
ECHO [ESXBot]: Press any key to exit.
PAUSE >nul 2>&1
CD /D "%cwd%"
TITLE Windows Command Prompt (CMD)
COLOR
