/*
	Default driver template for JS/CC generated parsers for Mozilla/Spidermonkey

	Written 2007-2010 by Jan Max Meyer, Phorward Software Technologies
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
		// Not implemented for Spidermonkey.
	}

	function __dbg_parsetree( indent, nodes, tree )
	{
		// Not implemented for Spidermonkey.
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
