@echo off
SETLOCAL
REM Use PhantomJS from npm (the phantomjs-prebuilt package), but use the standalone
REM (non-Node) executable
SET _search_dir=%~dp0\..\node_modules\phantomjs-prebuilt
node.exe "%_search_dir%\install.js"
SET _phantom_path=none
FOR /F "delims=`" %%g IN ('DIR %_search_dir% /S /A:-D /O:D /b ^| FINDSTR /I "phantomjs\.exe$"') DO IF "%_phantom_path%"=="none" SET _phantom_path=%%g
IF "%_phantom_path%"=="none" (
    ECHO "phantomjs.exe was not found in any subdirectory of %_search_dir%"
    EXIT 1
) ELSE (
    "%_phantom_path%" %~dp0\runner-browser.js %*
)
ENDLOCAL