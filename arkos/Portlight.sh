#!/bin/bash
# Portlight is the browser. Open this from the Ports menu.
# It starts the station on the device and shows it fullscreen.

ROOT="$(cd "$(dirname "$0")" && pwd)"
APP="$ROOT/portlight"
LOG="$ROOT/portlight.log"
HOME_DIR="$APP/runtime/home"
PROFILE="$APP/runtime/profile"

if [ ! -f "$APP/package.json" ]; then
  echo "Portlight is missing its app folder at $APP" | tee "$LOG"
  sleep 6
  exit 1
fi

mkdir -p "$HOME_DIR" "$PROFILE"
export HOME="$HOME_DIR"

if command -v systemctl >/dev/null 2>&1; then
  sudo systemctl stop emulationstation >/dev/null 2>&1 || true
fi

cleanup() {
  if [ -n "$GPTK_PID" ]; then
    kill "$GPTK_PID" >/dev/null 2>&1 || true
  fi
  if [ -n "$SERVER_PID" ]; then
    kill "$SERVER_PID" >/dev/null 2>&1 || true
  fi
  if command -v systemctl >/dev/null 2>&1; then
    sudo systemctl start emulationstation >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

if [ -x "$APP/runtime/bin/node" ]; then
  NODE="$APP/runtime/bin/node"
elif command -v node >/dev/null 2>&1; then
  NODE="$(command -v node)"
else
  echo "Portlight has no Node runtime in $APP/runtime." | tee "$LOG"
  sleep 6
  exit 1
fi

export PATH="$APP/runtime/bin:$PATH"
if [ ! -e "$APP/node_modules/vite/bin/vite.js" ]; then
  echo "Installing Portlight. Leave Wi-Fi on. This happens once." | tee "$LOG"
  NPM="$APP/runtime/lib/node_modules/npm/bin/npm-cli.js"
  if [ ! -f "$NPM" ]; then
    echo "Node on the card is incomplete. Run install.bat again." | tee -a "$LOG"
    sleep 8
    exit 1
  fi
  cd "$APP"
  if ! "$NODE" "$NPM" ci --omit=dev --no-audit --no-fund >>"$LOG" 2>&1; then
    echo "Install failed. See $LOG" | tee -a "$LOG"
    sleep 8
    exit 1
  fi
fi

export NODE_OPTIONS="--max-old-space-size=384"
cd "$APP"
"$NODE" arkos/serve.mjs >"$LOG" 2>&1 &
SERVER_PID=$!

ready=0
for _ in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75 76 77 78 79 80 81 82 83 84 85 86 87 88 89 90; do
  if "$NODE" -e "fetch('http://127.0.0.1:8080/').then((r)=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"; then
    ready=1
    break
  fi
  sleep 1
done

if [ "$ready" != 1 ]; then
  echo "Portlight did not start. See $LOG" | tee -a "$LOG"
  sleep 6
  exit 1
fi

FIREFOX="$APP/runtime/firefox/firefox"
if [ ! -x "$FIREFOX" ]; then
  echo "Portlight's fullscreen runtime is missing at $FIREFOX" | tee -a "$LOG"
  sleep 8
  exit 1
fi

GPTK=""
for candidate in "$APP/runtime/gptokeyb" /usr/bin/gptokeyb /opt/inttools/gptokeyb; do
  if [ -x "$candidate" ]; then
    GPTK="$candidate"
    break
  fi
done
if [ -n "$GPTK" ]; then
  "$GPTK" "firefox" -c "$APP/arkos/portlight.gptk" >/dev/null 2>&1 &
  GPTK_PID=$!
fi

"$FIREFOX" --profile "$PROFILE" --no-remote --kiosk "http://127.0.0.1:8080/"
