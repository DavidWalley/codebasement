rem CodeBaseMent local tool-chain for JS code development
rem Notepad++ NppExec plug-in code that should get us here: (f6 , then paste the following and save as GO_bat. Advanced - put on menu, then, set hot-key to this menu item).

rem inputbox "Neatify, Process, Test" : N
rem npp_save
rem cmd /c C:\$\Code\codebasement\GO.bat $(INPUT) "$(FULL_CURRENT_PATH)" $(CURRENT_LINE) $(CURRENT_COLUMN)
rem npp_menucommand File\Reload

cd "C:\$\Code\codebasement\"&           rem Custom pre-processor and tool-chain tools.
node Preprocess.js %1 %2 %3 %4&         rem Run tool-chain, passing along user dialog input and current Notepad++ file and cursor info.
