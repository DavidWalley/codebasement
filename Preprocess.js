// CodeBaseMent custom pre-processor and tool chains. Takes source files, such as itself, and generates tidied, macro expanded, and prettified output files.//>
// (c)2021 Mindfuel Inc., all rights reserved                                                           //>
                                                                                                        //>
/**/// // Example of line beginning with special sub-string, which will be removed for pre-processing.  //> Macro (in JavaScript) execution start. Example boilerplate code follows:
/**/// console.log('/* g_sMode= '+ g_sMode +' */');                                                     //> log text strings you want to output to result of pre-processing. In this line we pass along a variable from tool-chain command - are we in 'norm' or 'test' mode?
/**/// var                              r_sTestCode             = '';                                   //> Run this as JavaScript code during macro-expansion phase of Preprocess.js. Variable 'r_sMacro' will eventually be saved in result file.
/**/// var                              sUseStrict              = '"use strict"';                       //> Example variable to inject in output.
/**/// var                              fs                      = require('fs');                        //> Example of including contents of
/**/// console.log( fs.readFileSync('./Macros.js').toString() );                                        //> another file.
/**/// console.log(`                                                                                    //> Start multi-line text string of code (so regular code gets put into text strings in pre-processing intermediate files):
/*sUseStrict*/;                                                                                         //> Second method of putting JavaScript into code - block-style comments with no space after start token, on one line - have their contents injected into intermediate pre-processing file, allowing for short JavaScript code snippets, or variable names. This line is an example of injecting macro value into expanded code.
  /*'var sM = "'+ g_sMode +'";'*/                                                                       //> Example of injecting macro value (literal text string and value from command line) into expanded code.
/**/// `); if( 'test' === g_sMode ){ r_sTestCode += `                                                   //> TESTS: Use JavaScript macro code to switch to some lines of test code.
function o(a){ console.log( 'FAILED at '+ a ); }                                                        //> Test code convenience - shortens test code lines.
function sJ(a){ return JSON.stringify(a); }                                                             //> Test code convenience - convert arbitrary objects into text which can be compared to expected results.
var                                     afuncTests              = [];                                   //> Example of line of code to be included in test-mode macro-expanded code. Start a list of test functions from scratch (done this way so test code will do no harm when executing this file ('Preprocess.js') in 'norm' mode, rather that its prettified or compiled version).
/**/// `;} console.log(`                                                                                //>
                                                                                                        //>
/*                                                                                                      //> Example of comment that should survive prettier:
Neatify:                                                                                                //>
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
    lines starting with / * * / / /   are uncommented to create valid JS code statements.               //>
  Most such uncommented lines begin and end with a backtick character, turning the intervening JS       //>
    source code into multi-line text strings.                                                           //>
  The macro expansion result is then anything output via console.log statements.                        //>
  In order to get this scheme to work:                                                                  //>
    Deprecate ES-6 back-tick use in code (stick with single or double quote strings and concatenation). //>
    Deprecate use of /* type comments, which are used instead for value insertion, or,                  //>
      when followed by a space, can be used for comments which survive the  prettier step.              //>
    Start file with     / * * / / /   console.log( <backtick>                                           //>
    End with            / * * / / /   <backtick>);                                                      //>
*/                                                                                                      //>
                                                                                                        //> GLOBAL STUFF:
const                                   fs                      = require('fs'  );                      //> Node's standard local file system.
const                                   path                    = require('path');                      //> Handle directory and sub-directory conventions of various operating systems.
                                                                                                        //>
                                                                                                        //>
eval( fs.readFileSync('C:/0mf/java-legacy/commits.js') +'' );                                           //> Include a file defining commit history: g_mapasCommit[]
                                                                                                        //>
                                                                                                        //>
const                                   asPathsFiles_recursive = function(////////////////////////////////>
                                        a_sPath                                                         //> *
,                                       a_afiles                                                        //> *
){                                      //////////////////////////////////////////////////////////////////>
 var                                    r_afiles                = a_afiles   ||   [];                   //> Default to empty list (first call).
 var                                    aentries                = fs.readdirSync(a_sPath);              //>
 var                                    s                       ;                                       //>
 aentries.forEach(                                                                                      //>
  function(sEntry){                                                                                     //>
   s = a_sPath +'/'+ sEntry;                                                                            //>
   if( fs.statSync(s).isDirectory() ){ r_afiles = asPathsFiles_recursive(s ,r_afiles); }                //>
   else                              { r_afiles.push(                    s          ); }                //>
  }//function                                                                                           //>
 );//forEach                                                                                            //>
return r_afiles;                                                                                        //>
}//asPathsFiles_recursive/////////////////////////////////////////////////////////////////////////////////>
                                                                                                        //>
                                                                                                        //>
function                                EnsurePathExists(/////////////////////////////////////////////////>
                                        a_sPath                                                         //> *
){                                      //////////////////////////////////////////////////////////////////>
 if( !fs.existsSync(a_sPath) ){                                                                         //> If the Notes sub-folder does not exist, then
  fs.mkdirSync(     a_sPath ,{recursive:true} );                                                        //> create it now, recursively
 }//if                                                                                                  //> .
}//EnsurePathExists///////////////////////////////////////////////////////////////////////////////////////>
                                                                                                        //>
                                                                                                        //>
function                                Execute(//////////////////////////////////////////////////////////>
                                        a_sCommand                                                      //> *
,                                       a_sPathFileOut                                                  //> * Results file.
){                                      //////////////////////////////////////////////////////////////////>
                                                                                                        console.log('Execute '+ a_sCommand);//>
 var                                    bits            = require('child_process').execSync(a_sCommand);//> Execute intermediate file as JavaScript using node, saving its console.log output.
 fs.writeFileSync( a_sPathFileOut ,bits ,"binary" ,function(err){} );                                   //>
}//Execute////////////////////////////////////////////////////////////////////////////////////////////////>
                                                                                                        //>
                                                                                                        //>
