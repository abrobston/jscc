/* -MODULE----------------------------------------------------------------------
JS/CC: A LALR(1) Parser Generator written in JavaScript
Copyright (C) 2007, 2008 by J.M.K S.F. Software Technologies, Jan Max Meyer
http://www.jmksf.com ++ jscc<-AT->jmksf.com

File:	lexdfa.js
Author:	Jan Max Meyer
Usage:	Deterministic finite automation construction and minimization.

You may use, modify and distribute this software under the terms and conditions
of the Artistic License. Please see ARTISTIC for more information.
----------------------------------------------------------------------------- */

//Utility functions; I think there is no documentation required about them.

function create_dfa( where )
{
	var dfa = new DFA();
	
	dfa.line = new Array( MAX_CHAR );
	dfa.accept = -1;
	dfa.nfa_set = new Array();
	dfa.done = false;
	dfa.group = -1;
	
	where.push( dfa );
	return where.length - 1;
}


function same_nfa_items( dfa_states, items )
{
	var i, j;
	for( i = 0; i < dfa_states.length; i++ )
		if( dfa_states[i].nfa_set.length == items.length )
		{
			for( j = 0; j < dfa_states[i].nfa_set.length; j++ )
				if( dfa_states[i].nfa_set[j] != items[j] )
					break;
			
			if( j == dfa_states[i].nfa_set.length )
				return i;
		}
			
	return -1;
}


function get_undone_dfa( dfa_states )
{
	for( var i = 0; i < dfa_states.length; i++ )
		if( !dfa_states[i].done )
			return i;
			
	return -1;
}


//NFA test function; Has no use currently.
function execute_nfa( machine, str )
{
	var	result		= new Array();
	var	accept;
	var	last_accept	= new Array();
	var last_length = 0;
	var	chr_cnt		= 0;

	if( machine.length == 0 )
		return -1;
		
	result.push( 0 );
	while( result.length > 0
		&& chr_cnt < str.length )
	{
		accept = epsilon_closure( result, machine );
		
		if( accept.length > 0 )
		{
			last_accept = accept;
			last_length = chr_cnt;
		}
		
		result = move( result, machine, str.charCodeAt( chr_cnt ) );
		chr_cnt++;
	}
	
	return last_accept;
}


/* -FUNCTION--------------------------------------------------------------------
	Function:		move()
	
	Author:			Jan Max Meyer
	
	Usage:			Performs a move operation on a given input character from a
					set of NFA states.
					
	Parameters:		state_set				The set of epsilon-closure states
											on which base the move should be
											performed.
					machine					The NFA state machine.
					ch						A character code to be moved on.
	
	Returns:		If there is a possible move, a new set of NFA-states is
					returned, else the returned array has a length of 0.
  
	~~~ CHANGES & NOTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	Date:		Author:			Note:
----------------------------------------------------------------------------- */
function move( state_set, machine, ch )
{
	var hits	= new Array();
	var tos		= -1;
	
	do
	{
		tos = state_set.pop();
		if( machine[ tos ].edge == EDGE_CHAR )
			if( bitset_get( machine[ tos ].ccl, ch ) )
				hits.push( machine[ tos ].follow );		
	}
	while( state_set.length > 0 );
	
	return hits;
}


