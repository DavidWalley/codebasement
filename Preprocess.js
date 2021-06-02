// CodeBaseMent custom pre-processor and tool chains. Takes source files, such as this one, and generates tidied, macro expanded, and prettified output files.//>
// (c)2021 David C. Walley                                                                              //>
                                                                                                        //>
                                                                                                        //>
//* var                                 r_sTest                 ='';                                    //> Macro execution start: Run this as JavaScript code during macro-expansion phase of Preprocess.js. Variable 'r_sMacro' will eventually be saved in result file.
//* console.log('/* sMode= '+ sMode +' */');                                                            //> Test variable passed in from tool-chain command.
//* var                                 sUseStrict              = '"use strict"';                       //> Example variable to inject in output.
//* var                                 fs                      = require('fs');                        //> Example of including contents of
//* console.log( fs.readFileSync('./Macros.js').toString() );                                           //> another file.
//* console.log(`                                                                                       //> Start multi-line text string of code:
/*sUseStrict*/;                                                                                         //> Example of injecting macro value into expanded code.
  /*'var sM = "'+ sMode +'";'*/                                                                         //> Example of injecting macro value (literal text string and value from command line) into expanded code.
                                                                                                        //>
/*                                                                                                      //> Example of comment that should survive prettier:
Tidy:                                                                                                   //>
  Main point is to divide page into code on left, and comments (plus miscellaneous key:value fields)    //>
    overflowing off right side of display.                                                              //>
  Floating comment token 'slides' to standard column (105).                                             //>
  Code is padded with spaces or slashes (3 or more slashes followed by > is automatically extended to   //>
    create quick way to draw decoration divider line).                                                  //>
Macro language and expansion:                                                                           //>
  The custom macro language, to be used on JavaScript files, is JavaScript itself.                      //>
  During the first step of macro expansion:                                                             //>
    /* type comments, with no space after the '*', are converted to their value                         //>
       after execution as JS code, and                                                                  //>
    lines starting with //* are uncommented to create valid JS code statements.                         //>
  Most such uncommented lines begin and end with a backtick character, turning the intervening JS       //>
    source code into multi-line text strings.                                                           //>
  The macro expansion result is then anything output via console.log statements.                        //>
  In order to get this scheme to work:                                                                  //>
    Deprecate ES-6 back-tick use in code (stick with single or double quote strings and concatenation). //>
    Deprecate use of /* type comments, which are used instead for value insertion, or,                  //>
      when followed by a space, can be used for comments which survive the  prettier step.              //>
    Start file with  //* console.log(`                                                                  //>
    End with         //* `);                                                                            //>
*/                                                                                                      //>
                                                                                                        //>
const                                   fs                      = require('fs');                        //> Node's standard file system.
                                                                                                        //>
                                                                                                        //>
