// codebasement/ToolChain_GameMaker.hx - Haxe language BODGE code for transferring files in and out of a GameMaker project.
// (c)2024 David C. Walley

// Start GameMaker IDE. Open project *.yyp
// In a UBUNTU terminal (ctrl+alt+T):
// cd ~/Desktop/AAA/code/codebasement                                                                   # Where I keep this file.
// #      Language (neko for local execution bodge code)                  Custom direction operation
// #      |    Intermediate file                                          |
// #      |    |            Main code class                               | 
// #      V    V             V                                            V                      
// haxe --neko TEMP_neko.n --main ToolChain_GameMaker && neko TEMP_neko.n TOpROJECT
// haxe --neko TEMP_neko.n --main ToolChain_GameMaker && neko TEMP_neko.n SUMMARIZE  # <-<-<-<-<-<-<-<-<-<-<-<-<-<-<-<-<-<-<-<-<-<-<- DANGER WILL ROBINSON <-<-<- WILL OVER-WRITE $-CODE <-<-<-

// This Haxe program is bodge code for processing $-code notes to source code.   https://haxe.org/
// Any project-related notes should be in electronic (preferrably text) format in a repo, because they belong to the enterprise, and shareholders should be pissed if not.
// Therefore, I am releasing this as $-code, not source code, as an example of my note-taking.

// THE FOLLOWING IS NOT SOURCE CODE. THESE ARE MY NOTES!

// I like to have the ability to easily and non-distractingly write notes about individual lines or tokens found in the enterprise's source code.
// The easiest way to do this is with single-line comments, starting at or after a given column and continuing on a single line until hitting a new-line.
// Set your text editor to non-wrapping, and ignore comments that spill of the right side of the screen, or scroll over, or toggle word-wrap to read them.
// In general reading long comments is discouraged, unless you need to. 
// Beware the Stroop Effect. 
//
// But comments don't work, because:
// Extensive note-taking messes with the source code repo.
// And, too many devs read all the footnotes, which can get to be a waste of their time.
// Notes are most useful for fixing bugs or perhaps refactoring - otherwise they can be a distraction.

// I DON'T WRITE TOO MANY COMMENTS - YOU READ TOO MANY!

// I believe notes should be kept separately, in their own repo, in a one-to-zero-or-one relationship between code lines or tokens, and footnotes about them.
// This can be achieved with almost any text editor and in-line comments in $-code files, and minimal tooling to strip out most comments, and automatically prettify and post-process to meet desired standards.
//
// My notes are written for my brain, my visual cortex, and my neural net of memories - this bodge code is not for you, especially without reprogramming your brain's familiarity processors, which take about 2 weeks.
// However, as a normal part of codebase-as-database methodology, this Haxe code can be exported to a fair number of other programming languages.
// And, what do you care how I keep bodge code notes?
// If, however, you like my notes, you are welcome to read, copy and use what you like.
//
// However, it is a property of my $-code notes that they can be converted into source code in the enterprise's preferred format, in what is hopefully a fully automated process.
// In particular, this file of notes should execute properly as a Haxe file.
// I co-locate relevant code, notes, and diagrams whenever possible, so I don't have to switch applications or even pages.
// If everything is ASCII, then they can be presented to your eye with minimal effort and distraction on your part, and kept as if data in a database.

// The following outlines what I want to do with most $-code to source code projects:                   //>
//   +--------+  +------------+  +------------+      +------------+   +---------+   +---------+         //>
//   | $ code |->| Bodge Pre- |->| Prettify*  |      | Prettify*  |<--| Source  |<--| Manual  |         //> * Post-processing sometimes required.
//   | Notes  |  | Process    |  | 1-1 to AST |      | 1-1 to AST |   | repo ** |   | changes |         //> ** It is preferred that the Source repo code be prettified before it is commited - eliminate a step.
//   +--------+  +------------+  +------------+      +------------+   +---------+   +---------+         //>
//     ^                |                      \    /                                    ^              //>
//     |                v                    +---------+                                 |              //>
//     |     Docs, tests, reports            | Compare |                                 |              //>
//     |                                     +---------+                                 |              //>
// +-------------------------+                    |                                      |              //>
// | Manual edits? Automate? |<----Changes--------+---------Changes->--------------------+              //>
// +-------------------------+                                                                          //>

// GameMaker
// =========
// I have been asked to evaluate GameMaker and GML. 
// GameMaker is useful for the vast majority of potential game designers because it provide many common 2-D game idioms in an easy-to-learn (or as easy as possible) way.
// It also has some finished game export functionality which might prove useful.
//
// I hate the GameMaker IDE and a few annoying things about GML, so I don't edit GML source code in their IDE if I don't have to.
// Rather, I use my preferred editor and edit my notes as text files.
// I keep their IDE open with a corresponding project, but read from and write to files GameMaker uses, mostly the code and JSON property files, using this tool-chain, set to run from a hot-key.
// Graphics files and the like I just import, keep, and edit in the GameMaker project.

