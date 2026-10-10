# Third-party notices

## Fire4ArkOS (GPL-3.0)

`arkos/display/browser.arm64` and `arkos/display/firefox-framebuffer-wrapper.py` come from the
Fire4ArkOS project, which is licensed under the GNU General Public License v3.0.
Portlight modifies the wrapper (gamepad and pointer-event prefs, userContent.css, CommandBatcher fixes,
a PORTLIGHT_PROFILE override). Those changes are released under the same GPL-3.0 terms.
Upstream source and the full license text are available from the Fire4ArkOS repository.
Anyone who receives the wrapper in this repo or in the release zip may use, study, change and share it under GPL-3.0.

## Node.js (MIT)

The release zip bundles the unmodified official Node.js 22.21.0 linux-arm64 binary, taken from the
`node-linux-arm64` npm package. Its SHA256 is in `payload/node/node.sha256` and is checked by the installer.