function                                avGo_ParsePathFileName(///////////////////////////////////////////>
                                        a_sPathFile                                                     //> *
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
  if( 'repo_main' === s.toLowerCase()   ||   'repo_notes' === s.toLowerCase() ){                        //> If either of these is seen in the path, then assume they are in our standard duplicate repo directory structure.
   r_sRepo = s +'/';                                                                                    //>
   for( i++; i < n; i++ ){ r_sFolder += asPath[i] +'/'; }                                               //>
 break;                                                                                                 //>
  }//if                                                                                                 //>
  r_sRoot += s +'/';                                                                                    //>
 }//for i                                                                                               //>
                                                                                                        //>
 var                                    as                      = r_sFile.split('.');                   //>
 var                                    r_sType                 = as.pop();                             //>
 if( '' !== r_sType ){ r_sType = '.'+ r_sType; }                                                        //>
 r_sFile = as.join('.');                                                                                //>
                                                                                                        //>
return  [ r_sRoot ,r_sRepo ,r_sFolder ,r_sFile ,r_sType ];                                              //>
}//avGo_ParsePathFileName/////////////////////////////////////////////////////////////////////////////////>
/**/// `); if( 'test' === g_sMode ){ r_sTestCode += `                                                   //> TESTS:
afuncTests.push( function(){                                                                            //>
  var                                   s                       ;                                       //>
  s = sJ( avGo_ParsePathFileName('C:/$/testing.js'                        ) ); if( s!=='["C:/$/","","","testing",".js"]'                         ){o( '/*_HERE_*/ ('+ s +')'); }//>
  s = sJ( avGo_ParsePathFileName('C:\\$\\testing.js'                      ) ); if( s!=='["C:/$/","","","testing",".js"]'                         ){o( '/*_HERE_*/ ('+ s +')'); }//>
  s = sJ( avGo_ParsePathFileName('C:/$/0mf/repo_MAIN/testing.js'          ) ); if( s!=='["C:/$/0mf/","repo_MAIN/","","testing",".js"]'           ){o( '/*_HERE_*/ ('+ s +')'); }//>
  s = sJ( avGo_ParsePathFileName('C:/$/0mf/repo_NOTES/src/more/testing.js') ); if( s!=='["C:/$/0mf/","repo_NOTES/","src/more/","testing",".js"]' ){o( '/*_HERE_*/ ('+ s +')'); }//>
});                                                                                                     //>
/**/// `; } console.log(`/////////////////////////////////////////////////////////////////////////////////>
                                                                                                        //>
                                                                                                        //>
// DIRECTORY SETUP (example, for Mindfuel):                                                             //>
//  c:/$/Code/codebasement/ - Root of preprocessing code.                                               //>
//  c:/0mf/                 - Mindfuel rescue project root.                                             //>
//        /repo_MAIN        - copy of main branch of (Mindfuel) source code.                            //>
//        /repo_NOTES       - Notated base files - copies of source code directories and files, created as needed, notated and with macors.//>
//        /TEMP_PrettyMAIN  - prettified main source code directories and files.                        //>
//        /TEMP_ProofMAIN   - prettified main source code with lines removed (for comparison).          //>
//        /TEMP_ProofNOTES  - Result of prettifying macro expanded notated base files.                  //>
//        /TEMP_Tests       - Result of macro expansion of tests. Can be executed.                      //>
//        /TEMP_temp        - Intermediate results of expanding macros, etc.                            //>
//                                                                                                      //>
// BASIC TOOL CHAIN:                                                                                    //>
//             v----tidy------<  Slide floating comments, extend decoration lines.                      //>
//             v              |                                                                         //>
// +----------------------+   |                                                                         //>
// | Source codebase repo |---^                                      Notes                              //> Source codebase repo, with extensive comments, macros
// |New version with notes|---> macro expand 'test' -->              TEMP_Tests --> execute tests       //> Code ready for test execution.
// |and macros.           |                                                                             //>
// +-------------+--------+                                                                             //>
//               >--> macro expand 'norm'--> TEMP_temp --> prettier --> TEMP_ProofNOTES  <---\          //> Macro-expanded code in *.js_1 and *.js_2.  Prettified notes code. If different from MAIN/TEMP_PRETTY then edit NOTES.
//                                                                                            compare   //> Use compare app or plug-in, and update NOTES source file to stay in sync?
//               >---------------------------------------> prettier --> TEMP_ProofMAIN   <---/          //> Prettified main code
//               |                                                                                      //>
//  +-------------------+                                                                               //>
//  | Production code   |                                            Main                               //> Main repo source code - used for production - may not be prettified.
//  | (normal git repo) |                                                                               //> MAIN/TEMP_PRETTY
//  +-------------------+                                                                               //>
const                                   g_sPRETTYm              = 'TEMP_PrettyMAIN/';                   //> subfolder containing Prettified main branch source code - suitable for copying standardized code back to the main repo.
const                                   g_sPROOFm               = 'TEMP_ProofMAIN/' ;                   //> subfolder containing Collapsed and prettified MAIN code - for comparison with NOTES version.
const                                   g_sPROOFn               = 'TEMP_ProofNOTES/';                   //> subfolder containing Collapsed and prettified NOTES code - for comparison.
const                                   g_sTEMP                 = 'TEMP_temp/'      ;                   //> subfolder for intermediate results files.
const                                   g_sTESTS                = 'TEMP_tests/'     ;                   //> subfolder for NOTES code that has been expanded in 'test' mode.
                                                                                                        //>
                                                                                                        //>
