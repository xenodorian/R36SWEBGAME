# GitROMs

Lightweight GitHub ROM browser and downloader for the R36S (ArkOS).

**No browser. No Firefox. No HTML rendering of GitHub pages.**

Uses the GitHub API only. Shows only folders and known ROM file types. Downloads straight into the correct ArkOS `/roms/<system>/` folders.

## Controls

- **D-pad** – Move focus
- **A** – Select / Confirm / Download
- **B** – Back

## Install on the R36S (Windows)

1. Download or clone this repo.
2. Plug the R36S SD card into your Windows PC.
3. Double-click **`gitroms/install.bat`**.
   - It finds the EASYROMS / roms drive and copies everything into `ports/gitroms`.
4. Eject the SD card safely, put it back in the R36S, and boot.
5. Open **Ports** → launch **GitROMs**.

**First launch only:** the launcher automatically installs `python3-pygame` and `python3-requests` if they are missing (needs Wi-Fi once). After that it works offline except for talking to GitHub.

If something fails, check `ports/gitroms/gitroms.log`.

## Manual install (Linux / advanced)

```bash
# Copy the gitroms folder to the Ports directory
cp -r gitroms /path/to/EASYROMS/ports/
chmod +x /path/to/EASYROMS/ports/gitroms/GitROMs.sh
```

## Features

- Defaults to user `xenodorian`
- Browse any public user’s repositories
- Browse folders
- Only shows directories + ROM extensions (everything else is ignored)
- Big chunky pad-friendly UI
- Downloads to the correct system folder automatically

## ROM extensions currently recognised

`.nes .smc .sfc .gba .gbc .gb .md .gen .bin .sms .gg .pce .z64 .n64 .v64 .nds .chd .pbp .iso .cso .cue .zip .7z`

Edit `config.py` to add more.
