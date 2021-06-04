// CodeBaseMent custom pre-processor and tool chains. Takes source files, such as this one, and generates tidied, macro expanded, and prettified output files.//>
// (c)2021 David C. Walley                                                                              //>
                                                                                                        //>
                                                                                                        //>
//* var                                 r_sTestCode             ='';                                    //> Macro execution start: Run this as JavaScript code during macro-expansion phase of Preprocess.js. Variable 'r_sMacro' will eventually be saved in result file.
//* console.log('/* sMode= '+ sMode +' */');                                                            //> Test variable passed in from tool-chain command.
//* var                                 sUseStrict              = '"use strict"';                       //> Example variable to inject in output.
//* var                                 fs                      = require('fs');                        //> Example of including contents of
//* console.log( fs.readFileSync('./Macros.js').toString() );                                           //> another file.
//* console.log(`                                                                                       //> Start multi-line text string of code:
/*sUseStrict*/;                                                                                         //> Example of injecting macro value into expanded code.
  /*'var sM = "'+ sMode +'";'*/                                                                         //> Example of injecting macro value (literal text string and value from command line) into expanded code.
                                                                                                        //>
//* `); if( 'test' === sMode ){ r_sTestCode += `                                                        //> TESTS:
function o(a){ console.log( 'FAILED at '+ a ); }                                                        //> Code convenience - shortens test code lines.
function sJ(a){ return JSON.stringify(a); }                                                             //> Code convenience.
var                                     afuncTests               = [];                                  //> Example of line of code to be included in test-mode macro-expanded code. Start a list of test functions from scratch (done this way so test code will do no harm when executing this file ('Preprocess.js') directly, rather that its prettified or compiled version).
//* `;} console.log(`                                                                                   //>
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
// DIRECTORY SETUP (example, for Mindfuel):                                                             //>
//  c:/$/Code/codebasement/ - Root of preprocessing code.                                               //>
//  c:/0mf/                 - Mindfuel rescue project root.                                             //>
//        /repo_MAIN            - copy of main branch of (Mindfuel) source code.                        //>
//        /repo_NOTES            - Notated base files - copies of source code directories and files, created as needed, notated and with macors.//>
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
// |and macros.           |---> macro expand 'main' -->              TEMP_expand                        //> Macro-expanded code in *.js_1 and *.js_2.
// +----------------------+                         --> prettier --> TEMP_PrettyNotes  <---\            //> Prettified notes code. If different from MAIN/TEMP_PRETTY then edit NOTES.
//                                                                                         compare      //> Use compare app or plug-in, and update NOTES source file to stay in sync?
//               >------------------------------------> prettier --> TEMP_Pretty       <---/            //> Prettified main code
//               |                                                                                      //>
//  +-------------------+                                                                               //>
//  | Production code   |                                            Main                               //> Main repo source code - used for production - may not be prettified.
//  | (normal git repo) |                                                                               //> MAIN/TEMP_PRETTY
//  +-------------------+                                                                               //>
                                                                                                        //>
                                                                                                        //>
const                                   sPATHrOOT               = 'c:/0mf';                             //>
                                                                                                        //>
                                                                                                        //>
