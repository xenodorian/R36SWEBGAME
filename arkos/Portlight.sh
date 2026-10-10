#!/bin/bash
# Portlight is the browser. Open this from the Ports menu.
# It starts the station on the device and shows it fullscreen.
# There is no address bar and no second browser.

ROOT="$(cd "$(dirname "$0")" && pwd)"
APP="$ROOT/portlight"
LOG="$ROOT/portlight.log"

if [ ! -f "$APP/package.json" ]; then
  echo "Portlight is missing its app folder at $APP" | tee "$LOG"
  sleep 6
  exit 1
fi

if command -v systemctl >/dev/null 2>&1; then
  sudo systemctl stop emulationstation >/dev/null 2>&1 || true
fi

cleanup() {
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

cd "$APP"
"$NODE" node_modules/vite/bin/vite.js dev --host 127.0.0.1 --port 8080 >"$LOG" 2>&1 &
SERVER_PID=$!

ready=0
for _ in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20; do
  if command -v curl >/dev/null 2>&1 && curl -sf -o /dev/null http://127.0.0.1:8080/; then
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

URL="http://127.0.0.1:8080/"
if [ -x "$APP/runtime/firefox/firefox" ]; then
  "$APP/runtime/firefox/firefox" --kiosk "$URL"
else
  echo "Portlight's fullscreen runtime is missing at $APP/runtime/firefox/firefox" | tee -a "$LOG"
  sleep 8
  exit 1
fi