/* -FUNCTION--------------------------------------------------------------------
	Function:		epsilon_closure()
	
	Author:			Jan Max Meyer
	
	Usage:			Performs an epsilon closure from a set of NFA states.
					
	Parameters:		state_set				The set of states on which base
											the closure is started.
											The whole epsilon closure will be
											appended to this parameter, so this
											parameter acts as input/output value.
					machine					The NFA state machine.
	
	Returns:		An array of accepting states, if available.
  
	~~~ CHANGES & NOTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	Date:		Author:			Note:
----------------------------------------------------------------------------- */
function epsilon_closure( state_set, machine )
{
	var 	stack	= new Array();
	var		accept	= new Array();
	var		tos		= -1;
	
	for( var i = 0; i < state_set.length; i++ )
		stack.push( state_set[i] );
	
	do
	{
		tos = stack.pop();
		if( machine[ tos ].accept >= 0 )
			accept.push( machine[ tos ].accept );
			
		if( machine[ tos ].edge == EDGE_EPSILON )
		{
			if( machine[ tos ].follow > -1 )
			{
				for( var i = 0; i < state_set.length; i++ )
					if( state_set[i] == machine[ tos ].follow )
						break;
				
				if( i == state_set.length )
				{
					state_set.push( machine[ tos ].follow );
					stack.push( machine[ tos ].follow );
				}
			}
			
			if( machine[ tos ].follow2 > -1 )
			{
				for( var i = 0; i < state_set.length; i++ )
					if( state_set[i] == machine[ tos ].follow2 )
						break;
				
				if( i == state_set.length )
				{
					state_set.push( machine[ tos ].follow2 );
					stack.push( machine[ tos ].follow2 );
				}
			}
		}
	}
	while( stack.length > 0 );
	
	return accept.sort();
}


/* -FUNCTION--------------------------------------------------------------------
	Function:		create_subset()
	
	Author:			Jan Max Meyer
	
	Usage:			Constructs a deterministic finite automata (DFA) from a non-
					deterministic finite automata, by using the subset construc-
					tion algorithm.
					
	Parameters:		nfa_states				The NFA-state machine on which base
											the DFA will be constructed.

	Returns:		An array of DFA-objects forming the new DFA-state machine.
					This machine is not minimized here.
  
	~~~ CHANGES & NOTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	Date:		Author:			Note:
----------------------------------------------------------------------------- */
function create_subset( nfa_states )
{
	var dfa_states = new Array();
	var stack = new Array();
	var current = create_dfa( dfa_states );
	var trans;
	var next = -1;
	var lowest_weight;
	
	if( nfa_states.length == 0 )
		return dfa_states;
		
	stack.push( 0 );
	epsilon_closure( stack, nfa_states );
		
	dfa_states[ current ].nfa_set = dfa_states[ current ].nfa_set.concat( stack );
	
	while( ( current = get_undone_dfa( dfa_states ) ) > -1 )
	{
		//_print( "Next DFA-state to process is " + current );
		dfa_states[ current ].done = true;
		
		lowest_weight = -1;
		for( var i = 0; i < dfa_states[ current ].nfa_set.length; i++ )
		{
			if( nfa_states[ dfa_states[ current ].nfa_set[i] ].accept > -1
					&& nfa_states[ dfa_states[ current ].nfa_set[i] ].weight < lowest_weight 
						|| lowest_weight == -1 )
			{
				dfa_states[ current ].accept = nfa_states[ dfa_states[ current ].nfa_set[i] ].accept;
				lowest_weight = nfa_states[ dfa_states[ current ].nfa_set[i] ].weight;
			}
		}
			
		for( var i = MIN_CHAR; i < MAX_CHAR; i++ )
		{
			trans = new Array();
			trans = trans.concat( dfa_states[ current ].nfa_set );
			
			trans = move( trans, nfa_states, i );
			
			if( trans.length > 0 )
			{
				//_print( "Character >" + String.fromCharCode( i ) + "< from " + dfa_states[ current ].nfa_set.join() + " to " + trans.join() );
				epsilon_closure( trans, nfa_states );
			}

			if( trans.length == 0 )
				next = -1;
			else if( ( next = same_nfa_items( dfa_states, trans ) ) == -1 )
			{				
				next = create_dfa( dfa_states );
				dfa_states[ next ].nfa_set = trans;
				
				//_print( "Creating new state " + next );
			}
			
			dfa_states[ current ].line[ i ] = next;
		}
	}
	
	return dfa_states;
}