function                                sGo(//////////////////////////////////////////////////////////////> Main execution of this file starts here.
){                                      //////////////////////////////////////////////////////////////////>
 var                                    sCommand                = process.argv[2][0];                   //> First letter of first parameter is the action to be taken, as detailed below.
 var                                    sPath                   = process.argv[3].split('\\').join('/');//> Convert Windows to UNIX path delimiters.
 // sRoot                   sRepo        sFolder                                sFile         sExt      //>
 // C:\$\Code\codebasement                                                      Preprocess    .js       //>
 // C:\0mf\java-legacy      repo_MAIN    src\main\webapp\scripts\app\dialogs    inputDialog   .js       //>
 // C:\0mf\java-legacy      repo_NOTES   src\main\webapp\scripts\app\dialogs    inputDialog   .js       //>
 var                                    asPath            = avGo_ParsePathFileName( process.argv[3] );  //>
 var                                    sRoot                   = asPath[0];                            //>
 var                                    sRepo                   = asPath[1];                            //>
 var                                    sFolder                 = asPath[2];                            //>
 var                                    sFile                   = asPath[3];                            //>
 var                                    sExt                    = asPath[4];                            //>
 if( sExt !== '.js' ){                                                                                  //> If not a javascript file, then
return 'Not a javascript file.';                                                                        //> fail gracefully
 }//if                                                                                                  //> .
                                                                                                        //>
 var                                    sPath                   = sRoot + sRepo;                        //>
                                                                                                        //>
 switch( sCommand ){                                                                                    //>
 case 'P': case 'p':                                                                                    //> If request is to process current file, then...
  console.log('--------- Process');                                                                     //>
  console.log('--------- Process');                                                                     //>
  if( 'repo_MAIN/' === sRepo ){                                                                         //>
   Go_SwitchToNotes( sRoot ,sRepo ,sFolder ,sFile ,sExt );                                              //> Main:If Notes version does not exist yet, then create and line-number it now. Open in notepad++?
return '';                                                                                              //>
  }//if                                                                                                 //>
                                                                                                        //>
  Go_Macro( 'main' ,sPath               ,sFile     ,sExt    ,sPath+'TEMP_expand/'     ,sFile     ,sExt );//> Expand macros with results going to a sub-directory.
  fs.copyFile(      sPath+'TEMP_expand/'+sFile+'_2'+sExt    ,sPath+'TEMP_PrettyNotes/'+sFile     +sExt ,(err)=>{} );//> Copy the second intermediate result to the prettified source file directory, and
  require('child_process').execSync( 'prettier --write '    +sPath+'TEMP_PrettyNotes/'+sFile     +sExt );//> run prettier via a synchronous system call, over-writing existing file.
  // Prettify main repo to TEMP_MAIN                                                                    //>
  // Compare TEMP_MACRO and TEMP_MAIN files.                                                            //>
return '';                                                                                              //> Report success.
                                                                                                        //>
 case 'T': case 't':                                                                                    //> If request is for Macro expansion for tests, and then running.
  Go_Macro( 'test' ,sPath               ,sFile     ,sExt    ,sPath+'TEMP_Tests/'      ,sFile     ,sExt );//> Expand macros with 'test' parameter, with results going to a sub-directory.
  var   binary = require('child_process').execSync('node "'+ sPath+'TEMP_Tests/'+      sFile+'_2'+sExt +'"');//> Execute intermediate file as JavaScript using node, saving its console.log output.
  fs.writeFileSync( sPath+'TEMP_Tests/results.txt' ,binary ,"binary" ,function(err){} );                //> Save this preprocessed file.
                                                                                                        //>
return '';                                                                                              //> Report success.
                                                                                                        //>
 case 'N': case 'n':                                                                                    //> If request is for Macro expansion for tests, and then running.
  console.log('--------- Neatify');                                                                     //>
  console.log('--------- Neatify');                                                                     //>
  console.log( sPath + sFolder + sFile + sExt );                                                        //>
  Go_Neat(     sPath + sFolder + sFile + sExt  ,sPath + sFolder + sFile + sExt );                       //> Neatify the base file in place.
return '';                                                                                              //> Report success.
 }//switch                                                                                              //> Otherwise:
return 'Command "'+ sCommand +'" not recognized.';                                                      //> Report failure
}//sGo////////////////////////////////////////////////////////////////////////////////////////////////////>
                                                                                                        //>
                                                                                                        //>
function                                Go_SwitchToNotes(/////////////////////////////////////////////////> Main:If Notes version does not exist yet, then create and line-number it now. Open in notepad++?
                                        a_sRoot                                                         //>
,                                       a_sRepo                                                         //>
,                                       a_sFolder                                                       //>
,                                       a_sFile                                                         //>
,                                       a_sExt                                                          //>
){                                      //////////////////////////////////////////////////////////////////>
                                                                                                        //>
}//Go_ SwitchToNotes//////////////////////////////////////////////////////////////////////////////////////>
                                                                                                        //>
                                                                                                        //>
function                                Go_Neat(//////////////////////////////////////////////////////////> * Create a tidied version of the given file.
                                        a_sPathFileIn                                                   //> * Path and file name of the file to be tidied.
,                                       a_sPathFileOut                                                  //> * Path and file name of the output file (re-writes existing).
){                                      //////////////////////////////////////////////////////////////////> * Return nothing. Write to result file.
 const                                  sDATA                 = fs.readFileSync(a_sPathFileIn,'UTF-8'); //> Read contents of the file.
 var                                    sNeat                   = '';                                   //> Pass give value to the macro JS code.
 const                                  asLINES                 = sDATA.split("\n");                    //> Split the contents by newlines.
 for( var iLine = 0; iLine < asLINES.length; iLine++ ){                                                 //>
  var                                   sLine                   = asLINES[iLine];                       //>
  if( iLine === asLINES.length-1   &&   '' === sLine ){                                                 //> If on last line, and it is blank, then
 break;//for iLine                                                                                      //> we are done
  }//if                                                                                                 //> .
  sNeat += sGo_Neat_Line( sLine )+"\n";                                                                 //>
 }//for iLine                                                                                           //>
 if( sDATA !== sNeat ){   fs.writeFileSync( a_sPathFileOut ,sNeat );   }                                //> If a change has been made, then write the new contents of the output file.
}//Go_Neat////////////////////////////////////////////////////////////////////////////////////////////////>
                                                                                                        //>
                                                                                                        //>
