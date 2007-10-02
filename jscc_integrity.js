/* -MODULE----------------------------------------------------------------------
JS/CC: A LALR(1) Parser Generator written in JavaScript
Copyright (C) 2007 by J.M.K S.F. Software Technologies, Jan Max Meyer
http://www.jmksf.com ++ jscc<-AT->jmksf.com

File:	jscc_integrity.js
Author:	Jan Max Meyer
Usage:	Checks the integrity of the grammar by performing several tests.

You may use, modify and distribute this software under the terms and conditions
of the Artistic License. Please see ARTISTIC for more information.
----------------------------------------------------------------------------- */


/* -FUNCTION--------------------------------------------------------------------
	Function:		undefined()
	
	Author:			Jan Max Meyer
	
	Usage:			Checks if there are undefined non-terminals.
					Prints an error message for each undefined non-terminal
					that appears on a right-hand side.
					
	Parameters:		void
	
	Returns:		void
  
	~~~ CHANGES & NOTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	Date:		Author:			Note:
----------------------------------------------------------------------------- */
function undefined()
{
	var i;
	for( i = 0; i < symbols.length; i++ )
	{
		if( symbols[i].kind == SYM_NONTERM
			&& symbols[i].defined == false )
			_error( "Call to undefined non-terminal \"" + symbols[i].label + "\"" );
	}
}


/* -FUNCTION--------------------------------------------------------------------
	Function:		unreachable()
	
	Author:			Jan Max Meyer
	
	Usage:			Checks if there are unreachable productions.
					
	Parameters:		void
	
	Returns:		void
  
	~~~ CHANGES & NOTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	Date:		Author:			Note:
----------------------------------------------------------------------------- */
function unreachable()
{
	var		stack		= new Array();
	var		reachable	= new Array();
	var		i, j, k, l;
	
	for( i = 0; i < symbols.length; i++ )
		if( symbols[i].kind == SYM_NONTERM )
			break;
			
	if( i == symbols.length )
		return;
		
	stack.push( i );
	reachable.push( i );
	
	while( stack.length > 0 )
	{
		i = stack.pop();
		for( j = 0; j < symbols[i].prods.length; j++ )
		{
			for( k = 0; k < productions[symbols[i].prods[j]].rhs.length; k++ )
			{
				if( symbols[ productions[symbols[i].prods[j]].rhs[k] ].kind == SYM_NONTERM )
				{
					for( l = 0; l < reachable.length; l++ )
						if( reachable[l] == productions[symbols[i].prods[j]].rhs[k] )
							break;
							
					if( l == reachable.length )
					{
						stack.push( productions[symbols[i].prods[j]].rhs[k] );
						reachable.push( productions[symbols[i].prods[j]].rhs[k] );
					}
				}
			}
		}
	}
	
	for( i = 0; i < symbols.length; i++ )
	{
		if( symbols[i].kind == SYM_NONTERM )
		{
			for( j = 0; j < reachable.length; j++ )
				if( reachable[j] == i )
					break;
			
			if( j == reachable.length )
				_warning( "Unreachable non-terminal \"" + symbols[i].label + "\"" );
		}
	}
}


/* -FUNCTION--------------------------------------------------------------------
	Function:		check_empty_lines()
	
	Author:			Jan Max Meyer
	
	Usage:			Checks if there are LALR(1) states that have no lookaheads
					(no shifts or reduces) within their state row.
					
	Parameters:		void
	
	Returns:		void
  
	~~~ CHANGES & NOTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	Date:		Author:			Note:
----------------------------------------------------------------------------- */
function check_empty_lines()
{
	var i;
	for( i = 0; i < states.length; i++ )
		if( states[i].actionrow.length == 0 )
			_error( "No lookaheads in state " + i + ", watch for endless list definition" );
}
