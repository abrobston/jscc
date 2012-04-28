#-------------------------------------------------------------------------------
# Build system for JS/CC LALR(1) Parser Generator
# Copyright (C) 2007-2012 by Phorward Software Technologies, Jan Max Meyer
#
# You may use, modify and distribute this software under the terms and
# conditions of the BSD license. Please see LICENSE for more information.
#
# Platform independet sources.inc
#-------------------------------------------------------------------------------

# JS/CC constant sources
SRC_GLOBAL		=	global.js \
					io_$(PLATFORM).js

SRC_MODULES		=	debug.js \
					first.js \
					printtab.js \
					tabgen.js \
					util.js \
					bitset.js \
					integrity.js \
					lexdfa.js \
					lexdbg.js

SRC_MAIN		= 	main.js

# JS/CC internal parsers
SRC_PARSE		=	parse.par
SRC_REGEX		=	regex.par
SRC_PARSE_JS	=	parse.js
SRC_REGEX_JS	=	regex.js

# JS/CC source variables
SRC				=	$(SRC_GLOBAL) \
					$(SRC_MODULES) \
					$(SRC_PARSE) \
					$(SRC_REGEX) \
					$(SRC_MAIN)

SRC_FINAL		=	$(SRC_GLOBAL) \
					$(SRC_MODULES) \
					$(SRC_PARSE_JS) \
					$(SRC_REGEX_JS) \
					$(SRC_MAIN)