function                                sGo_Neat_Line(////////////////////////////////////////////////////> * Create a tidied version of the given line.
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
}//sGo_Neat_Line//////////////////////////////////////////////////////////////////////////////////////////>
                                                                                                        //>
                                                                                                        //>
function                                Go_Macro(/////////////////////////////////////////////////////////> * Create a tidied version of the given file.
                                        a_sMode                                                         //> * Process variation, e.g., 'tidy' or 'macro'
,                                       a_sInPath                                                       //> * Path,
,                                       a_sInFile                                                       //> * file name, and
,                                       a_sInExt                                                        //> * extension of the file to be tidied.
,                                       a_sOutPath                                                      //> * Path,
,                                       a_sOutFile                                                      //> * file name, and
,                                       a_sOutExt                                                       //> * extension of the result (intermediate) files.
){                                      //////////////////////////////////////////////////////////////////> * Return nothing. Write result files.
 const                                  sPATHfILEiN             = a_sInPath + a_sInFile + a_sInExt;     //>
 const                                  sDATA                   = fs.readFileSync(sPATHfILEiN,'UTF-8'); //> read contents of the file
 var                                    sNeat                   = 'var sMode="'+ a_sMode +'";' +"\n";   //> Pass given value into the macro-expanded JavaScript.
 var                                    s                       ;                                       //> Short-term utility.
 const                                  asLINES                 = sDATA.split("\n");                    //> split the contents by new line
 var                                    sNewLine                = ' ';                                  //>
 for( var iLine = 0; iLine < asLINES.length; iLine++ ){                                                 //>
  var                                   sLine                   = asLINES[iLine];                       //>
  if( iLine === asLINES.length-1   &&   '' === sLine ){                                                 //> If on last line, and it is blank, then
 break;//for iLine                                                                                      //> we are done
  }//if                                                                                                 //> .
  s = sGo_Macro_Line( sLine ,sPATHfILEiN,iLine );                                                       //>
  if( ' ' === sNewLine ){   if( '/'+'* ' === sLine.slice(0,3) ){ sNewLine = "\n"; }   }                 //> Use new lines when inside a preserved comment.
  else                  {   if( '*'+'/ ' === sLine.slice(0,3) ){ sNewLine = ' ' ; }   }                 //> Outside, ignore new lines (and let Prettier sort it out).
  if( ' ' === sNewLine ){   s = s.trim();   }                                                           //> If ignoring new lines then ignore whitespace too.
  sNeat += ( '' === s.trim() )?"\n\n" :( s +sNewLine );                                                 //> Preserve blank lines, otherwise put everything on one line and let Prettier sort it out.
 }//for iLine                                                                                           //>
                                                                                                        //>
 sNeat = sNeat.split('\\').join('\\\\');                                                                //> Work-around escape of backslash at this point (should be done in later step).
 fs.writeFileSync(                                        a_sOutPath+a_sOutFile+'_1'+a_sOutExt ,sNeat );//> Save this intermediate file.
 var binary = require('child_process').execSync('node "'+ a_sOutPath+a_sOutFile+'_1'+a_sOutExt +'"');   //> Execute intermediate file as JavaScript using node, saving its console.log output.
 fs.writeFileSync( a_sOutPath+a_sOutFile+'_2'+a_sOutExt ,binary ,"binary" ,function(err){} );           //> Save this preprocessed file.
}//Go_Macro///////////////////////////////////////////////////////////////////////////////////////////////>
                                                                                                        //>
                                                                                                        //>
function                                sGo_Macro_Line(///////////////////////////////////////////////////> * Create a macro expanded version of the given line.
                                        a_sLine                                                         //> * Source code line.
,                                       a_sPathFile                                                     //> * Path and file name of the file to be tidied.
,                                       a_iLine                                                         //> * Source code line number.
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
    if(      '_FILE_*/' === s.slice(0 ,8) ){ sLine += a_sPathFile                   + s.slice(8); }     //> Replace magic constant.
    else if( '_LINE_*/' === s.slice(0 ,8) ){ sLine +=                   (a_iLine+1) + s.slice(8); }     //> Replace magic constant.
    else if( '_AT_*/'   === s.slice(0 ,6) ){ sLine += a_sPathFile +':'+ (a_iLine+1) + s.slice(6); }     //> Replace magic constant.
    else                                   { sLine += '\u0060+' + s.replace('*'+'/' ,'+\u0060') ; }     //> immediate replacement with `+( ... )+` (where ... is the comment contents).
 }}}//if//for i//else                                                                                   //>
                                                                                                        //>
 var                                    iChar                = iSplitCodeComments('strip' ,sLine +'//');//> Find split point between code and comments.
 var                                    sCode                = sLine.slice(0 ,iChar-1);                 //>
