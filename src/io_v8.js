/* -MODULE----------------------------------------------------------------------
JS/CC LALR(1) Parser Generator
Copyright (C) 2007-2012 by Phorward Software Technologies, Jan Max Meyer
Contibutions by Louis P. Santillan <lpsantil@gmail.com>
http://jscc.phorward-software.com ++ contact<<AT>>phorward-software<<DOT>>com

File:	io_v8.js
Author:	Louis P. Santillan
		Jan Max Meyer
Usage:	Console-based wrapper function set for JS/CC to be executed
		via Google's V8 engine

You may use, modify and distribute this software under the terms and conditions
of the BSD license. Please see LICENSE for more information.
----------------------------------------------------------------------------- */

var DEFAULT_DRIVER = "driver_v8.js_";

function _error( msg )
{
	if( show_errors )
		print( "error: " + file + ": " + msg );

	errors++;
}

function _warning( msg )
{
	if( show_warnings )
		print( "warning: " + file + ": "  + msg );

	warnings++;
}

function _print( txt )
{
	print( txt );
}

function _quit( exitcode )
{
	quit( exitcode );
}

function read_file( file )
{
	var src = new String();

	if( file_exists( file ) )
		src = file_read( file );
	else
	{
		_error( "unable to open file '" + file + "'" );
		quit();
	}

	return src;
}

function write_file( file, content )
{
	var f = file_write( file, content );

	if( !f )
	{
		_error( "unable to write '" + file + "'" );
		return false;
	}

	return true;
}

var args_global_var = arguments;
function get_arguments()
{
   return( args_global_var );
}

