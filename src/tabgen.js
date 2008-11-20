/* -MODULE----------------------------------------------------------------------
JS/CC: A LALR(1) Parser Generator written in JavaScript
Copyright (C) 2007, 2008 by J.M.K S.F. Software Technologies, Jan Max Meyer
http://www.jmksf.com ++ jscc<-AT->jmksf.com

File:	tabgen.js
Author:	Jan Max Meyer
Usage:	LALR(1) closure and table construction

You may use, modify and distribute this software under the terms and conditions
of the Artistic License. Please see ARTISTIC for more information.
----------------------------------------------------------------------------- */

// --- Utility functions: I think there is no documentation necessary ;) ---
function create_state()
{
	var state = new STATE();
	
	state.kernel = new Array();
	state.epsilon = new Array();
	state.actionrow = new Array();
	state.gotorow = new Array();
	state.done = false;
	state.closed = false;

	states.push( state );
	
	return state;
}


function create_item( p )
{
	var item = new ITEM();
	
	item.prod = p;
	item.dot_offset = 0;
	item.lookahead = new Array();
	
	return item;
}


function add_table_entry( row, sym, act )
{
	var i;
	for( i = 0; i < row.length; i++ )
		if( row[i][0] == sym )
			return row;
	
	row.push( new Array( sym, act ) );
	return row;
}



function update_table_entry( row, sym, act )
{
	var i;
	for( i = 0; i < row.length; i++ )
		if( row[i][0] == sym )
		{
			row[i][1] = act;
			return row;
		}

	return row;
}


function remove_table_entry( row, sym )
{
	var i;
	for( i = 0; i < row.length; i++ )
		if( row[i][0] == sym )
		{
			row.splice( i, 1 );
			return row;
		}

	return row;
}

function get_table_entry( row, sym )
{
	var i;
	for( i = 0; i < row.length; i++ )
		if( row[i][0] == sym )
			return row[i][1];
	
	return void(0);
}


function get_undone_state()
{
	for( var i = 0; i < states.length; i++ )
	{
		if( states[i].done == false )
			return i;
	}
			
	return -1;
}


/* -FUNCTION--------------------------------------------------------------------
	Function:		find_symbol()
	
	Author:			Jan Max Meyer
	
	Usage:			Searches for a symbol using its label and kind.
					
	Parameters:		label				The label of the symbol.
					kind				Type of the symbol. This can be
										SYM_NONTERM or SYM_TERM
					special				Specialized symbols 

	Returns:		The index of the desired object in the symbol table,
					-1 if the symbol was not found.
  
	~~~ CHANGES & NOTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	Date:		Author:			Note:
	16.11.2007	Jan Max Meyer	Allow to find eof_character
	19.11.2008	Jan Max Meyer	Special character checking
----------------------------------------------------------------------------- */
function find_symbol( label, kind, special )
{
	if( !special )
		special = SPECIAL_NO_SPECIAL;

	for( var i = 0; i < symbols.length; i++ )
	{
		if( symbols[i].label.toString() == label.toString()
			&& symbols[i].kind == kind
				&& symbols[i].special == special )
		{
			return i;
		}
	}
	
	return -1;
}


