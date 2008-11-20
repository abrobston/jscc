/* -MODULE----------------------------------------------------------------------
JS/CC: A LALR(1) Parser Generator written in JavaScript
Copyright (C) 2007, 2008 by J.M.K S.F. Software Technologies, Jan Max Meyer
http://www.jmksf.com ++ jscc<-AT->jmksf.com

File:	io_jscript.js
Author:	Jan Max Meyer
Usage:	Console-based wrapper function set for JS/CC to be executed
		via Windows Script Host/JScript or compiled into a JScript.NET
		executable.

You may use, modify and distribute this software under the terms and conditions
of the Artistic License. Please see ARTISTIC for more information.
----------------------------------------------------------------------------- */

@if( @_jscript_version >= 7 )
@set @js_dotnet = 1
@else
@set @js_dotnet = 0
@end

@if( @js_dotnet )
import System;
@end

var DEFAULT_DRIVER = "driver_jscript.js_";

function _error( msg )
{
	if( show_errors )
	{
		@if( @js_dotnet )
		print( "error: " + msg  + "\n" );
		@else
		WScript.Echo( "error: " + msg + "\n" );
		@end
	}
	
	errors++;
}

function _warning( msg )
{
	if( show_warnings )
	{
		@if( @js_dotnet )
		print( "warning: " + msg + "\n" );
		@else
		WScript.Echo( "warning: " + msg + "\n" );
		@end
	}
	
	warnings++;
}

function _print( txt )
{
	@if( @js_dotnet )
	print( txt );
	@else
	WScript.Echo( txt );
	@end
}

function _quit( exitcode )
{
	@if( @js_dotnet )
	Environment.Exit( exitcode );
	@else
	WScript.Quit( exitcode );
	@end
}


function read_file( file )
{
	var fs = new ActiveXObject( "Scripting.FileSystemObject" );	
	var src = new String();
	
	if( !fs )
		return null;
	
	if( fs.fileExists( file ) )
	{
		var f = fs.OpenTextFile( file, 1 );
		
		if( f && !f.AtEndOfStream )
		{
			src = f.ReadAll();
			f.Close();
		}
	}
	else
	{
		_error( "unable to open file '" + file + "'" );
		_quit( 1 );
	}
	
	return src;
}

function write_file( file, content )
{
	var fs = new ActiveXObject( "Scripting.FileSystemObject" );	
	
	if( !fs )
		return null;
	
	var f = fs.OpenTextFile( file, 2, true );
		
	if( f )
	{
		f.write( content );
		f.Close();
	}
	else
	{
		_error( "unable to write '" + file + "'" );
		return false;
	}
	
	return true;
}

@if( !@js_dotnet )
function get_arguments()
{
	var enu = new Enumerator( WScript.Arguments )
	var params = new Array();
	
	for( ; !enu.atEnd(); enu.moveNext() )
		params.push( enu.item() );
		
	return params;
}
@else
function get_arguments()
{
	var params = new Array( Environment.GetCommandLineArgs() );
	
	params.shift();
	return params;
}
@end

