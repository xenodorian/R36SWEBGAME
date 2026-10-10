$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

function Find-Card {
  $volumes = @(Get-CimInstance -ClassName Win32_LogicalDisk -Filter "DriveType=2 OR DriveType=3")
  foreach ($disk in $volumes) {
    if ($disk.VolumeName -eq "EASYROMS") { return $disk.DeviceID + "\" }
  }
  foreach ($disk in $volumes) {
    if ($disk.DriveType -ne 2) { continue }
    $root = $disk.DeviceID + "\"
    if (Test-Path (Join-Path $root "ports")) { return $root }
  }
  return $null
}

function Write-Lf($path, $text) {
  $text = $text -replace "`r`n", "`n" -replace "`r", "`n"
  if (-not $text.EndsWith("`n")) { $text += "`n" }
  [System.IO.File]::WriteAllText($path, $text, (New-Object System.Text.UTF8Encoding $false))
}

Write-Host ""
Write-Host "Portlight installer"
Write-Host "Plug in the R36S SD card (the EASYROMS drive)."
Write-Host ""

$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$payload = Join-Path $here "payload"
foreach ($need in @("app\server\index.mjs", "display\browser.arm64", "display\firefox-framebuffer-wrapper.py", "node\node", "node\node.sha256", "Portlight.sh")) {
  if (-not (Test-Path (Join-Path $payload $need))) { throw "This download is incomplete: payload\$need is missing. Download the zip again." }
}

$node = Join-Path $payload "node\node"
$want = (Get-Content (Join-Path $payload "node\node.sha256") -Raw).Trim().Split(" ")[0].ToLower()
Write-Host "Checking the handheld runtime..."
$got = (Get-FileHash $node -Algorithm SHA256).Hash.ToLower()
if ($got -ne $want) { throw "The Node runtime failed its SHA256 check. Download the zip again." }

$card = Find-Card
if (-not $card) {
  $letter = Read-Host "EASYROMS drive letter (for example E)"
  $letter = $letter.Trim().TrimEnd(":").TrimEnd("\")
  if ($letter.Length -ne 1) { throw "That is not a drive letter." }
  $card = $letter.ToUpper() + ":\"
}
if (-not (Test-Path $card)) { throw "Cannot see $card" }
Write-Host "Installing onto $card"

$ports = Join-Path $card "ports"
$dest = Join-Path $ports "portlight"
New-Item -ItemType Directory -Force -Path $dest | Out-Null

# Keep saves and the game shelf. Older installs kept the profile in other places.
$data = Join-Path $dest "data"
foreach ($name in @("profile", "home")) {
  $target = Join-Path $data $name
  if (Test-Path $target) { continue }
  foreach ($old in @((Join-Path $dest "runtime\$name"), (Join-Path $dest "arkos\display\.mozilla_profile"))) {
    if (($name -eq "profile") -and (Test-Path $old)) {
      New-Item -ItemType Directory -Force -Path $data | Out-Null
      Copy-Item $old $target -Recurse -Force
      break
    }
    if (($name -eq "home") -and ($old -like "*runtime*") -and (Test-Path $old)) {
      New-Item -ItemType Directory -Force -Path $data | Out-Null
      Copy-Item $old $target -Recurse -Force
      break
    }
  }
}
New-Item -ItemType Directory -Force -Path (Join-Path $data "profile"), (Join-Path $data "home") | Out-Null

# Replace only the program files.
foreach ($name in @("app", "display", "runtime", "arkos", "node_modules", "src", "public", "scripts", "server")) {
  $old = Join-Path $dest $name
  if (Test-Path $old) { Remove-Item $old -Recurse -Force }
}
Get-ChildItem $dest -File -Force -ErrorAction SilentlyContinue | Where-Object { $_.Name -ne "portlight.log" } | Remove-Item -Force

Write-Host "Copying Portlight..."
Copy-Item (Join-Path $payload "app") (Join-Path $dest "app") -Recurse -Force
Copy-Item (Join-Path $payload "display") (Join-Path $dest "display") -Recurse -Force
$bin = Join-Path $dest "runtime\bin"
New-Item -ItemType Directory -Force -Path $bin | Out-Null
Copy-Item $node (Join-Path $bin "node") -Force

if ((Get-FileHash (Join-Path $bin "node") -Algorithm SHA256).Hash.ToLower() -ne $want) {
  throw "The copy to the card is damaged. Try again, or use a different card reader."
}

Write-Lf (Join-Path $ports "Portlight.sh") (Get-Content (Join-Path $payload "Portlight.sh") -Raw)

Write-Host ""
Write-Host "Portlight is on the card."
Write-Host "Eject the card, boot the R36S, open Ports, and start Portlight."
Write-Host "The first launch installs Firefox and its helpers. Leave Wi-Fi on for that one time."