/* -FUNCTION--------------------------------------------------------------------
	Function:		create_symbol()
	
	Author:			Jan Max Meyer
	
	Usage:			Creates a new symbol (if necessary) and appends it to the
					global symbol array. If the symbol does already exist, the
					instance of that symbol is returned only.
					
	Parameters:		label				The label of the symbol. In case of
										kind == SYM_NONTERM, the label is the
										name of the right-hand side, else it
										is the regular expression for the
										terminal symbol.
					kind				Type of the symbol. This can be
										SYM_NONTERM or SYM_TERM
					special				Specialized symbols 
	
	Returns:		The particular object of type SYMBOL.
  
	~~~ CHANGES & NOTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	Date:		Author:			Note:
	16.11.2007	Jan Max Meyer	Bugfix: EOF-character is a special case!
	19.11.2008	Jan Max Meyer	Special character checking
----------------------------------------------------------------------------- */
function create_symbol( label, kind, special )
{
	var exists;
	
	if( ( exists = find_symbol( label, kind, special ) ) > -1 )
		return symbols[ exists ].id;
	
	var sym = new SYMBOL();
	sym.label = label;
	sym.kind = kind;
	sym.prods = new Array();
	sym.nullable = false;
	sym.id = symbols.length;
	sym.code = new String();
	
	sym.assoc = ASSOC_NONE; //Could be changed by grammar parser
	sym.level = 0; //Could be changed by grammar parser

	sym.special = special;
	
	//Flags
	sym.defined = false;

	sym.first = new Array();
	
	if( kind == SYM_TERM )
		sym.first.push( sym.id );

	symbols.push( sym );
	
	//_print( "Creating new symbol " + sym.id + " kind = " + kind + " >" + label + "<" );
	
	return sym.id;
}


/* -FUNCTION--------------------------------------------------------------------
	Function:		item_set_equal()
	
	Author:			Jan Max Meyer
	
	Usage:			Checks if two item sets contain the same items. The items
					may only differ in their lookahead.
					
	Parameters:		set1					Set to be compared with set2.
					set2					Set to be compared with set1.
	
	Returns:		true					If equal,
					false					else.
  
	~~~ CHANGES & NOTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	Date:		Author:			Note:
----------------------------------------------------------------------------- */
function item_set_equal( set1, set2 )
{
	var i, j, cnt = 0;
	
	if( set1.length != set2.length )
		return false;

	for( i = 0; i < set1.length; i++ )
	{
		for( j = 0; j < set2.length; j++ )
		{			
			if( set1[i].prod == set2[j].prod &&
				set1[i].dot_offset == set2[j].dot_offset )
			{
				cnt++;
				break;
			}
		}
	}
	
	if( cnt == set1.length )
		return true;
		
	return false;
}


/* -FUNCTION--------------------------------------------------------------------
	Function:		close_items()
	
	Author:			Jan Max Meyer
	
	Usage:			
					
	Parameters:		
	
	Returns:		void
  
	~~~ CHANGES & NOTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	Date:		Author:			Note:
----------------------------------------------------------------------------- */
function close_items( seed, closure )
{
	var i, j, k;
	var cnt = 0, tmp_cnt = 0;
	var item;
	
	for( i = 0; i < seed.length; i++ )
	{
		if( seed[i].dot_offset < productions[seed[i].prod].rhs.length )
		{
			if( symbols[productions[seed[i].prod].rhs[seed[i].dot_offset]].kind == SYM_NONTERM )
			{
				for( j = 0; j < symbols[productions[seed[i].prod].rhs[seed[i].dot_offset]].prods.length; j++ )
				{
					for( k = 0; k < closure.length; k++ )
					{
						if( closure[k].prod == symbols[productions[seed[i].prod].rhs[seed[i].dot_offset]].prods[j] )
							break;
					}
					
					if( k == closure.length )
					{
						item = create_item( symbols[productions[seed[i].prod].rhs[seed[i].dot_offset]].prods[j] );									
						closure.push( item );
						
						cnt++;
					}
					
					tmp_cnt = closure[k].lookahead.length;
					if( rhs_first( closure[k], productions[seed[i].prod], seed[i].dot_offset+1 ) )
						closure[k].lookahead = union( closure[k].lookahead, seed[i].lookahead );
						
					cnt += closure[k].lookahead.length - tmp_cnt;
				}
			}
		}
	}
	
	return cnt;
}


