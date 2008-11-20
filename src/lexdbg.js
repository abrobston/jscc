/* -MODULE----------------------------------------------------------------------
JS/CC: A LALR(1) Parser Generator written in JavaScript
Copyright (C) 2007, 2008 by J.M.K S.F. Software Technologies, Jan Max Meyer
http://www.jmksf.com ++ jscc<-AT->jmksf.com

File:	lexdbg.js
Author:	Jan Max Meyer
Usage:	NFA/DFA state machines debugging/dumping functions

You may use, modify and distribute this software under the terms and conditions
of the Artistic License. Please see ARTISTIC for more information.
----------------------------------------------------------------------------- */

function print_nfa( ta )
{
	_print( "Pos\tType\t\tfollow\t\tfollow2\t\taccept" );
	_print( "-------------------------------------------------------------------" );
	for( var i = 0; i < ta.length; i++ )
	{
		_print( i + "\t" + ( ( nfa_states[i].edge == EDGE_FREE ) ? "FREE" :
			( ( nfa_states[i].edge == EDGE_EPSILON ) ? "EPSILON" : "CHAR" ) ) + "\t\t" +
				( ( nfa_states[i].edge != EDGE_FREE && nfa_states[i].follow > -1 ) ? nfa_states[i].follow : "" ) + "\t\t" +
					( ( nfa_states[i].edge != EDGE_FREE && nfa_states[i].follow2 > -1 ) ? nfa_states[i].follow2 : "" ) + "\t\t" +
						( ( nfa_states[i].edge != EDGE_FREE && nfa_states[i].accept > -1 ) ? nfa_states[i].accept : "" ) );
						
		if( nfa_states[i].edge == EDGE_CHAR )
		{
			var chars = new String();
			for( var j = MIN_CHAR; j < MAX_CHAR; j++)
			{
				if( bitset_get( nfa_states[i].ccl, j ) )
				{
					chars += String.fromCharCode( j );
					if( chars.length == 10 )
					{
						_print( "\t" + chars );
						chars = "";
					}
				}
			}
			
			if( chars.length > 0 )
				_print( "\t" + chars );
		}
	}
	_print( "" );
}


function print_dfa( dfa_states )
{
	var str = new String();
	var chr_cnt = 0;
	for( var i = 0; i < dfa_states.length; i++ )
	{
		str = i + " => (";
		
		chr_cnt = 0;
		for( var j = 0; j < dfa_states[i].line.length; j++ )
		{
			if( dfa_states[i].line[j] > -1 )
			{
				str += " >" + String.fromCharCode( j ) + "<," + dfa_states[i].line[j] + " ";
				chr_cnt++;
				
				if( ( chr_cnt % 5 ) == 0 )
					str += "\n      ";
			}
		}
		
		str += ") " + dfa_states[i].accept;
		_print( str );
	}
}
