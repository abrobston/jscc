[Setup]
AppName=JS/CC
AppVerName=JS/CC 0.30
AppPublisher=J.M.K S.F. Software Technologies, Jan Max Meyer
AppPublisherURL=http://jscc.jmksf.com
AppSupportURL=http://jscc.jmksf.com
AppUpdatesURL=http://jscc.jmksf.com
DefaultDirName={pf}\jscc
DefaultGroupName=JavaScript Parser Generator
LicenseFile=jscc\ARTISTIC
InfoBeforeFile=jscc\CHANGES
OutputBaseFilename=jscc-0.30
Compression=lzma
SolidCompression=yes

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked
Name: "setenv"; Description: "Add JS/CC environment to PATH"; GroupDescription: "{cm:AdditionalIcons}";

[Files]
Source: "jscc\jscc.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "jscc\jscc.js"; DestDir: "{app}"; Flags: ignoreversion
Source: "jscc\CHANGES"; DestDir: "{app}"; Flags: ignoreversion
Source: "jscc\TODO"; DestDir: "{app}"; Flags: ignoreversion
Source: "jscc\ARTISTIC"; DestDir: "{app}"; Flags: ignoreversion
Source: "jscc\README"; DestDir: "{app}"; Flags: ignoreversion
Source: "jscc\driver_jscript.js_"; DestDir: "{app}"; Flags: ignoreversion
Source: "jscc\driver_webenv.js_"; DestDir: "{app}"; Flags: ignoreversion
Source: "jscc\driver_web.js_"; DestDir: "{app}"; Flags: ignoreversion
Source: "jscc\driver_rhino.js_"; DestDir: "{app}"; Flags: ignoreversion

Source: "jscc\webenv\img\*.png"; DestDir: "{app}\webenv\\img"; Flags: ignoreversion
Source: "jscc\webenv\img\*.gif"; DestDir: "{app}\webenv\\img"; Flags: ignoreversion
Source: "jscc\webenv\*.png"; DestDir: "{app}\webenv\img"; Flags: ignoreversion
Source: "jscc\webenv\jscc.html"; DestDir: "{app}\webenv"; Flags: ignoreversion
Source: "jscc\webenv\jscc.js"; DestDir: "{app}\webenv"; Flags: ignoreversion
Source: "jscc\webenv\driver.js"; DestDir: "{app}\webenv"; Flags: ignoreversion
Source: "jscc\webenv\webdriver.js"; DestDir: "{app}\webenv"; Flags: ignoreversion
Source: "jscc\webenv\jscc_logo.png"; DestDir: "{app}\webenv"; Flags: ignoreversion
Source: "jscc\webenv\jscc_logo_small.png"; DestDir: "{app}\webenv"; Flags: ignoreversion
Source: "jscc\webenv\jscc.css"; DestDir: "{app}\webenv"; Flags: ignoreversion

Source: "jscc\src\*.js"; DestDir: "{app}\src"; Flags: ignoreversion
Source: "jscc\src\*.par"; DestDir: "{app}\src"; Flags: ignoreversion
Source: "jscc\src\Makefile.*"; DestDir: "{app}\src"; Flags: ignoreversion
Source: "jscc\src\*.inc"; DestDir: "{app}\src"; Flags: ignoreversion
Source: "jscc\src\v8\*"; DestDir: "{app}\src\v8"; Flags: ignoreversion

Source: "jscc\samples\*.par"; DestDir: "{app}\samples"; Flags: ignoreversion
Source: "jscc\samples\xpl\*.xpl"; DestDir: "{app}\samples"; Flags: ignoreversion
Source: "jscc\samples\README"; DestDir: "{app}\samples"; Flags: ignoreversion

Source: "jscc\doc\jscc_manual.pdf"; DestDir: "{app}\doc"; Flags: ignoreversion

Source: "setenv.exe"; DestDir: "{app}\util"; Flags: ignoreversion; Tasks: setenv

[Icons]
Name: "{group}\Web Environment"; Filename: "{app}\webenv\jscc.html"
Name: "{group}\README"; Filename: "{cmd}"; Parameters: "/C more ""{app}\README"""
Name: "{group}\CHANGES"; Filename: "{cmd}"; Parameters: "/C more ""{app}\CHANGES"""
Name: "{group}\TODO"; Filename: "{cmd}"; Parameters: "/C more ""{app}\TODO"""
Name: "{group}\LICENSE"; Filename: "{cmd}"; Parameters: "/C more ""{app}\ARTISTIC"""
Name: "{group}\Command-line"; Filename: "{cmd}"; Parameters: "/K title JS/CC Command-Line"; WorkingDir: "{app}"
Name: "{group}\User's Manual"; Filename: "{app}\doc\jscc_manual.pdf"; WorkingDir: "{app}"
Name: "{group}\Official Web-Site"; Filename: "http://jscc.jmksf.com"
Name: "{group}\{cm:UninstallProgram,JavaScript Parser Generator}"; Filename: "{uninstallexe}"
Name: "{commondesktop}\JavaScript Parser Generator WebEnv"; Filename: "{app}\jscc.html"; Tasks: desktopicon

[UninstallRun]
Filename: "{app}\util\setenv.exe"; Parameters: "-d PATH %""{app}""";

[Run]
Filename: "{app}\webenv\jscc.html"; Description: "{cm:LaunchProgram,JS/CC}"; Flags: shellexec postinstall skipifsilent unchecked
Filename: "{app}\util\setenv.exe"; Parameters: "-a PATH %""{app}"""; Flags: shellexec skipifsilent; Tasks: setenv

