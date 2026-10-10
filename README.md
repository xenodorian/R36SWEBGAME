# Portlight

Portlight is the browser for HTML games on an R36S running ArkOS. You launch it from Ports. It does not run on another computer.
The pad is the mouse. GitHub browsing, downloads and play all happen inside Portlight.

## Install on the R36S

1. Download [Portlight-R36S.zip](https://github.com/xenodorian/R36SWEBGAME/raw/release/Portlight-R36S.zip) (44 MB) and unzip it.
2. Plug the SD card into a Windows computer and double-click **install.bat**.
   It copies Portlight and the Node runtime (checked against a SHA256) onto the EASYROMS drive. No download is needed for this step.
3. Boot the R36S, open **Ports**, and start **Portlight**.

**First launch only:** Portlight installs Firefox, Xvfb and xdotool with apt. This needs Wi-Fi once and takes a few minutes.
Those packages come from Ubuntu's archive for the device, so they cannot be bundled on the card. After that Portlight works offline except for the GitHub tab.
Reinstalling keeps your saves and shelf (they live in `ports/portlight/data`). If something fails, read `ports/portlight/portlight.log`.

## Included games
- **Lantern Run**, **Grid Snake**, **Break Amber**

## Play a game from GitHub
Open the GitHub tab. It lists HTML files and ROMs. You can also enter a user name, `owner/repo`, or a GitHub URL to an `.html` file. Shelved games stay on the device.

Games can listen for Portlight messages:

```
window.addEventListener("message", (event) => {
  const data = event.data;
  if (!data || data.source !== "portlight") return;
  // data.phase: "keydown" | "keyup"
  // data.code: "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight" | "KeyZ" | "KeyX" | "KeyC" | "KeyV"
});
```

## Build the release zip
```
npm ci
./scripts/build-release.sh
```

## Develop on a computer
```
npm install
npm run dev
```
That is only for working on Portlight.

Licenses: see [NOTICE.md](NOTICE.md). The display front-end is GPL-3.0.
