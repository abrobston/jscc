#-------------------------------------------------------------------------------
# Makefile for JS/CC Samples
# This Makefile is in the Public Domain.
#-------------------------------------------------------------------------------

EXEC = calc.exe calc.js calc.html xpl.js xpl_opt.js

all: $(EXEC)
	@echo.
	@echo --- Compilation succeeded! ---

calc.exe: calc_dotnet.par
	..\jscc -o calc.js -t ..\driver.js_ -w calc_dotnet.par
	jsc /out:calc.exe /t:exe calc.js
	@del calc.js

calc.js: calc_wsh.par
	..\jscc -o calc.js -t ..\driver.js_ -w calc_wsh.par

calc.html: calc_web.par
	..\jscc -o calc.html -t ..\driver_web.js_ -w calc_web.par

xpl.js: xpl.par
	..\jscc -o xpl.js -t ..\driver.js_ -w xpl.par

xpl_opt.js: xpl_opt.par
	..\jscc -o xpl_opt.js -t ..\driver.js_ -w xpl_opt.par

clean:
	@del $(EXEC)
