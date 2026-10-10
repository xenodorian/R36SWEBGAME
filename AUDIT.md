# R36SWEBGAME audit report (no code changes were made)

Verified = I located the exact text/code. Inferred = reasoning, not tested on a device.

## Verified defects
1. First launch runs `npm ci` on the device (Portlight.sh) and `apt-get install` for Firefox, Xvfb, xdotool, python3. The installer does not deliver "everything"; Wi-Fi and a long first boot are required.
2. Server is the Vite DEV server (arkos/serve.mjs, vite.config.ts only adds nitro for build, preset "vercel"). Heavy for a 1 GB RK3326. A production build (nitro node-server preset) shipped prebuilt would avoid npm, Vite and native modules on the device.
3. Portlight.sh never launches gptokeyb. `GPTK_PID` is never set and arkos/portlight.gptk is unused. `PROFILE` is unused.
4. Firefox prefs in the wrapper: `dom.gamepad.enabled=false` (app uses navigator.getGamepads) and `dom.w3c_pointer_events.enabled=false` (breaks the on-screen keyboard's onPointerDown and pointer-event games).
5. userContent.css in the wrapper sets animation/transition duration 0s and `contain: layout paint` on article/section for ALL pages, which can break HTML games.
6. src/lib/pad.ts assumes the standard gamepad layout (D-pad 12-15, L3/R3 10/11). From disassembling browser.arm64, the R36S raw layout is: A0 B1 X2 Y3 L1=4 R1=5 L2=6 R2=7, D-pad Up8 Down9 Left10 Right11, Select12 Start13 L3=14 R3=15. With raw numbering, Select/Start/L3/R3 would read as D-pad.
7. The bundled front-end (browser.arm64, Fire4ArkOS) already owns the pad: stick = cursor, A = mouse down/up, B = click, D-pad = scroll, Start = Return. In-app pad handling would double-trigger. Verified main() accepts argv[1] as the start URL, so the launcher URL works.
8. Reinstall wipes the Firefox profile (arkos/display/.mozilla_profile is deleted with the app folder), including the shelf (localStorage). The installer preserves runtime/profile and runtime/home, which are not where the profile lives.
9. Wrapper CommandBatcher: `self.log_callback` is undefined (caught by bare except), xdotool stderr pipe is never drained (possible stall), flush() references undefined attributes.
10. Vendored Fire4ArkOS files are GPL-3.0 with no notice in the repo. Wrapper is identical to upstream v1.5.43 line count (1767), no diff found.
11. install.ps1: no checksum on Node download, copies whole Node tree (thousands of files), no TLS1.2 / ProgressPreference setting.

## Inferred (not tested)
- Portlight.sh stops emulationstation, which likely kills the script itself (upstream launcher does not stop ES).
- `npm ci` fails on exFAT (no symlinks) without `--no-bin-links`.
- Portlight.sh does not rewrite EOL Ubuntu 19.10 apt sources to old-releases.ubuntu.com (upstream installer does), so apt may fail.
- Client bundle likely needs a Firefox 78 compatible build target (ArkOS Ubuntu 19.10 ships Firefox 78-era).

## Not verifiable here
Pad behavior, audio, performance and Firefox install on real hardware.

## Proposed fix plan (not started)
1. Prebuilt node-server bundle in arkos/app, no npm/Vite on device.
2. Installer copies only device files, downloads Node arm64 binary only with SHA256 check, preserves profile.
3. Portlight.sh: no ES stop, apt source fix, on-screen status, persistent profile env.
4. Wrapper: fix prefs, CSS, CommandBatcher, profile path.
5. pad.ts: R36S raw layout when mapping is not "standard"; skip in-app pad menu control under the front-end.
6. GPL notice, README correction, rebuild zip, push to main.

## Status after fixes (commits 77aa763, b109756, 35872e7)

Done: 1 (no npm/apt-for-Node on device; Node bundled and SHA256-checked), 2 (prebuilt node-server in arkos/app, Firefox 78 target),
3 (dead gptokeyb code removed; front-end owns the pad), 4, 5, 6 (raw layout used when mapping is not "standard"),
7 (?fe=1 disables in-app cursor control), 8 (profile moved to ports/portlight/data, preserved, old profile migrated),
9 (CommandBatcher), 10 (NOTICE.md), 11 (installer is offline, copies ~55 files plus the Node binary).
Inferred items: ES is no longer stopped; apt sources are rewritten to old-releases.ubuntu.com if `apt-get update` fails.

Still unverified on hardware: PORTLIGHT_PROFILE reaching Firefox through browser.arm64 (a closed binary), the apt install of
firefox-esr/xvfb/xdotool on ArkOS, the installer on real Windows (no PowerShell was available to test), pad behavior, audio, performance.
Not solvable here: Firefox, Xvfb and xdotool cannot be bundled, so the first boot still needs Wi-Fi once.
Not done: the unrelated Grok/auth/PGLite scaffolding in the repo is still shipped in source but not in the device build.
