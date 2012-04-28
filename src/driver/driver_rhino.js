/*
	Default driver template for JS/CC generated parsers for Mozilla/Rhino

	Written 2007-2010 by Jan Max Meyer, Phorward Software Technologies
        Modified 2007 from driver.js_ to support Mozilla/Rhino
           by Louis P.Santillan <lpsantil@gmail.com>

	This is in the public domain.
*/
var __##PREFIX##_debug=(function(){///@TODO: create this variable without function
	var _dbg_withparsetree	= false;
	var _dbg_withtrace		= false;
	var _dbg_withstepbystep	= false;

	function __dbg_print( text )
	{
		print( text );
	}

	function __dbg_flush()
	{
		//Not required here.
	}

	function __dbg_wait()
	{
	   var kbd = new java.io.BufferedReader(
	                new java.io.InputStreamReader( java.lang.System[ "in" ] ) );

	   kbd.readLine();
	}

	function __dbg_parsetree( indent, nodes, tree )
	{
		var str = "";
		for( var i = 0; i < tree.length; i++ )
		{
			str = "";
			for( var j = indent; j > 0; j-- )
				str += "\t";

			str += nodes[ tree[i] ].sym;
			if( nodes[ tree[i] ].att != "" )
				str += " >" + nodes[ tree[i] ].att + "<" ;

			__dbg_print( str );
			if( nodes[ tree[i] ].child.length > 0 )
				__dbg_parsetree( indent + 1, nodes, nodes[ tree[i] ].child );
		}
	}
	return {
		__dbg_print:__dbg_print,
		_dbg_withtrace:_dbg_withtrace,
		__dbg_wait:__dbg_wait,
		_dbg_withparsetree:_dbg_withparsetree,
		_dbg_withstepbystep:_dbg_withstepbystep,
		__dbg_flush:__dbg_flush,
		__dbg_parsetree:__dbg_parsetree
	};
})();


