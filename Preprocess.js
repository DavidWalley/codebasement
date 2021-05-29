// Dave's custom pre-processor and tool chains. Takes source files, such as this one, and generates tidied, macro expanded, and prettified output files.//>
// (c)2021 David C. Walley                                                                              //>
                                                                                                        //>
                                                                                                        //>
//* var r_sTest ='';                                                                                    //> Macro execution start: Run this as JavaScript code during macro-expansion phase of Preprocess.js. Variable 'r_sMacro' will eventually be saved in result file.
//* console.log('/* sMode= '+ sMode +' */');                                                            //> Test variable passed in from tool-chain command.
//* var u = '"use strict"';                                                                             //>
//* console.log(`                                                                                       //> Start multi-line text string of code:
/*u*/;                                                                                                  //> "use strict"; Example of injecting macro value into expanded code.
                        /*'var sM = "'+ sMode +'";' */                                                  //> Example of injecting macro value (text with value from command line) into expanded code.
                                                                                                        //>
/*                                                                                                      //>
Tidy:                                                                                                   //>
  Main point is to divide page into code on left, and comments (plus miscellaneous key:value fields) overflowing off right side of display.//>
  Floating comment token 'slides' to standard column (105).                                             //>
  Code is padded with spaces or slashes (3 or more slashes followed by > is automatically extended to create quick way to draw decoration divider line).//>
Macro language and expansion:                                                                           //>
  The custom macro language, to be used on JavaScript files, is JavaScript itself.                      //>
  During the first step of macro expansion:                                                             //>
    /* type comments, with no space after the '*', are converted to their value after execution as JS code, and//>
    lines starting with //* are uncommented to create valid JS code statements.                         //>
  Most such uncommented lines begin and end with a backtick character, turning the intervening JS source code into multi-line text strings.//>
  The macro expansion result is then anything output via console.log statements.                        //>
  In order to get this scheme to work:                                                                  //>
    Deprecate ES-6 back-tick use in code (stick with string concatenation).                             //>
    Deprecate use of /* type comments, which are used instead for value insertion, or,                  //>
      when followed by a space, can be used for comments which survive the  prettier step.              //>
*/                                                                                                      //>
                                                                                                        //>
const                                   asARGS                  = process.argv.slice(2);                //> Ignore first 2 arguments (node and path to this file).
const                                   fs                      = require('fs');                        //> Node's standard file system.
                                                                                                        //>
function                                iTidiedFile_Split(////////////////////////////////////////////////>* Find split point between code and comments.
                                        a_sMode                                                         //>* Given parsing variation, e.g., ''=split at floating comment, or 'strip'=split at first comment.
,                                       a_sLine                                                         //>* Source code line.
){                                      //////////////////////////////////////////////////////////////////>* Return an integer.
 if( undefined === a_sMode ){                                                             return -1;}   //>
 var                                    sInQuotes               = '';                                   //>
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
return r_iChar-2;                                                                                       //> we are done looking (we have found the code to be left alone)
  }//if                                                                                                 //> .
                                                                                                        //>
  if( '/' === sWas   &&   '/' === sChar ){                                                              //> If start of in-line comment seen, then
   if( 'strip' === a_sMode ){                                                                           //> if stripping all comments then
return r_iChar;                                                                                         //> we are done
   }//if                                                                                                //> . But if not...
   sInQuotes = '/';                                                                                     //> Disable further search for quotes
  }//if                                                                                                 //> .
  if( '' === sInQuotes   &&   ( '"' === sChar || "'" === sChar )   ){ sInQuotes = sChar; }              //> If we are still looking... if either kind of quote seen, then remember we are now inside that type of quotes.
  sWas2 = sWas;   sWas = sChar;                                                                         //> Remember 2 characters to the left
 }//for r_iChar                                                                                         //> .
return r_iChar;                                                                                         //>
}//iTidiedFile_Split//////////////////////////////////////////////////////////////////////////////////////>
//* `); if( 'test' === sMode ){ r_sTest += `                                                            //>
 if( iTidiedFile_Split() !== -1 ){ console.log('Test failed'); }                                        //>
