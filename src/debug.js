/* -MODULE----------------------------------------------------------------------
JS/CC: A LALR(1) Parser Generator written in JavaScript
Copyright (C) 2007, 2008 by J.M.K S.F. Software Technologies, Jan Max Meyer
http://www.jmksf.com ++ jscc<-AT->jmksf.com

File:	debug.js
Author:	Jan Max Meyer
Usage:	Debug-Functions / Detail progress output
		These functions had been designed to both output plain text as well
		as HTML-formatted output.

You may use, modify and distribute this software under the terms and conditions
of the Artistic License. Please see ARTISTIC for more information.
----------------------------------------------------------------------------- */

function print_symbols( mode )
{
	if( mode == MODE_GEN_HTML )
	{
		_print( "<table class=\"debug\" cellpadding=\"0\" cellspacing=\"0\">" );
		_print( "<tr>" );
		_print( "<td class=\"tabtitle\" colspan=\"3\">Symbols Overview</td>" );
		_print( "</tr>" );
		_print( "<tr>" );
		_print( "<td class=\"coltitle\">Symbol</td>" );
		_print( "<td class=\"coltitle\">Type</td>" );
		_print( "</tr>" );
	}
	else if( mode == MODE_GEN_TEXT )
		_print( "--- Symbol Dump ---" );
	
	for( var i = 0; i < symbols.length; i++ )
	{
		if( mode == MODE_GEN_HTML )
		{
			_print( "<tr>" );
			
			_print( "<td>" );
			_print( symbols[i].label );
			_print( "</td>" );
		
			_print( "<td>" );
			_print( ( ( symbols[i].kind == SYM_NONTERM ) ? "Non-terminal" : "Terminal" ) );
			_print( "</td>" );
		}
		else if( mode == MODE_GEN_TEXT )
		{
			var output = new String();			
			
			output = symbols[i].label;
			for( var j = output.length; j < 20; j++ )
				output += " ";
			
			output += ( ( symbols[i].kind == SYM_NONTERM ) ? "Non-terminal" : "Terminal" );
			
			if( symbols[i].kind == SYM_TERM )
			{
				for( var j = output.length; j < 40; j++ )
					output += " ";
			
				output += symbols[i].level + "/";
				
				switch( symbols[i].assoc )
				{
					case ASSOC_NONE:
						output += "^";
						break;
					case ASSOC_LEFT:
						output += "<";
						break;
					case ASSOC_RIGHT:
						output += ">";
						break;
	
				}
			}
			
			_print( output );
		}
		
	}	
	
	if( mode == MODE_GEN_HTML )
		_print( "</table>" );
	else if( mode == MODE_GEN_TEXT )
		_print( "" );
}


function print_grammar( mode )
{
	if( mode == MODE_GEN_HTML )
	{
		_print( "<table class=\"debug\" cellpadding=\"0\" cellspacing=\"0\">" );
		_print( "<tr>" );
		_print( "<td class=\"tabtitle\" colspan=\"3\">Grammar Overview</td>" );
		_print( "</tr>" );
		_print( "<tr>" );
		_print( "<td class=\"coltitle\">Left-hand side</td>" );
		_print( "<td class=\"coltitle\">FIRST-set</td>" );
		_print( "<td class=\"coltitle\">Right-hand side</td>" );
		_print( "</tr>" );
		
		for( var i = 0; i < symbols.length; i++ )
		{
			_print( "<tr>" );
			
			//alert( "symbols " + i +  " = " + symbols[i].label + "(" + symbols[i].kind + ")" );
			if( symbols[i].kind == SYM_NONTERM )
			{
				_print( "<td>" );
				_print( symbols[i].label );
				_print( "</td>" );
	
				_print( "<td>" );
				for( var j = 0; j < symbols[i].first.length; j++ )
				{
					_print( " <b>" + symbols[symbols[i].first[j]].label + "</b> " );
				}
				_print( "</td>" );
	
				_print( "<td>" );
				for( var j = 0; j < symbols[i].prods.length; j++ )
				{
					for( var k = 0; k < productions[symbols[i].prods[j]].rhs.length; k++ )
					{
						if( symbols[productions[symbols[i].prods[j]].rhs[k]].kind == SYM_TERM )
							_print( " <b>" + symbols[productions[symbols[i].prods[j]].rhs[k]].label + "</b> " );
						else
							_print( " " + symbols[productions[symbols[i].prods[j]].rhs[k]].label + " " );					
					}
					_print( "<br />" );
				}
				_print( "</td>" );
			}
			
			_print( "</tr>" );
		}
		
		_print( "</table>" );
	}
	else if( mode == MODE_GEN_TEXT )
	{
		var output = new String();
				
		for( var i = 0; i < symbols.length; i++ )
		{
			if( symbols[i].kind == SYM_NONTERM )
			{
				output += symbols[i].label + " {";
				
				for( var j = 0; j < symbols[i].first.length; j++ )
					output += " " + symbols[symbols[i].first[j]].label + " ";
	
				output += "}\n";			
	
				for( var j = 0; j < symbols[i].prods.length; j++ )
				{
					output += "\t";
					for( var k = 0; k < productions[symbols[i].prods[j]].rhs.length; k++ )
					{
						if( symbols[productions[symbols[i].prods[j]].rhs[k]].kind == SYM_TERM )
							output += "#" + symbols[productions[symbols[i].prods[j]].rhs[k]].label + " ";
						else
							output += symbols[productions[symbols[i].prods[j]].rhs[k]].label + " ";
					}
					output += "\n";
				}
			}
		}
		
		_print( output );
	}
}

