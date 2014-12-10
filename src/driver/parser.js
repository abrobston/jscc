/*
	This is the general, platform-independent part of every parser driver;
	Input-/Output and Feature-Functions are done by the particular drivers
	created for the particular platform.
*/
##HEADER##
var __##PREFIX##parse=(function(debug,eof,whitespace,error_token){
##DFA##
	function DFA(state,chr,match,pos,set_match,set_match_pos,set_state){
		var line = DFA_DATA[state].line;
		var p,st;
		for(p=1<<8,st=line;p;p>>=1){
			st=st[!!(chr&p)+0];
			if(st==null)break;
			if(st instanceof Array)continue;
			break;
		}
		var ac=DFA_DATA[state].accept;
		set_state(st)
		if(ac!=-1){
			set_match(ac);
			set_match_pos(pos);
		}
	}
	function TERMINAL_ACTIONS(PCB,match){
##TERMINAL_ACTIONS##
	}
	function lex(PCB){
		var state, match, match_pos, start, pos, chr, actionResult;
		
		///Functions for manipulation of variables
		function set_match(v){match=v;}
		function set_state(v){state=v;}
		function set_match_pos(v){match_pos=v;}
		
		while(true){
			match_pos = 0;
			pos = PCB.offset + 1;
			do{
				pos--;
				state = 0;
				match = null;
				start = pos;
				if(PCB.src.length <= start)
					return eof;
				do{
					chr = PCB.src.charCodeAt(pos);
					DFA(state,chr,match,pos,set_match,set_match_pos,set_state);
					if(state != null){
						if( chr === 10 ){
							PCB.line++;
							PCB.column = 0;
						}
						PCB.column++;
					}
					pos++;
				}while(state != null);
			}while(whitespace > -1 && match == whitespace);
			if(match != null){
				PCB.att = PCB.src.slice(start, match_pos);
				PCB.offset = match_pos;
				actionResult = (function(){
					try{
						return TERMINAL_ACTIONS(PCB,match);
					}catch(e){
						if(e === Continue)return e;
						if(e instanceof Return)return e.valueOf();
						throw e;
					}
				})();
				if(actionResult === Continue)continue;
				PCB.att = actionResult;
			}else
				PCB.att = "";
			return match;
		}
	}