//* `;} console.log(`                                                                                   //>
                                                                                                        //>
                                                                                                        //>
function                                ProcessFile_Tidy_Line(////////////////////////////////////////////> * Create a tidied version of the given line.
                                        a_sLine                                                         //> * Source code line.
){                                      //////////////////////////////////////////////////////////////////> * Return '' on success, or an error message.
 var                                    r_s                     = '';                                   //>
 var                                    iChar                   = iTidiedFile_Split( '' ,a_sLine );     //> Split floating code from comments.
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
}//ProcessFile_Tidy_Line//////////////////////////////////////////////////////////////////////////////////>
                                                                                                        //>
                                                                                                        //>
function                                ProcessFile_Tidy(/////////////////////////////////////////////////>* Create a tidied version of the given file.
                                        a_sPathFileIn                                                   //>* Path and file name of the file to be tidied.
,                                       a_sPathFileOut                                                  //>* Path and file name of the output file (re-writes existing).
){                                      //////////////////////////////////////////////////////////////////>* Return nothing. Write to result file.
 if( a_sPathFileIn.slice(-3) !== '.js' ){ return 'Not a javascript file (ProcessFile_Tidy).'; }         //>
                                                                                                        //>
 const                                  sDATA                 = fs.readFileSync(a_sPathFileIn,'UTF-8'); //> read contents of the file
 var                                    sTidy                   = '';                                   //> Pass give value to the macro JS code
 const                                  asLINES                 = sDATA.split("\n");                    //> split the contents by new line
 for( var iLine = 0; iLine < asLINES.length; iLine++ ){                                                 //>
  var                                   sLine                   = asLINES[iLine];                       //>
  if( iLine === asLINES.length-1   &&   '' === sLine ){                                                 //> If on last line, and it is blank, then
 break;//for iLine                                                                                      //> we are done
  }//if                                                                                                 //> .
  sTidy += ProcessFile_Tidy_Line(  sLine )+"\n";                                                        //>
 }//for iLine                                                                                           //>
 if( sDATA !== sTidy ){   fs.writeFileSync( a_sPathFileOut ,sTidy );   }                                //> If a change has been made, then write the new contents of the output file.
}//ProcessFile_Tidy///////////////////////////////////////////////////////////////////////////////////////>
                                                                                                        //>
                                                                                                        //>
function                                ProcessFile_Macro_Line(///////////////////////////////////////////> * Create a macro expanded version of the given line.
                                        a_sLine                                                         //> * Source code line.
){                                      //////////////////////////////////////////////////////////////////> * Return a text string.
 var                                    r_s                     = '';                                   //>
 var                                    sLine                   = a_sLine +'   ';                       //>
 if( '//* ' === sLine.slice(0,4) ){ sLine = sLine.slice(4); }                                           //> Uncomment lines starting with this.
 else{                                                                                                  //> For all other lines...
  var                                   asParts                 = sLine.split('/*');                    //> Look for block comments.
  sLine = asParts[0];                                                                                   //> Output will start with everything before.
  for( var i = 1; i < asParts.length; i++ ){                                                            //> For each other part
   var                                  s                       = asParts[i];                           //>
   if( ' ' === s[0]   ||   ! s.includes('*/') ){ sLine += '/*'     + s;                             }   //> If the block comment starts with a space, or there is no end to the block comment then append the part as is, and move on to next part.
   else                                        { sLine += '\u0060+'+ s.replace('*'+'/' ,'+\u0060'); }   //> Otherwise, immediate replacement with `+(...)+`
 }}//for i//else                                                                                        //>
                                                                                                        //>
 var                                    iChar                = iTidiedFile_Split('strip' ,sLine +'//'); //> Split all code from comments.
 var                                    sCode                = sLine.slice(0 ,iChar-1);                 //>
return sCode.trimEnd();                                                                                 //>
}//ProcessFile_Macro_Line/////////////////////////////////////////////////////////////////////////////////>
                                                                                                        //>
                                                                                                        //>
