# Portlight

Portlight is the browser for HTML games on an R36S running ArkOS. You launch it from Ports. It is not a page you open in Firefox, and it does not run on another computer.

The pad is the mouse. GitHub browsing, downloads, and play all happen inside Portlight.

## Install on the R36S

Plug the SD card into a Windows computer and double-click [install.bat](install.bat). It copies Portlight onto the EASYROMS drive and downloads the handheld runtime.

Boot the R36S, open **Ports**, and start **Portlight**. The first launch finishes the install. Leave Wi-Fi on. That only happens once.

Quit returns to the games menu. Saves and the shelf stay in `ports/portlight/runtime/profile` on the SD card.

If the card does not already contain a fullscreen runtime, install Fire4ArkOS from Tools and run `install.bat` again. It copies that file into Portlight. You do not open it or type an address.

## Included games

- **Lantern Run** — jump the posts. Up or Z launches the lantern.
- **Grid Snake** — turn with the D-pad. Don't bite the trail.
- **Break Amber** — move the paddle. Z or A launches the ball.

## Play a game from GitHub

Open the GitHub tab. It starts on [xenodorian's repositories](https://github.com/xenodorian?tab=repositories), showing HTML files and ROMs. You can also enter a user name, `owner/repo`, or a GitHub URL that points at an `.html` file.

Shelved games stay on the device.

While a game is open, L and R move across Exit, Keyboard, and Mouse. Outside a game, the left stick brings up the cursor. L3 or Q left-clicks. R3 or E right-clicks. B goes back.

Games can also listen for Portlight messages:

```js
window.addEventListener("message", (event) => {
  const data = event.data;
  if (!data || data.source !== "portlight") return;
  // data.phase: "keydown" | "keyup"
  // data.code: "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight" | "KeyZ" | "KeyX" | "KeyC" | "KeyV"
});
```

## Develop on a computer

```bash
npm install
npm run dev
```

That is only for working on Portlight. It is not how you install it on the handheld.
