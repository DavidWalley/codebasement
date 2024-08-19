// ToolChain_GameMaker.hx - Haxe language bodge code for transferring files in and out of a GameMaker project. Now in GitHub.
// (c)2024 D.C. Walley

// For coding in GameMaker, I prefer all code to be organized in files of my choosing. Also, I want a
// few simple macro replacements for coding convenience. This Haxe program does this. I call it from
// the command line with options to transfer pre-processed code to a GameMaker project, or from it.
// Some paths are hard-coded below, because this is just bodge code at this time.

// Start GameMaker IDE. Open project *.yyp
// In a UBUNTU terminal (ctrl+alt+T):
// cd ~/Desktop/AAA/code
//        language
//             Intermediate file
//                                            Main code class                                Custom direction operation
// haxe --neko                    TEMP_neko.n --main ToolChain_GameMaker && neko TEMP_neko.n TOpROJECT # <- 
// haxe --neko ~/Desktop/AAA/code/TEMP_neko.n --main ToolChain_GameMaker && neko TEMP_neko.n SUMMARIZE # ->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->

// The following outlines what I want to do with most $-code to source code projects:
//   +--------+  +------------+  +------------+      +------------+   +---------+   +---------+         //>
//   | $ code |->| Bodge Pre- |->| Prettify*  |      | Prettify*  |<--| Source  |<--| Manual  |         //> * Post-processing sometimes required.
//   | Notes  |  | Process    |  | 1-1 to AST |      | 1-1 to AST |   | repo    |   | changes |         //>
//   +--------+  +------------+  +------------+      +------------+   +---------+   +---------+         //>
//     ^                |                      \    /                                    ^              //>
//     |                v                    +---------+                                 |              //>
//     |     Docs, tests, reports            | Compare |                                 |              //>
//     |                                     +---------+                                 |              //>
// +-------------------------+                    |                                      |              //>
// | Manual edits? Automate? |<----Changes--------+---------Changes->--------------------+              //>
// +-------------------------+  


class ToolChain_GameMaker ////////////////////////////////////////////////////////////////////////////////> For a GameMaker project:
{/////////////////////////////////////////////////////////////////////////////////////////////////////////>

  var              _is                  :Int                    = 1;                                    //> 0 = read from project to summary files, 1 = read summaries and write back to project.;
  var              _sFileSplit          :String                 = "\n== == ==";                         //> Visual divider, and escape sequence to look for.
  var              _sPathGameMaker      :String = "/home/dave/GameMakerProjects/HitMaker001";           //> Root directory of GameMaker project - "source code"
  var              _sPathSums        :String="/home/dave/Desktop/AAA/Practical_Math_Music/game_music/"; //> Money code directory.
                                        
//var              _sPathGameMaker      :String = "/home/dave/GameMakerProjects/Convention_Maze";       //> Root directory of GameMaker project.
//var              _sPathSums           :String = "/home/dave/Desktop/AAA/Convention_Maze/"     ;       //> Money code directory, gets summary of project.
                                                                                                        //>
//var              _sGml                :String                 = "";                                   //>
  var              _s                   :String                 = "";                                   //> Utility text string.
                                        
  var              _asGml                                       = new Array<String>();                  //> List of *.gml files' contents.
                                        
//public var       _sPng                :String                 = "";                                   //>
//public var       _sTxt                :String                 = "";                                   //>
//public var       _sWav                :String                 = "";                                   //>
  var              _sYy                 :String                 = "";                                   //> *.yy file contents.
  var              _sYyp                :String                 = "";                                   //> *.yyp file contents.


 function               FoundFile(////////////////////////////////////////////////////////////////////////>
                        sPath                                                                           //>
 )                                      :Void {///////////////////////////////////////////////////////////>
  var                   as              :Array<String>          = ("."+ sPath).split(".");              //>
  switch as[as.length-1] {                                                                              //> Depending on extension (whatever is after '.')...
//case "n"             : _s    += "\nn             file found: " + sPath;                               //>
//case "hx"            : _s    += "\nhx            file found: " + sPath;                               //>
//case "js"            : _s    += "\njs            file found: " + sPath;                               //>
  case "gml"           : _asGml.push( _sFileSplit + sPath +"\n"+ sys.io.File.getContent(sPath) );       //> Put in array, ultimately sorted by second line (number after @description).
  case "yy"            : _sYy  +=     _sFileSplit + sPath +"\n"+ sys.io.File.getContent(sPath)  ;       //> JSON formatted object data?
  case "yyp"           : _sYyp +=     _sFileSplit + sPath +"\n"+ sys.io.File.getContent(sPath)  ;       //> JSON formatted project data?
  case "txt"           : _s    += "\n"+             sPath;                                              //> Our notes?
  case "png"           : _s    += "\n"+             sPath;                                              //> graphic file
  case "wav"           : _s    += "\n"+             sPath;                                              //> audio file
  case "resource_order": _s    += "\n"+             sPath;                                              //>
  case "gitattributes" : _s    += "\n"+             sPath;                                              //>
  case "gitignore"     : _s    += "\n"+             sPath;                                              //>
  default              : _s    += "\n~~~Unknown file extension ~~~~~~~~~~~~~~~~~~~~~~ found: " + sPath; //> do something with file
  }//switch                                                                                             //>
 }//FoundFile/////////////////////////////////////////////////////////////////////////////////////////////>


