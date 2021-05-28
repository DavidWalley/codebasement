// Dave's custom pre-processor and tool chains. Takes source files, such as this one, and generates tidied, macro expanded, and prettified output files.//>
// (c)2021 David C. Walley                                                                              //>
                                                                                                        //>
                                                                                                        //>
//* var r_sTest ='';                                                                                    //> Macro execution start: Run this as JavaScript code during macro-expansion phase of Preprocess.js. Variable 'r_sMacro' will eventually be saved in result file.
//* console.log('/* sMode= '+ sMode +' */');                                                            //> Test variable passed in from command line.
//* console.log(`                                                                                       //> Start multi-line text string of code:
                        /*'var sM="'+ sMode +'";' */                                                    //> Example of injecting macro value (text with value from command line) into expanded code.
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
"use strict";                                                                                           //>
                                                                                                        //>
const                                   asARGS                  = process.argv.slice(2);                //> Ignore first 2 arguments (node and path to this file).
const                                   fs                      = require('fs');                        //> Node's standard file system.
                                                                                                        //>
function                                iTidiedFile_Split(////////////////////////////////////////////////>* Find split point between code and comments.
                                        a_sMode                                                         //>* Given parsing variation, e.g., ''=split at floating comment, or 'strip'=split at first comment.
,                                       a_sLine                                                         //>* Source code line.
){                                      //////////////////////////////////////////////////////////////////>* Report an integer.
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
function                                sProcessFile_LineTidy(////////////////////////////////////////////>* Create a tidied version of the given line.
                                        a_sLine                                                         //>* Source code line.
){                                      //////////////////////////////////////////////////////////////////>* Report '' on success, or an error message.
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
}//sProcessFile_LineTidy//////////////////////////////////////////////////////////////////////////////////>
                                                                                                        //>
                                                                                                        //>
function                                sProcessFile_LineMacro(///////////////////////////////////////////>* Create a tidied version of the given file.
                                        a_sLine                                                         //>* Source code line.
){                                      //////////////////////////////////////////////////////////////////>* Report '' on success, or an error message.
 var                                    r_s                     = '';                                   //>
 var                                    sLine                   = a_sLine +'   ';                       //>
 if( '//* ' === sLine.slice(0,4) ){ sLine = sLine.slice(4); }                                           //> Uncomment lines starting with this.
 else{                                                                                                  //>
  var                                   asParts                 = sLine.split('/*');                    //> Look for block comments with no spaces at start and end - immediate replacement with `+(...)+`
  sLine = asParts[0];                                                                                   //>
  for( var i = 1; i < asParts.length; i++ ){                                                            //>
   var                                  s                       = asParts[i];                           //>
   if( ' ' !== s[0]   &&   s.includes('*/') ){ sLine += '\u0060+'+ s.replace('*'+'/' ,'+\u0060'); }     //>
   else                                      { sLine += '/*'+      s                            ; }     //>
 }}//for i//else                                                                                        //>
                                                                                                        //>
 var                                    iChar                = iTidiedFile_Split('strip' ,sLine +'//'); //> Split all code from comments.
 var                                    sCode                = sLine.slice(0 ,iChar-1);                 //>
return sCode.trimEnd();                                                                                 //>
}//sProcessFile_LineMacro/////////////////////////////////////////////////////////////////////////////////>
                                                                                                        //>
                                                                                                        //>
function                                ProcessFile(//////////////////////////////////////////////////////>* Create a tidied version of the given file.
                                        a_sMode                                                         //>* Process variation, e.g., 'tidy' or 'macro'
,                                       a_sPathFileIn                                                   //>* Path and file name of the file to be tidied.
,                                       a_sPathFileOut                                                  //>* Path and file name of the output file (re-writes existing).
){                                      //////////////////////////////////////////////////////////////////>* Report '' on success, or an error message.
 if( a_sPathFileIn.slice(-3) !== '.js' ){ return 'Not a javascript file.'; }                            //>
                                                                                                        //>
 const                                  sDATA                 = fs.readFileSync(a_sPathFileIn,'UTF-8'); //> read contents of the file
 const                                  asLINES                 = sDATA.split("\n");                    //> split the contents by new line
 var                                    sTidy                   = '';                                   //> Pass give value to the macro JS code
 switch( a_sMode ){                                                                                     //>
 case       'tidy' :                                                                                    //>
 break;case 'macro': case 'test' : sTidy += 'var sMode="'+ a_sMode +'";' +"\n";                         //>
 }//switch                                                                                              //>
//sTidy += '/* = = = = */';                                                                             //>
                                                                                                        //>
 var                                    r_sError                = '';                                   //>
 for( var iLine = 0; iLine < asLINES.length; iLine++ ){                                                 //>
  var                                   sLine                   = asLINES[iLine];                       //>
  if( iLine === asLINES.length-1   &&   '' === sLine ){                                                 //> If on last line, and it is blank, then
 break;//for iLine                                                                                      //> we are done
  }//if                                                                                                 //> .
                                                                                                        //>
  switch( a_sMode ){                                                                                    //>
  case       'tidy' :               sTidy += sProcessFile_LineTidy(  sLine )+"\n";                      //>
  break;case 'macro': case 'test' : sTidy += sProcessFile_LineMacro( sLine )+"\n";                      //>
  }//switch                                                                                             //>
 }//for iLine                                                                                           //>
                                                                                                        //>
 switch( a_sMode ){                                                                                     //>
 case       'tidy' :                                                                                    //>
  if( sDATA !== sTidy ){                                                                                //> If a change has been made,
   fs.writeFileSync( a_sPathFileOut         ,sTidy                                         );           //> then write the new contents of the output file
  }//if                                                                                                 //> .
                                                                                                        //>
 break;case 'macro': case 'test' :                                                                      //>
  fs.writeFileSync( a_sPathFileOut+'_macro' ,sTidy );                                                   //> Save this intermediate file, for DEBUG.
  var sRet = require('child_process').execSync( 'node "'+ a_sPathFileOut+'_macro' +'"' );               //> Run prettier via a synchronous system call, over-writing existing file.
  fs.writeFile(a_sPathFileOut+'_expand', sRet,  "binary",function(err) { });                            //>
 }//switch                                                                                              //>
                                                                                                        //>
return r_sError;                                                                                        //>
}//ProcessFile////////////////////////////////////////////////////////////////////////////////////////////>
                                                                                                        //>
                                                                                                        //>
console.log( asARGS );                                                                                  //> DEBUG
var                                     asPath                  = asARGS[1].split(/[\\\/]/);            //>
var                                     sFile                   = asPath.pop();                         //> https://stackoverflow.com/questions/423376/how-to-get-the-file-name-from-a-full-path-using-javascript
var                                     sPath                   = asPath.join('/');                     //>
                                                                                                        //>
var                                     sError                  = '';                                   //>
if(       'T' === asARGS[0] ){                                                                          //>
 sError += ProcessFile( 'tidy'  ,sPath+'/'+sFile         ,sPath+'/'      +sFile      );                 //> Tidy the code file in place.
                                                                                                        //>
}else if( 'TM'   === asARGS[0] ){                                                                       //>
 sError += ProcessFile( 'tidy'  ,sPath+'/'+sFile         ,sPath+'/'      +sFile      );                 //> Tidy the code file in place.
 sError += ProcessFile( 'macro' ,sPath+'/'+sFile         ,sPath+'/MACRO/'+sFile      );                 //> Macro-expansion processing: Expand macros with results going to a sub-directory.
// require('child_process').execSync( 'prettier --write "'+ sPath+'/MACRO/'+sFile +'"' );               //> Run prettier via a synchronous system call, over-writing existing file.
// sError += ProcessFile( 'test'  ,sPath+'/'+sFile         ,sPath+'/TEST/' +sFile      );               //> Expand macros with 'test' parameter, with results going to a sub-directory.
                                                                                                        //>
}//if                                                                                                   //>
console.log( "sError:"+ sError );                                                                       //>
                                                                                                        //>
//* `); console.log( "//Tests: "); console.log(r_sTest);                                                //> End of file.
