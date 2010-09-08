##HEADER##

/*
	JS/CC: A LALR(1) Compiler-Compiler written in JavaScript
	Copyright (C) 2007-2010 by J.M.K S.F. Software Technologies, Jan Max Meyer
	http://www.jmksf.com ++ jscc<-AT->jmksf.com
	
	File:	jscc.html
	Author:	Jan Max Meyer
	Usage:	Modified parser template for the Web Environment Module
			Based on "driver_web.js_" parser template, but NOT
			in the public domain!
	
	You may use, modify and distribute this software under the terms and
	conditions of the Artistic License.
	Please see ARTISTIC for more information.

	Driver for the JS/CC Web Environment with integrated HTML
	parse tree generator!
*/
##HEADER##

var ##PREFIX##_dbg_withparsetree	= true;
var ##PREFIX##_dbg_withtrace		= false;
var ##PREFIX##_dbg_withstepbystep	= false;
var ##PREFIX##_dbg_string			= new String();

function __##PREFIX##dbg_print( text )
{
	##PREFIX##_dbg_string += text + "\n";
}

function __##PREFIX##dbg_flush()
{
	alert( ##PREFIX##_dbg_string );
}

function __##PREFIX##dbg_wait()
{
	//Not implemented for Web.
}

function __##PREFIX##dbg_parsetree( indent, nodes, tree )
{
	//Not implemented for Web.
}

function __##PREFIX##dbg_image( name )
{
	return "<img src=\"img/" + name + ".png\" " +
			"style=\"border: 0px; margin: 0px; padding: 0px;\" />";
}

function __##PREFIX##dbg_get_tree_depth( nodes, tree, max )
{
	var		tmp		= 0;
	
	for( var i = 0; i < tree.length; i++ )
	{
		if( nodes[ tree[i] ].child.length > 0 )
			if( max < ( tmp = __dbg_get_tree_depth(
									nodes, nodes[ tree[i] ].child, max+1 ) ) )
				max = tmp;
	}
	
	return max;
}

function __##PREFIX##dbg_parsetree( cnt, nodes, tree, prev, depth )
{
	var str = new String();
	
	if( typeof( prev ) == "undefined" )
	{
		str += "<table border=\"0\" cellpadding=\"0\" " +
					"cellspacing=\"0\" class=\"parsetree\">";
					
		depth = __##PREFIX##dbg_get_tree_depth( nodes, tree, 0 )
		prev = new Array();
	}

	if( cnt > 0 )
		prev[cnt-1] = true;
			
	for( var i = 0; i < tree.length; i++ )
	{
		str += "<tr>";

		for( var j = 0; j < cnt; j++ )
		{
			str += "<td>";

			if( prev[j] )
			{
				if( j == cnt - 1 && i == tree.length - 1 )
					str += __##PREFIX##dbg_image( "ll" );
				else if( j == cnt - 1 )
					str += __##PREFIX##dbg_image( "la" );
				else
					str += __##PREFIX##dbg_image( "l" );
			}
			else
				str += __##PREFIX##dbg_image( "e" );
				
			str += "</td>";
		}
		
		if( cnt > 0 && i == tree.length - 1 )
			prev[cnt-1] = false;

		str += "<td>";
		if( nodes[ tree[i] ].child.length > 0 )
			if( cnt == 0 )
				str += __##PREFIX##dbg_image( "rn" );
			else
				str += __##PREFIX##dbg_image( "n" );	
		else
			str += __##PREFIX##dbg_image( "t" );
		str += "</td>";
		
		str += "<td class=\"node_name\" colspan=\"" + ( depth - cnt + 1 ) +
					 "\">" + nodes[ tree[i] ].sym ;
		if( nodes[ tree[i] ].att && nodes[ tree[i] ].att != "" )
			str += ":<span>" + nodes[ tree[i] ].att + "</span>" ;
			
		str += "</td>";

		if( nodes[ tree[i] ].child.length > 0 )
			str += __##PREFIX##dbg_parsetree(
						cnt+1, nodes, nodes[ tree[i] ].child, prev, depth );
	}
	
	if( cnt == 0 )
		document.getElementById( "parsetree" ).innerHTML = str + "</table>";
	
	return str;
}

function __##PREFIX##dbg_parsetree_phpSyntaxTree( nodes, tree )
{
	var str = new String();
	
	for( var i = 0; i < tree.length; i++ )
	{
		str += " [ ";

		str += nodes[ tree[i] ].sym;
		if( nodes[ tree[i] ].att && nodes[ tree[i] ].att != "" )
		{
			var attr = new String( nodes[ tree[i] ].att );
			str += ":\"" + attr.replace( / |\t|\r|\n|\[|\]/g, "_" ) + "\"";
		}
			
		str += " ";

		if( nodes[ tree[i] ].child.length > 0 )
			str += __##PREFIX##dbg_parsetree_phpSyntaxTree(
							nodes, nodes[ tree[i] ].child );

		str += " ] ";
	}
	
	return str;
}

/* Code of driver.js will go here... */

