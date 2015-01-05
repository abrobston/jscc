/*
	This is the general, platform-independent part of every parser driver;
	Input-/Output and Feature-Functions are done by the particular drivers
	created for the particular platform.
*/
##HEADER##
var __##PREFIX##parse=(function(debug,eof,whitespace,error_token){
	
/// there was "continue" in code, we must to replace it
var Continue = function(){throw Continue;};
///can return value from any place of callback
function Return(value){
	throw new Return.Value(value);
}
Return.Value = function(value){
	this.valueOf = function(){
		return value;
	};
}
	var DFA = (function(){
		var DFA_DATA = ##DFA##;
		return function(chr,pos){
			var line = DFA_DATA[this.state].line;
			var p, st;
			for(p = 1<<8, st = line; p; p>>=1){
				st = st[!!(chr&p)+0];
				if(st==null)break;
				if(st instanceof Array)continue;
				break;
			}
			var ac = DFA_DATA[this.state].accept;
			this.state = st;
			if(ac!=-1){
				this.match = ac;
				this.match_pos = pos;
			}
		}
	})();
	var TERMINAL_ACTIONS = (function(){
		function emptyFn(PCB){return PCB.att;}
		var actions = ##TERMINAL_ACTIONS##
		return function(PCB, match){
			try{
				return (actions[match] || emptyFn)(PCB);
			}catch(e){
				if(e instanceof Return.Value)return e.valueOf();
				if(e == Continue)return Continue;
				throw e;
			}
		}
	})();
	function lex(){
		var start, pos, chr, actionResult;
		var dfa = {
			exec:DFA
		}
		while(true){
			dfa.match_pos = 0;
			pos = this.offset + 1;
			do{
				pos--;
				dfa.state = 0;
				dfa.match = null;
				start = pos;
				if(this.src.length <= start)
					return eof;
				do{
					chr = this.src.charCodeAt(pos);
					dfa.exec(chr,pos);
					if(dfa.state != null)
						this.accountChar(chr);
					pos++;
				}while(dfa.state != null);
			}while(whitespace > -1 && dfa.match == whitespace);
			if(dfa.match != null){
				this.att = this.src.slice(start, dfa.match_pos);
				this.offset = dfa.match_pos;
				actionResult = TERMINAL_ACTIONS(this,dfa.match);
				if(dfa.state != null)
					this.accountChar(chr);
				if(actionResult === Continue)
					continue;
				this.att = actionResult;
			}else
				this.att = "";
			return this.la = dfa.match;
		}
	}
##TABLES##
##LABELS##
	var ACTIONS = (function(){
		var actions = ##ACTIONS##;
		return function (act,vstack){
			try{
				return actions[act].apply(null,vstack);
			}catch(e){
				if(e instanceof Return.Value)return e.valueOf();
				throw e;
			}
		}
	})();
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
		var i;

		var PCB	= {
			line:1,
			column:1,
			offset:0,
			error_step:0,
			src:src,
			att:"",
			lex:function(){return this.la = lex.call(this);},///@TODO: change `lex` function
			accountChar:function(chr){
				if( chr === 10 ){
					this.line++;
					this.column = 0;
				}
				this.column++;
			}
		};
		err_off	= err_off || [];
		err_la = err_la || [];
		PCB.lex();
		while(true){
			PCB.act = get_act(sstack[0],PCB.la);
			if(PCB.act == null && defact_tab[sstack[0]] >= 0)
				PCB.act = -defact_tab[sstack[0]];
			if(PCB.act == null){//Parse error? Try to recover!
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
					}
				}
				//Is it better to leave the parser now?
				if(sstack.length > 1 && PCB.act != null){
					//Ok, now try to shift on the next tokens
					while(PCB.la !== eof){
						PCB.act = act_tab[sstack[0]][i+1];
						if(PCB.act != null)break;
						while(PCB.lex() != null)PCB.offset++;
					}
				}
				if(PCB.act == null || PCB.la === eof){
					break;
				}
				//Try to parse the next three tokens successfully...
				PCB.error_step = 3;
			}
			if(PCB.act > 0){//Shift
				//Parse tree generation
				sstack.unshift(PCB.act);
				vstack.unshift(PCB.att);
				PCB.lex();
				//Successfull shift and right beyond error recovery?
				if(PCB.error_step > 0)
					PCB.error_step--;
			}else{	//Reduce	
				act = -PCB.act;
				//vstack.unshift(vstack);
				rval = ACTIONS(act,vstack);
				//vstack.shift();
				sstack.splice(0,pop_tab[act][1]);
				vstack.splice(0,pop_tab[act][1]);
				
				PCB.act = get_goto(sstack[0],pop_tab[act][0]);
				//Do some parse tree construction if desired
				//Goal symbol match?
				if(act === 0) break; //Don't use PCB.act here!
			
				//...and push it!
				sstack.unshift(PCB.act);
				vstack.unshift(rval);
			}
		}
		return err_cnt;
	}
	return parse;
})(__##PREFIX##_debug,##EOF##,##WHITESPACE##,##ERROR_TOKEN##);

##FOOTER##

