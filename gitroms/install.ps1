# GitROMs installer for Windows
# Copies the app into the Ports folder on the R36S SD card (EASYROMS / roms).

$ErrorActionPreference = "Stop"
$src = $PSScriptRoot

Write-Host ""
Write-Host " GitROMs installer" -ForegroundColor Yellow
Write-Host " -----------------"
Write-Host ""

function Find-RomRoot {
    foreach ($letter in 68..90) {  # D: to Z:
        $drive = [char]$letter + ":\"
        foreach ($candidate in @("roms", "EASYROMS", "Ports")) {
            $path = Join-Path $drive $candidate
            if (Test-Path $path -PathType Container) {
                return $path
            }
        }
    }
    return $null
}

$romRoot = Find-RomRoot
if (-not $romRoot) {
    Write-Host "Could not find an EASYROMS / roms / Ports drive." -ForegroundColor Red
    Write-Host "Plug the SD card in and run this again."
    Read-Host "Press Enter to exit"
    exit 1
}

if ($romRoot -match "[\\/]Ports$") {
    $target = Join-Path $romRoot "gitroms"
} else {
    $ports = Join-Path $romRoot "ports"
    if (-not (Test-Path $ports)) { New-Item -ItemType Directory -Path $ports | Out-Null }
    $target = Join-Path $ports "gitroms"
}

Write-Host "Installing to: $target"
Write-Host ""

if (-not (Test-Path $target)) {
    New-Item -ItemType Directory -Path $target | Out-Null
}

$files = @("config.py", "github_client.py", "main.py", "GitROMs.sh", "gitroms.sh", "README.md")
foreach ($f in $files) {
    $srcFile = Join-Path $src $f
    if (Test-Path $srcFile) {
        Copy-Item -Path $srcFile -Destination $target -Force
        Write-Host "  copied $f"
    } else {
        Write-Host "  missing $f (skipped)" -ForegroundColor DarkYellow
    }
}

Write-Host ""
Write-Host "Done." -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. Eject the SD card safely."
Write-Host "  2. Put it back in the R36S and boot."
Write-Host "  3. In EmulationStation: Main Menu -> Games Settings -> Update Gamelists"
Write-Host "     (or restart ES), then open Ports -> gitroms."
Write-Host ""
Read-Host "Press Enter to exit"