 function               FoundFolder_recursive(////////////////////////////////////////////////////////////> 
                        sPath                                                                           //>
 )                                      :Void {///////////////////////////////////////////////////////////>
  sPath = haxe.io.Path.addTrailingSlash(sPath);                                                         //>
  if( 1 < ( sPath.split(".git/"   ) ).length ){ _s += "\n"+ sPath +" -------- Ignoring";        return;}//>
  if( 1 < ( sPath.split("rooms/"  ) ).length ){ _s += "\n"+ sPath +" -------- Ignoring";        return;}//>
  if( 1 < ( sPath.split("fonts/"  ) ).length ){ _s += "\n"+ sPath +" -------- Ignoring";        return;}//>
  if( 1 < ( sPath.split("options/") ).length ){ _s += "\n"+ sPath +" -------- Ignoring";        return;}//>
  if( 1 < ( sPath.split("sprites/") ).length ){ _s += "\n"+ sPath +" -------- Ignoring";        return;}//>
  if( 1 < ( sPath.split("sounds/" ) ).length ){ _s += "\n"+ sPath +" -------- Ignoring";        return;}//>
  ScanFolder_recursive(sPath);                                                                          //> Scan this sub-folder using a recursive function.
 }//FoundFolder_recursive/////////////////////////////////////////////////////////////////////////////////>


 function               ScanFolder_recursive(/////////////////////////////////////////////////////////////>
                        a_sPath                                                                         //> Path to directory to be scanned.
 )                                      :Void {///////////////////////////////////////////////////////////>
                                                                                                        trace("Directory found: " + a_sPath); //>
  if( !sys.FileSystem.exists(a_sPath) ){                                                                trace("Error: "+ a_sPath +" does not exist."); //>
                                                                                                return;}//>
  var                   sContent        :String                 = "";                                   //> trace( "Scanning: " + a_sPath );//>
  for( file in sys.FileSystem.readDirectory(a_sPath) ){                                                 //> For every item in the directory listing...
   var                  sPath           :String                 = haxe.io.Path.join( [a_sPath,file] );  //> Prepend path to file name.
   if( !sys.FileSystem.isDirectory(sPath) ){ FoundFile(             sPath ); }                          //> If a file.
   else                                    { FoundFolder_recursive( sPath ); }                          //> If a directory.
  }//for                                                                                                //>
 }//ScanFolder_recursive//////////////////////////////////////////////////////////////////////////////////>


 function               sMacrosReplace(///////////////////////////////////////////////////////////////////> Define a find and replace operation on all $/source code.
                        sGml                                                                            //>
 ,                      a_isDirection                                                                   //> 0= Macro $ code to source, 1= source from GameMaker to $ code.
 )                                      :String {/////////////////////////////////////////////////////////>
  var                   asMoneyMacro    :Array<String>          = [];                                   //>
  var                   asSource        :Array<String>          = [];                                   //>
  var                   as              :Array<String>          = sGml.split("$REPLACE>");              //>
  for( i in 1... as.length ){                                                                           //>
   var                  as1             :Array<String>   = (   ( as[i].split("\n") )[0]   ).split(">"); //>
   if( 3 < as1.length ){                                                                                //>
    asMoneyMacro.push(   as1[0]   );                                                                    //>
    asSource.push(       as1[2]   );                                                                    //>
  }}//if//for i                                                                                         //>
                                                                                                        //>
  for( i in 0... asMoneyMacro.length ){                                                                 //>
   trace("Macro search and $REPLACE>"+ asMoneyMacro[i]   +"< $WITH>"+    asSource[i] +"<" );            //>
   if( 0 == a_isDirection ){                                                                            //> 0= Macro $ code to source
    sGml = sGml.split(              asMoneyMacro[i] ).join(              asSource[    i] );             //> MACRO replacements
    sGml = sGml.split( "$REPLACE>"+ asSource[    i] ).join( "$REPLACE>"+ asMoneyMacro[i] );             //> But restore the definition lines
   }else{                                                                                               //> 1= source from GameMaker to $ code.
    sGml = sGml.split(              asSource[    i] ).join(              asMoneyMacro[i] );             //> Source replacements back to Macros
    sGml = sGml.split( "$WITH>"   + asMoneyMacro[i] ).join( "$WITH>"   + asSource[    i] );             //> But restore the definition lines
   }//if                                                                                                //>
  }//for i                                                                                              //>
                                                                                                        //>
return sGml;                                                                                            //>
 }//sMacrosReplace////////////////////////////////////////////////////////////////////////////////////////>


