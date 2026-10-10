$ErrorActionPreference = "Stop"
$NodeVersion = "v22.21.0"
$NodeName = "node-$NodeVersion-linux-arm64"

function Find-Card {
  $volumes = @(Get-CimInstance -ClassName Win32_LogicalDisk -Filter "DriveType=2 OR DriveType=3")
  foreach ($disk in $volumes) {
    $root = $disk.DeviceID + "\"
    if ($disk.VolumeName -eq "EASYROMS") { return $root }
  }
  foreach ($disk in $volumes) {
    if ($disk.DriveType -ne 2) { continue }
    $root = $disk.DeviceID + "\"
    if (Test-Path (Join-Path $root "ports")) { return $root }
  }
  return $null
}

Write-Host ""
Write-Host "Portlight installer"
Write-Host "Plug in the R36S SD card. Use the EASYROMS drive."
Write-Host ""

$card = Find-Card
if (-not $card) {
  $letter = Read-Host "EASYROMS drive letter (for example E)"
  $letter = $letter.Trim().TrimEnd(":").TrimEnd("\")
  if ($letter.Length -ne 1) { throw "That is not a drive letter." }
  $card = $letter.ToUpper() + ":\"
}
if (-not (Test-Path $card)) { throw "Cannot see $card" }
Write-Host "Installing onto $card"

$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$temp = Join-Path $env:TEMP ("portlight-" + [guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Path $temp | Out-Null

try {
  $source = $null
  if (Test-Path (Join-Path $here "package.json")) {
    $source = $here
    Write-Host "Using the Portlight folder next to this installer."
  } else {
    $zip = Join-Path $temp "portlight.zip"
    Write-Host "Downloading Portlight..."
    Invoke-WebRequest -Uri "https://github.com/xenodorian/R36SWEBGAME/archive/refs/heads/main.zip" -OutFile $zip
    tar -xf $zip -C $temp
    $source = Get-ChildItem $temp -Directory | Where-Object { $_.Name -like "R36SWEBGAME-*" } | Select-Object -First 1 -ExpandProperty FullName
    if (-not $source) { throw "The download did not contain Portlight." }
  }

  $dest = Join-Path $card "ports\portlight"
  $keep = Join-Path $temp "keep"
  New-Item -ItemType Directory -Path $keep | Out-Null
  foreach ($name in @("profile", "home")) {
    $saved = Join-Path $dest "runtime\$name"
    if (Test-Path $saved) {
      Copy-Item $saved (Join-Path $keep $name) -Recurse -Force
    }
  }

  Write-Host "Copying Portlight..."
  if (Test-Path $dest) { Remove-Item $dest -Recurse -Force }
  New-Item -ItemType Directory -Path $dest | Out-Null
  $exclude = @("node_modules", "runtime", ".git", ".nitro")
  Get-ChildItem $source -Force | Where-Object { $exclude -notcontains $_.Name } | ForEach-Object {
    Copy-Item $_.FullName (Join-Path $dest $_.Name) -Recurse -Force
  }

  $nodeArchive = Join-Path $temp "node.tar.xz"
  Write-Host "Downloading the handheld runtime..."
  Invoke-WebRequest -Uri "https://nodejs.org/dist/$NodeVersion/$NodeName.tar.xz" -OutFile $nodeArchive
  tar -xf $nodeArchive -C $temp
  $nodeRoot = Join-Path $temp $NodeName
  if (-not (Test-Path (Join-Path $nodeRoot "bin\node"))) { throw "The Node download was not usable." }
  Copy-Item $nodeRoot (Join-Path $dest "runtime") -Recurse -Force

  foreach ($name in @("profile", "home")) {
    $saved = Join-Path $keep $name
    if (Test-Path $saved) {
      Copy-Item $saved (Join-Path $dest "runtime\$name") -Recurse -Force
    }
  }
  New-Item -ItemType Directory -Force -Path (Join-Path $dest "runtime\firefox") | Out-Null
  New-Item -ItemType Directory -Force -Path (Join-Path $dest "runtime\profile") | Out-Null

  $firefox = $null
  foreach ($folder in @("tools", "ports")) {
    $root = Join-Path $card $folder
    if (-not (Test-Path $root)) { continue }
    $firefox = Get-ChildItem $root -Recurse -File -Filter "firefox" -ErrorAction SilentlyContinue |
      Where-Object { $_.Length -gt 1MB } |
      Select-Object -First 1
    if ($firefox) { break }
  }
  if ($firefox) {
    Copy-Item $firefox.FullName (Join-Path $dest "runtime\firefox\firefox") -Force
    Write-Host "Copied the fullscreen runtime from $($firefox.FullName)"
  }

  $sh = Get-Content (Join-Path $source "arkos\Portlight.sh") -Raw
  $sh = $sh -replace "`r`n", "`n" -replace "`r", "`n"
  if (-not $sh.EndsWith("`n")) { $sh += "`n" }
  $ports = Join-Path $card "ports"
  New-Item -ItemType Directory -Force -Path $ports | Out-Null
  $utf8 = New-Object System.Text.UTF8Encoding $false
  [System.IO.File]::WriteAllText((Join-Path $ports "Portlight.sh"), $sh, $utf8)

  Write-Host ""
  Write-Host "Portlight is on the card."
  Write-Host "Boot the R36S, open Ports, and start Portlight."
  Write-Host "The first launch installs the rest. Leave Wi-Fi on."
  if (-not $firefox) {
    Write-Host ""
    Write-Host "The fullscreen runtime was not on the card yet."
    Write-Host "Install Fire4ArkOS from Tools, run this installer again, and it will pick that file up."
  }
} finally {
  if (Test-Path $temp) { Remove-Item $temp -Recurse -Force -ErrorAction SilentlyContinue }
}
