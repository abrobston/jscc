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

var DEFAULT_DRIVER = "driver_node.js_";

var sys=require("sys");
var fs=require("fs");

function _error( msg )
{
	if( show_errors )
		sys.print( file + ": error: " + msg );
	
	errors++;
}

function _warning( msg )
{
	if( show_warnings )
		sys.print( file + ": warning: " + msg );
	
	warnings++;
}

var _print=sys.puts;

var _quit=process.exit;

function read_file( file )
{
	return fs.readFileSync(file,"utf-8");
}
function write_file( file, content )
{
	return fs.writeFileSync(file, content, "utf-8");
}
function get_arguments()
{
	return process.ARGV.splice(2);
}
