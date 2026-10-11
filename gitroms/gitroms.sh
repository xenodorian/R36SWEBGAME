#!/bin/bash
# GitROMs launcher for ArkOS Ports menu

DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR" || exit 1

LOG="$DIR/gitroms.log"
echo "===== GitROMs start $(date) =====" > "$LOG"

say() {
  echo "$*" | tee -a "$LOG"
  echo "$*" > /dev/tty1 2>/dev/null || true
}

# Prefer python3
PYTHON=python3
command -v python3 >/dev/null 2>&1 || PYTHON=python
say "Using: $PYTHON ($($PYTHON --version 2>&1))"

need_install=0
"$PYTHON" -c "import pygame" 2>>"$LOG" || need_install=1
"$PYTHON" -c "import urllib.request" 2>>"$LOG" || true
# requests is optional — we use urllib in github_client, but keep trying for requests

if [ "$need_install" = 1 ]; then
  say "Missing pygame — installing (needs Wi-Fi)…"

  if command -v apt-get >/dev/null 2>&1; then
    say "apt-get update…"
    if ! sudo apt-get update >>"$LOG" 2>&1; then
      say "apt update failed, trying old-releases mirrors…"
      sudo sed -i -E 's#https?://(ports|archive|security)\.ubuntu\.com#http://old-releases.ubuntu.com#g' /etc/apt/sources.list 2>/dev/null || true
      sudo apt-get update >>"$LOG" 2>&1 || true
    fi
    say "apt-get install python3-pygame…"
    sudo DEBIAN_FRONTEND=noninteractive apt-get install -y python3-pygame >>"$LOG" 2>&1 || true
    sudo DEBIAN_FRONTEND=noninteractive apt-get install -y python3-pip >>"$LOG" 2>&1 || true
  fi

  if ! "$PYTHON" -c "import pygame" 2>>"$LOG"; then
    say "Trying pip install pygame…"
    "$PYTHON" -m pip install --user pygame >>"$LOG" 2>&1 \
      || "$PYTHON" -m pip install --user --break-system-packages pygame >>"$LOG" 2>&1 \
      || sudo "$PYTHON" -m pip install pygame >>"$LOG" 2>&1 \
      || true
  fi
fi

if ! "$PYTHON" -c "import pygame" 2>>"$LOG"; then
  say "ERROR: pygame still missing."
  say "See log: $LOG"
  say "Connect Wi-Fi and try again."
  sleep 12
  exit 1
fi

say "pygame OK — starting GitROMs…"

# ArkOS / handheld display setup
export HOME="${HOME:-/home/ark}"
export XDG_RUNTIME_DIR="${XDG_RUNTIME_DIR:-/run/user/0}"

# Try common SDL video drivers for R36S / ArkOS
if [ -z "$SDL_VIDEODRIVER" ]; then
  # kmsdrm is preferred on modern ArkOS; fall back handled by SDL
  export SDL_VIDEODRIVER=kmsdrm
fi
export SDL_RENDER_DRIVER="${SDL_RENDER_DRIVER:-software}"

if [ -f /opt/inttools/gamecontrollerdb.txt ]; then
  export SDL_GAMECONTROLLERCONFIG="$(cat /opt/inttools/gamecontrollerdb.txt)"
fi

# Run app; capture crash
"$PYTHON" -u main.py >>"$LOG" 2>&1
RC=$?

if [ $RC -ne 0 ]; then
  say "GitROMs exited with code $RC"
  # Retry once with different video driver
  say "Retrying with SDL_VIDEODRIVER=fbcon…"
  export SDL_VIDEODRIVER=fbcon
  "$PYTHON" -u main.py >>"$LOG" 2>&1
  RC=$?
fi

if [ $RC -ne 0 ]; then
  say "Retrying with SDL_VIDEODRIVER=x11…"
  export SDL_VIDEODRIVER=x11
  export DISPLAY="${DISPLAY:-:0}"
  "$PYTHON" -u main.py >>"$LOG" 2>&1
  RC=$?
fi

if [ $RC -ne 0 ]; then
  say "Failed. Last log lines:"
  tail -n 15 "$LOG" > /dev/tty1 2>/dev/null || true
  tail -n 15 "$LOG"
  sleep 15
fi

exit $RC
