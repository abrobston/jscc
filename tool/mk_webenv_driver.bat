@echo off
if "%1"=="" exit
type %1 | cscript mk_webenv_driver.js //Nologo >%1.out