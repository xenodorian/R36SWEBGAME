#!/bin/bash
# Portlight: open this from the Ports menu. Everything it needs is on the card
# except the display runtime (Firefox, Xvfb, xdotool), which installs once over Wi-Fi.

ROOT="$(cd "$(dirname "$0")" && pwd)"
BASE="$ROOT/portlight"
APP="$BASE/app"
NODE="$BASE/runtime/bin/node"
DATA="$BASE/data"
LOG="$BASE/portlight.log"
BROWSER="$BASE/display/browser.arm64"
WRAP="$BASE/display/firefox-framebuffer-wrapper.py"

say() { echo "$*" | tee -a "$LOG"; echo "$*" > /dev/tty1 2>/dev/null || true; }
die() { say "$*"; sleep 8; exit 1; }
: > "$LOG"

[ -f "$APP/server/index.mjs" ] || die "Portlight app files are missing. Run install.bat again."
[ -f "$BROWSER" ] && [ -f "$WRAP" ] || die "Portlight display files are missing. Run install.bat again."
[ -f "$NODE" ] || die "Portlight runtime is missing. Run install.bat again."
chmod +x "$NODE" "$BROWSER" "$WRAP" 2>/dev/null || true

# Saves and the game shelf live here and survive reinstalls.
mkdir -p "$DATA/home" "$DATA/profile"
export HOME="$DATA/home"
export PORTLIGHT_PROFILE="$DATA/profile"

cleanup() { [ -n "$SERVER_PID" ] && kill "$SERVER_PID" >/dev/null 2>&1 || true; }
trap cleanup EXIT

fix_apt_sources() {
  # Ubuntu 19.10 is end of life. Point apt at the archive that still serves it.
  sudo sed -i -E 's#https?://(ports|archive|security)\.ubuntu\.com#http://old-releases.ubuntu.com#g' /etc/apt/sources.list 2>/dev/null || true
}

have_display_runtime() {
  { command -v firefox >/dev/null 2>&1 || command -v firefox-esr >/dev/null 2>&1; } \
    && command -v Xvfb >/dev/null 2>&1 && command -v xdotool >/dev/null 2>&1 && command -v python3 >/dev/null 2>&1
}

if ! have_display_runtime; then
  say "Installing the display runtime. Leave Wi-Fi on. This happens once."
  if ! sudo apt-get update >>"$LOG" 2>&1; then
    fix_apt_sources
    sudo apt-get update >>"$LOG" 2>&1
  fi
  sudo apt-get install -y firefox-esr xvfb xdotool python3 libsdl2-2.0-0 >>"$LOG" 2>&1 \
    || sudo apt-get install -y firefox xvfb xdotool python3 libsdl2-2.0-0 >>"$LOG" 2>&1 || true
  have_display_runtime || die "The display runtime did not install. Check Wi-Fi, then see $LOG"
fi

export PORT=8080 HOST=127.0.0.1 NODE_OPTIONS="--max-old-space-size=256"
cd "$APP"
"$NODE" server/index.mjs >>"$LOG" 2>&1 &
SERVER_PID=$!

ready=0
for _ in $(seq 1 60); do
  if "$NODE" -e "fetch('http://127.0.0.1:8080/').then((r)=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"; then
    ready=1
    break
  fi
  kill -0 "$SERVER_PID" 2>/dev/null || break
  sleep 1
done
[ "$ready" = 1 ] || die "Portlight did not start. See $LOG"

sudo mkdir -p /opt/fire4arkos /usr/local/bin
sudo cp "$WRAP" /opt/fire4arkos/firefox-framebuffer-wrapper.py
sudo cp "$WRAP" /usr/local/bin/firefox-framebuffer-wrapper.py
sudo chmod +x /opt/fire4arkos/firefox-framebuffer-wrapper.py /usr/local/bin/firefox-framebuffer-wrapper.py
export FIRE4ARKOS_WRAPPER="$WRAP"
export FIRE4ARKOS_FROM_ES=1

"$BROWSER" "http://127.0.0.1:8080/?fe=1" >>"$LOG" 2>&1
