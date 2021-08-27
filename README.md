# Codebase as Database
Integrated Development Environments are antiquated.
My brother learned how to code back in the 1970s, but went on to other things.
A while back he asked to see how programming is done these days, and he remarked that not much has changed.
Launching into an explanation of new features of the latest languages was tempting for me, but not what he was talking about.

He was surprised at what my IDE looked like, and that at it was still, essentially, a text editor. 
He started his career looking at x-ray photos on a light-box.
Now, he can take virtual tours inside a beating heart, or check out how a mutation might affect 3-D protein folding. 

I am envious.
It is hard to achieve what I am looking for, but I am taking baby steps, and posting results.
I also know that many of the features I am looking for are out there, but many take significant learning for a result that may or may not prove helpful.
I have seen some games for learning coding that have more useful and intuitive visualization capabilities than any advanced IDE.

I want my codebase to be in some kind of row-by-row database-like repository, conceptually more sophisticated than a bunch of text files and resources, allowing me to query it in multiple different ways - to generate different views of source code, documentation, test code, static analyses, history, graphical and animated views, and other custom results.  

As aspirational goals, my high-level wish list of features in a future IDE:
- Visual, taking advantage of 3-D, graphical, schematic, text, animation and custom views of a code-base. (Not to exclude audio or other sensory interfaces which could develop)
- Seemlessly multi-view, allowing easy navigation of multiple simultaneous views
- Multi-lingual, allowing focus on design, rather than details of a given computer language, and automatic or at least easy porting
- Data-centric, ensuring that at its root, though not always obvious, the code-base is kept in a future-proof open format.

You can't always get what you want, but I have made some progress with existing tools, and a minimal amount of custom tooling, to get a little closer.
The 3-D visualizations are a long way off for me, but I have made some baby steps in organizing my codebase as a database.

# codebasement
Codebase as Database JavaScript preprocessor and tool-chain using JavaScript as the macro language.

Uses JavaScript to run a development tool-chain, which tidies source code allowing organization along the lines of a database.

Lines of source code are equivalent to records with fields including: (implied) sequence number; JS code (normally 104 ASCII characters); Comment (unlimited length, avoid escape character); and, miscellaneous key-value data (separated by escape character).

It would be nice to store this as fields in records, and to edit these fields with a specialized application.
However, given existing tools, it can be done by adopting a specific coding standard.

The goal is to use a single codebase to generate multiple products, including: industry standard prettified code; documentation of various formats; automated test code; code in formats suitable for import into existing tools and/or custom products.

An optional part of this tool-chain is macro-expansion/processing using JavaScript itself as the macro language.
JavaScript does not have a standard preprocessor, although many frameworks and language extensions can be seen as preprocessor/compilers.
While some of these tools are undoubtedly useful, most do not offer the developer the oportunity to add definitions or macros.

## Tidy:
  Main point is to divide page into code on left, and comments (plus miscellaneous key:value fields) overflowing off right side of display.

  Floating comment token (//*) 'slides' to standard column (105).

  Code is padded with spaces or slashes (3 or more slashes followed by > is automatically extended to create quick way to draw decoration divider line).

  Preprocess.js is both a JS application to do this, and is example code showing result.

## Macro language and expansion:
  The custom macro language, to be used on JavaScript source code files, is JavaScript itself.
  
  During the first step of macro expansion:
    lines starting with //* are uncommented to create (hopefully) valid JS code statements, and
    /* type block comments, with no space after the asterisk, are converted to their text value after execution as JS code, and inserted inside back-tick strings.
  
  Most lines uncommented during expansion, begin and end with backtick characters, turning the intervening JS source code into multi-line text strings.
  The product of this step is saved as a JavaScript file which is then executed by node.  
  Anything output via console.log statements is the macro-expanded code.

  Another optional step in a tool-chain is to prettify this code using the popular opinionated tool Prettier.
  This prettified code can be the code commited to the main repo, which is only concerned with the code, not the comments and other fields.
  
  In order to get this scheme to work:
      Deprecate ES-6 back-tick use in code (stick with string concatenation).
      Deprecate use of block type (slash asterisk) comments, which are used instead for value insertion, or,
      when followed by a space, can be used for comments which survive the  prettier step.