/* -FUNCTION--------------------------------------------------------------------
	Function:		lalr1_closure()
	
	Author:			Jan Max Meyer
	
	Usage:			Implements the LALR(1) closure algorithm. A short overview:
	
					1. Closing a closure_set of ITEM() objects from a given
					   kernel seed (this includes the kernel seed itself!)
					2. Moving all epsilon items to the current state's epsilon
					   set.
					3. Moving all symbols with the same symbol right to the
					   dot to a partition set.
					4. Check if there is already a state with the same items
					   as there are in the partition. If so, union the look-
					   aheads, else, create a new state and set the partition
					   as kernel seed.
					5. If the (probably new state) was not closed yet, perform
					   some table creation: If there is a terminal to the
					   right of the dot, do a shift on the action table, else
					   do a goto on the goto table. Reductions are performed
					   later, when all states are closed.
					
	Parameters:		s				Id of the state that should be closed.
	
	Returns:		void
  
	~~~ CHANGES & NOTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	Date:		Author:			Note:
----------------------------------------------------------------------------- */
function lalr1_closure( s )
{
	var closure = new Array(), nclosure, partition;
	var item, partition_sym;
	var i, j, k, l, cnt = 0, old_cnt = 0, tmp_cnt, ns;
	
	/*
	for( i = 0; i < states[s].kernel.length; i++ )
	{
		closure.push( new ITEM() );
		closure[i].prod = states[s].kernel[i].prod;
		closure[i].dot_offset = states[s].kernel[i].dot_offset;
		closure[i].lookahead = new Array();
	
		for( j = 0; j < states[s].kernel[i].lookahead.length; j++ )
			closure[i].lookahead[j] = states[s].kernel[i].lookahead[j];
	}
	*/
		
	do
	{
		old_cnt = cnt;
		cnt = close_items( ( ( old_cnt == 0 ) ? states[s].kernel : closure ), closure );
		//_print( "closure: cnt = " + cnt + " old_cnt = " + old_cnt + "<br />" );
	}
	while( cnt != old_cnt );
	
	for( i = 0; i < states[s].kernel.length; i++ )
	{
		if( states[s].kernel[i].dot_offset < productions[states[s].kernel[i].prod].rhs.length )
		{
			closure.unshift( new ITEM() );

			closure[0].prod = states[s].kernel[i].prod;
			closure[0].dot_offset = states[s].kernel[i].dot_offset;
			closure[0].lookahead = new Array();
		
			for( j = 0; j < states[s].kernel[i].lookahead.length; j++ )
				closure[0].lookahead[j] = states[s].kernel[i].lookahead[j];
		}
	}
	
	/*
	print_item_set( (exec_mode == EXEC_CONSOLE) ? MODE_GEN_TEXT : MODE_GEN_HTML,
		"closure in " + s, closure );
	print_item_set( (exec_mode == EXEC_CONSOLE) ? MODE_GEN_TEXT : MODE_GEN_HTML, 
		"states[" + s + "].epsilon", states[s].epsilon );
	*/
	
	for( i = 0; i < closure.length; i++ )
	{
		if( productions[closure[i].prod].rhs.length == 0 )
		{
			for( j = 0; j < states[s].epsilon.length; j++ )
				if( states[s].epsilon[j].prod == closure[i].prod
						&& states[s].epsilon[j].dot_offset == closure[i].dot_offset )
							break;
			
			if( j == states[s].epsilon.length )			
				states[s].epsilon.push( closure[i] );

			closure.splice( i, 1 );
		}
	}
	
	while( closure.length > 0 )
	{
		partition = new Array();
		nclosure = new Array();
		partition_sym = -1;
		
		for( i = 0; i < closure.length; i++ )
		{
			if( partition.length == 0 )
				partition_sym = productions[closure[i].prod].rhs[closure[i].dot_offset];
						
			if( closure[i].dot_offset < productions[closure[i].prod].rhs.length )
			{
			
				//_print( productions[closure[i].prod].rhs[closure[i].dot_offset] + " " + partition_sym + "<br />" );
				if( productions[closure[i].prod].rhs[closure[i].dot_offset] == partition_sym )
				{
					closure[i].dot_offset++;
					partition.push( closure[i] );
				}
				else
					nclosure.push( closure[i] );
			}
		}
		
		//print_item_set( "partition " + s, partition );
		
		if( partition.length > 0 )
		{
			for( i = 0; i < states.length; i++ )
			{	
				if( item_set_equal( states[i].kernel, partition ) )
					break;
			}
			
			if( i == states.length )
			{				
				ns = create_state();
				//_print( "Generating state " + (states.length - 1) );
				ns.kernel = partition;
			}
			
			tmp_cnt = 0;
			cnt = 0;
			
			for( j = 0; j < partition.length; j++ )
			{
				tmp_cnt += states[i].kernel[j].lookahead.length;
				states[i].kernel[j].lookahead = union( states[i].kernel[j].lookahead,
													partition[j].lookahead );

				cnt += states[i].kernel[j].lookahead.length;
			}					
			
			if( tmp_cnt != cnt )
				states[i].done = false;
			
			//_print( "<br />states[" + s + "].closed = " + states[s].closed );
			if( !(states[s].closed) )
			{
				for( j = 0; j < partition.length; j++ )
				{
					//_print( "<br />partition[j].dot_offset-1 = " + 
					//	(partition[j].dot_offset-1) + " productions[partition[j].prod].rhs.length = " 
					//		+ productions[partition[j].prod].rhs.length );
							
					if( partition[j].dot_offset-1 < productions[partition[j].prod].rhs.length )
					{
						//_print( "<br />symbols[productions[partition[j].prod].rhs[partition[j].dot_offset-1]].kind = " + 
						//	symbols[productions[partition[j].prod].rhs[partition[j].dot_offset-1]].kind );
						if( symbols[productions[partition[j].prod].rhs[partition[j].dot_offset-1]].kind
								== SYM_TERM )
						{
							states[s].actionrow = add_table_entry( states[s].actionrow,
								productions[partition[j].prod].rhs[partition[j].dot_offset-1], i );
								
							shifts++;
						}
						else
						{
							states[s].gotorow = add_table_entry( states[s].gotorow,
								productions[partition[j].prod].rhs[partition[j].dot_offset-1], i );
							
							gotos++;
						}
					}
				}
			}
		}
		
		closure = nclosure;
	}
	
	states[s].closed = true;
}


