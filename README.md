# Portlight

HTML game station for the R36S on ArkOS, and any other browser. Browse a GitHub account or repository, shelf an HTML game, and play it with the handheld pad.

## Included games

- **Lantern Run** — jump the posts. Up or Z launches the lantern.
- **Grid Snake** — turn with the D-pad. Don't bite the trail.
- **Break Amber** — move the paddle. Z or A launches the ball.

## Play a game from GitHub

Open the GitHub tab and enter any of:

- a user name, such as `xenodorian`
- `owner/repo`
- a full GitHub URL that points at an `.html` file

Shelved games stay on this device. Select is Enter or Z. Escape leaves a game.

Handheld mapping while a game is running:

| Button | Key |
| --- | --- |
| D-pad | Arrow keys |
| A | Z |
| B | X |
| X | C |
| Y | V |

Games can also listen for Portlight messages:

```js
window.addEventListener("message", (event) => {
  const data = event.data;
  if (!data || data.source !== "portlight") return;
  // data.phase: "keydown" | "keyup"
  // data.code: "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight" | "KeyZ" | "KeyX" | "KeyC" | "KeyV"
});
```

## Run

```bash
npm install
npm run dev
```

The dev server prints a local address. Production build:

```bash
npm run build
```
