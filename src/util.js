/* -MODULE----------------------------------------------------------------------
JS/CC: A LALR(1) Parser Generator written in JavaScript
Copyright (C) 2007, 2008 by J.M.K S.F. Software Technologies, Jan Max Meyer
http://www.jmksf.com ++ jscc<-AT->jmksf.com

File:	util.js
Author:	Jan Max Meyer
Usage:	Utility functions used by several modules

You may use, modify and distribute this software under the terms and conditions
of the Artistic License. Please see ARTISTIC for more information.
----------------------------------------------------------------------------- */


/* -FUNCTION--------------------------------------------------------------------
	Function:		union()
	
	Author:			Jan Max Meyer
	
	Usage:			Unions the content of two arrays.
					
	Parameters:		dest_array				The destination array.
					src_array				The source array. Elements that are
											not in dest_array but in src_array
											are copied to dest_array.
	
	Returns:		The destination array, the union of both input arrays.
  
	~~~ CHANGES & NOTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	Date:		Author:			Note:
----------------------------------------------------------------------------- */
function union( dest_array, src_array )
{
	var i, j;
	for( i = 0; i < src_array.length; i++ )
	{
		for( j = 0; j < dest_array.length; j++ )
		{
			if( src_array[i] == dest_array[j] )
				break;
		}
		
		if( j == dest_array.length )
			dest_array.push( src_array[i] );
	}
	
	return dest_array;
}


/* -FUNCTION--------------------------------------------------------------------
	Function:		reset_all()
	
	Author:			Jan Max Meyer
	
	Usage:			Resets all global variables. reset_all() should be called
					each time a new grammar is compiled.
					
	Parameters:		mode			Exec-mode; This can be either
									JSCC_EXEC_CONSOLE or JSCC_EXEC_WEB
	
	Returns:		void
  
	~~~ CHANGES & NOTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	Date:		Author:			Note:
----------------------------------------------------------------------------- */
function reset_all( mode )
{
	var p;
	
	assoc_level = 1;
	exec_mode = mode;

	symbols = new Array();
	productions = new Array();
	states = new Array();
	nfa_states = new Array();
	dfa_states = new Array();
	lex = new Array();
	
	create_symbol( "", SYM_NONTERM, SPECIAL_NO_SPECIAL );
	symbols[0].defined = true;
	
	p = new PROD();
	p.lhs = 0;
	p.rhs = new Array();
	p.code = new String( "%% = %1;" );
	symbols[0].prods.push( productions.length );
	productions.push( p );
	
	whitespace_token = -1;
	
	/*
	src = new String();
	src_off = 0;
	line = 1;
	lookahead = void(0);
	*/
	
	errors = 0;
	show_errors = true;
	warnings = 0;
	show_warnings = false;
	
	shifts = 0;
	reduces = 0;
	gotos = 0;
	
	regex_weight = 0;
	
	code_head = new String();
	code_foot = new String();
}