/* -FUNCTION--------------------------------------------------------------------
	Function:		do_reductions()
	
	Author:			Jan Max Meyer
	
	Usage:			Inserts reduce-cells into the action table. A reduction
					does always occur for items with the dot to the far right
					of the production and to items with no production (epsilon
					items).
					The reductions are done on the corresponding lookahead
					symbols. If a shift-reduce conflict appears, the function
					will always behave in favor of the shift.
					
					Reduce-reduce conflicts are reported immediatelly, and need
					to be solved.
					
	Parameters:		item_set				The item set to work on.
					s						The index of the state where the
											reductions take effect.
	
	Returns:		void
  
	~~~ CHANGES & NOTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	Date:		Author:			Note:
----------------------------------------------------------------------------- */
function do_reductions( item_set, s )
{
	var i, j, ex, act, output_warning;
	for( i = 0; i < item_set.length; i++ )
	{
		if( item_set[i].dot_offset == productions[item_set[i].prod].rhs.length )
		{
			for( j = 0; j < item_set[i].lookahead.length; j++ )
			{
				output_warning = true;

				ex = get_table_entry( states[s].actionrow,
						item_set[i].lookahead[j] );

				act = ex;
				if( ex == void(0) )
				{
					states[s].actionrow = add_table_entry( states[s].actionrow,
						item_set[i].lookahead[j], -1 * item_set[i].prod );
						
					reduces++;
				}
				else
				{
					var warning	= new String();
					if( ex > 0 )
					{
						//Shift-reduce conflict

						//Is there any level specified?
						if( symbols[item_set[i].lookahead[j]].level > 0
							|| productions[ item_set[i].prod ].level > 0 )
						{
							//Is the level the same?
							if( symbols[item_set[i].lookahead[j]].level ==
								productions[ item_set[i].prod ].level )
							{
								//In case of left-associativity, reduce
								if( symbols[item_set[i].lookahead[j]].assoc
										== ASSOC_LEFT )
								{
									//Reduce
									act = -1 * item_set[i].prod;
								}
								//else, if nonassociativity is set,
								//remove table entry.
								else
								if( symbols[item_set[i].lookahead[j]].assoc
										== ASSOC_NOASSOC )
								{
									remove_table_entry( states[s].actionrow,
											item_set[i].lookahead[j] );

									_warning(
										"Removing nonassociative symbol '"
										 + symbols[item_set[i].lookahead[j]].label + "' in state " + s );

									output_warning = false;
								}
							}
							else
							{
								//If symbol precedence is lower production's
								//precedence, reduce
								if( symbols[item_set[i].lookahead[j]].level <
										productions[ item_set[i].prod ].level )
									//Reduce
									act = -1 * item_set[i].prod;
							}
						}
						
						warning = "Shift";
					}
					else
					{
						//Reduce-reduce conflict
						act = ( ( act * -1 < item_set[i].prod ) ?
									act : -1 * item_set[i].prod );
						
						warning = "Reduce";
					}

					warning += "-reduce conflict on symbol '" + symbols[item_set[i].lookahead[j]].label + "' in state " + s;
					warning += "\n         Conflict resolved by " +
								( ( act <= 0 ) ? "reducing with production" : "shifting to state" )
									+ " " + ( ( act <= 0 ) ? act * -1 : act );

					if( output_warning )
						_warning( warning );

					if( act != ex )
						update_table_entry( states[s].actionrow,
							item_set[i].lookahead[j], act );
				}				
			}
		}
	}
}


