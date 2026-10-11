#!/bin/bash
# GitROMs launcher for ArkOS Ports menu
# On first run it installs python3-pygame and python3-requests if missing.

DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR" || exit 1

LOG="$DIR/gitroms.log"
say() { echo "$*" | tee -a "$LOG"; }

# Prefer python3
PYTHON=python3
command -v python3 >/dev/null 2>&1 || PYTHON=python

need_install=0
"$PYTHON" -c "import pygame" 2>/dev/null || need_install=1
"$PYTHON" -c "import requests" 2>/dev/null || need_install=1

if [ "$need_install" = 1 ]; then
  say "GitROMs: missing dependencies – installing (needs Wi-Fi once)…"
  # Show something on the framebuffer if possible
  echo "GitROMs: installing pygame + requests…" > /dev/tty1 2>/dev/null || true

  if command -v apt-get >/dev/null 2>&1; then
    # Fix EOL Ubuntu sources if needed (common on older ArkOS)
    if ! sudo apt-get update >>"$LOG" 2>&1; then
      sudo sed -i -E 's#https?://(ports|archive|security)\.ubuntu\.com#http://old-releases.ubuntu.com#g' /etc/apt/sources.list 2>/dev/null || true
      sudo apt-get update >>"$LOG" 2>&1 || true
    fi
    sudo DEBIAN_FRONTEND=noninteractive apt-get install -y python3-pygame python3-requests >>"$LOG" 2>&1 \
      || sudo DEBIAN_FRONTEND=noninteractive apt-get install -y python3-pygame python3-pip >>"$LOG" 2>&1 || true
  fi

  # Fallback to pip if still missing
  "$PYTHON" -c "import pygame" 2>/dev/null || {
    say "Trying pip install pygame…"
    "$PYTHON" -m pip install --user pygame >>"$LOG" 2>&1 || true
  }
  "$PYTHON" -c "import requests" 2>/dev/null || {
    say "Trying pip install requests…"
    "$PYTHON" -m pip install --user requests >>"$LOG" 2>&1 || true
  }
fi

# Final check
if ! "$PYTHON" -c "import pygame, requests" 2>/dev/null; then
  say "ERROR: pygame or requests still missing. See $LOG"
  echo "GitROMs: dependency install failed. Check Wi-Fi and gitroms.log" > /dev/tty1 2>/dev/null || true
  sleep 6
  exit 1
fi

# Optional: load gamecontroller db if present (helps some pads)
if [ -f /opt/inttools/gamecontrollerdb.txt ]; then
  export SDL_GAMECONTROLLERCONFIG="$(cat /opt/inttools/gamecontrollerdb.txt)"
fi

exec "$PYTHON" -u main.py >>"$LOG" 2>&1
