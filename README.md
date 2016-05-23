JS/CC Documentation Website
===========================

Contributions to the website are welcome.  Please see the
[licenses](http://jscc.brobston.com/licenses.html) and the rest of
this README before submitting a pull request.

What to Edit
------------

Please **do not edit the .html files directly.**  The files are generated
from [Handlebars](http://handlebarsjs.com/) templates found in the
`pages` and `partial` directories of this project.

If you add new documentation pages -- that is, anything under
`pages/documentation` -- please update
[documentation-table-of-contents.json](https://github.com/abrobston/jscc/blob/gh-pages/partial/documentation-table-of-contents.json)
accordingly.  That file is used for generating the documentation table-of-contents
sidebar as well as the previous/next links on each page.

Getting Started
---------------

To generate the site on your machine, after cloning the repository and
switching to the relevant branch (likely `gh-pages`):

 1. Ensure that you have [Node](https://nodejs.org/) installed.
 2. From the root directory of the repository, `npm update --dev`.
 3. `gulp`
 
Before You Commit Changes
-------------------------

Be sure to regenerate the site with `gulp` and to add any modified
`.html` files to the commit.  Because GitHub Pages sites are static,
the `.html` files need to be updated even though they should not be
edited directly.  If you change any `.less` stylesheets, a similar
logic applies to `.css` files.

Formatting
----------

### In General

The site uses [Bootstrap 3](http://getbootstrap.com/) as its formatting
library.

### Code

The site uses [Prism](http://prismjs.com/) for code formatting, though
you will likely not need to interact with the Prism library directly.
See the information on Handlebars helpers below for how code should
be marked in the `.hbs` files.

Custom Handlebars Helpers
-------------------------

### All Pages Use `layout`

Each page -- that is, a Handlebars template file under the `pages` directory --
uses a custom block helper `layout` to wrap its content.  The `layout` helper
uses a `title` parameter to indicate the page title.  For example:

    {{#> layout title="My New Page"}}
    <h1>My New Page</h1>
    <p>Here is some important content.</p>
    {{/layout}}
    
### Code Blocks Use `code`

Any code block within a page should use the custom block helper `code`.
The `code` helper takes one optional parameter to indicate the language.
JS/CC source files should use the language parameter `"jscc"`.
Any other [Prism-supported language](http://prismjs.com/#languages-list)
is also permitted.  If the language parameter is omitted, no syntax
highlighting will be applied.  For example:

    {{#> layout title="My New Page, Now With Code"}}
    <h1>My New Page, Now With Code</h1>
    <p>Here is a JS/CC parser file:</p>
    {{#code "jscc"}}
    /~ This is not a valid template, but you get the idea. ~/
    /~ The terminal declaration part goes here ~/ 
    ##
    /~ The grammar definition part goes here ~/
    {{/code}}
    <p>And now, some JavaScript:</p>
    {{#code "javascript"}}
    var myVar = "something";
    {{/code}}
    <p>And some code that will not have syntax highlighting:</p>
    {{#code}}
    print "Some code without syntax highlighting"
    {{/code}}
    {{/layout}}
    
Note that _inline_ code should just use the HTML5 `<code>` tag.  The
block helper is only for code blocks.

### URLs Within the Site Use `resolve`

Because the `<base>` tag causes some inconvenient side effects, this
site does not use that tag.  Instead, URLs that reference documents
within the site should use the `resolve` helper, whose parameter
is the URL relative to the site root.  URLs to external resources
should not use the `resolve` helper.  For example:

    {{#> layout title="My New Page, This Time With Links"}}
    <h1>My New Page, This Time With Links</h1>
    <p>Here is a link to the
    <a href="{{resolve "documentation/introducing/welcome.html"}}">welcome
    page</a>.</p>
    <p>Here is a link to the
    <a href="https://github.com/abrobston/jscc">GitHub project</a>.</p>
    {{/layout}}