##TABLES##
##LABELS##
	function ACTIONS(act,vstack){
		try{
			return ##ACTIONS##
		}catch(e){
		if(e instanceof Return.Value)
			return e.valueOf();
		else
			throw e;
		}
	}
	function get_act(top, la){	
		for(var i = 0; i < act_tab[top].length; i+=2)
			if(act_tab[top][i] === la)
				return act_tab[top][i+1];
		return null;
	}
	function get_goto(top, pop){	
		for(var i = 0; i < goto_tab[top].length; i+=2)
			if(goto_tab[top][i] === pop)
				return goto_tab[top][i+1];
		return null;
	}
	function parse(src, err_off, err_la){
		var		sstack			= [0];
		var		vstack			= [0];
		var 	err_cnt			= 0;
		var		rval;
		var		act;
		var		treenodes		= [];//DEBUG!!!
		var		tree			= [];//DEBUG!!!
		var		tmptree			= null;//DEBUG!!!
		var i;

		var PCB	= {
			line:1,
			column:1,
			offset:0,
			error_step:0,
			src:src,
			att:"",
			lex:function(){return this.la = lex(this);}///@TODO: change `lex` function
		};
		err_off	= err_off || [];
		err_la = err_la || [];
		PCB.lex();
		while(true){
			PCB.act = get_act(sstack[0],PCB.la);
			if(PCB.act == null && defact_tab[sstack[0]] >= 0)
				PCB.act = -defact_tab[sstack[0]];
			if(debug._dbg_withtrace && sstack.length > 0){//DEBUG!!!
				debug.__dbg_print( "\nState " + sstack[0] + "\n" +//DEBUG!!!
							"\tLookahead: " + labels[PCB.la] +//DEBUG!!!
								" (\"" + PCB.att + "\")\n" +//DEBUG!!!
							"\tAction: " + PCB.act + "\n" + //DEBUG!!!
							"\tSource: \"" + PCB.src.substr( PCB.offset, 30 ) +//DEBUG!!!
									( ( PCB.offset + 30 < PCB.src.length ) ?//DEBUG!!!
										"..." : "" ) + "\"\n" +//DEBUG!!!
							"\tStack: " + sstack.join() + "\n" +//DEBUG!!!
							"\tValue stack: " + vstack.join() + "\n" );//DEBUG!!!
				if(debug._dbg_withstepbystep)//DEBUG!!!
					debug.__dbg_wait();//DEBUG!!!
			}//DEBUG!!!
			if(PCB.act == null){//Parse error? Try to recover!
				if( debug._dbg_withtrace ){//DEBUG!!!
					var expect = "";//DEBUG!!!
					debug.__dbg_print("Error detected: There is no reduce or shift on the symbol " + labels[PCB.la]);//DEBUG!!!
					for(i = 0; i < act_tab[sstack[0]].length; i+=2){//DEBUG!!!
						if( expect != "" )//DEBUG!!!
							expect += ", ";//DEBUG!!!
						expect += "\"" + labels[act_tab[sstack[0]][i]] + "\"";//DEBUG!!!
					}//DEBUG!!!
					debug.__dbg_print( "Expecting: " + expect );//DEBUG!!!
				}//DEBUG!!!
				//Report errors only when error_step is 0, and this is not a
				//subsequent error from a previous parse
				if(PCB.error_step === 0){
					err_cnt++;
					err_off.unshift(PCB.offset - PCB.att.length);
					err_la.unshift([]);
					for(i = 0; i < act_tab[sstack[0]].length; i+=2)
						err_la[0].push(labels[act_tab[sstack[0]][i]]);
				}
				//Perform error recovery			
				while(sstack.length > 1 && PCB.act == null){
					sstack.shift();
					vstack.shift();
					//Try to shift on error token
					PCB.act = get_act(sstack[0],PCB.la);
					if(PCB.act === error_token){
						sstack.unshift(PCB.act);
						vstack.unshift("");
						if( debug._dbg_withtrace ){//DEBUG!!!
							debug.__dbg_print("Error recovery: error token could be shifted!" );//DEBUG!!!
							debug.__dbg_print("Error recovery: current stack is " + sstack.join());//DEBUG!!!
						}//DEBUG!!!
					}
				}
				//Is it better to leave the parser now?
				if(sstack.length > 1 && PCB.act != null){
					//Ok, now try to shift on the next tokens
					while(PCB.la !== eof){
						if(debug._dbg_withtrace)//DEBUG!!!
							debug.__dbg_print( "Error recovery: Trying to shift on \""	+ labels[ PCB.la ] + "\"" );//DEBUG!!!
						PCB.act = act_tab[sstack[0]][i+1];
						if(PCB.act != null)break;

						if(debug._dbg_withtrace)//DEBUG!!!
							debug.__dbg_print( "Error recovery: Discarding \"" + labels[PCB.la] + "\"" );//DEBUG!!!

						while(PCB.lex() != null)PCB.offset++;

						if(debug._dbg_withtrace)//DEBUG!!!
							debug.__dbg_print( "Error recovery: New token \"" + labels[PCB.la] + "\"" );//DEBUG!!!
					}
				}
				if(PCB.act === error || PCB.la === eof){
					if(debug._dbg_withtrace)//DEBUG!!!
						debug.__dbg_print("\tError recovery failed, terminating parse process...");//DEBUG!!!
					break;
				}
				if(debug._dbg_withtrace)//DEBUG!!!
					debug.__dbg_print("\tError recovery succeeded, continuing");//DEBUG!!!
				//Try to parse the next three tokens successfully...
				PCB.error_step = 3;
			}
			if(PCB.act > 0){//Shift
				//Parse tree generation
				if(debug._dbg_withparsetree){//DEBUG!!!
					tree.push(treenodes.length);//DEBUG!!!
					treenodes.push({//DEBUG!!!
						sym:labels[ PCB.la ],//DEBUG!!!
						att:PCB.att,//DEBUG!!!
						child:[]//DEBUG!!!
					});//DEBUG!!!
				}//DEBUG!!!
			
				if(debug._dbg_withtrace)//DEBUG!!!
					debug.__dbg_print("Shifting symbol: " + labels[PCB.la] + " (" + PCB.att + ")");//DEBUG!!!
				sstack.unshift(PCB.act);
				vstack.unshift(PCB.att);
				PCB.lex();
				if(debug._dbg_withtrace)//DEBUG!!!
					debug.__dbg_print("\tNew lookahead symbol: " +	labels[PCB.la] + " (" + PCB.att + ")");//DEBUG!!!
				//Successfull shift and right beyond error recovery?
				if(PCB.error_step > 0)PCB.error_step--;
			}else{	//Reduce	
				act = -PCB.act;	
				if(debug._dbg_withtrace){//DEBUG!!!
					debug.__dbg_print("Reducing by production: " + act);//DEBUG!!!
					debug.__dbg_print("\tPerforming semantic action...");//DEBUG!!!
				}//DEBUG!!!
				rval = ACTIONS(act,vstack);
	
				if(debug._dbg_withparsetree)//DEBUG!!!
					tmptree = [];//DEBUG!!!

				if(debug._dbg_withtrace)//DEBUG!!!
					debug.__dbg_print("\tPopping " + pop_tab[act][1] +  " off the stack...");//DEBUG!!!
				
				sstack.splice(0,pop_tab[act][1]);
				vstack.splice(0,pop_tab[act][1]);
				if(debug._dbg_withparsetree)//DEBUG!!!
					tmptree.push.apply(tmptree, tree.splice(tree.length - pop_tab[act][1], tree.length));//DEBUG!!!
				
				PCB.act = get_goto(sstack[0],pop_tab[act][0]);
				//Do some parse tree construction if desired
				if(debug._dbg_withparsetree){//DEBUG!!!
					tree.push(treenodes.length);//DEBUG!!!
					treenodes.push({//DEBUG!!!
						sym:labels[pop_tab[act][0]],//DEBUG!!!
						att:rval,//DEBUG!!!
						child:tmptree.reverse()//DEBUG!!!
						});//DEBUG!!!
				}//DEBUG!!!
				//Goal symbol match?
				if(act === 0) break; //Don't use PCB.act here!
				if(debug._dbg_withtrace)//DEBUG!!!
					debug.__dbg_print("\tPushing non-terminal " + labels[pop_tab[act][0]]);//DEBUG!!!
			
				//...and push it!
				sstack.unshift(PCB.act);
				vstack.unshift(rval);
			}
		}
		if(debug._dbg_withtrace){//DEBUG!!!
			debug.__dbg_print("\nParse complete.");//DEBUG!!!
			//This function is used for parser drivers that will output//DEBUG!!!
			//the entire debug messages in a row.//DEBUG!!!
			debug.__dbg_flush();//DEBUG!!!
		}//DEBUG!!!

		if(debug._dbg_withparsetree){//DEBUG!!!
			if(err_cnt === 0){//DEBUG!!!
				debug.__dbg_print("\n\n--- Parse tree ---");//DEBUG!!!
				debug.__dbg_parsetree(0, treenodes, tree);//DEBUG!!!
			}else//DEBUG!!!
				debug.__dbg_print("\n\nParse tree cannot be viewed. There where parse errors.");//DEBUG!!!
		}//DEBUG!!!
		return err_cnt;
	}
	return parse;
})(__##PREFIX##_debug,##EOF##,##WHITESPACE##,##ERROR_TOKEN##);

##FOOTER##

