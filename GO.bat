GOTO :Go_one
rem CodeBaseMent local tool-chain for JS code development
rem Notepad++ NppExec plug-in code that should get us here: (f6 , then paste the following and save as GO_bat. Advanced - put on menu, then, set hot-key to this menu item).
rem npp_save
rem cmd /c C:\$\Code\GO.bat "$(FULL_CURRENT_PATH)"
rem npp_menucommand File\Reload

:Go_one&                                                                                                rem Tidy one file.
rem node "C:\$\Code\codebasement\Preprocess.js"         TMP %1&                                         rem Run Dave's custom pre-processor tool-chain 'TMP' (tidy, macro expand and prettify), passing along the path and file name of current Notepad++ tab.
node "C:\$\Code\codebasement\TEMP_PRETTY\Preprocess.js" TMP %1&                                         rem Run Dave's custom pre-processor tool-chain 'TMP' (tidy, macro expand and prettify), passing along the path and file name of current Notepad++ tab. 

GOTO :End

:Go_project&                                                                                            rem Tidy files in project.
node "C:\$\Code\codebasement\Preprocess.js" T "C:\$\Code\Daves Preprocessor\Preprocess.js"
node "C:\$\Code\codebasement\Preprocess.js" T "C:\$\Code\HelloWorld\app.js"

GOTO :End

:End
