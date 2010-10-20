/**@file driver_node.js
 * @brief Contains functions and variables for nodejs
 * http://nodejs.org
*/

var __##PREFIX##_debug=(function(){///@TODO: create this variable without function
	
	var _dbg_withparsetree	= false;
	var _dbg_withtrace		= false;
	var _dbg_withstepbystep	= false;
	
	var __dbg_print=require('sys').print;
	
	function __dbg_flush()
	{
		///Not required here.
	}
	
	function __dbg_wait()
	{
		///Not required here.
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