function                                sGo(//////////////////////////////////////////////////////////////>
){                                      //////////////////////////////////////////////////////////////////>
 var                                    sCommand                = process.argv[2][0];                   //> First letter of first parameter is the action to be taken, as detailed below.
 var                                    sPath                   = process.argv[3].split('\\').join('/');//> Convert Windows to UNIX path delimiters.
 var                                    asPath                  = avGo_ParsePathFileName( sPath );      //>
 var                                    sRoot                   = asPath[0];                            //>
 var                                    sRepo                   = asPath[1];                            //> Filled iff 'repo_MAIN' or 'repo_NOTES' seen.
 var                                    sFolder                 = asPath[2];                            //> Filled iff 'repo_MAIN' or 'repo_NOTES' seen.
 var                                    sFile                   = asPath[3];                            //>
 var                                    sType                   = asPath[4];                            //> Extension (with leading '.').
console.log(asPath);                                                                                    //>
 var                                    RM                      = sRoot + sRepo     ;                   //> MAIN repo - copy of (reasonable up-to-date) main branch source code.
 const                                  PRETTYm                 = sRoot + g_sPRETTYm;                   //> Directory of Prettified main branch source code - suitable for copying standardized code back to the main repo.
 const                                  PROOFm                  = sRoot + g_sPROOFm ;                   //> Directory of Collapsed and prettified MAIN code - for comparison with NOTES version.
 const                                  PROOFn                  = sRoot + g_sPROOFn ;                   //> Directory of Collapsed and prettified NOTES code - for comparison.
 const                                  TEMP                    = sRoot + g_sTEMP   ;                   //> Directory for intermediate results files.
 const                                  TESTS                   = sRoot + g_sTESTS  ;                   //> Directory for NOTES code that has been expanded in 'test' mode.
 if( sType !== '.js'   &&   sType !== '.java' ){                                                        //> If not a javascript file nor java, then
return 'Not a javascript nor java file.';                                                               //> fail gracefully
 }//if                                                                                                  //> .
                                                                                                        //>
 switch( sCommand ){                                                                                    //> Depending on command line parameter...
 case 'P': case 'p':                                                                                    console.log('*** Process');   console.log('*** Process');//> If request is to process current file, then...
  if( 'repo_main/' === sRepo.toLowerCase() ){                                                           //> If currently looking at the MAIN version of a file, then copy a prettified version of file to NOTES repo.
   EnsurePathExists(                                    PRETTYm+ sFolder                              );//> If the sub-folder for Notes version of prettified code does not exist, then create it.
   fs.copyFileSync( RM+      sFolder+ sFile+     sType ,PRETTYm+ sFolder+sFile      +sType ,(err)=>{} );//> Copy the main source code file to the prettified source file directory, and
   Prettier(                                            PRETTYm+ sFolder+ sFile     +sType            );//> run prettier via a synchronous system call, over-writing existing file.
                                                                                                        //> NOW, Create PROOF version for later comparisons, done in 'proof' directory on a file in-place:
   EnsurePathExists(                                    PROOFm + sFolder                              );//> If the sub-folder for Notes version of prettified code does not exist, then create it.
   fs.copyFileSync( RM+      sFolder+ sFile+     sType ,PROOFm + sFolder+sFile+'_Mp'+sType ,(err)=>{} );//> Copy the main source code file to the proof version directory.
   RemoveCommentsAndBlankLines(                         PROOFm + sFolder+sFile+'_Mp'+sType            );//> Prepare file for 'canonical' run of prettier (to get a consistent output when the only difference between code files is blank lines).
   Prettier(                                            PROOFm + sFolder+sFile+'_Mp'+sType            );//> Run prettier via a synchronous system call, over-writing existing file.
 //require('child_process').execSync('start notepad++ '+PROOFm + sFolder+sFile+'_Mp'+sType            );//> Open the result file in Notepad++.
                                                                                                        //> Open file version from NOTES (or start one):
   Go_SwitchToNotes(sRoot   ,sFolder ,sFile     ,sType ,TEMP                                          );//> If a Notes version of this file does not exist yet, then create, line-number it, and prepare it for macros now. Open in notepad++.
return '';                                                                                              //> Report success.
  }//if                                                                                                 //>
                                                                                                        //>
                                                                                                        //> If Process requested but not within the MAIN source code repo, then...
  Go_Macro( 'norm' ,RM+      sFolder ,sFile     ,sType ,TEMP   + sFolder                              );//> Expand macros with results going to a sub-directory (intermediate results of 2 stages of processing are saved).
  EnsurePathExists(                                     PROOFn + sFolder                              );//> If the sub-folder for Notes version of prettified code does not exist, then create it.
  fs.copyFileSync(TEMP+      sFolder+ sFile+'_2'+sType ,PROOFn + sFolder+sFile+'_pr'+sType ,(err)=>{} );//> Copy the second intermediate result to the prettified source file directory, and
  RemoveCommentsAndBlankLines(                          PROOFn + sFolder+sFile+'_pr'+sType            );//> Prepare file for 'canonical' run of prettier (to get a consistent output when the only difference between code files is blank lines).
  Prettier(                                             PROOFn + sFolder+sFile+'_pr'+sType            );//> Run prettier via a synchronous system call, over-writing existing file.
                                                                                                        //>
  require('child_process').execSync( 'start notepad++ '+PROOFn + sFolder+ sFile+'_pr'+sType           );//> Open the result file in Notepad++.
  require('child_process').execSync( 'start winmerge ' +PROOFm + sFolder+ sFile+'_pr'+sType +           //> Compare TEMP_MACRO and TEMP_MAIN files.
                                                   ' ' +PROOFn + sFolder+ sFile+'_pr'+sType           );//> Open the result file in Notepad++.
return '';                                                                                              //> Report success.
                                                                                                        //>
                                                                                                        //>
 case 'T': case 't':                                                                                    console.log('*** Tests');   console.log('*** Tests');   console.log( sRoot + sRepo + sFolder + sFile + sType );//> If request is for Macro expansion for tests, and then running.
  Go_Macro( 'test',sRoot+ sRepo          ,sFile     ,sType  ,TESTS                             );       //> Expand macros with 'test' parameter, with results going to a sub-directory.
  var     bits = require('child_process').execSync('node "'+ TESTS+       sFile+'_2'+sType+'"' );       //> Execute intermediate file as JavaScript using node, saving its console.log output.
  fs.writeFileSync(                                          TESTS+'results.txt'                        //> Save this preprocessed file.
  ,       bits ,"binary" ,function(err){}                                                               //>
  );                                                                                                    //>
return '';                                                                                              //> Report success.
                                                                                                        //>
                                                                                                        //>
 case 'N': case 'n':                                                                                    console.log('*** Neatify');   console.log('*** Neatify');   console.log( sRoot + sRepo + sFolder + sFile + sType );//> If request is for Neatification:
  Go_ScanFile( Go_ScanFile_sSnippets_Line,[] ,sRoot+sRepo+sFolder+sFile+sType ,sRoot+sRepo+sFolder+sFile+sType );//>
  Go_ScanFile( Go_ScanFile_sNeat_Line    ,[] ,sRoot+sRepo+sFolder+sFile+sType ,sRoot+sRepo+sFolder+sFile+sType );//>
return '';                                                                                              //> Report success.
                                                                                                        //>
                                                                                                        //>
 case 'D': case 'd':                                                                                    console.log('*** Directories');   console.log('*** Directories');//>
  Execute( 'cd C:/0mf/java-legacy/repo_MAIN & git ls-files' ,'c:/$/RESULTS.txt');                       //> Execute system command to list files in git - output into a standard file.
  Go_ScanFile(                                                                                          //> For files listed in the results,
   function(a, a_sLine ,c,d){   return a_sLine +' *** Example of boilerplate.'+"\n";   }                //> Run an example routine
  ,[]                                                                                                   //>
  ,'c:/$/RESULTS.txt' ,                                  'c:/$/RESULTS_4.txt'                           //> from the results file to another
  );                                                                                                    //> .
  require('child_process').execSync( 'start notepad++ '+ 'c:/$/RESULTS_4.txt' );                        //> Open the result file in Notepad++.
return '';                                                                                              //> Report success.
 }//switch                                                                                              //> Otherwise:
                                                                                                        //>
return 'Command "'+ sCommand +'" not recognized.';                                                      //> Report failure.
}//sGo////////////////////////////////////////////////////////////////////////////////////////////////////>
                                                                                                        //>
                                                                                                        //>
