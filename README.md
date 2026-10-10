# Portlight

Portlight is the browser for HTML games on an R36S running ArkOS. You launch it from Ports. It is not a page you open in Firefox, and it does not run on another computer.

The pad is the mouse. GitHub browsing, downloads, and play all happen inside Portlight.

## Install on the R36S

1. Copy this project onto the SD card at `EASYROMS/ports/portlight/`.
2. Copy [arkos/Portlight.sh](arkos/Portlight.sh) to `EASYROMS/ports/Portlight.sh`.
3. In the games menu, open **Ports** and start **Portlight**.

The script stops the games menu, starts the station on the device, and shows it fullscreen. Quit returns to the games menu. Saves and the shelf stay in `ports/portlight/runtime/profile` on the SD card.

Node lives at `ports/portlight/runtime/bin/node`. The fullscreen runtime lives at `ports/portlight/runtime/firefox/firefox`. If `gptokeyb` is on the device or at `runtime/gptokeyb`, the port uses it so the pad still works when Firefox cannot see the joystick. Those files belong to Portlight. They are not a browser you surf with.

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
