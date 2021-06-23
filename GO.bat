rem CodeBaseMent local tool-chain for JS code development
GOTO :Go
rem Notepad++ NppExec plug-in code gets us here: (f6 , then paste the following and save as GO_bat.
rem Advanced - put on menu using NppExec, then, set hot-key to this menu item).
rem The following is an NppExec macro (hit f6, and enter the following (assumes this file is in C:\$\Coding\codebasement\):
rem     npp_save
rem     // Blank line required for some reason.
rem     inputbox "Neatify, Process, Test" : Neatify
rem     cmd /c C:\$\Coding\codebasement\GO.bat $(INPUT) "$(FULL_CURRENT_PATH)" $(CURRENT_LINE) $(CURRENT_COLUMN)
rem     npp_menucommand File\Reload

:Go
cd   "C:\$\Coding\codebasement\"&                                                                       rem Custom pre-processor and tool-chain tools.
node "C:\$\Coding\codebasement\Preprocess.js" %1 %2 %3 %4&                                              rem Run tool-chain, passing along user dialog input and current Notepad++ file and cursor info.
rem node "C:\$\Code\codebasement\TEMP_PrettyNotes\Preprocess.js" %1 %2 %3 %4&                           rem