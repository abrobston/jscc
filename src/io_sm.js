/* -MODULE----------------------------------------------------------------------
JS/CC LALR(1) Parser Generator
Copyright (C) 2007-2012 by Phorward Software Technologies, Jan Max Meyer

File:	io_sm.js
Author: Jan Max Meyer
Usage:	Console-based wrapper function set for JS/CC to be executed
		via Mozilla/Spidermonkey

You may use, modify and distribute this software under the terms and conditions
of the BSD license. Please see LICENSE for more information.
----------------------------------------------------------------------------- */

function _error( msg )
{
	if( show_errors )
		print( "/*--- error: " + msg + " */" );

	errors++;
}

function _warning( msg )
{
	if( show_warnings )
		print( "/*--- warning: " + msg + " */" );

	warnings++;
}

function _print( txt )
{
	print( txt );
}

var DEFAULT_DRIVER = "";

//The rest of the platform-dependent code is done in jscc_main_sm.js,
//because Spidermonkey can't handle files.
