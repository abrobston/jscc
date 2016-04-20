@echo off
SETLOCAL
REM Find the Rhino executable
SET _jar_dir=%~dp0\..\jar
SET _rhino_path=none
FOR /F "delims=`" %%g IN ('DIR %_jar_dir% /S /A:-D /O:D /b ^| FINDSTR /I "rhino[^\\]*\.jar$"') DO IF "%_rhino_path%"=="none" SET _rhino_path=%%g
IF "%_rhino_path%"=="none" (
    ECHO "rhino*.jar was not found in any subdirectory of %_jar_dir%"
    EXIT 1
)
"%JAVA_HOME%\bin\java.exe" -server -XX:+TieredCompilation -classpath "%_rhino_path%" org.mozilla.javascript.tools.shell.Main -opt -1 %~dp0\runner-java.js %~dp0 rhino %*
EXIT %ERRORLEVEL%
ENDLOCAL