const                                   sPATHrOOT               = 'c:/0mf';                             //>
// DIRECTORY SETUP (for Mindfuel):                                                                      //>
//  c:/$/Code/codebasement/ - Root of preprocessing code.                                               //>
//  c:/0mf/                 - Mindfuel rescue project root.                                             //>
//        /Main             - copy of main branch of (Mindfuel) source code.                            //>
//        /Notes            - Notated base files - copies of source code directories and files, created as needed, notated and with macors.//>
//        /TEMP_expand      - Intermediate results of expanding macros.                                 //>
//        /TEMP_PrettyMain  - prettified main source code directories and files.                        //>
//        /TEMP_PrettyNotes - Result of prettifying macro expanded notated base files.                  //>
//        /TEMP_Tests       - Result of macro expansion of tests. Can be executed.                      //>
//                                                                                                      //>
// BASIC TOOL CHAIN:                                                                                    //>
//             v----tidy------<  Slide floating comments, extend decoration lines.                      //>
//             v              |                                                                         //>
// +----------------------+   |                                                                         //>
// | Source codebase repo |---^                                      Notes                              //> Source codebase repo, with extensive comments, macros
// |New version with notes|---> macro expand 'test' -->              TEMP_Tests --> execute tests       //> Code ready for test execution.
// |and macros.           |---> macro expand 'main' -->              TEMP_expand                        //> Macro-expanded code.
// +----------------------+                         --> prettier --> TEMP_PrettyNotes  <---\            //> Prettified notes code. If different from MAIN/TEMP_PRETTY then edit NOTES.
//                                                                                         compare      //> Use compare app or plug-in, and update NOTES source file to stay in sync?
//               >------------------------------------> prettier --> TEMP_Pretty       <---/            //> Prettified main code
//               |                                                                                      //>
//  +-------------------+                                                                               //>
//  | Production code   |                                            Main                               //> Main repo source code - used for production - may not be prettified.
//  | (normal git repo) |                                                                               //> MAIN/TEMP_PRETTY
//  +-------------------+                                                                               //>
function                                Go(///////////////////////////////////////////////////////////////> Main execution of this file starts here.
                                                                                                        //>
){                                      //////////////////////////////////////////////////////////////////>
 const                                  asARGS                  = process.argv.slice(2);                //> Ignore first 2 arguments (node and path to this file).
 console.log( asARGS );                                                                                 //> DEBUG
 var                                    asPath                  = asARGS[1].split(/[\\\/]/);            //>
 var                                    sFile                   = asPath.pop();                         //> https://stackoverflow.com/questions/423376/how-to-get-the-file-name-from-a-full-path-using-javascript
 var                                    sPath                   = asPath.join('/');                     //>
                                                                                                        //>
 if( sFile.slice(-3) !== '.js' ){                                                                       //>
return 'Not a javascript file.';                                                                        //>
 }//if                                                                                                  //>
                                                                                                        //>
 if( 'P' === asARGS[0]   ||   'p' === asARGS[0] ){                                                      //> If request is to process current file, then...
  Go_Macro( 'main'   ,sPath+'/'             +sFile      ,sPath+'/TEMP_expand/' +sFile   );              //> Expand macros with results going to a sub-directory.
  fs.copyFile(        sPath+'/TEMP_expand/' +sFile+'_2' ,sPath+'/TEMP_PrettyNotes/'+sFile ,(err)=>{} ); //>
  require('child_process').execSync( 'prettier --write '+sPath+'/TEMP_PrettyNotes/'+sFile   );          //> Run prettier via a synchronous system call, over-writing existing file.
  // Prettify main repo to TEMP_MAIN                                                                    //>
  // Compare TEMP_MACRO and TEMP_MAIN files.                                                            //>
return '';                                                                                              //> Report success.
 }//if                                                                                                  //> .
                                                                                                        //>
 if( 'N' === asARGS[0]   ||   'n' === asARGS[0] ){                                                      //> If request is 'Neat', then
  Go_Neatify( sPath+'/'+sFile ,sPath+'/'+sFile );                                                       //> Tidy the code file in place
return '';                                                                                              //> Report success.
 }//if                                                                                                  //> .
                                                                                                        //>
 if( 'T' === asARGS[0]   ||   't' === asARGS[0] ){                                                      //> If request is for Macro expansion for tests, and then running.
  Go_Macro( 'test'          ,sPath+'/'+sFile ,sPath+'/TEMP_TEST/'  +sFile   );                          //> Expand macros with 'test' parameter, with results going to a sub-directory.
 }//if                                                                                                  //>
return '';                                                                                              //> Report success.
}//Go/////////////////////////////////////////////////////////////////////////////////////////////////////>
                                                                                                        //>
                                                                                                        //>
function                                Go_Neatify(///////////////////////////////////////////////////////> * Create a tidied version of the given file.
                                        a_sPathFileIn                                                   //> * Path and file name of the file to be tidied.
,                                       a_sPathFileOut                                                  //> * Path and file name of the output file (re-writes existing).
){                                      //////////////////////////////////////////////////////////////////> * Return nothing. Write to result file.
 const                                  sDATA                 = fs.readFileSync(a_sPathFileIn,'UTF-8'); //> read contents of the file
 var                                    sNeat                   = '';                                   //> Pass give value to the macro JS code
 const                                  asLINES                 = sDATA.split("\n");                    //> split the contents by new line
 for( var iLine = 0; iLine < asLINES.length; iLine++ ){                                                 //>
  var                                   sLine                   = asLINES[iLine];                       //>
  if( iLine === asLINES.length-1   &&   '' === sLine ){                                                 //> If on last line, and it is blank, then
 break;//for iLine                                                                                      //> we are done
  }//if                                                                                                 //> .
  sNeat += Go_Tidy_Line( sLine )+"\n";                                                                  //>
 }//for iLine                                                                                           //>
 if( sDATA !== sNeat ){   fs.writeFileSync( a_sPathFileOut ,sNeat );   }                                //> If a change has been made, then write the new contents of the output file.
}//Go_Neatify/////////////////////////////////////////////////////////////////////////////////////////////>
                                                                                                        //>
                                                                                                        //>
