/* -MODULE----------------------------------------------------------------------
JS/CC: A LALR(1) Parser Generator written in JavaScript
Copyright (C) 2007, 2008 by J.M.K S.F. Software Technologies, Jan Max Meyer
Contibutions by Louis P. Santillan <lpsantil@gmail.com>
http://www.jmksf.com ++ jscc<-AT->jmksf.com

File:	io_rhino.js
Author:	Louis P. Santillan
		Jan Max Meyer
Usage:	Console-based wrapper function set for JS/CC to be executed
		via Mozilla/Rhino.

You may use, modify and distribute this software under the terms and conditions
of the Artistic License. Please see ARTISTIC for more information.
----------------------------------------------------------------------------- */

var DEFAULT_DRIVER = "driver_rhino.js_";

function _error( msg )
{
	if( show_errors )
		print( "error: " + msg );
	
	errors++;
}

function _warning( msg )
{
	if( show_warnings )
		print( "warning: " + msg );
	
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
	
	if( ( new java.io.File( file ).exists() ) )
		src = readFile( file );
	else
	{
		_error( "unable to open file '" + file + "'" );
		quit( 1 );
	}
	
	return src;
}

function write_file( file, content )
{
	var f = new java.io.PrintWriter( file );
		
	if( f )
	{
		f.write( content );
		f.close();
	}
	else
	{
		_error( "unable to write '" + file + "'" );
		return false;
	}
	
	return true;
}

var args_global_var = arguments;
function get_arguments()
{
   return args_global_var;
}