function                                RemoveCommentsAndBlankLines(//////////////////////////////////////>
                                        a_sPathFile                                                     //> *
){                                      //////////////////////////////////////////////////////////////////>
 Go_ScanFile(                                                                                           //>
  function(a ,a_sLine ,c,d){                                                                            //> Remove inline comments
   var                                  sCode                   = '';                                   //>
   var                                  s                       = a_sLine.trim();                       //>
   if( '/*' === s.slice(0,2) ){                                                                         //>
    sCode = s;                                                                                          //> ??? bit of a kludge to avoid proper parsing on multi-line comment.
   }else{                                                                                               //>
    var                                 iChar                  = iSplitCodeComments('//',a_sLine+' //');//> Find split point between code and comments.
    sCode = a_sLine.slice(0 ,iChar-1);                                                                  //>
   }//if                                                                                                //>
   s = sCode.trimEnd();                                                                                 //>
   if( ''   === s                ){ return ''           ; }                                             //>
   if( ';'  === s.slice(-1)      ){ return s +"\n"; }                                                   //> If code ending in a semi-colon then we can end the line.
   if( '*/' === s.slice(-2)      ){ return s +"\n"; }                                                   //> If code ending in a semi-colon then we can end the line.
  return                                   s +' ' ;                                                     //>
  }//function                                                                                           //>
 ,[]                                                                                                    //>
 ,a_sPathFile ,a_sPathFile                                                                              //>
 );                                                                                                     //>
}//RemoveCommentsAndBlankLines////////////////////////////////////////////////////////////////////////////>
                                                                                                        //>
                                                                                                        //>
function                                Prettier(/////////////////////////////////////////////////////////>
                                        a_sPathFile                                                     //> *
){                                      //////////////////////////////////////////////////////////////////>
 require('child_process').execSync( 'prettier'                                                          //> Run prettier via a synchronous system call, Set a few of prettiers options - to match existing source code (for easier comparison).
                                   +' --write'                                                          //> over-writing existing file.
                                   +' --print-width'   +' 120'                                          //>
                                   +' --single-quote'                                                   //>
                                   +' --tab-width'     +' 4'                                            //> To match an existing code base.
                                   +' --trailing-comma'+' none'                                         //>
                                   +' '+ a_sPathFile                                                    //>
                                  );                                                                    //>
// TweakPrettierResult()                                                                                //> Makes some find-and-replace tweaks to bring prettier's results into sync with existing code as much as possible.
 // Replace  'function (' with 'function( '.                                                            //>
}//Prettier///////////////////////////////////////////////////////////////////////////////////////////////>
                                                                                                        //>
                                                                                                        //>