/* -FUNCTION--------------------------------------------------------------------
	Function:		create_subset()
	
	Author:			Jan Max Meyer
	
	Usage:			Minimizes a DFA, by grouping equivalent states together.
					These groups form the new, minimized dfa-states.
					
	Parameters:		dfa_states				The DFA-state machine on which base
											the minimized DFA is constructed.

	Returns:		An array of DFA-objects forming the minimized DFA-state
					machine.
  
	~~~ CHANGES & NOTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	Date:		Author:			Note:
----------------------------------------------------------------------------- */
function minimize_dfa( dfa_states )
{
	var		groups			= new Array();
	var		group			= new Array();
	var		accept_groups	= new Array();
	var		min_dfa_states	= new Array();
	var		old_cnt 		= 0;
	var		cnt 			= 0;
	var		new_group;
	var		i, j, k;
	
	if( dfa_states.length == 0 )
		return min_dfa_states;

	/*
		Forming a general starting state:
		Accepting and non-accepting states are pushed in
		separate groups first
	*/
	groups.push( new Array() );
	for( i = 0; i < dfa_states.length; i++ )
	{
		if( dfa_states[i].accept > -1 )
		{
			for( j = 0; j < accept_groups.length; j++ )
				if( accept_groups[j] == dfa_states[i].accept )
					break;
			
			if( j == accept_groups.length )
			{
				accept_groups.push( dfa_states[i].accept );
				groups.push( new Array() );
			}
			groups[ j+1 ].push( i );
			dfa_states[ i ].group = j+1;
		}
		else
		{
			groups[ 0 ].push( i );
			dfa_states[ i ].group = 0;
		}
	}

	/*
		Now the minimization is performed on base of
		these default groups
	*/
	do
	{
		old_cnt = cnt;

		for( i = 0; i < groups.length; i++ )
		{
			new_group = new Array();
			
			if( groups[i].length > 0 )
			{
				for( j = 1; j < groups[i].length; j++ )
				{
					for( k = MIN_CHAR; k < MAX_CHAR; k++ )
					{
						/*
							This verifies the equality of the
							first state in this group with its
							successors
						*/
						if( dfa_states[ groups[i][0] ].line[k] !=
								dfa_states[ groups[i][j] ].line[k] &&
							( dfa_states[ groups[i][0] ].line[k] == -1 ||
								dfa_states[ groups[i][j] ].line[k] == -1 ) ||
									( dfa_states[ groups[i][0] ].line[k] > -1 && 
											dfa_states[ groups[i][j] ].line[k] > -1 &&
										dfa_states[ dfa_states[ groups[i][0] ].line[k] ].group
											!= dfa_states[ dfa_states[ groups[i][j] ].line[k] ].group ) )
						{
							/*
								If this item does not match, but it to a new group
							*/
							dfa_states[ groups[i][j] ].group = groups.length;
							new_group = new_group.concat( groups[i].splice( j, 1 ) );
							j--;
							
							break;
						}
					}
				}
			}

			if( new_group.length > 0 )
			{
				groups[ groups.length ] = new Array();
				groups[ groups.length-1 ] = groups[ groups.length-1 ].concat( new_group );
				cnt += new_group.length;
			}
		}
		
		//_print( "old_cnt = " + old_cnt + " cnt = " + cnt );
		//_print( "old_cnt = " + old_cnt + " cnt = " + cnt );
	}
	while( old_cnt != cnt );
	
	/*
		Updating the dfa-state transitions;
		Each group forms a new state.
	*/
	for( i = 0; i < dfa_states.length; i++ )
		for( j = MIN_CHAR; j < MAX_CHAR; j++ )
			if( dfa_states[i].line[j] > -1 )
				dfa_states[i].line[j] = dfa_states[ dfa_states[i].line[j] ].group;

	for( i = 0; i < groups.length; i++ )			
		min_dfa_states.push( dfa_states[ groups[i][0] ] );

	return min_dfa_states;
}

