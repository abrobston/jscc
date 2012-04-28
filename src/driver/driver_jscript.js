/*
	Default driver template for JS/CC generated parsers for JScript.
	Platforms JScript.NET and Windows Script Host are supported.

	Written 2007-2010 by Jan Max Meyer, Phorward Software Technologies
	This is in the public domain.
*/

@if( @_jscript_version >= 7 )
import System;
@end

##HEADER##

var ##PREFIX##_dbg_withparsetree	= false;
var ##PREFIX##_dbg_withtrace		= false;
var ##PREFIX##_dbg_withstepbystep	= false;

function __##PREFIX##dbg_print( text )
{
@if( @_jscript_version < 7 )
	WScript.Echo( text );
@else
	print( text );
@end
}

function __##PREFIX##dbg_flush()
{
	//Not required here.
}

function __##PREFIX##dbg_wait()
{
@if( @_jscript_version < 7 )
	WScript.StdIn.ReadLine()
@else
	Console.ReadLine();
@end
}

function __##PREFIX##dbg_parsetree( indent, nodes, tree )
{
	var str = new String();
	for( var i = 0; i < tree.length; i++ )
	{
		str = "";
		for( var j = indent; j > 0; j-- )
			str += "\t";

		str += nodes[ tree[i] ].sym;
		if( nodes[ tree[i] ].att != "" )
			str += " >" + nodes[ tree[i] ].att + "<" ;

		__##PREFIX##dbg_print( str );
		if( nodes[ tree[i] ].child.length > 0 )
			__##PREFIX##dbg_parsetree( indent + 1, nodes, nodes[ tree[i] ].child );
	}
}

/* Code of driver.js will go here... */