function                                Go_SwitchToNotes(/////////////////////////////////////////////////>
                                        a_sRoot                                                         //> * Directory common to all the repos associated with this project.
,                                       a_sFolder                                                       //> *
,                                       a_sFile                                                         //> *
,                                       a_sType                                                         //> * extension
,                                       a_sPathTemp                                                     //>
){                                      //////////////////////////////////////////////////////////////////>
 console.log( 'a_sRoot     '+ a_sRoot     );                                                            //>
 console.log( 'a_sFolder   '+ a_sFolder   );                                                            //>
 console.log( 'a_sFile     '+ a_sFile     );                                                            //>
 console.log( 'a_sType     '+ a_sType     );                                                            //>
 console.log( 'a_sPathTemp '+ a_sPathTemp );                                                            //>
 var                     sPathFileMain  = a_sRoot +'repo_MAIN/' + a_sFolder + a_sFile+a_sType          ;//>
 var                     sPathFileNotes = a_sRoot +'repo_NOTES/'+ a_sFolder + a_sFile+a_sType          ;//>
 var                     sPathFileBlame = a_sPathTemp                       + a_sFile+a_sType +'_blame';//>
 EnsurePathExists( a_sPathTemp                    );                                                    //>
 EnsurePathExists( a_sRoot +'repo_NOTES/'+ a_sFolder );                                                 //> If the sub-folder with the Notes directory structure does not exist, then create it now.
 if( !fs.existsSync(sPathFileNotes) ){                                                                  //> If the Notes sub-folder does not exist, then
  Execute(  'cd '+ a_sRoot +'repo_MAIN & git blame '+ sPathFileMain ,sPathFileBlame );                  //> Execute system command - output into a standard file.
  const                                 sDATA                = fs.readFileSync(sPathFileBlame ,'UTF-8');//>
  const                                 asLINES              = sDATA.split("\n");                       //> Split on new-lines.
  Go_ScanFile( Go_ScanFile_NotesCopy_Line ,[asLINES] ,sPathFileMain ,sPathFileNotes );                  //> Create a new copy of the file, one line at a time.
 }//if                                                                                                  //>
                                                                                                        //>
 require('child_process').execSync( 'start notepad++ '+ sPathFileNotes );                               //> Issue system command to open the result file in Notepad++.
}//Go_SwitchToNotes///////////////////////////////////////////////////////////////////////////////////////>
                                                                                                        //>
                                                                                                        //>
function                                Go_ScanFile_NotesCopy_Line(///////////////////////////////////////>
                                        a_avParameters                                                  //> * Parameters for the above line-wise function.
,                                       a_sLine                                                         //> *
,                                       a_sPathFileIn                                                   //> *
,                                       a_iAt                                                           //> * Source code line number (0 is first line), or -1 for last line of the file.
){                                      //////////////////////////////////////////////////////////////////>
 const                                  asLINESbLAME            = a_avParameters[0];                    //>
 if( a_iAt < 0 ){                                                                                       //>
return ('/**/// `);'                                             ).padEnd(104)+'//> End of file.'+"\n"; //> End file and end multi-line console.log text string during macro expansion.
 }//if                                                                                                  //>
 const                                  sLINEbLAME              = asLINESbLAME[a_iAt];                  //>
 var                                    asB                     = sLINEbLAME.split('(');                //>
 const                                  sCOMMIT                 = asB[0].trim();                        //>
 asB = asB[1].split(')')[0].split(' ').filter( (a) => a !== '' );                                       //> Split what is inside parentheses on spaces, removing empty elements (multiple spaces in a row).
 const                                  N                       = asB.length;                           //>
 var                                    sName                   = '';                                   //>
 if( 'undefined' !== typeof asB[N-6] ){ sName += asB[N-6]+' '; }                                        //>
 if( 'undefined' !== typeof asB[N-5] ){ sName += asB[N-5]+' '; }                                        //>
 sName = sName.trim();                                                                                  //>
 switch( sName ){                                                                                       //>
 case       'Brad Murray'    : case 'brad'     :                     sName = 'Brad   ';                 //>
 break;case 'David Walley'   :                                       sName = 'David  ';                 //>
 break;case 'Erik Yuzwa'     : case 'erikyuzwa': case 'eyuzwa':      sName = 'Erik   ';                 //>
 break;case 'Jessica Engblom': case 'jess'     : case 'jessica':     sName = 'Jessica';                 //>
 break;case 'hg'             :                                       sName = 'hg     ';                 //>
 break;case 'Cam Roe'        :                                       sName = 'Cam    ';                 //>
 break;default               : console.log('*** Unrecognized dev: '+ sName +' *');                      //>
 }//switch                                                                                              //>
                                                                                                        //>
 var                                    sBlame                  = '             '                       //>
                                                                 +'; line:'      +(asB[N-1]).padStart(4)//>
                                                                 +'; by:'        +sName                 //>
                                                                 +'; date:'      +asB[N-4]              //>
                                                                 +'; commit:'    +sCOMMIT               //>
                                                                ;                                       //>
 var                                    sMore                   = '';                                   //>
 if( 'undefined' !== typeof g_mapasCommit[sCOMMIT] ){                                                   //>
  sBlame += '   ;message:'+ g_mapasCommit[sCOMMIT][3]                                                   //> Commit message
           +   ';more:'   + g_mapasCommit[sCOMMIT][2]+' '+ g_mapasCommit[sCOMMIT][1]                    //> Other commit info
  ;                                                                                                     //> .
 }//if                                                                                                  //>
                                                                                                        //>
 if( 0 <= a_iAt ){                                                                                      //> If not the end of the file
  var                                   sLine                   = a_sLine.split("\t").join('    ');     //> Convert tabs to 4 spaces (TODO - fancy version of this. Don't need it for start-of-line indents.)
  var                                   nIndents                = sLine.length -sLine.trimLeft().length;//>
  var                                   r_s                     = ''.padEnd(nIndents/4);                //>
  r_s += sLine.trim();                                                                                  //>
  if( '' === r_s.trim() ){                                                                              //> If the line is blank then
return '';                                                                                              //> drop it and we are done
  }//if                                                                                                 //> .
  r_s =                                 r_s                       .padEnd(104)+'//> '+ sBlame    +"\n"; //> Add a floating comment with last edit (blame) info for original file.
  if( 0 === a_iAt ){                                                                                    //> If the first line of a file
return ('// '+ a_sPathFileIn +' - with NOTES.'                   ).padEnd(104)+'//>'             +"\n"  //> start with standard header and
      +('// (c)2021 Mindfuel Inc., all rights reserved'                             ).padEnd(104)+'//>'             +"\n"//> copyright notice.
//    +('// (c)2021 Mindfuel Inc., all rights reserved.'         ).padEnd(104)+'                        //> '             +"\n"   copyright notice.
      +(' '                                                      ).padEnd(104)+'//>'             +"\n"  //>
      +('/**/// console.log(`'                                   ).padEnd(104)+'//>'             +"\n"  //> Start multi-line text string of code:
      + r_s                                                                                             //>
   ;                                                                                                    //>
  }//if                                                                                                 //>
return r_s;                                                                                             //>
 }//if 0                                                                                                //>
return ('/**/// `);'                                             ).padEnd(104)+'//> End of file.'+"\n"; //> End file and end multi-line console.log text string during macro expansion.
}//Go_ScanFile_NotesCopy_Line/////////////////////////////////////////////////////////////////////////////>
                                                                                                        //>
                                                                                                        //>
