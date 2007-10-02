#-------------------------------------------------------------------------------
# Makefile for JS/CC: A LALR(1) Parser Generator written in JavaScript
# Copyright (C) 2007 by J.M.K S.F. Software Technologies, Jan Max Meyer
#
# --- Targets ---
# all:		Builds both the JS/CC executable and source version.
# sources:	Build sources only (compiles grammar parser and regular expression
#			parser using JS/CC itself).
# clean:	Deletes the JS/CC executable.
#
# The file jscc1.js is temporarily build and has no further usage.
#
#
# You may use, modify and distribute this software under the terms and conditions
# of the Artistic License. Please see ARTISTIC for more information.
#-------------------------------------------------------------------------------

EXEC		=	..\jscc.exe
TMP_EXEC	=	jscc1.js
SRC			=	jscc.js \
				jscc_debug.js \
				jscc_first.js \
				jscc_global.js \
				jscc_printtab.js \
				jscc_tabgen.js \
				jscc_util.js \
				jscc_bitset.js \
				jscc_integrity.js \
				jscc_lexdfa.js \
				jscc_lexdbg.js \
				jscc_regex.par \
				jscc_parse.par
				
all: $(EXEC)
	@echo.
	@echo --- Compilation succeeded! ---

sources: $(SRC)
	copy 	/B jscc_global.js + \
			/B jscc_debug.js + \
			/B jscc_first.js + \
			/B jscc_parse.js + \
			/B jscc_printtab.js + \
			/B jscc_tabgen.js + \
			/B jscc_util.js + \
			/B jscc_bitset.js + \
			/B jscc_integrity.js + \
			/B jscc_REGEX.js + \
			/B jscc_lexdfa.js + \
			/B jscc_lexdbg.js + \
			/B jscc.js \
			jscc1.js
	cscript //Nologo jscc1.js -o jscc_PARSE.js -p jscc -t ..\driver.js_ jscc_parse.par
	cscript //Nologo jscc1.js -o jscc_PARSE_WEB.js -p jscc -t ..\driver_web.js_ jscc_parse.par
	cscript //Nologo jscc1.js -o jscc_REGEX.js -p regex -t ..\driver.js_ jscc_regex.par
	cscript //Nologo jscc1.js -o jscc_REGEX_WEB.js -p regex -t ..\driver_web.js_ jscc_regex.par
	@del jscc1.js

$(EXEC): sources
	copy 	/B jscc_global.js + \
			/B jscc_debug.js + \
			/B jscc_first.js + \
			/B jscc_parse.js + \
			/B jscc_printtab.js + \
			/B jscc_tabgen.js + \
			/B jscc_util.js + \
			/B jscc_bitset.js + \
			/B jscc_integrity.js + \
			/B jscc_REGEX.js + \
			/B jscc_lexdfa.js + \
			/B jscc_lexdbg.js + \
			/B jscc.js \
			jscc1.js
	jsc /out:$(EXEC) /t:exe jscc1.js
	@del jscc1.js

clean:
	@del $(EXEC)