function print_item_set( mode, label, item_set )
{
	var i, j;
	
	if( item_set.length == 0 )
		return;
	
	if( mode == MODE_GEN_HTML )
	{
		_print( "<table class=\"debug\" cellpadding=\"0\" cellspacing=\"0\">" );
		_print( "<tr>" );
		_print( "<td class=\"tabtitle\" colspan=\"2\">" + label + "</td>" );
		_print( "</tr>" );
		_print( "<tr>" );
		_print( "<td class=\"coltitle\" width=\"35%\">Lookahead</td>" );
		_print( "<td class=\"coltitle\" width=\"65%\">Production</td>" );
		_print( "</tr>" );
	}
	else if( mode == MODE_GEN_TEXT )
		_print( "--- " + label + " ---" );
			
	for( i = 0; i < item_set.length; i++ )
	{
		if( mode == MODE_GEN_HTML )
		{
			_print( "<tr>" );
			
			//alert( "symbols " + i +  " = " + symbols[i].label + "(" + symbols[i].kind + ")" );
			_print( "<td>" );
			for( j = 0; j < item_set[i].lookahead.length; j++ )
			{
				_print( " <b>" + symbols[item_set[i].lookahead[j]].label + "</b> " );
			}
			_print( "</td>" );
	
			_print( "<td>" );
			
			_print( symbols[productions[item_set[i].prod].lhs].label + " -&gt; " );
			for( j = 0; j < productions[item_set[i].prod].rhs.length; j++ )
			{
				if( j == item_set[i].dot_offset )
					_print( "." );
				
				if( symbols[productions[item_set[i].prod].rhs[j]].kind == SYM_TERM )
					_print( " <b>" + symbols[productions[item_set[i].prod].rhs[j]].label + "</b> " );
				else
					_print( " " + symbols[productions[item_set[i].prod].rhs[j]].label + " " );					
			}
			
			if( j == item_set[i].dot_offset )
					_print( "." );
			_print( "</td>" );
			
			_print( "</tr>" );
		}
		else if( mode == MODE_GEN_TEXT )
		{
			var out = new String();
			
			out += symbols[productions[item_set[i].prod].lhs].label;
						
			for( j = out.length; j < 20; j++ )
				out += " ";
				
			out += " -> ";
			
			for( j = 0; j < productions[item_set[i].prod].rhs.length; j++ )
			{
				if( j == item_set[i].dot_offset )
					out += ".";
				
				if( symbols[productions[item_set[i].prod].rhs[j]].kind == SYM_TERM )
					out += " #" + symbols[productions[item_set[i].prod].rhs[j]].label + " ";
				else
					out += " " + symbols[productions[item_set[i].prod].rhs[j]].label + " ";					
			}
			
			if( j == item_set[i].dot_offset )
				out += ".";

			for( j = out.length; j < 60; j++ )
				out += " ";
			out += "{ ";
			
			for( j = 0; j < item_set[i].lookahead.length; j++ )
				out += "#" + symbols[item_set[i].lookahead[j]].label + " ";
				
			out += "}";
			
			_print( out );
		}
	}
	
	if( mode == MODE_GEN_HTML )
		_print( "</table>" );
}

