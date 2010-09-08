/*
	Default driver template for JS/CC generated parsers for Mozilla/Spidermonkey
	
	Written 2007-2010 by Jan Max Meyer, J.M.K S.F. Software Technologies
	This is in the public domain.
*/
##HEADER##

var ##PREFIX##_dbg_withparsetree	= false;
var ##PREFIX##_dbg_withtrace		= false;
var ##PREFIX##_dbg_withstepbystep	= false;

function __##PREFIX##dbg_print( text )
{
	print( text );
}

function __##PREFIX##dbg_flush()
{
	//Not required here.
}

function __##PREFIX##dbg_wait()
{
	// Not implemented for Spidermonkey.
}

function __##PREFIX##dbg_parsetree( indent, nodes, tree )
{
	// Not implemented for Spidermonkey.
}

/* Code of driver.js will go here... */

