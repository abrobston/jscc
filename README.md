[![Build Status](https://travis-ci.org/abrobston/jscc.svg?branch=master)](https://travis-ci.org/abrobston/jscc)
[![codecov](https://codecov.io/gh/abrobston/jscc/branch/master/graph/badge.svg)](https://codecov.io/gh/abrobston/jscc)
[![npm](https://img.shields.io/npm/v/jscc-parser.svg?maxAge=2592000)](https://www.npmjs.com/package/jscc-parser)

JS/CC LALR(1) Parser Generator  
Copyright © 2007-2016 by Phorward Software Technologies; Jan Max Meyer; Brobston Development, Inc.; and other contributors  
http://jscc.brobston.com ++ contact<<AT>>phorward-software<<DOT>>com  

INTRODUCTION
------------


JS/CC is the first available parser development system for JavaScript
and ECMAScript-derivates. It has been developed, both, with the
intention of building a productive compiler development system and
with the intention of creating an easy-to-use academic environment for
people interested in how parse table generation is done generally in
bottom-up parsing.

JS/CC brings a lex/yacc-like toolchain into the world of ECMAScript.

LICENSE
-------

JS/CC is initially written by Jan Max Meyer (Phorward Software Technologies)
with contributions by Louis P. Santillan and Sergiy Shatunov.  Work 
to migrate JS/CC to GitHub, add modularity, and package for npm and Bower
was done by Andrew Brobston.  JS/CC is released under the terms and
conditions of the 3-clause BSD license.

REQUIREMENTS
------------

To use JS/CC, you need either Mozilla/Rhino, Node.js, Nashorn, or an
ordinary ECMAScript compatible web browser!  Versions through 0.37.0
supported Mozilla/Spidermonkey, Google V8, and Microsoft JScript.
If resumed support for these platforms is desired, pull requests are welcome.

The build system uses Gulp.  Google's Closure Compiler is used for verifying
and minifying the code for the various platforms.  Code contributions should
ensure that all tests pass (using the Mocha framework, with the TDD code style
and Chai assertion library) and that there are no Closure Compiler warnings
or errors.

The npm package is named `jscc-parser`, as `jscc` was already taken.

ABOUT
-----

JS/CC is a platform-independent software that unions both: A regular
expression-based lexical analyzer generator matching individual tokens from
the input character stream and a LALR(1) parser generator, computing the parse
tables for a given context-free grammar specification to build a stand-alone,
working parser. The context-free grammar fed to JS/CC is defined in a
Backus-Naur-Form-based meta language, and allows the insertion of individual
semantic code to be evaluated on a rule's reduction. JS/CC itself has been
entirely written in JavaScript so it can be executed in many different ways:
as platform-independent, browser-based JavaScript embedded on a Website, as
as a Mozilla/Rhino or Java Nashorn interpreted application, or a
Node shell script on Windows, *nix, Linux and Mac OSX. However, for productive
execution, it is recommended to use the command-line versions.
These versions are capable of assembling a complete compiler from a JS/CC
parser specification, which is then stored to a .js JavaScript source file.

To use JS/CC and for understanding its internals and behavior, some knowledge
of context-free grammars, bottom-up parsing techniques and compiler
construction theory, in general, is assumed.

BUILDING
--------

 1. Ensure that you have Node.js and npm.  See
    https://docs.npmjs.com/getting-started/installing-node for details.
    Building and testing JS/CC most recently used Node versions 4.4.3
    and 5.10.1, but other versions will likely work also.  
 2. Ensure that you have Gulp version 3.x.  See
    https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md.
    Gulp version 4.x may work but has not been tested.
 3. Ensure that Java 8 or later is installed and that the `JAVA_HOME`
    environment variable points to the correct path of this installation.
    Builds and tests have been done with Oracle's distribution of
    Java 8.  OpenJDK 8 may work but has not been tested.
 4. From the root project directory, run `npm update`.
 5. To run the default build target, simply run `gulp`.  The default
    build target downloads some additional dependencies, generates
    documentation, and builds for the four platforms currently
    supported.  To run Mocha tests, first build with `gulp`, then
    run `gulp test`.  For other targets, see gulpfile.js.
    
USE
---

JS/CC can be used as a JavaScript module or with one of the command-line runners.

### As a Module

After `var jscc = require("jscc-parser")` or equivalent, call the `jscc` function with an object containing options:

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `out_file` | `string` | Empty string, meaning to print to standard output or the engine's equivalent | The path of the output file. |
| `src_file` | `string` | Empty string, meaning to read from standard input or the engine's equivalent. | The path of the input grammar file. |
| `tpl_file` | `string` | A default template file for generic compilation tasks. | The path of the input template file. |
| `input` | `string` or `function` | None | If a string, the contents of the input grammar.  If a function, a function that returns the contents of the grammar.  When `input` is specified, `src_file` is ignored. |
| `template` | `string` or `function` | None | If a string, the contents of the template.  If a function with no arguments, a function that returns the contents of the template.  When `template` is specified, `tpl_file` is ignored. |
| `outputCallback` | `function(string)` | None | A function with a parameter that will be called with the output.  When `outputCallback` is specified, `out_file` is ignored. |
| `dump_nfa` | `boolean` | `false` | Whether to output the nondeterministic finite automata for debugging purposes. |
| `dump_dfa` | `boolean` | `false` | Whether to output the deterministic finite automata for debugging purposes. |
| `verbose` | `boolean` | `false` | Makes output slightly chattier.  Will probably be deprecated in favor of using only `logLevel` at some point. |
| `logLevel` | `string` or member of the `jscc.enums.LOG_LEVEL` enumeration (`FATAL`, `ERROR`, `WARN`, `INFO`, `DEBUG`, `TRACE`) | `WARN` | The logging level. |
| `throwIfErrors` | `boolean` | `false` | Whether to throw an exception before completion of the main method if there are any compilation errors. |
| `exitIfErrors` | `boolean` | `false` | Whether to exit the process with a non-zero exit code if there are any errors, provided that the platform permits doing so.  Intended for use with shell scripts. |

### From the Command Line

After building JS/CC, the `bin` directory should contain shell scripts for both *nix
and Windows.  There are scripts for each platform.  For example, to run using the
Nashorn engine on Linux:

    ./bin/jscc-nashorn.sh --src_file "./path/to/src" --out_file "./path/to/output" --logLevel INFO
    
The `throwIfErrors` and `exitIfErrors` options are not supported from the command line because
each runner sets those options according to its needs.

GRAMMAR FILES
-------------

See the [online documentation](http://jscc.brobston.com/documentation/grammar/general.html) for information
on the grammar file syntax that JS/CC requires.