/* -FUNCTION--------------------------------------------------------------------
	Function:		lalr1_parse_table()
	
	Author:			Jan Max Meyer
	
	Usage:			Entry function to perform table generation. If all states
					of the parsing state machine are constructed, all reduce
					operations are inserted in the particular positions of the
					action table.
					
					If there is a Shift-reduce conflict, the shift takes the
					higher precedence. Reduce-reduce conflics are resolved by
					choosing the first defined production.
					
	Parameters:		debug					Toggle debug trace output; This
											should only be switched on when
											JS/CC is executed in a web environ-
											ment, because HTML-code will be
											printed.
	
	Returns:		void
  
	~~~ CHANGES & NOTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	Date:		Author:			Note:
----------------------------------------------------------------------------- */
function lalr1_parse_table( debug )
{
	var i, j, k, item, s, p;
	
	//Create EOF symbol
	item = create_item( 0 );
	s = create_symbol( "$", SYM_TERM, SPECIAL_EOF );
	item.lookahead.push( s );
	
	//Create first state
	s = create_state();
	s.kernel.push( item );
	
	while( ( i = get_undone_state() ) >= 0 )
	{
		states[i].done = true;
		lalr1_closure( i );
	}
	
	for( i = 0; i < states.length; i++ )
	{
		do_reductions( states[i].kernel, i );
		do_reductions( states[i].epsilon, i );
	}
	
	if( debug )
	{		
		for( i = 0; i < states.length; i++ )
		{
			print_item_set( (exec_mode == EXEC_CONSOLE) ? MODE_GEN_TEXT : MODE_GEN_HTML,
				"states[" + i + "].kernel", states[i].kernel );
			print_item_set( (exec_mode == EXEC_CONSOLE) ? MODE_GEN_TEXT : MODE_GEN_HTML,
				"states[" + i + "].epsilon", states[i].epsilon );
		}

		_print( states.length + " States created." );
	}
}