function                                Go_ScanFile(//////////////////////////////////////////////////////>
                                        a_functionLine                                                  //> *
,                                       a_avParameters                                                  //> * Parameters for the above line-wise function.
,                                       a_sPathFileIn                                                   //> *
,                                       a_sPathFileOut                                                  //> *
){                                      //////////////////////////////////////////////////////////////////>
 const                                  sDATA                 = fs.readFileSync(a_sPathFileIn,'UTF-8'); //>
 const                                  asLINES               = sDATA.split("\n");                      //> Split on new-lines.
 var                                    r_s                   = '';                                     //>
 for( var iLine = 0; iLine < asLINES.length; iLine++ ){                                                 //>
  var                                   sLine                   = asLINES[iLine];                       //>
  if( iLine === asLINES.length-1   &&   '' === sLine ){                                                 //>
 break;                                                                                                 //>
  }//if                                                                                                 //>
                                                                                                        //>
  r_s += a_functionLine( a_avParameters ,sLine ,a_sPathFileIn ,iLine );                                 //>
 }                                                                                                      //>
 r_s  += a_functionLine( a_avParameters ,''    ,a_sPathFileIn ,-1    );                                 //> Request a possible end of file line or lines.
//if( sDATA !== r_s ){                                                                                  //>
 fs.writeFileSync( a_sPathFileOut ,r_s );                                                               //>
//}                                                                                                     //>
}//Go_ScanFile////////////////////////////////////////////////////////////////////////////////////////////>
                                                                                                        //>
                                                                                                        //>
function                                Go_ScanPath(//////////////////////////////////////////////////////>
                                        a_functionFile                                                  //> * Function to run on each file.
,                                       a_sPath                                                         //> * Path to be scanned.
){                                      //////////////////////////////////////////////////////////////////>
 var                                    r_s                     = '';                                   //>
 var                                    asFiles                 = asPathsFiles_recursive(a_sPath);      //>
                                                                                                        //>
 for( var i = 0; i < asFiles.length; i++ ){                                                             //>
  var                                   sFile                   = asFiles[i];                           //>
                                                                                                        //>
 }//for                                                                                                 //>
return '';                                                                                              //>
}//Go_ScanPath////////////////////////////////////////////////////////////////////////////////////////////>
                                                                                                        //>
                                                                                                        //>
function                                Go_ScanFile_sSnippets_Line(///////////////////////////////////////>
                                        a_avFileParameters                                              //> * Parameters passed in from file level code.
,                                       a_sLine                                                         //> *
,                                       a_sPathFileIn                                                   //> *
,                                       a_iAt                                                           //> *
){                                      //////////////////////////////////////////////////////////////////>
 if( a_iAt < 0 ){ return ''; }                                                                          //>
 var                                    sLine                   = a_sLine.trimLeft();                   //>
 var                                    nIndents                = a_sLine.length - sLine.length;        //>
 var                                    asWords            = sLine.split(' ').filter( (a) => a !== '' );//> Split on spaces, removing empty elements (multiple spaces in a row).
 var                                    sIndent                 = ''.padEnd(nIndents);                  //>
 if( '/f' === asWords[0] ){                                                                             //>
return Go_ScanFile_sSnippets_Line_function(sIndent ,asWords) +"\n";                                     //>
 }//if                                                                                                  //>
return a_sLine +"\n";                                                                                   //>
}//Go_ScanFile_sSnippets_Line/////////////////////////////////////////////////////////////////////////////>
                                                                                                        //>
                                                                                                        //>
function                                Go_ScanFile_sSnippets_Line_function(//////////////////////////////>
                                        sIndent                                                         //> *
,                                       asWords                                                         //> *
){                                      //////////////////////////////////////////////////////////////////>
 var                                    r_s                     =  '          //>'   +"\n"              //>
                                                                  +'          //>'   +"\n";             //>
 r_s +=  (   sIndent+'function' ).padEnd(39) +' '+ asWords[1] +'(///////////////> *' +"\n";             //>
 for( i = 2; i < asWords.length; i++ ){                                                                 //>
  s = asWords[i].trim();                                                                                //>
  if( s[0].toUpperCase() === s[0].toLowerCase() ){                                                      //> If not a letter then
 break;                                                                                                 //> quit
  }                                                                                                     //> .
  r_s += (  sIndent+ ( i===2?' ':',' )   ).padEnd(39) +' '+ s +'              //> *' +"\n";             //>
 }//for i                                                                                               //>
 r_s += (   sIndent+'){'                 ).padEnd(39) +' ///////////////////////> *' +"\n";             //>
 r_s +=     sIndent+'return "";                                               //>'   +"\n";             //>
 r_s +=     sIndent+'}//'+ asWords[1] +'////////////////////////////////////////>'   +"\n";             //>
       +    '                                                                 //>'   +"\n";             //>
       +    '                                                                 //>'   +"\n";             //>
return r_s;                                                                                             //>
}//Go_ScanFile_sSnippets_Line_function////////////////////////////////////////////////////////////////////>
                                                                                                        //>
                                                                                                        //>