// For coding in GameMaker, I prefer all code to be organized in a directory structure of my choosing, which is a single file until it gets too big.
// Also, I want a few simple macro replacements for coding convenience, because there are some annoying things, and a few dangerous things, in GML. 
//
// I call this code from the command line with options to transfer pre-processed code to a GameMaker project, or from it.
// Some paths are hard-coded below, because this is just bodge code at this time. 
//
// Don't complain - fix it.

// This code's features
// ====================
// 1) File splitter/joiner from $-code to source and back:
//    Splits and restores files delimited with ======== lines, kept in order with on the return trip with "/// @description 10002 ..." lines.
// 2) Search and replace:
//    Keeps a list of any search and replace definitions, specified in comments, in the form of:
//      €REPLACE>needle >  €WITH>replacement >
//    Makes replacements, and reverses them on the return trip.
//    Sending to GameMaker, and then getting back from GameMaker, should result in no change to $-code file.


class ToolChain_GameMaker ////////////////////////////////////////////////////////////////////////////////> For a GameMaker project:
{/////////////////////////////////////////////////////////////////////////////////////////////////////////>

  var              _is                  :Int                    = 1;                                    //> 0 = read from project to summary files, 1 = read summaries and write back to project.;
  var              _sFileSplit          :String                 = "\n========";                         //> Visual divider, and escape sequence to look for.
  var              _sPathGameMaker  :String ="/home/dave/GameMakerProjects/HitMaker001";                //> ???Hard-coded? Root directory of GameMaker project - "source code"
  var              _sPathSums       :String ="/home/dave/Desktop/AAA/Practical_Math_Music/game_music/"; //> ???Hard-coded? Money code directory.
                                        
//var              _sPathGameMaker   :String="/home/dave/GameMakerProjects/Convention_Maze";            //> Root directory of GameMaker project.
//var              _sPathSums        :String="/home/dave/Desktop/AAA/Convention_Maze/"     ;            //> Money code directory, gets summary of project.

//var              _sGml                :String                 = "";                                   //>
  var              _sReport             :String                 = "";                                   //> Report on files found and processed.
                                        
  var              _asGml                                       = new Array<String>();                  //> List of *.gml files' contents.
                                        
//public var       _sPng                :String                 = "";                                   //> Images, keep in GameMaker project.
//public var       _sTxt                :String                 = "";                                   //> Not used?
//public var       _sWav                :String                 = "";                                   //> Audio files, keep in GameMaker project.
  var              _sYy                 :String                 = "";                                   //> *.yy file JSON contents.
  var              _sYyp                :String                 = "";                                   //> *.yyp file JSON contents.


 function               FoundFile(////////////////////////////////////////////////////////////////////////> Process files found in the GameMaker project, according to their filename extension.
                        sPath                                                                           //> Path and filename of a file found in the GameMaker project.
 )                                      :Void {///////////////////////////////////////////////////////////> Report nothing, change a private variable.
  var                   as              :Array<String>          = ("."+ sPath).split(".");              //>
  switch as[as.length-1] {                                                                              //> Depending on extension (whatever is after '.')...
//case "n"             : _sReport    += "\nn             file found: " + sPath;                         //>
//case "hx"            : _sReport    += "\nhx            file found: " + sPath;                         //>
//case "js"            : _sReport    += "\njs            file found: " + sPath;                         //>
  case "gml"           : _asGml.push( _sFileSplit + sPath +"\n"+ sys.io.File.getContent(sPath) );       //> Put in array, ultimately sorted by second line (number after @description).
  case "yy"            : _sYy  +=     _sFileSplit + sPath +"\n"+ sys.io.File.getContent(sPath)  ;       //> JSON formatted object data?
  case "yyp"           : _sYyp +=     _sFileSplit + sPath +"\n"+ sys.io.File.getContent(sPath)  ;       //> JSON formatted project data?
  case "txt"           : _sReport    += "\n"+             sPath;                                        //> Our notes?
  case "png"           : _sReport    += "\n"+             sPath;                                        //> graphic file
  case "wav"           : _sReport    += "\n"+             sPath;                                        //> audio file
  case "resource_order": _sReport    += "\n"+             sPath;                                        //>
  case "gitattributes" : _sReport    += "\n"+             sPath;                                        //>
  case "gitignore"     : _sReport    += "\n"+             sPath;                                        //>
  default              : _sReport    += "\n~~~Unknown file extension ~~~~~~~~~~~~~~~~ found: " + sPath; //> do something with file
  }//switch                                                                                             //>
 }//FoundFile/////////////////////////////////////////////////////////////////////////////////////////////>


