@echo off
setlocal EnableExtensions
cd /d "%~dp0"

echo.
echo  GitROMs installer
echo  -----------------
echo.

REM Prefer PowerShell for reliability
where powershell >nul 2>&1
if %ERRORLEVEL% equ 0 (
  powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0install.ps1"
  exit /b %ERRORLEVEL%
)

echo PowerShell not found. Falling back to basic copy.
echo.

set "TARGET="
for %%D in (D E F G H I J K L M N O P Q R S T U V W X Y Z) do (
  if exist "%%D:\roms\" (
    set "TARGET=%%D:\roms\ports\gitroms"
    goto :found
  )
  if exist "%%D:\EASYROMS\" (
    set "TARGET=%%D:\EASYROMS\ports\gitroms"
    goto :found
  )
  if exist "%%D:\Ports\" (
    set "TARGET=%%D:\Ports\gitroms"
    goto :found
  )
)

echo Could not find an EASYROMS / roms / Ports drive.
echo Plug the SD card in and try again.
pause
exit /b 1

:found
echo Installing to %TARGET%
echo.

if not exist "%TARGET%" mkdir "%TARGET%"

copy /Y "%~dp0config.py"          "%TARGET%\" >nul
copy /Y "%~dp0github_client.py"   "%TARGET%\" >nul
copy /Y "%~dp0main.py"            "%TARGET%\" >nul
copy /Y "%~dp0GitROMs.sh"         "%TARGET%\" >nul
copy /Y "%~dp0README.md"          "%TARGET%\" >nul

echo Done.
echo.
echo 1. Eject the SD card safely.
echo 2. Put it back in the R36S and boot.
echo 3. Open Ports and launch GitROMs.
echo    (First launch will install pygame/requests if needed.)
echo.
pause
