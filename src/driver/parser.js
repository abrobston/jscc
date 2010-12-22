/*
	This is the general, platform-independent part of every parser driver;
	Input-/Output and Feature-Functions are done by the particular drivers
	created for the particular platform.
*/
	##HEADER##
var __##PREFIX##parse=(function(debug){
	with(debug){
		var dbg_print = __dbg_print;
		var dbg_withtrace = _dbg_withtrace;
		var dbg_wait = __dbg_wait;
		var dbg_withparsetree = _dbg_withparsetree;
		var dbg_withstepbystep = _dbg_withstepbystep;
		var dbg_flush = __dbg_flush;
		var dbg_parsetree = __dbg_parsetree;
	}

##DFA##

	function DFA_2(state,chr,match,pos,set_match,set_match_pos,set_state){
		var st=DFA_DATA_2[state].line[chr];
		if(typeof st == "undefined")st=-1;
		var ac=DFA_DATA_2[state].accept;
		set_state(st)
		if(ac!=-1){
			set_match(ac);
			set_match_pos(pos);
		}
	}
	
	function DFA_1(state,chr,match,pos,set_match,set_match_pos,set_state){
		var line = DFA_DATA_1[state].line;
		var p,st;
		for(p=1<<8,st=line;p;p>>=1){
			st=st[!!(chr&p)+0];
			if(st==null){
				st=-1;
				break;
			}
			if(st.constructor===Array)continue;
			break;
		}
		var ac=DFA_DATA_1[state].accept;
		set_state(st)
		if(ac!=-1){
			set_match(ac);
			set_match_pos(pos);
		}
	}

	function TERMINAL_ACTIONS(PCB,match){
##TERMINAL_ACTIONS##
	}
	function lex( PCB ){
		var state, match, match_pos, start, pos, chr;
		while(true){
			state = 0;
			match = -1;
			match_pos = 0;
			start = 0;
			pos = PCB.offset + 1 + ( match_pos - start );
			///Functions for manipulation of variables
			function set_match(v){match=v;}
			function set_state(v){state=v;}
			function set_match_pos(v){match_pos=v;}
			do{
				pos--;
				state = 0;
				match = -2;
				start = pos;
				if( PCB.src.length <= start )
					return ##EOF##;
				do{
					chr = PCB.src.charCodeAt( pos );
					DFA_1(state,chr,match,pos,set_match,set_match_pos,set_state);
					//Line- and column-counter
					if( state > -1 ){
						if( chr == 10 ){
							PCB.line++;
							PCB.column = 0;
						}
						PCB.column++;
					}
					pos++;
				}while( state > -1 );
			}while( ##WHITESPACE## > -1 && match == ##WHITESPACE## );
	
			if( match > -1 ){
				PCB.att = PCB.src.substr( start, match_pos - start );
				PCB.offset = match_pos;
				if((function(){
					try{
TERMINAL_ACTIONS(PCB,match);
					}catch(e){
						if(e===Continue)return true;
						else throw e;
					}
				})())continue;
			}else{
				PCB.att = "";
				match = -1;
			}
			break;
		}
		return match;
	}

##TABLES##

##LABELS##

	function ACTIONS(act,sstack,vstack){
		var rval;
##ACTIONS##
		return rval;
	}
	function parse( src, err_off, err_la ){
		var		sstack			= [];
		var		vstack			= [];
		var 	err_cnt			= 0;
		var		rval;
		var		act;
	
		//Visual parse tree generation

		var		treenodes		= [];
		var		tree			= [];
		var		tmptree			= null;
		
		/*
			This is the parser control block (PCB);
			It is used to hold the entire parser state
			in one object, to be quickly accessed from
			various functions.
		*/ 
		var PCB	= {
			line:1,
			column:1,
			offset:0,
			error_step:0,
			src:src,
			att:""
		};

		if( !err_off )
			err_off	= [];
		if( !err_la )
			err_la = [];
	
		sstack.push( 0 );
		vstack.push( 0 );
	
		PCB.la = lex( PCB );
			
		while(true){
			PCB.act = ##ERROR##;
			for( var i = 0; i < act_tab[sstack[sstack.length-1]].length; i+=2 ){
				if( act_tab[sstack[sstack.length-1]][i] == PCB.la ){
					PCB.act = act_tab[sstack[sstack.length-1]][i+1];
					break;
				}
			}
		
			if( PCB.act == ##ERROR## ){
				if( ( PCB.act = defact_tab[ sstack[sstack.length-1] ] ) < 0 )
					PCB.act = ##ERROR##;
				else
					PCB.act *= -1;
			}

			/*
			_print( "state " + sstack[sstack.length-1] +
					" la = " +
					PCB.la + " att = >" +
					PCB.att + "< act = " +
					PCB.act + " src = >" +
					PCB.src.substr( PCB.offset, 30 ) + "..." + "<" +
					" sstack = " + sstack.join() );
			*/
		
			if( dbg_withtrace && sstack.length > 0 )
			{
				dbg_print( "\nState " + sstack[sstack.length-1] + "\n" +
							"\tLookahead: " + labels[PCB.la] +
								" (\"" + PCB.att + "\")\n" +
							"\tAction: " + PCB.act + "\n" + 
							"\tSource: \"" + PCB.src.substr( PCB.offset, 30 ) +
									( ( PCB.offset + 30 < PCB.src.length ) ?
										"..." : "" ) + "\"\n" +
							"\tStack: " + sstack.join() + "\n" +
							"\tValue stack: " + vstack.join() + "\n" );
			
				if( dbg_withstepbystep )
					dbg_wait();
			}
		
			
			//Parse error? Try to recover!
			if( PCB.act == ##ERROR## )
			{
				if( dbg_withtrace )
				{
					var expect = "";
				
					dbg_print( "Error detected: " +
						"There is no reduce or shift on the symbol " +
							labels[PCB.la] );
				
					for( var i = 0;
						i < act_tab[sstack[sstack.length-1]].length;
						i+=2 )
					{
						if( expect != "" )
							expect += ", ";
						
						expect += "\"" +
								labels[ act_tab[sstack[sstack.length-1]][i] ]
									+ "\"";
					}
					dbg_print( "Expecting: " + expect );
				}
			
				//Report errors only when error_step is 0, and this is not a
				//subsequent error from a previous parse
				if( PCB.error_step == 0 ){
					err_cnt++;
					err_off.push( PCB.offset - PCB.att.length );
					err_la.push([]);
					for( var i = 0;
						i < act_tab[sstack[sstack.length-1]].length;
						i+=2 )
						err_la[err_la.length-1].push(
							labels[act_tab[sstack[sstack.length-1]][i]] );
				}
			
				//Perform error recovery			
				while( sstack.length > 1 && PCB.act == ##ERROR## ){
					sstack.pop();
					vstack.pop();
				
					//Try to shift on error token
					for( var i = 0;
						i < act_tab[sstack[sstack.length-1]].length;
						i+=2 ){
						if( act_tab[sstack[sstack.length-1]][i] == ##ERROR_TOKEN## ){
							PCB.act = act_tab[sstack[sstack.length-1]][i+1];
						
							sstack.push( PCB.act );
							vstack.push("");
						
							if( dbg_withtrace ){
								dbg_print("Error recovery: error token could be shifted!" );
								dbg_print( "Error recovery: current stack is " + sstack.join() );
							}
							break;
						}
					}
				}
			
				//Is it better to leave the parser now?
				if( sstack.length > 1 && PCB.act != ##ERROR## ){
					//Ok, now try to shift on the next tokens
					while( PCB.la != ##EOF## ){
						if( dbg_withtrace )
							dbg_print( "Error recovery: " +
								"Trying to shift on \""
								+ labels[ PCB.la ] + "\"" );

						PCB.act = ##ERROR##;
					
						for( var i = 0;
							i < act_tab[sstack[sstack.length-1]].length;
							i+=2 ){
							if( act_tab[sstack[sstack.length-1]][i] == PCB.la ){
								PCB.act = act_tab[sstack[sstack.length-1]][i+1];
								break;
							}
						}
					
						if( PCB.act != ##ERROR## )
							break;
						
						if( dbg_withtrace )
							dbg_print( "Error recovery: Discarding \""
								+ labels[ PCB.la ] + "\"" );
					
						while( ( PCB.la = lex( PCB ) ) < 0 )
							PCB.offset++;
				
						if( dbg_withtrace )
							dbg_print( "Error recovery: New token \""
								+ labels[ PCB.la ] + "\"" );
					}
				}
			
				if( PCB.act == ##ERROR## || PCB.la == ##EOF## )
				{
					if( dbg_withtrace )
						dbg_print( "\tError recovery failed, terminating parse process..." );
					break;
				}

				if( dbg_withtrace )
					dbg_print( "\tError recovery succeeded, continuing" );
			
				//Try to parse the next three tokens successfully...
				PCB.error_step = 3;
			}

			//Shift
			if( PCB.act > 0 ){
				//Parse tree generation
				if( dbg_withparsetree ){
					tree.push( treenodes.length );
					treenodes.push({
						sym:labels[ PCB.la ],
						att:PCB.att,
						child:[]
					});
				}
			
				if( dbg_withtrace )
					dbg_print( "Shifting symbol: " +
						labels[PCB.la] + " (" + PCB.att + ")" );
		
				sstack.push( PCB.act );
				vstack.push( PCB.att );
			
				PCB.la = lex( PCB );
			
				if( dbg_withtrace )
					dbg_print( "\tNew lookahead symbol: " +
						labels[PCB.la] + " (" + PCB.att + ")" );
				
				//Successfull shift and right beyond error recovery?
				if( PCB.error_step > 0 )
					PCB.error_step--;
			}
			//Reduce
			else
			{		
				act = PCB.act * -1;
			
				if( dbg_withtrace )
					dbg_print( "Reducing by production: " + act );
			
				rval = void( 0 );
			
				if( dbg_withtrace )
					dbg_print( "\tPerforming semantic action..." );
			
				rval=ACTIONS(act,sstack,vstack);
	
				if( dbg_withparsetree )
					tmptree = [];

				if( dbg_withtrace )
					dbg_print( "\tPopping " + 
									pop_tab[act][1] +  " off the stack..." );
				
				for( var i = 0; i < pop_tab[act][1]; i++ ){
					if( dbg_withparsetree )
						tmptree.push( tree.pop() );
					
					sstack.pop();
					vstack.pop();
				}

				//Get goto-table entry
				PCB.act = ##ERROR##;
				for( var i = 0; i < goto_tab[sstack[sstack.length-1]].length; i+=2 ){
					if( goto_tab[sstack[sstack.length-1]][i] == pop_tab[act][0] ){
						PCB.act = goto_tab[sstack[sstack.length-1]][i+1];
						break;
					}
				}
			
				//Do some parse tree construction if desired
				if( dbg_withparsetree ){
					tree.push( treenodes.length );
					treenodes.push( {
						sym:labels[ pop_tab[act][0] ],
						att:rval,
						child:tmptree.reverse()
						} );
				}
				//Goal symbol match?
				if( act == 0 ) break; //Don't use PCB.act here!
				if( dbg_withtrace )
					dbg_print( "\tPushing non-terminal " + labels[ pop_tab[act][0] ] );
			
				//...and push it!
				sstack.push( PCB.act );
				vstack.push( rval );
			}
		}

		if( dbg_withtrace ){
			dbg_print( "\nParse complete." );
			//This function is used for parser drivers that will output
			//the entire debug messages in a row.
			dbg_flush();
		}

		if( dbg_withparsetree ){
			if( err_cnt == 0 ){
				dbg_print( "\n\n--- Parse tree ---" );
				dbg_parsetree( 0, treenodes, tree );
			}
			else dbg_print( "\n\nParse tree cannot be viewed. There where parse errors." );
		}
		return err_cnt;
	}
	return parse;
})(__##PREFIX##_debug);

##FOOTER##

