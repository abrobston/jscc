/* -MODULE----------------------------------------------------------------------
JS/CC: A LALR(1) Parser Generator written in JavaScript
Copyright (C) 2007, 2008 by J.M.K S.F. Software Technologies, Jan Max Meyer
http://www.jmksf.com ++ jscc<-AT->jmksf.com

File:	first.js
Author:	Jan Max Meyer
Usage:	FIRST-set calculation

You may use, modify and distribute this software under the terms and conditions
of the Artistic License. Please see ARTISTIC for more information.
----------------------------------------------------------------------------- */


/* -FUNCTION--------------------------------------------------------------------
	Function:		first()
	
	Author:			Jan Max Meyer
	
	Usage:			Computes the FIRST-sets for all non-terminals of the
					grammar. Must be called right after the parse and before
					the table generation methods are performed.
					
	Parameters:		void
	
	Returns:		void
  
	~~~ CHANGES & NOTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	Date:		Author:			Note:
	25.08.2008	Jan Max Meyer	Here was a bad bug that sometimes came up when
								nonterminals are nullable. An example is the
								grammar
								
								"A" "B";
								##
								x: y "B";
								y: y "A" | ;
								
								Now it works... embarrassing bug... ;(
----------------------------------------------------------------------------- */
function first()
{
	var	cnt			= 0,
		old_cnt		= 0;
	var nullable;

	do
	{
		old_cnt = cnt;
		cnt = 0;
		
		for( var i = 0; i < symbols.length; i++ )
		{
			if( symbols[i].kind == SYM_NONTERM )
			{
				for( var j = 0; j < symbols[i].prods.length; j++ )
				{
					nullable = false;
					for( var k = 0; k < productions[symbols[i].prods[j]].rhs.length; k++ )
					{
						symbols[i].first = union( symbols[i].first, symbols[productions[symbols[i].prods[j]].rhs[k]].first );

						nullable = symbols[productions[symbols[i].prods[j]].rhs[k]].nullable;
						if( !nullable )
							break;
					}
					cnt += symbols[i].first.length;
					
					if( k == productions[symbols[i].prods[j]].rhs.length )
						nullable = true;

					symbols[i].nullable |= nullable;
				}
			}
		}
		
		//_print( "first: cnt = " + cnt + " old_cnt = " + old_cnt + "<br />" );
	}
	while( cnt != old_cnt );
}


/* -FUNCTION--------------------------------------------------------------------
	Function:		rhs_first()
	
	Author:			Jan Max Meyer
	
	Usage:			Returns all terminals that are possible from a given position
					of a production's right-hand side.
					
	Parameters:		item			Item to which the lookaheads are added to.
					p				The production where the computation should
									be done on.
					begin			The offset of the symbol where rhs_first()
									begins its calculation from.
	
	Returns:		true			If the whole rest of the right-hand side can
									be null (epsilon),
					false			else.
  
	~~~ CHANGES & NOTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	Date:		Author:			Note:
----------------------------------------------------------------------------- */
function rhs_first( item, p, begin )
{
	var f, i, nullable = true;
	for( i = begin; i < p.rhs.length; i++ )
	{
		item.lookahead = union( item.lookahead, symbols[p.rhs[i]].first );
		
		if( !symbols[p.rhs[i]].nullable )
			nullable = false;
		
		if( !nullable )
			break;
	}
	
	return nullable;
}
