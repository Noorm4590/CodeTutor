$toolsDir = Get-ToolsLocation

Write-Host "Generating extra installed packages."
$installed_packages_command = "/C `"$toolsdir\TinyTeX\bin\windows\tlmgr.bat info --list --only-installed --data name > $toolsDir/tinytex-pkg-installed.txt`""
Start-ChocolateyProcessAsAdmin $installed_packages_command "$env:WINDIR\system32\cmd.exe"