function                                Go_Tidy_Line(/////////////////////////////////////////////////////> * Create a tidied version of the given line.
                                        a_sLine                                                         //> * Source code line.
){                                      //////////////////////////////////////////////////////////////////> * Return '' on success, or an error message.
 var                                    r_s                     = '';                                   //>
 var                                    iChar                   = iSplitCodeComments( '' ,a_sLine );    //> Find split point between code and comments.
 var                                    sCode                   = a_sLine.slice(0,iChar  )          ;   //>
 var                                    sComments               = a_sLine.slice(  iChar+3).trimEnd();   //>
 const                                  iSLIDEtO                = 104;                                  //> Normal length of code section of a line - defines where floating comments float to.
                                                                                                        //>
 if( '///' !== sCode.slice(-3) ){                                                                       //> If not a decoration line flagged with 3 or more slashes then
return sCode.trimEnd().padEnd(iSLIDEtO     ) +'//>'+ sComments;                                         //> Pad the code with spaces to the preferred column
 }//if                                                                                                  //>
                                                                                                        //> Otherwise
 while( iSLIDEtO < sCode.length   &&   '/' === sCode.slice(-1) ){ sCode = sCode.slice(0,-1); }          //> remove all extra slashes beyond the end of code portion of line.
return sCode.padEnd(          iSLIDEtO ,'/') +'//>'+ sComments;                                         //> Pad the code with additional slashes after the existing streak.
}//Go_Tidy_Line///////////////////////////////////////////////////////////////////////////////////////////>
                                                                                                        //>
                                                                                                        //>
function                                Go_Macro(/////////////////////////////////////////////////////////> * Create a tidied version of the given file.
                                        a_sMode                                                         //> * Process variation, e.g., 'tidy' or 'macro'
,                                       a_sPathFileIn                                                   //> * Path and file name of the file to be tidied.
,                                       a_sPathFileOut                                                  //> * Path and file name of the output file (re-writes existing).
){                                      //////////////////////////////////////////////////////////////////> * Return nothing. Write result files.
 const                                  sDATA                 = fs.readFileSync(a_sPathFileIn,'UTF-8'); //> read contents of the file
 var                                    sNeat                   = 'var sMode="'+ a_sMode +'";' +"\n";   //> Pass given value into the macro-expanded JavaScript.
 var                                    s                       ;                                       //> Short-term utility.
 const                                  asLINES                 = sDATA.split("\n");                    //> split the contents by new line
 var                                    sNewLine       = ' ';                                           //>
 for( var iLine = 0; iLine < asLINES.length; iLine++ ){                                                 //>
  var                                   sLine                   = asLINES[iLine];                       //>
  if( iLine === asLINES.length-1   &&   '' === sLine ){                                                 //> If on last line, and it is blank, then
 break;//for iLine                                                                                      //> we are done
  }//if                                                                                                 //> .
  s = Go_Macro_Line( a_sPathFileIn ,iLine ,sLine );                                                     //>
  if( ' ' === sNewLine ){   if( '/'+'* ' === sLine.slice(0,3) ){ sNewLine = "\n"; }   }                 //> Use new lines when inside a preserved comment.
  else                  {   if( '*'+'/ ' === sLine.slice(0,3) ){ sNewLine = ' ' ; }   }                 //> Outside, ignore new lines (and let Prettier sort it out).
  if( ' ' === sNewLine ){   s = s.trim();   }                                                           //> If ignoring new lines then ignore whitespace too.
  sNeat += ( '' === s.trim() )?"\n\n" :( s +sNewLine );                                                 //> Preserve blank lines, otherwise put everything on one line and let Prettier sort it out.
//if( '' !== s.trim() ){   sNeat += Go_Macro_Line( a_sPathFileIn ,iLine ,sLine )+" ";   }               //> Use this line to remove all extraneous whitespace to get truly consistent prettified result.
 }//for iLine                                                                                           //>
                                                                                                        //>
 sNeat = sNeat.split('\\').join('\\\\');                                                                //> Work-around escape of backslash at this point (should be done in later step).
 fs.writeFileSync( a_sPathFileOut+'_1'  ,sNeat );                                                       //> Save this intermediate file.
 var                r_binary = require('child_process').execSync( 'node "'+ a_sPathFileOut+'_1' +'"' ); //> Execute intermediate file as JavaScript using node, saving its console.log output.
 fs.writeFileSync( a_sPathFileOut+'_2' ,r_binary ,"binary" ,function(err){} );                          //> Save this preprocessed file.
}//Go_Macro///////////////////////////////////////////////////////////////////////////////////////////////>
                                                                                                        //>
                                                                                                        //>
