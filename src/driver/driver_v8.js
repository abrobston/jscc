/*
	Default driver template for JS/CC generated parsers for V8
	
	Written 2007-2010 by Jan Max Meyer, J.M.K S.F. Software Technologies
        Modified 2008 from driver.js_ to support V8 by Louis P.Santillan
			<lpsantil@gmail.com>
	
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
   read_line();
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