function                                Go_ScanFile_sNeat_Line(///////////////////////////////////////////>
                                        a_avFileParameters                                              //> * Parameters passed in from file level code.
,                                       a_sLine                                                         //> *
,                                       a_sPathFileIn                                                   //> *
,                                       a_iAt                                                           //> *
){                                      //////////////////////////////////////////////////////////////////>
 if( a_iAt < 0 ){ return ''; }                                                                          //>
 var                                    r_s                     = '';                                   //>
 var                                    iChar                   = iSplitCodeComments( '//>' ,a_sLine ); //> Find split point between code and comments.
 var                                    sCode                   = a_sLine.slice(0,iChar  )          ;   //>
 var                                    sComments               = a_sLine.slice(  iChar+3).trimEnd();   //>
 var                                    asComments              = sComments.split('//>');               //>
 var                                    sFirstComment           = asComments.pop();                     //>
 sComments = asComments.map(Function.prototype.call, String.prototype.trim).join('   ');                //> hey   what is this?
                                                                                                        //>
 const                                  iSLIDEtO                = 104;                                  //> Normal length of code section of a line - defines where floating comments float to.
                                                                                                        //>
 if( '////' !== sCode.slice(-4) ){                                                                      //> If not a decoration line flagged with 3 or more slashes then
return sCode.trimEnd().padEnd(iSLIDEtO     ) +('//>'+ sFirstComment +'   '+ sComments).trim() +"\n";    //> Pad the code with spaces to the preferred column
 }//if                                                                                                  //>
                                                                                                        //> But if end of line indicates it is a decoration line, then...
 while( iSLIDEtO < sCode.length   &&   '/' === sCode.slice(-1) ){ sCode = sCode.slice(0,-1); }          //> remove all extra slashes beyond the end of code portion of line.
return sCode.padEnd(          iSLIDEtO ,'/') +('//>'+ sFirstComment +'   '+ sComments).trim() +"\n";    //> Pad the code with additional slashes after the existing streak.
}//Go_ScanFile_sNeat_Line/////////////////////////////////////////////////////////////////////////////////>
                                                                                                        //>
                                                                                                        //>
function                                Go_Macro(/////////////////////////////////////////////////////////>
                                        a_sMode                                                         //> * Parameter that is passed into JS macro code for its use. 'test' is generally used to generate automated test code.
,                                       a_sInPath                                                       //> * Input path,
,                                       a_sFile                                                         //> * file, and
,                                       a_sExt                                                          //> * extension.
,                                       a_sOutPath                                                      //> * Output path,
){                                      //////////////////////////////////////////////////////////////////>
 const                                  sPATHfILEiN             = a_sInPath + a_sFile + a_sExt;         //>
 const                                  sDATA                   = fs.readFileSync(sPATHfILEiN,'UTF-8'); //>
 const                                  asLINES                 = sDATA.split("\n");                    //> Split on new-lines.
 var                                    r_s                     = 'var g_sMode="'+ a_sMode +'";' +"\n"; //>
 var                                    bInCommentBlock         = false;                                //>
 var                                    s                       ;                                       //>
 for( var iLine = 0; iLine < asLINES.length; iLine++ ){                                                 //>
  var                                   sLine                   = asLINES[iLine];                       //>
  if( iLine === asLINES.length-1   &&   '' === sLine ){                                                 //> If on last line, and it is blank, then
 break;//for iLine                                                                                      //> we are done
  }//if                                                                                                 //> .
  s = sGo_Macro_Line( sLine ,sPATHfILEiN,iLine );                                                       //> Process (macro-expand) one line.
  if( !bInCommentBlock ){   if( '/'+'* ' === sLine.slice(0,3) ){ bInCommentBlock = true ; }   }         //> Use new lines when inside a preserved comment.
  else                  {   if( '*'+'/ ' === sLine.slice(0,3) ){ bInCommentBlock = false; }   }         //> Outside, ignore new lines (and let Prettier sort it out).
  if( bInCommentBlock ){                                                                                //> If in a multi-line comment block, then
   r_s += s +"\n";                                                                                      //> leave the line as is, and
 continue;                                                                                              //> this line is done
  }//if                                                                                                 //> .
                                                                                                        //> But if NOT in a multi-line comment block, then
  s = s.trim();                                                                                         //> put everything on one line (and let Prettier sort it out).
  r_s += s + (( '' === s )?"\n\n" :' ');                                                                //> Preserve blank lines, otherwise put everything on one line and let Prettier sort it out (but leave multi-line comments alone).
 }//for iLine                                                                                           //>
                                                                                                        //>
 r_s = r_s.split('\\').join('\\\\');                                                                    //> Work-around escape of backslash at this point (should be done in later step).
                                                                                                        //>
 EnsurePathExists(                                           a_sOutPath                         );      //> If the Notes sub-folder does not exist, then create it now, recursively.
 fs.writeFileSync(                                           a_sOutPath+a_sFile+'_1'+a_sExt,r_s );      //> Save this intermediate file.
                                                                                                        //>
 var    binary = require('child_process').execSync('node "'+ a_sOutPath+a_sFile+'_1'+a_sExt +'"');      //> Execute intermediate file as JavaScript using node, saving its console.log output.
                                                                                                        //>
 fs.writeFileSync( a_sOutPath+a_sFile+'_2'+a_sExt ,binary ,"binary" ,function(err){} );                 //> Save this preprocessed file.
}//Go_Macro///////////////////////////////////////////////////////////////////////////////////////////////>
                                                                                                        //>
                                                                                                        //>
