#-------------------------------------------------------------------------------
# Build system for JS/CC: A LALR(1) Parser Generator written in JavaScript
# Copyright (C) 2007, 2008 by J.M.K S.F. Software Technologies, Jan Max Meyer
#
# You may use, modify and distribute this software under the terms and
# conditions of the Artistic License. Please see ARTISTIC for more information.
#
# Platform independet tools.inc
#-------------------------------------------------------------------------------

# Bootstrap-Version: JS/CC uses itself as parser-generator!
BOOTSTRAP		=	_boot_
JSCC_BOOTSTRAP	=	$(BOOTSTRAP)$(PLATFORM).js