function                                ProcessFile_Macro(////////////////////////////////////////////////>* Create a tidied version of the given file.
                                        a_sMode                                                         //>* Process variation, e.g., 'tidy' or 'macro'
,                                       a_sPathFileIn                                                   //>* Path and file name of the file to be tidied.
,                                       a_sPathFileOut                                                  //>* Path and file name of the output file (re-writes existing).
){                                      //////////////////////////////////////////////////////////////////>* Return nothing. Write result files.
 if( a_sPathFileIn.slice(-3) !== '.js' ){ return 'Not a javascript file (ProcessFile_Macro).'; }        //>
                                                                                                        //>
 const                                  sDATA                 = fs.readFileSync(a_sPathFileIn,'UTF-8'); //> read contents of the file
 var                                    sTidy                   = 'var sMode="'+ a_sMode +'";' +"\n";   //> Pass given value into the macro-expanded JavaScript.
 const                                  asLINES                 = sDATA.split("\n");                    //> split the contents by new line
 for( var iLine = 0; iLine < asLINES.length; iLine++ ){                                                 //>
  var                                   sLine                   = asLINES[iLine];                       //>
  if( iLine === asLINES.length-1   &&   '' === sLine ){                                                 //> If on last line, and it is blank, then
 break;//for iLine                                                                                      //> we are done
  }//if                                                                                                 //> .
  sTidy += ProcessFile_Macro_Line( sLine )+"\n";                                                        //>
 }//for iLine                                                                                           //>
                                                                                                        //>
 sTidy = sTidy.split('\\').join('\\\\');                                                                //>
 var                                    sPathFileOut_1          = a_sPathFileOut+'_1';                  //>
 fs.writeFileSync( sPathFileOut_1  ,sTidy );                                                            //> Save this intermediate file.
 var                  r_binary = require('child_process').execSync( 'node "'+ sPathFileOut_1 +'"' );    //> Run intermediate file as JavaScript, saving its console.log output.
 fs.writeFileSync( a_sPathFileOut ,r_binary ,"binary" ,function(err){} );                               //> Save this preprocessed file.
}//ProcessFile_Macro//////////////////////////////////////////////////////////////////////////////////////>
                                                                                                        //>
                                                                                                        //>
console.log( asARGS );                                                                                  //> DEBUG
var                                     asPath                  = asARGS[1].split(/[\\\/]/);            //>
var                                     sFile                   = asPath.pop();                         //> https://stackoverflow.com/questions/423376/how-to-get-the-file-name-from-a-full-path-using-javascript
var                                     sPath                   = asPath.join('/');                     //>
                                                                                                        //>
if(       'T' === asARGS[0] ){                                                                          //>
 ProcessFile_Tidy(          sPath+'/'+sFile             ,sPath+'/'           +sFile   );                //> Tidy the code file in place.
                                                                                                        //>
}else if( 'TM'   === asARGS[0] ){                                                                       //>
 ProcessFile_Tidy(          sPath+'/'+sFile             ,sPath+'/'           +sFile   );                //> Tidy the code file in place.
 ProcessFile_Macro( 'main' ,sPath+'/'+sFile             ,sPath+'/TEMP_MACRO/'+sFile   );                //> Macro-expansion processing: Expand macros with results going to a sub-directory.
 require('child_process').execSync( 'prettier --write '+ sPath+'/TEMP_MACRO/'+sFile   );                //> Run prettier via a synchronous system call, over-writing existing file.
 ProcessFile_Macro( 'test' ,sPath+'/'+sFile             ,sPath+'/TEMP_TEST/' +sFile   );                //> Expand macros with 'test' parameter, with results going to a sub-directory.
                                                                                                        //>
}//if                                                                                                   //>
                                                                                                        //>
//* `); console.log( "//Tests: "); console.log(r_sTest);                                                //> End of file.
