var webdriver_t = "##HEADER##\n\n/*\n\tJS/CC: A LALR(1) Compiler-Compiler written in JavaScript\n\tCopyright (C) 2007-2010 by J.M.K S.F. Software Technologies, Jan Max Meyer\n\thttp://www.jmksf.com ++ jscc<-AT->jmksf.com\n\t\n\tFile:\tjscc.html\n\tAuthor:\tJan Max Meyer\n\tUsage:\tModified parser template for the Web Environment Module\n\t\t\tBased on \"driver_web.js_\" parser template, but NOT\n\t\t\tin the public domain!\n\t\n\tYou may use, modify and distribute this software under the terms and\n\tconditions of the Artistic License.\n\tPlease see ARTISTIC for more information.\n\n\tDriver for the JS/CC Web Environment with integrated HTML\n\tparse tree generator!\n*/\n##HEADER##\n\nvar ##PREFIX##_dbg_withparsetree\t= true;\nvar ##PREFIX##_dbg_withtrace\t\t= false;\nvar ##PREFIX##_dbg_withstepbystep\t= false;\nvar ##PREFIX##_dbg_string\t\t\t= new String();\n\nfunction __##PREFIX##dbg_print( text )\n{\n\t##PREFIX##_dbg_string += text + \"\\n\";\n}\n\nfunction __##PREFIX##dbg_flush()\n{\n\talert( ##PREFIX##_dbg_string );\n}\n\nfunction __##PREFIX##dbg_wait()\n{\n\t//Not implemented for Web.\n}\n\nfunction __##PREFIX##dbg_parsetree( indent, nodes, tree )\n{\n\t//Not implemented for Web.\n}\n\nfunction __##PREFIX##dbg_image( name )\n{\n\treturn \"<img src=\\\"img/\" + name + \".png\\\" \" +\n\t\t\t\"style=\\\"border: 0px; margin: 0px; padding: 0px;\\\" />\";\n}\n\nfunction __##PREFIX##dbg_get_tree_depth( nodes, tree, max )\n{\n\tvar\t\ttmp\t\t= 0;\n\t\n\tfor( var i = 0; i < tree.length; i++ )\n\t{\n\t\tif( nodes[ tree[i] ].child.length > 0 )\n\t\t\tif( max < ( tmp = __dbg_get_tree_depth(\n\t\t\t\t\t\t\t\t\tnodes, nodes[ tree[i] ].child, max+1 ) ) )\n\t\t\t\tmax = tmp;\n\t}\n\t\n\treturn max;\n}\n\nfunction __##PREFIX##dbg_parsetree( cnt, nodes, tree, prev, depth )\n{\n\tvar str = new String();\n\t\n\tif( typeof( prev ) == \"undefined\" )\n\t{\n\t\tstr += \"<table border=\\\"0\\\" cellpadding=\\\"0\\\" \" +\n\t\t\t\t\t\"cellspacing=\\\"0\\\" class=\\\"parsetree\\\">\";\n\t\t\t\t\t\n\t\tdepth = __##PREFIX##dbg_get_tree_depth( nodes, tree, 0 )\n\t\tprev = new Array();\n\t}\n\n\tif( cnt > 0 )\n\t\tprev[cnt-1] = true;\n\t\t\t\n\tfor( var i = 0; i < tree.length; i++ )\n\t{\n\t\tstr += \"<tr>\";\n\n\t\tfor( var j = 0; j < cnt; j++ )\n\t\t{\n\t\t\tstr += \"<td>\";\n\n\t\t\tif( prev[j] )\n\t\t\t{\n\t\t\t\tif( j == cnt - 1 && i == tree.length - 1 )\n\t\t\t\t\tstr += __##PREFIX##dbg_image( \"ll\" );\n\t\t\t\telse if( j == cnt - 1 )\n\t\t\t\t\tstr += __##PREFIX##dbg_image( \"la\" );\n\t\t\t\telse\n\t\t\t\t\tstr += __##PREFIX##dbg_image( \"l\" );\n\t\t\t}\n\t\t\telse\n\t\t\t\tstr += __##PREFIX##dbg_image( \"e\" );\n\t\t\t\t\n\t\t\tstr += \"</td>\";\n\t\t}\n\t\t\n\t\tif( cnt > 0 && i == tree.length - 1 )\n\t\t\tprev[cnt-1] = false;\n\n\t\tstr += \"<td>\";\n\t\tif( nodes[ tree[i] ].child.length > 0 )\n\t\t\tif( cnt == 0 )\n\t\t\t\tstr += __##PREFIX##dbg_image( \"rn\" );\n\t\t\telse\n\t\t\t\tstr += __##PREFIX##dbg_image( \"n\" );\t\n\t\telse\n\t\t\tstr += __##PREFIX##dbg_image( \"t\" );\n\t\tstr += \"</td>\";\n\t\t\n\t\tstr += \"<td class=\\\"node_name\\\" colspan=\\\"\" + ( depth - cnt + 1 ) +\n\t\t\t\t\t \"\\\">\" + nodes[ tree[i] ].sym ;\n\t\tif( nodes[ tree[i] ].att && nodes[ tree[i] ].att != \"\" )\n\t\t\tstr += \":<span>\" + nodes[ tree[i] ].att + \"</span>\" ;\n\t\t\t\n\t\tstr += \"</td>\";\n\n\t\tif( nodes[ tree[i] ].child.length > 0 )\n\t\t\tstr += __##PREFIX##dbg_parsetree(\n\t\t\t\t\t\tcnt+1, nodes, nodes[ tree[i] ].child, prev, depth );\n\t}\n\t\n\tif( cnt == 0 )\n\t\tdocument.getElementById( \"parsetree\" ).innerHTML = str + \"</table>\";\n\t\n\treturn str;\n}\n\nfunction __##PREFIX##dbg_parsetree_phpSyntaxTree( nodes, tree )\n{\n\tvar str = new String();\n\t\n\tfor( var i = 0; i < tree.length; i++ )\n\t{\n\t\tstr += \" [ \";\n\n\t\tstr += nodes[ tree[i] ].sym;\n\t\tif( nodes[ tree[i] ].att && nodes[ tree[i] ].att != \"\" )\n\t\t{\n\t\t\tvar attr = new String( nodes[ tree[i] ].att );\n\t\t\tstr += \":\\\"\" + attr.replace( / |\\t|\\r|\\n|\\[|\\]/g, \"_\" ) + \"\\\"\";\n\t\t}\n\t\t\t\n\t\tstr += \" \";\n\n\t\tif( nodes[ tree[i] ].child.length > 0 )\n\t\t\tstr += __##PREFIX##dbg_parsetree_phpSyntaxTree(\n\t\t\t\t\t\t\tnodes, nodes[ tree[i] ].child );\n\n\t\tstr += \" ] \";\n\t}\n\t\n\treturn str;\n}\n\n\n\n/*\n\tThis is the general, platform-independent part of every parser driver;\n\tInput-/Output and Feature-Functions are done by the particular drivers\n\tcreated for the particular platform.\n*/\n\nfunction __##PREFIX##lex( PCB )\n{\n\tvar state;\n\tvar match\t\t= -1;\n\tvar match_pos\t= 0;\n\tvar start\t\t= 0;\n\tvar pos;\n\tvar chr;\n\n\twhile( 1 )\n\t{\n\t\tstate = 0;\n\t\tmatch = -1;\n\t\tmatch_pos = 0;\n\t\tstart = 0;\n\t\tpos = PCB.offset + 1 + ( match_pos - start );\n\n\t\tdo\n\t\t{\n\t\t\tpos--;\n\t\t\tstate = 0;\n\t\t\tmatch = -2;\n\t\t\tstart = pos;\n\t\n\t\t\tif( PCB.src.length <= start )\n\t\t\t\treturn ##EOF##;\n\t\n\t\t\tdo\n\t\t\t{\n\t\t\t\tchr = PCB.src.charCodeAt( pos );\n\n##DFA##\n\n\t\t\t\t//Line- and column-counter\n\t\t\t\tif( state > -1 )\n\t\t\t\t{\n\t\t\t\t\tif( chr == 10 )\n\t\t\t\t\t{\n\t\t\t\t\t\tPCB.line++;\n\t\t\t\t\t\tPCB.column = 0;\n\t\t\t\t\t}\n\t\t\t\t\tPCB.column++;\n\t\t\t\t}\n\n\t\t\t\tpos++;\n\t\n\t\t\t}\n\t\t\twhile( state > -1 );\n\t\n\t\t}\n\t\twhile( ##WHITESPACE## > -1 && match == ##WHITESPACE## );\n\t\n\t\tif( match > -1 )\n\t\t{\n\t\t\tPCB.att = PCB.src.substr( start, match_pos - start );\n\t\t\tPCB.offset = match_pos;\n\t\t\t\n##TERMINAL_ACTIONS##\n\t\t}\n\t\telse\n\t\t{\n\t\t\tPCB.att = new String();\n\t\t\tmatch = -1;\n\t\t}\n\t\t\n\t\tbreak;\n\t}\n\n\treturn match;\n}\n\nfunction __##PREFIX##parse( src, err_off, err_la )\n{\n\tvar\t\tsstack\t\t\t= new Array();\n\tvar\t\tvstack\t\t\t= new Array();\n\tvar \terr_cnt\t\t\t= 0;\n\tvar\t\trval;\n\tvar\t\tact;\n\t\n\t//PCB: Parser Control Block\n\tvar \tparsercontrol\t= new Function( \"\",\n\t\t\t\t\t\t\t\t\"var la;\" +\n\t\t\t\t\t\t\t\t\"var act;\" +\n\t\t\t\t\t\t\t\t\"var offset;\" +\n\t\t\t\t\t\t\t\t\"var src;\" +\n\t\t\t\t\t\t\t\t\"var att;\" +\n\t\t\t\t\t\t\t\t\"var line;\" +\n\t\t\t\t\t\t\t\t\"var column;\" +\n\t\t\t\t\t\t\t\t\"var error_step;\" );\n\tvar\t\tPCB\t= new parsercontrol();\n\t\n\t//Visual parse tree generation\n\tvar \ttreenode\t\t= new Function( \"\",\n\t\t\t\t\t\t\t\t\"var sym;\"+\n\t\t\t\t\t\t\t\t\"var att;\"+\n\t\t\t\t\t\t\t\t\"var child;\" );\n\tvar\t\ttreenodes\t\t= new Array();\n\tvar\t\ttree\t\t\t= new Array();\n\tvar\t\ttmptree\t\t\t= null;\n\n##TABLES##\n\n##LABELS##\n\t\n\tPCB.line = 1;\n\tPCB.column = 1;\n\tPCB.offset = 0;\n\tPCB.error_step = 0;\n\tPCB.src = src;\n\tPCB.att = new String();\n\n\tif( !err_off )\n\t\terr_off\t= new Array();\n\tif( !err_la )\n\t\terr_la = new Array();\n\t\n\tsstack.push( 0 );\n\tvstack.push( 0 );\n\t\n\tPCB.la = __##PREFIX##lex( PCB );\n\t\t\t\n\twhile( true )\n\t{\n\t\tPCB.act = ##ERROR##;\n\t\tfor( var i = 0; i < act_tab[sstack[sstack.length-1]].length; i+=2 )\n\t\t{\n\t\t\tif( act_tab[sstack[sstack.length-1]][i] == PCB.la )\n\t\t\t{\n\t\t\t\tPCB.act = act_tab[sstack[sstack.length-1]][i+1];\n\t\t\t\tbreak;\n\t\t\t}\n\t\t}\n\t\t\n\t\tif( PCB.act == ##ERROR## )\n\t\t{\n\t\t\tif( ( PCB.act = defact_tab[ sstack[sstack.length-1] ] ) < 0 )\n\t\t\t\tPCB.act = ##ERROR##;\n\t\t\telse\n\t\t\t\tPCB.act *= -1;\n\t\t}\n\n\t\t/*\n\t\t_print( \"state \" + sstack[sstack.length-1] +\n\t\t\t\t\" la = \" +\n\t\t\t\tPCB.la + \" att = >\" +\n\t\t\t\tPCB.att + \"< act = \" +\n\t\t\t\tPCB.act + \" src = >\" +\n\t\t\t\tPCB.src.substr( PCB.offset, 30 ) + \"...\" + \"<\" +\n\t\t\t\t\" sstack = \" + sstack.join() );\n\t\t*/\n\t\t\n\t\tif( ##PREFIX##_dbg_withtrace && sstack.length > 0 )\n\t\t{\n\t\t\t__##PREFIX##dbg_print( \"\\nState \" + sstack[sstack.length-1] + \"\\n\" +\n\t\t\t\t\t\t\t\"\\tLookahead: \" + labels[PCB.la] +\n\t\t\t\t\t\t\t\t\" (\\\"\" + PCB.att + \"\\\")\\n\" +\n\t\t\t\t\t\t\t\"\\tAction: \" + PCB.act + \"\\n\" + \n\t\t\t\t\t\t\t\"\\tSource: \\\"\" + PCB.src.substr( PCB.offset, 30 ) +\n\t\t\t\t\t\t\t\t\t( ( PCB.offset + 30 < PCB.src.length ) ?\n\t\t\t\t\t\t\t\t\t\t\"...\" : \"\" ) + \"\\\"\\n\" +\n\t\t\t\t\t\t\t\"\\tStack: \" + sstack.join() + \"\\n\" +\n\t\t\t\t\t\t\t\"\\tValue stack: \" + vstack.join() + \"\\n\" );\n\t\t\t\n\t\t\tif( ##PREFIX##_dbg_withstepbystep )\n\t\t\t\t__##PREFIX##dbg_wait();\n\t\t}\n\t\t\n\t\t\t\n\t\t//Parse error? Try to recover!\n\t\tif( PCB.act == ##ERROR## )\n\t\t{\n\t\t\tif( ##PREFIX##_dbg_withtrace )\n\t\t\t{\n\t\t\t\tvar expect = new String();\n\t\t\t\t\n\t\t\t\t__##PREFIX##dbg_print( \"Error detected: \" +\n\t\t\t\t\t\"There is no reduce or shift on the symbol \" +\n\t\t\t\t\t\tlabels[PCB.la] );\n\t\t\t\t\n\t\t\t\tfor( var i = 0; i < act_tab[sstack[sstack.length-1]].length;\n\t\t\t\t\t\ti+=2 )\n\t\t\t\t{\n\t\t\t\t\tif( expect != \"\" )\n\t\t\t\t\t\texpect += \", \";\n\t\t\t\t\t\t\n\t\t\t\t\texpect += \"\\\"\" +\n\t\t\t\t\t\t\t\tlabels[ act_tab[sstack[sstack.length-1]][i] ]\n\t\t\t\t\t\t\t\t\t+ \"\\\"\";\n\t\t\t\t}\n\t\t\t\t\n\t\t\t\t__##PREFIX##dbg_print( \"Expecting: \" + expect );\n\t\t\t}\n\t\t\t\n\t\t\t//Report errors only when error_step is 0, and this is not a\n\t\t\t//subsequent error from a previous parse\n\t\t\tif( PCB.error_step == 0 )\n\t\t\t{\n\t\t\t\terr_cnt++;\n\t\t\t\terr_off.push( PCB.offset - PCB.att.length );\n\t\t\t\terr_la.push( new Array() );\n\t\t\t\tfor( var i = 0; i < act_tab[sstack[sstack.length-1]].length;\n\t\t\t\t\t\ti+=2 )\n\t\t\t\t\terr_la[err_la.length-1].push(\n\t\t\t\t\t\t\tlabels[act_tab[sstack[sstack.length-1]][i]] );\n\t\t\t}\n\t\t\t\n\t\t\t//Perform error recovery\t\t\t\n\t\t\twhile( sstack.length > 1 && PCB.act == ##ERROR## )\n\t\t\t{\n\t\t\t\tsstack.pop();\n\t\t\t\tvstack.pop();\n\t\t\t\t\n\t\t\t\t//Try to shift on error token\n\t\t\t\tfor( var i = 0; i < act_tab[sstack[sstack.length-1]].length;\n\t\t\t\t\t\ti+=2 )\n\t\t\t\t{\n\t\t\t\t\tif( act_tab[sstack[sstack.length-1]][i] == ##ERROR_TOKEN## )\n\t\t\t\t\t{\n\t\t\t\t\t\tPCB.act = act_tab[sstack[sstack.length-1]][i+1];\n\t\t\t\t\t\t\n\t\t\t\t\t\tsstack.push( PCB.act );\n\t\t\t\t\t\tvstack.push( new String() );\n\t\t\t\t\t\t\n\t\t\t\t\t\tif( ##PREFIX##_dbg_withtrace )\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\t__##PREFIX##dbg_print(\n\t\t\t\t\t\t\t\t\"Error recovery: error token \" +\n\t\t\t\t\t\t\t\t\t\"could be shifted!\" );\n\t\t\t\t\t\t\t__##PREFIX##dbg_print( \"Error recovery: \" +\n\t\t\t\t\t\t\t\t\t\"current stack is \" + sstack.join() );\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t\t\n\t\t\t//Is it better to leave the parser now?\n\t\t\tif( sstack.length > 1 && PCB.act != ##ERROR## )\n\t\t\t{\n\t\t\t\t//Ok, now try to shift on the next tokens\n\t\t\t\twhile( PCB.la != ##EOF## )\n\t\t\t\t{\n\t\t\t\t\tif( ##PREFIX##_dbg_withtrace )\n\t\t\t\t\t\t__##PREFIX##dbg_print( \"Error recovery: \" +\n\t\t\t\t\t\t\t\"Trying to shift on \\\"\"\n\t\t\t\t\t\t\t\t+ labels[ PCB.la ] + \"\\\"\" );\n\n\t\t\t\t\tPCB.act = ##ERROR##;\n\t\t\t\t\t\n\t\t\t\t\tfor( var i = 0; i < act_tab[sstack[sstack.length-1]].length;\n\t\t\t\t\t\t\ti+=2 )\n\t\t\t\t\t{\n\t\t\t\t\t\tif( act_tab[sstack[sstack.length-1]][i] == PCB.la )\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\tPCB.act = act_tab[sstack[sstack.length-1]][i+1];\n\t\t\t\t\t\t\tbreak;\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t\t\n\t\t\t\t\tif( PCB.act != ##ERROR## )\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t\t\n\t\t\t\t\tif( ##PREFIX##_dbg_withtrace )\n\t\t\t\t\t\t__##PREFIX##dbg_print( \"Error recovery: Discarding \\\"\"\n\t\t\t\t\t\t\t+ labels[ PCB.la ] + \"\\\"\" );\n\t\t\t\t\t\n\t\t\t\t\twhile( ( PCB.la = __##PREFIX##lex( PCB ) )\n\t\t\t\t\t\t\t\t< 0 )\n\t\t\t\t\t\tPCB.offset++;\n\t\t\t\t\n\t\t\t\t\tif( ##PREFIX##_dbg_withtrace )\n\t\t\t\t\t\t__##PREFIX##dbg_print( \"Error recovery: New token \\\"\"\n\t\t\t\t\t\t\t+ labels[ PCB.la ] + \"\\\"\" );\n\t\t\t\t}\n\t\t\t\twhile( PCB.la != ##EOF## && PCB.act == ##ERROR## );\n\t\t\t}\n\t\t\t\n\t\t\tif( PCB.act == ##ERROR## || PCB.la == ##EOF## )\n\t\t\t{\n\t\t\t\tif( ##PREFIX##_dbg_withtrace )\n\t\t\t\t\t__##PREFIX##dbg_print( \"\\tError recovery failed, \" +\n\t\t\t\t\t\t\t\"terminating parse process...\" );\n\t\t\t\tbreak;\n\t\t\t}\n\n\t\t\tif( ##PREFIX##_dbg_withtrace )\n\t\t\t\t__##PREFIX##dbg_print( \"\\tError recovery succeeded, \" +\n\t\t\t\t\t\t\t\t\t\t\t\"continuing\" );\n\t\t\t\n\t\t\t//Try to parse the next three tokens successfully...\n\t\t\tPCB.error_step = 3;\n\t\t}\n\n\t\t//Shift\n\t\tif( PCB.act > 0 )\n\t\t{\n\t\t\t//Parse tree generation\n\t\t\tif( ##PREFIX##_dbg_withparsetree )\n\t\t\t{\n\t\t\t\tvar node = new treenode();\n\t\t\t\tnode.sym = labels[ PCB.la ];\n\t\t\t\tnode.att = PCB.att;\n\t\t\t\tnode.child = new Array();\n\t\t\t\ttree.push( treenodes.length );\n\t\t\t\ttreenodes.push( node );\n\t\t\t}\n\t\t\t\n\t\t\tif( ##PREFIX##_dbg_withtrace )\n\t\t\t\t__##PREFIX##dbg_print( \"Shifting symbol: \" +\n\t\t\t\t\t\tlabels[PCB.la] + \" (\" + PCB.att + \")\" );\n\t\t\n\t\t\tsstack.push( PCB.act );\n\t\t\tvstack.push( PCB.att );\n\t\t\t\n\t\t\tPCB.la = __##PREFIX##lex( PCB );\n\t\t\t\n\t\t\tif( ##PREFIX##_dbg_withtrace )\n\t\t\t\t__##PREFIX##dbg_print( \"\\tNew lookahead symbol: \" +\n\t\t\t\t\t\tlabels[PCB.la] + \" (\" + PCB.att + \")\" );\n\t\t\t\t\n\t\t\t//Successfull shift and right beyond error recovery?\n\t\t\tif( PCB.error_step > 0 )\n\t\t\t\tPCB.error_step--;\n\t\t}\n\t\t//Reduce\n\t\telse\n\t\t{\t\t\n\t\t\tact = PCB.act * -1;\n\t\t\t\n\t\t\tif( ##PREFIX##_dbg_withtrace )\n\t\t\t\t__##PREFIX##dbg_print( \"Reducing by production: \" + act );\n\t\t\t\n\t\t\trval = void( 0 );\n\t\t\t\n\t\t\tif( ##PREFIX##_dbg_withtrace )\n\t\t\t\t__##PREFIX##dbg_print( \"\\tPerforming semantic action...\" );\n\t\t\t\n##ACTIONS##\n\t\t\t\n\t\t\tif( ##PREFIX##_dbg_withparsetree )\n\t\t\t\ttmptree = new Array();\n\n\t\t\tif( ##PREFIX##_dbg_withtrace )\n\t\t\t\t__##PREFIX##dbg_print( \"\\tPopping \" + \n\t\t\t\t\t\t\t\t\tpop_tab[act][1] +  \" off the stack...\" );\n\t\t\t\t\n\t\t\tfor( var i = 0; i < pop_tab[act][1]; i++ )\n\t\t\t{\n\t\t\t\tif( ##PREFIX##_dbg_withparsetree )\n\t\t\t\t\ttmptree.push( tree.pop() );\n\t\t\t\t\t\n\t\t\t\tsstack.pop();\n\t\t\t\tvstack.pop();\n\t\t\t}\n\n\t\t\t//Get goto-table entry\n\t\t\tPCB.act = ##ERROR##;\n\t\t\tfor( var i = 0; i < goto_tab[sstack[sstack.length-1]].length; i+=2 )\n\t\t\t{\n\t\t\t\tif( goto_tab[sstack[sstack.length-1]][i] == pop_tab[act][0] )\n\t\t\t\t{\n\t\t\t\t\tPCB.act = goto_tab[sstack[sstack.length-1]][i+1];\n\t\t\t\t\tbreak;\n\t\t\t\t}\n\t\t\t}\n\t\t\t\n\t\t\t//Do some parse tree construction if desired\n\t\t\tif( ##PREFIX##_dbg_withparsetree )\n\t\t\t{\n\t\t\t\tvar node = new treenode();\n\t\t\t\tnode.sym = labels[ pop_tab[act][0] ];\n\t\t\t\tnode.att = rval;\n\t\t\t\tnode.child = tmptree.reverse();\n\t\t\t\ttree.push( treenodes.length );\n\t\t\t\ttreenodes.push( node );\n\t\t\t}\n\t\t\t\n\t\t\t//Goal symbol match?\n\t\t\tif( act == 0 ) //Don't use PCB.act here!\n\t\t\t\tbreak;\n\t\t\t\t\n\t\t\tif( ##PREFIX##_dbg_withtrace )\n\t\t\t\t__##PREFIX##dbg_print( \"\\tPushing non-terminal \" + \n\t\t\t\t\t\tlabels[ pop_tab[act][0] ] );\n\t\t\t\n\t\t\t//...and push it!\n\t\t\tsstack.push( PCB.act );\n\t\t\tvstack.push( rval );\n\t\t}\n\t}\n\n\tif( ##PREFIX##_dbg_withtrace )\n\t{\n\t\t__##PREFIX##dbg_print( \"\\nParse complete.\" );\n\t\t\n\t\t//This function is used for parser drivers that will output\n\t\t//the entire debug messages in a row.\n\t\t__##PREFIX##dbg_flush();\n\t}\n\n\tif( ##PREFIX##_dbg_withparsetree )\n\t{\n\t\tif( err_cnt == 0 )\n\t\t{\n\t\t\t__##PREFIX##dbg_print( \"\\n\\n--- Parse tree ---\" );\n\t\t\t__##PREFIX##dbg_parsetree( 0, treenodes, tree );\n\t\t}\n\t\telse\n\t\t{\n\t\t\t__##PREFIX##dbg_print( \"\\n\\nParse tree cannot be viewed. \" +\n\t\t\t\t\t\t\t\t\t\"There where parse errors.\" );\n\t\t}\n\t}\n\t\n\treturn err_cnt;\n}\n\n##FOOTER##";
