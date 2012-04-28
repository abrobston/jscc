#-------------------------------------------------------------------------------
# Build system for JS/CC LALR(1) Parser Generator
# Copyright (C) 2007-2012 by Phorward Software Technologies, Jan Max Meyer
#
# You may use, modify and distribute this software under the terms and
# conditions of the BSD license. Please see LICENSE for more information.
#
# Platform independet tools.inc
#-------------------------------------------------------------------------------

# Bootstrap-Version: JS/CC uses itself as parser-generator!
BOOTSTRAP		=	_boot_
JSCC_BOOTSTRAP	=	$(BOOTSTRAP)$(PLATFORM).js

