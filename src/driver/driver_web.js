##HEADER##
/*
	Default template driver for JS/CC generated parsers running as
	browser-based JavaScript/ECMAScript applications.
	
	WARNING: 	This parser template will not run as console and has lesser
				features for debugging than the console derivates for the
				various JavaScript platforms.
	
	Written 2007-2010 by Jan Max Meyer, J.M.K S.F. Software Technologies
	This is in the public domain.
*/
##HEADER##

var ##PREFIX##_dbg_withparsetree	= false;
var ##PREFIX##_dbg_withtrace		= false;
var ##PREFIX##_dbg_withstepbystep	= false;
var ##PREFIX##_dbg_string			= new String();

function __##PREFIX##dbg_print( text )
{
	##PREFIX##_dbg_string += text + "\n";
}

function __##PREFIX##dbg_flush()
{
	alert( ##PREFIX##_dbg_string );
}

function __##PREFIX##dbg_wait()
{
	//Not implemented for Web.
}

function __##PREFIX##dbg_parsetree( indent, nodes, tree )
{
	//Not implemented for Web.
}

/* Code of driver.js will go here... */

