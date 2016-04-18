@echo off
SETLOCAL
SET _this_dir=%~dp0
SET _jjs=%JAVA_HOME%\bin\jjs.exe
IF NOT EXIST "%_jjs%" (
    ECHO "Nashorn executable not found at %_jjs%.  Ensure that the JAVA_HOME environment variable points to the root of a Java 8 or later installation."
    EXIT 1
)
"%_jjs%" -doe --debug-locals=true --debug-lines=true %~dp0\runner-java.js -- %~dp0 nashorn %*
ENDLOCAL
