# GitROMs

Lightweight GitHub ROM browser and downloader for the R36S (ArkOS).

**No browser. No Firefox. No HTML rendering of GitHub pages.**

Uses the GitHub API only. Shows only folders and known ROM file types. Downloads straight into the correct ArkOS `/roms/<system>/` folders.

## Controls

- **D-pad** – Move focus
- **A** – Select / Confirm / Download
- **B** – Back

## Requirements on device

- Python 3
- pygame
- requests

One-time install (needs Wi-Fi):

```bash
sudo apt-get update
sudo apt-get install -y python3-pygame python3-requests
```

Or with pip:

```bash
pip3 install pygame requests
```

## Install

1. Copy the entire `gitroms` folder to the Ports directory on the EASYROMS / roms card, e.g.:

   `EASYROMS/ports/gitroms/`

2. Make the launcher executable (on the device or via Linux):

   ```bash
   chmod +x ports/gitroms/GitROMs.sh
   ```

3. Restart EmulationStation or refresh the Ports list.

4. Launch **GitROMs** from the Ports menu.

## Features

- Defaults to user `xenodorian`
- Enter any GitHub username or `owner/repo`
- Browse folders
- Only shows directories + ROM extensions
- Big chunky pad-friendly UI
- Downloads to the correct system folder automatically

## ROM extensions currently recognised

`.nes .smc .sfc .gba .gbc .gb .md .gen .bin .sms .gg .pce .z64 .n64 .v64 .nds .chd .pbp .iso .cso .cue .zip .7z`

More can be added easily in `config.py`.
