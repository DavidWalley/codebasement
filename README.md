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
