/* -MODULE----------------------------------------------------------------------
JS/CC LALR(1) Parser Generator
Copyright (C) 2007-2012 by Phorward Software Technologies, Jan Max Meyer
http://jscc.phorward-software.com ++ contact<<AT>>phorward-software<<DOT>>com

File:	util.js
Author:	Jan Max Meyer
Usage:	Utility functions used by several modules

You may use, modify and distribute this software under the terms and conditions
of the BSD license. Please see LICENSE for more information.
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

	symbols = [];
	productions = [];
	states = [];
	nfa_states = [];
	dfa_states = [];
	lex = [];

	//Placeholder for the goal symbol
	create_symbol( "", SYM_NONTERM, SPECIAL_NO_SPECIAL );
	symbols[0].defined = true;

	//Error synchronization token
	create_symbol( "ERROR_RESYNC", SYM_TERM, SPECIAL_ERROR );
	symbols[1].defined = true;

	p = new PROD();
	p.lhs = 0;
	p.rhs = [];
	p.code = "%% = %1;";
	symbols[0].prods.push( productions.length );
	productions.push( p );

	whitespace_token = -1;

	/*
	src = new String();
	src_off = 0;
	line = 1;
	lookahead = void(0);
	*/
	file = "";
	errors = 0;
	show_errors = true;
	warnings = 0;
	show_warnings = false;

	shifts = 0;
	reduces = 0;
	gotos = 0;

	regex_weight = 0;

	code_head = "";
	code_foot = "";
}