 function               FoundFolder_recursive(////////////////////////////////////////////////////////////> Continue recursive scan of a directory folder.
                        sPath                                                                           //>
 )                                      :Void {///////////////////////////////////////////////////////////>
  sPath = haxe.io.Path.addTrailingSlash(sPath);                                                         //>
  if( 1 < ( sPath.split(".git/"   ) ).length ){ _sReport += "\n"+ sPath +" -------- Ignoring";  return;}//>
  if( 1 < ( sPath.split("rooms/"  ) ).length ){ _sReport += "\n"+ sPath +" -------- Ignoring";  return;}//>
  if( 1 < ( sPath.split("fonts/"  ) ).length ){ _sReport += "\n"+ sPath +" -------- Ignoring";  return;}//>
  if( 1 < ( sPath.split("options/") ).length ){ _sReport += "\n"+ sPath +" -------- Ignoring";  return;}//>
  if( 1 < ( sPath.split("sprites/") ).length ){ _sReport += "\n"+ sPath +" -------- Ignoring";  return;}//>
  if( 1 < ( sPath.split("sounds/" ) ).length ){ _sReport += "\n"+ sPath +" -------- Ignoring";  return;}//>
  ScanFolder_recursive(sPath);                                                                          //> Scan this sub-folder using a recursive function.
 }//FoundFolder_recursive/////////////////////////////////////////////////////////////////////////////////>


 function               ScanFolder_recursive(/////////////////////////////////////////////////////////////> Scan a directory folder and, recursively, scan sub-folders.
                        a_sPath                                                                         //> Path to directory to be scanned.
 )                                      :Void {///////////////////////////////////////////////////////////>
                                                                                                        //> trace("Directory found: " + a_sPath); //>
  if( !sys.FileSystem.exists(a_sPath) ){                                                                trace("Error: "+ a_sPath +" does not exist."); //>
                                                                                                return;}//>
  var                   sContent        :String                 = "";                                   //> trace( "Scanning: " + a_sPath );//>
  for( file in sys.FileSystem.readDirectory(a_sPath) ){                                                 //> For every item in the directory listing...
   var                  sPath           :String                 = haxe.io.Path.join( [a_sPath,file] );  //> Prepend path to file name.
   if( !sys.FileSystem.isDirectory(sPath) ){ FoundFile(             sPath ); }                          //> If a file.
   else                                    { FoundFolder_recursive( sPath ); }                          //> If a directory.
  }//for                                                                                                //>
 }//ScanFolder_recursive//////////////////////////////////////////////////////////////////////////////////>


