# codebasement
Codebase as Database JavaScript preprocessor and tool-chain using JavaScript as the macro language.

Uses JavaScript to run a development tool-chain, which tidies source code allowing organization along the lines of a database.

Lines of source code are equivalent to records with fields including: JS code (normally 104 ASCII characters); Comment (unlimited length, avoid escape character); miscellaneous key-value data.

From this codebase the tool-chain generates: industry standard prettified code; and/or, documentation; and/or, test code; and/or custom products. 

JavaScript does not have a standard preprocessor, although many frameworks and language extensions can be seen as preprocessor/compilers. An optional part of this tool-chain is macro-expansion/processing using JavaScript as the macro language.

## Tidy:
  Main point is to divide page into code on left, and comments (plus miscellaneous key:value fields) overflowing off right side of display.
  Floating comment token 'slides' to standard column (105).
  Code is padded with spaces or slashes (3 or more slashes followed by > is automatically extended to create quick way to draw decoration divider line).

## Macro language and expansion:
  The custom macro language, to be used on JavaScript files, is JavaScript itself.
  
  During the first step of macro expansion:
    /* type comments, with no space after the asterisk are converted to their value after execution as JS code, and
    lines starting with //* are uncommented to create valid JS code statements.
  
  Most such uncommented lines begin and end with a backtick character, turning the intervening JS source code into multi-line text strings.
  
  The macro expansion result is then anything output via console.log statements.
  
  In order to get this scheme to work:
      Deprecate ES-6 back-tick use in code (stick with string concatenation).
      Deprecate use of /* type comments, which are used instead for value insertion, or,
      when followed by a space, can be used for comments which survive the  prettier step.