function                                Go_Macro_Line(////////////////////////////////////////////////////> * Create a macro expanded version of the given line.
                                        a_sPathFile                                                     //> * Path and file name of the file to be tidied.
,                                       a_iLine                                                         //> * Source code line number.
,                                       a_sLine                                                         //> * Source code line.
){                                      //////////////////////////////////////////////////////////////////> * Return a text string.
 var                                    r_s                     = '';                                   //>
 var                                    sLine                   = a_sLine +'   ';                       //>
 if( '//* ' === sLine.slice(0,4) ){ sLine = sLine.slice(4); }                                           //> Uncomment lines starting with this.
 else{                                                                                                  //> For all other lines...
  var                                   asParts                 = sLine.split('/*');                    //> Look for block comments.
  sLine = asParts[0];                                                                                   //> Output will start with everything before.
  for( var i = 1; i < asParts.length; i++ ){                                                            //> For each other part
   var                                  s                       = asParts[i];                           //>
   if( ' ' === s[0]   ||   ! s.includes('*/') ){                                                        //> If the block comment starts with a space, or there is no end to the block comment then
    sLine += '/*'     + s;                                                                              //> append the part as is, and move on to next part
   }else{                                                                                               //> Otherwise,                                                             //> .
    if(      '_FILE_*/' === s.slice(0 ,8) ){ sLine += a_sPathFile + s.slice(8)                   ; }    //> Replace magic constant.
    else if( '_LINE_*/' === s.slice(0 ,8) ){ sLine += (a_iLine+1) + s.slice(8)                   ; }    //> Replace magic constant.
    else                                   { sLine += '\u0060+'   + s.replace('*'+'/' ,'+\u0060'); }    //> immediate replacement with `+( ... )+` (where ... is the comment contents).
 }}}//if//for i//else                                                                                   //>
                                                                                                        //>
 var                                    iChar                = iSplitCodeComments('strip' ,sLine +'//');//> Find split point between code and comments.
 var                                    sCode                = sLine.slice(0 ,iChar-1);                 //>
return sCode.trimEnd();                                                                                 //>
}//Go_Macro_Line//////////////////////////////////////////////////////////////////////////////////////////>
                                                                                                        //>
                                                                                                        //>
function                                iSplitCodeComments(///////////////////////////////////////////////> * Find split point between code and comments.
                                        a_sMode                                                         //> * Given parsing variation, e.g., ''=split at floating comment, or 'strip'=split at first comment.
,                                       a_sLine                                                         //> * Source code line.
){                                      //////////////////////////////////////////////////////////////////> * Return an integer.
 if( undefined === a_sMode ){                                                                return -1;}//> This argument is required.
 if( undefined === a_sLine ){                                                                return -2;}//> This argument is required.
 var                                    sInQuotes               = '';                                   //> Remember if scan is currently inside of single or double quotes.
 var                                    sWas                    = '';                                   //> Previous character.
 var                                    sWas2                   = '';                                   //> Previous previous character.
 var                                    r_iChar                 ;                                       //>
 for( r_iChar = 0; r_iChar < a_sLine.length; r_iChar++ ){                                               //>
  var                                   sChar                   = a_sLine[r_iChar];                     //>
  if( '"' === sInQuotes   ||   "'" === sInQuotes ){                                                     //> If currently inside single or double quotes, then...
   if( sInQuotes === sChar ){ sInQuotes = ''; sWas = ''; }                                              //> When we hit the matching end-quote then change status to outside of quotes.
 continue;//for r_iChar                                                                                 //>
  }//if                                                                                                 //>
                                                                                                        //> But if not inside quotes, then...
  if( '/' === sWas2   &&   '/' === sWas   &&   '>' === sChar ){                                         //> If floating comment marker seen, then
return r_iChar-2;                                                                                       //> report position of split and we are done looking (we have found the code to be left alone)
  }//if                                                                                                 //> .
                                                                                                        //>
  if( '/' === sWas   &&   '/' === sChar ){                                                              //> If start of in-line comment seen, then
   if( 'strip' === a_sMode ){                                                                           //> if stripping all comments then
return r_iChar;                                                                                         //> report position of split and we are done
   }//if                                                                                                //> . But if not...
   sInQuotes = '/';                                                                                     //> Disable further search for quotes
  }//if                                                                                                 //> .
  if( '' === sInQuotes   &&   ( '"' === sChar || "'" === sChar )   ){ sInQuotes = sChar; }              //> If we are still looking... if either kind of quote seen, then remember we are now inside that type of quotes.
  sWas2 = sWas;   sWas = sChar;                                                                         //> Remember 2 characters to the left
 }//for r_iChar                                                                                         //> .
return r_iChar;                                                                                         //> Report position of split.
}//iSplitCodeComments/////////////////////////////////////////////////////////////////////////////////////>
//* `); if( 'test' === sMode ){ r_sTest += `                                                            //> TESTS:
// i = iSplitCodeComments(  ); if( i !== -1 ){ console.log('/*_FILE_*/:/*_LINE_*/ Failed ('+ i +')'); } //> Example of unit test of above function.
// i = iSplitCodeComments(''); if( i !== -1 ){ console.log('/*_FILE_*/:/*_LINE_*/ Failed ('+ i +')'); } //> This kicks up a fuss during straight execution of this file, so it is commented out.
//* `;} console.log(`                                                                                   //>
                                                                                                        //>
                                                                                                        //>
Go();                                                                                                   //>
                                                                                                        //>
//* `); if( '' !== r_sTest ){ console.log( "//Tests: "); } console.log(r_sTest);                        //> End of file.