 function               sMacrosReplace(///////////////////////////////////////////////////////////////////> Define a find and replace operation on all $-code.
                        sGml                                                                            //>
 ,                      a_isDirection                                                                   //> 0= Macro $ code to source, 1= source from GameMaker to $ code.
 )                                      :String {/////////////////////////////////////////////////////////>
  var                   asMoneyMacro    :Array<String>          = [];                                   //>
  var                   asSource        :Array<String>          = [];                                   //>
  var                   as              :Array<String>          = sGml.split("€REPLACE>");              //>
  for( i in 1... as.length ){                                                                           //>
   var                  as1             :Array<String>   = (   ( as[i].split("\n") )[0]   ).split(">"); //>
   if( 3 < as1.length ){                                                                                //>
    asMoneyMacro.push(   as1[0]   );                                                                    //>
    asSource.push(       as1[2]   );                                                                    //>
  }}//if//for i                                                                                         //>

  for( i in 0... asMoneyMacro.length ){                                                                 //>
   trace("Macro search and €REPLACE>"+ asMoneyMacro[i]   +"< €WITH>"+    asSource[i] +"<" );            //>
   if( 0 == a_isDirection ){                                                                            //> 0= Macro $ code to source
    sGml = sGml.split(              asMoneyMacro[i] ).join(              asSource[    i] );             //> MACRO replacements
    sGml = sGml.split( "€REPLACE>"+ asSource[    i] ).join( "€REPLACE>"+ asMoneyMacro[i] );             //> But restore the definition lines
   }else{                                                                                               //> 1= source from GameMaker to $ code.
    sGml = sGml.split(              asSource[    i] ).join(              asMoneyMacro[i] );             //> Source replacements back to Macros
    sGml = sGml.split( "€WITH>"   + asMoneyMacro[i] ).join( "€WITH>"   + asSource[    i] );             //> But restore the definition lines
  }}//if//for i                                                                                         //>

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
                                                                                                        trace( "*** Write to "+ asLines[0] );//>
   }catch(e:haxe.Exception){                                                                            trace( "oops '"+ asLines[0] +"': "+ e.message +" "+ e.stack );//>
   }//try                                                                                               //>
  }//for i                                                                                              //>
 }//new_ToProject/////////////////////////////////////////////////////////////////////////////////////////>


 function               new_Summarize(////////////////////////////////////////////////////////////////////> Get source from GameMaker, write to summary files (concatenate everything).
 ){                     //////////////////////////////////////////////////////////////////////////////////>
  _sReport       = "";                                                                                  //>
  ScanFolder_recursive(    _sPathGameMaker                             );                               //>
  try{
   sys.io.File.copy(       _sPathSums +"SUMMARY_s.txt", _sPathSums +"OLD_SUMMARY_s.txt");
  }catch(e:haxe.Exception){};                                                                                //> If file does not exist, do nothing
  sys.io.File.saveContent( _sPathSums +"SUMMARY_s.txt" ,_sReport );                                     //>
  _asGml.sort(         function(a, b){                                                                  //> Sort List of *.gml files' contents by
                        var             A                       = ( (a+"\n0").split("\n") )[2];         //> second line (first is file name).
                        var             B                       = ( (b+"\n0").split("\n") )[2];         //>
                        if( A < B ){                                              return          -1  ;}//> Report in the way sort() needs to work
                       return                                                           ( B < A ) ?1 :0;//> .
                       }// // // // // // // // // // // // // // // // // // // // // // // // // // ////>
  );                                                                                                    //>
  var                                   sGml                    = _asGml.join("");                      //>
  sGml = sMacrosReplace(sGml ,1);                                                                       //>

//sGml = StringTools.replace( sGml ," 0!= "   ," |IS " );                                               //> MACRO replacements
//sGml = StringTools.replace( sGml ," 0== "   ," |NO " );                                               //>
//sGml = StringTools.replace( sGml ,"global." , "|."   );                                               //> !!! Cannot end a variable with "global"!

  try{
   sys.io.File.copy(       _sPathSums +"SUMMARY_sGml.txt", _sPathSums +"OLD_SUMMARY_sGml.txt");
  }catch(e:haxe.Exception){ trace("111"); }                                                             //> If file does not exist, do nothing
  sys.io.File.saveContent( _sPathSums +"SUMMARY_sGml.txt" ,sGml  );                                     //>

  try{
   sys.io.File.copy(       _sPathSums +"SUMMARY_sYy.txt" , _sPathSums +"OLD_SUMMARY_sYy.txt" );
  }catch(e:haxe.Exception){ trace("1121"); }                                                            //> If file does not exist, do nothing
  sys.io.File.saveContent( _sPathSums +"SUMMARY_sYy.txt"  ,sGml  );                                     //>

  try{
   sys.io.File.copy(       _sPathSums +"SUMMARY_sYyp.txt", _sPathSums +"OLD_SUMMARY_sYyp.txt");
  }catch(e:haxe.Exception){ trace("1131"); }                                                            //> If file does not exist, do nothing
  sys.io.File.saveContent( _sPathSums +"SUMMARY_sYyp.txt" ,sGml  );                                     //>


//  sys.io.File.saveContent( _sPathSums +"SUMMARY_sYy.txt"  ,_sYy  );                                     //>
//  trace( "*** Write to "+  _sPathSums +"SUMMARY_sYy.txt"         );                                     //>
//
//  sys.io.File.saveContent( _sPathSums +"SUMMARY_sYyp.txt" ,_sYyp );                                     //>
//  trace( "*** Write to "+  _sPathSums +"SUMMARY_sYyp.txt"        );                                     //>
 }//new_Summarize/////////////////////////////////////////////////////////////////////////////////////////>


 function               new(//////////////////////////////////////////////////////////////////////////////> Construct a new object of this class (and run appropriate processing).
 )                                      :Void {///////////////////////////////////////////////////////////>
  var                      sCommandLineDirection :String        = ( Sys.args() )[0];                    //> Get direction operation from command line.
  if(       "SUMMARIZE" == sCommandLineDirection ){          trace( sCommandLineDirection +" ->->->" ); //> If command line is specifying "from GameMaker project to summary $-code files":
   new_Summarize();                                                                                     //>
  }else if( "TOpROJECT" == sCommandLineDirection ){          trace( sCommandLineDirection +" <-----" ); //> If command line is specifying "Read summaries and write back to project":
   new_ToProject();                                                                                     //>
  }//if                                                                                                 //>
 }//new///////////////////////////////////////////////////////////////////////////////////////////////////>


 static public function         main(/////////////////////////////////////////////////////////////////////> Execution starts here.
 )                                      :Void {///////////////////////////////////////////////////////////>
  #if sys                                                                                               //>
   trace("file system can be accessed");                                                                //>
  #end                                                                                                  //>
  new ToolChain_GameMaker();                                                                            //> Create and run and instance of main code.
 }//main//////////////////////////////////////////////////////////////////////////////////////////////////>

}//class ToolChain_GameMaker//////////////////////////////////////////////////////////////////////////////>
//////////////////////////////////////////////////////////////////////////////////////////////////////////>


//End of file