function                                sGo_Macro_Line(///////////////////////////////////////////////////>
                                        a_avFileParameters                                              //> * Parameters passed in from file level code.
,                                       a_sLine                                                         //> * Source code line.
,                                       a_sPathFile                                                     //> * Path and file name of the file to be tidied.
,                                       a_iAt                                                           //> * Source code line number.
){                                      //////////////////////////////////////////////////////////////////>
 if( a_iAt < 0 ){ return ''; }                                                                          //>
 var                                    r_s                     = '';                                   //>
 var                                    sLine                   = a_sLine +'   ';                       //>
 if( '/'+'*'+'*'+'/'+'/'+'/ ' === sLine.slice(0,7) ){ sLine = sLine.slice(7); }                         //> Uncomment lines starting with this.
 else{                                                                                                  //> For all other lines...
  var                                   asParts                 = sLine.split('/*');                    //> Look for block comments.
  sLine = asParts[0];                                                                                   //> Output will start with everything before.
  for( var i = 1; i < asParts.length; i++ ){                                                            //> For each other part
   var                                  s                       = asParts[i];                           //>
   if( ' ' === s[0]   ||   ! s.includes('*/') ){                                                        //> If the block comment starts with a space, or there is no end to the block comment then
    sLine += '/*'     + s;                                                                              //> append the part as is, and move on to next part
   }else{                                                                                               //> Otherwise,   .
    if(      '_FILE_*/' === s.slice(0 ,8) ){ sLine += a_sPathFile                 + s.slice(8); }       //> Replace magic constant - current file name.
    else if( '_LINE_*/' === s.slice(0 ,8) ){ sLine +=                   (a_iAt+1) + s.slice(8); }       //> Replace magic constant - current line number.
    else if( '_HERE_*/' === s.slice(0 ,8) ){ sLine += a_sPathFile +':'+ (a_iAt+1) + s.slice(8); }       //> Replace magic constant - file and line.
    else                                   { sLine += '\u0060+' + s.replace('*'+'/' ,'+\u0060') ; }     //> immediate replacement with `+( ... )+` (where ... is the comment contents).
 }}}//if//for i//else                                                                                   //>
                                                                                                        //>
 var                                    iChar                   = iSplitCodeComments('//' ,sLine +'//');//> Find split point between code and comments.
 var                                    sCode                   = sLine.slice(0 ,iChar-1);              //>
return sCode.trimEnd();                                                                                 //>
}//sGo_Macro_Line/////////////////////////////////////////////////////////////////////////////////////////>
                                                                                                        //>
                                                                                                        //>
function                                iSplitCodeComments(///////////////////////////////////////////////>
                                        a_sMode                                                         //> * Given parsing variation, e.g., '   '=split at floating comment, or '//'=split at first comment.
,                                       a_sLine                                                         //> * Source code line.
){                                      //////////////////////////////////////////////////////////////////>
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
   if( '//' === a_sMode ){                                                                              //> if stripping all comments then
return r_iChar;                                                                                         //> report position of split and we are done
   }//if                                                                                                //> . But if not...
   sInQuotes = '/';                                                                                     //> Disable further search for quotes
  }//if                                                                                                 //> .
  if( '' === sInQuotes   &&   ( '"' === sChar || "'" === sChar )   ){ sInQuotes = sChar; }              //> If we are still looking... if either kind of quote seen, then remember we are now inside that type of quotes.
  sWas2 = sWas;   sWas = sChar;                                                                         //> Remember 2 characters to the left
 }//for r_iChar                                                                                         //> .
return r_iChar;                                                                                         //> Report position of split.
}//iSplitCodeComments/////////////////////////////////////////////////////////////////////////////////////>
/**/// `); if( 'test' === g_sMode ){ r_sTestCode += `                                                   //> TESTS:
afuncTests.push( function(){                                                                            //>
  var                                   i                       ;                                       //>
  i = iSplitCodeComments(  ); if( i !== -1 ){ o('/*_HERE_*/ ('+ i +')'); }                              //> Example of unit test of above function.
  i = iSplitCodeComments(''); if( i !== -2 ){ o('/*_HERE_*/ ('+ i +')'); }                              //> This kicks up a fuss during straight execution of this file, so it is commented out.
});                                                                                                     //>
/**/// `;} console.log(`//////////////////////////////////////////////////////////////////////////////////>
                                                                                                        //>
                                                                                                        //>
/**/// `); var sIgnoreTheFollowingInTestMode = `                                                        //> If testing, then ignore the following...
 var                                    r_s                     = sGo();                                //> If running this file as is, then execute the main function of this file, and
 console.log( r_s );                                                                                    //> display result.
/**/// `;                                                                                               //>
/**/// if( 'test' !== g_sMode ){ console.log(sIgnoreTheFollowingInTestMode); }                          //>
/**/// else{                                                                                            //>
/**///  if( '' !== r_sTestCode ){                                                                       //>
/**///   console.log("//Tests: ");                                                                      //>
/**///   console.log(r_sTestCode);                                                                      //>
/**///   console.log( 'console.log("---Start tests"); for( let f of afuncTests ){ f(); } console.log("---End."); ' );//>
/**/// }}                                                                                               //> End of file.