return sCode.trimEnd();                                                                                 //>
}//sGo_Macro_Line/////////////////////////////////////////////////////////////////////////////////////////>
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
//* `); if( 'test' === sMode ){ r_sTestCode += `                                                        //> TESTS:
afuncTests.push( function(){                                                                            //>
  var                                   i                       ;                                       //>
  i = iSplitCodeComments(  ); if( i !== -1 ){ o('/*_AT_*/ ('+ i +')'); }                                //> Example of unit test of above function.
  i = iSplitCodeComments(''); if( i !== -2 ){ o('/*_AT_*/ ('+ i +')'); }                                //> This kicks up a fuss during straight execution of this file, so it is commented out.
});                                                                                                     //>
//* `;} console.log(`                                                                                   //>
                                                                                                        //>
                                                                                                        //>
function                                avGo_ParsePathFileName(///////////////////////////////////////////>
                                        a_sPathFile                                                     //>
){                                      //////////////////////////////////////////////////////////////////>
 var                                    asPath                  = a_sPathFile.split(/[\\\/]/);          //> Split on slashes or backslashes.
 var                                    n                       = asPath.length - 1;                    //>
                                                                                                        //>
 var                                    r_sRoot                 = '';                                   //> path to directory containing expected sub-directory.
 var                                    r_sRepo                 = '';                                   //> Directory name if expected sub-directory seen.
 var                                    r_sFolder               = '';                                   //>
 var                                    r_sFile                 = asPath[n];                            //> Split base file into name, and...
                                                                                                        //>
 var                                    s                       ;                                       //>
 var                                    i                       = 0;                                    //>
 for( i = 0; i < n; i++ ){   s = asPath[i];                                                             //> Split off root:
  if( 'repo_MAIN' === s   ||   'repo_NOTES' === s ){                                                    //> If either of these is seen in the path, then assume they are in our standard duplicate repo directory structure.
   r_sRepo = s +'/';                                                                                    //>
   for( i++; i < n; i++ ){ r_sFolder += asPath[i] +'/'; }                                               //>
 break;                                                                                                 //>
  }//if                                                                                                 //>
  r_sRoot += s +'/';                                                                                    //>
 }//for i                                                                                               //>
                                                                                                        //>
 var                                    as                      = r_sFile.split('.');                   //>
 var                                    r_sExt                  = as.pop();                             //>
 if( '' !== r_sExt ){ r_sExt = '.'+ r_sExt; }                                                           //>
 r_sFile = as.join('.');                                                                                //>
                                                                                                        //>
return  [ r_sRoot                                                                                       //>
        , r_sRepo                                                                                       //>
        , r_sFolder                                                                                     //>
        , r_sFile                                                                                       //>
        , r_sExt                                                                                        //>
        ];                                                                                              //>
}//avGo_ParsePathFileName/////////////////////////////////////////////////////////////////////////////////>
//* `); if( 'test' === sMode ){ r_sTestCode += `                                                        //> TESTS:
afuncTests.push( function(){                                                                            //>
  var                                   s                       ;                                       //>
  s = sJ( avGo_ParsePathFileName('C:/$/testing.js'                        ) ); if( s!=='["C:/$/","","","testing",".js"]'                         ){o( '/*_AT_*/ ('+ s +')'); }//>
  s = sJ( avGo_ParsePathFileName('C:/$/0mf/repo_MAIN/testing.js'          ) ); if( s!=='["C:/$/0mf/","repo_MAIN/","","testing",".js"]'           ){o( '/*_AT_*/ ('+ s +')'); }//>
  s = sJ( avGo_ParsePathFileName('C:/$/0mf/repo_NOTES/src/more/testing.js') ); if( s!=='["C:/$/0mf/","repo_NOTES/","src/more/","testing",".js"]' ){o( '/*_AT_*/ ('+ s +')'); }//>
});                                                                                                     //>
//* `; var sIgnoreTheFollowingInTestMode = `                                                            //> If testing, then ignore the following...
 var                                    r_s                     = sGo();                                //> If running this file as is, then execute the main function of this file, and
 console.log( r_s );                                                                                    //> display result.
//* `;                                                                                                  //>
//*  if( '' !== r_sTestCode ){                                                                          //>
//*   console.log("//Tests: ");                                                                         //>
//*   console.log(r_sTestCode);                                                                         //>
//*   console.log( 'console.log("---Start tests"); for( let f of afuncTests ){ f(); } console.log("---End."); ' );//>
//* }}                                                                                                  //> End of file.