 function               new_ToProject(////////////////////////////////////////////////////////////////////> Create source from $ code, replacing macros.
 ){                     //////////////////////////////////////////////////////////////////////////////////>
  var                   sGml           :String = sys.io.File.getContent(_sPathSums+"SUMMARY_sGml.txt"); //> Money code directory, get contents of $ code (summary file).
  sGml = sMacrosReplace(sGml ,0);                                                                       //> MACRO replacements
  var                   asFiles         :Array<String>          = sGml.split( _sFileSplit );            //> Split into individual files.
  for( i in 1... asFiles.length ){                                                                      //>
   var                  asLines         :Array<String>          = asFiles[i].split( "\n" );             //>
   if( "" == asLines[0] ){                                                                    continue;}//>
   try{                                                                                                 //>
    var                 asLine0         :Array<String>          = ( asLines[1]+"    " ).split(" ");     //>
    asLine0[2] = ""+ (10000 + i);                                                                       //>
    var                 sContent        :String                 = ( asLines.slice(2) ).join("\n");      //>
    if( "\n" == sContent ){ sContent = ""; }                                                            //>
    sContent = StringTools.rtrim( asLine0.join(" ") ) +"\n"+ sContent;                                  //>
    sys.io.File.saveContent(   asLines[0] ,sContent   );                                                //> File name, followed by all other lines.
   }catch(e:haxe.Exception){                                                                            trace( "oops '"+ asLines[0] +"': "+ e.message +" "+ e.stack );//>
   }//try                                                                                               //>
                                                                                                        trace( "*** Write to "+ asLines[0] );//>
  }//for i                                                                                              //>
 }//new_ToProject/////////////////////////////////////////////////////////////////////////////////////////>


 function               new_Summarize(////////////////////////////////////////////////////////////////////> Get source from GameMaker, write to summary files (concatenate everything).
 ){                     //////////////////////////////////////////////////////////////////////////////////>
  _s       = "";                                                                                        //>
  ScanFolder_recursive(    _sPathGameMaker                       );                                     //>
  sys.io.File.saveContent( _sPathSums +"SUMMARY_s.txt"    ,_s    );                                     //>
  _asGml.sort(         function(a, b){                                                                  //> Sort List of *.gml files' contents by
                        var             A                       = ( (a+"\n0").split("\n") )[2];         //> second line (first is file name).
                        var             B                       = ( (b+"\n0").split("\n") )[2];         //>
                        if( A < B ){                                              return          -1  ;}//> Report in the way sort() needs to work
                       return                                                           ( B < A ) ?1 :0;//> .
                       }// // // // // // // // // // // // // // // // // // // // // // // // // // ////>
  );                                                                                                    //>
  var                                   sGml                    = _asGml.join("");                      //>
  sGml = sMacrosReplace(sGml ,1);                                                                       //>
                                                                                                        //>
//sGml = StringTools.replace( sGml ," 0!= "   ," $IS " );                                               //> MACRO replacements
//sGml = StringTools.replace( sGml ," 0== "   ," $NO " );                                               //>
//sGml = StringTools.replace( sGml ,"global." , "$."   );                                               //> !!! Cannot end a variable with "global"!
                                                                                                        //>
  sys.io.File.saveContent( _sPathSums +"SUMMARY_sGml.txt" ,sGml  );                                     //>
  trace( "*** Write to "+  _sPathSums +"SUMMARY_sGml.txt"        );                                     //>
                                                                                                        //>
  sys.io.File.saveContent( _sPathSums +"SUMMARY_sYy.txt"  ,_sYy  );                                     //>
  trace( "*** Write to "+  _sPathSums +"SUMMARY_sYy.txt"         );                                     //>
                                                                                                        //>
  sys.io.File.saveContent( _sPathSums +"SUMMARY_sYyp.txt" ,_sYyp );                                     //>
  trace( "*** Write to "+  _sPathSums +"SUMMARY_sYyp.txt"        );                                     //>
 }//new_Summarize/////////////////////////////////////////////////////////////////////////////////////////>


 function               new(//////////////////////////////////////////////////////////////////////////////>
 )                                      :Void {///////////////////////////////////////////////////////////>
  var                   sCommandLineDirection :String           = ( Sys.args() )[0];                    //> Get direction operation from command line.
  if(       "SUMMARIZE" == sCommandLineDirection ){          trace( sCommandLineDirection +" ->->->" ); //> If command line is specifying "from GameMaker project to summary $-code files":
   new_Summarize();                                                                                     //>
  }else if( "TOpROJECT" == sCommandLineDirection ){          trace( sCommandLineDirection +" <-----" ); //> If command line is specifying "Read summaries and write back to project":
   new_ToProject();                                                                                     //>
  }//if                                                                                                 //>
 }//new///////////////////////////////////////////////////////////////////////////////////////////////////>


 static public function main(/////////////////////////////////////////////////////////////////////////////>
 )                                      :Void {///////////////////////////////////////////////////////////>
  #if sys                                                                                               //>
   trace("file system can be accessed");                                                                //>
  #end                                                                                                  //>
  new ToolChain_GameMaker();                                                                            //> run instance of main code.
 }//main//////////////////////////////////////////////////////////////////////////////////////////////////>
                                                                                                        //>
}//class ToolChain_GameMaker//////////////////////////////////////////////////////////////////////////////>
//////////////////////////////////////////////////////////////////////////////////////////////////////////>


//End of file
