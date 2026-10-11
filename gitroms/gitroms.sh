#!/bin/bash
# GitROMs — self-contained launcher for ArkOS / R36S

DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR" || exit 1

LOG="$DIR/gitroms.log"
echo "===== GitROMs start $(date) =====" > "$LOG"

say() {
  echo "$*" | tee -a "$LOG"
  echo "$*" > /dev/tty1 2>/dev/null || true
}

PYTHON=python3
command -v python3 >/dev/null 2>&1 || PYTHON=python
say "Python: $($PYTHON --version 2>&1)"

# Install pygame from bundled wheel if missing
if ! "$PYTHON" -c "import pygame" 2>>"$LOG"; then
  say "pygame missing — installing from local wheel…"
  PYVER=$("$PYTHON" -c "import sys; print('cp%d%d' % (sys.version_info[0], sys.version_info[1]))")
  say "Looking for wheel matching $PYVER aarch64"
  WHEEL=$(ls -1 "$DIR/wheels"/pygame-*-${PYVER}-*aarch64*.whl 2>/dev/null | head -n1)
  if [ -z "$WHEEL" ]; then
    WHEEL=$(ls -1 "$DIR/wheels"/pygame-*aarch64*.whl 2>/dev/null | head -n1)
  fi
  if [ -z "$WHEEL" ]; then
    say "ERROR: no pygame wheel in $DIR/wheels for $PYVER"
    sleep 10
    exit 1
  fi
  say "Installing $(basename "$WHEEL")…"
  "$PYTHON" -m pip install --user "$WHEEL" >>"$LOG" 2>&1 \
    || "$PYTHON" -m pip install --user --break-system-packages "$WHEEL" >>"$LOG" 2>&1 \
    || sudo "$PYTHON" -m pip install "$WHEEL" >>"$LOG" 2>&1 \
    || true
fi

if ! "$PYTHON" -c "import pygame" 2>>"$LOG"; then
  say "ERROR: pygame still not importable. See $LOG"
  tail -n 20 "$LOG" > /dev/tty1 2>/dev/null || true
  sleep 12
  exit 1
fi

say "Starting GitROMs…"

export HOME="${HOME:-/home/ark}"
# Do NOT load full gamecontrollerdb into env — causes "Argument list too long"

for DRIVER in kmsdrm fbcon x11; do
  say "Trying SDL_VIDEODRIVER=$DRIVER"
  export SDL_VIDEODRIVER="$DRIVER"
  if [ "$DRIVER" = "x11" ]; then
    export DISPLAY="${DISPLAY:-:0}"
  fi
  "$PYTHON" -u main.py >>"$LOG" 2>&1
  RC=$?
  if [ $RC -eq 0 ]; then
    exit 0
  fi
  say "Exit code $RC with $DRIVER"
done

say "All video drivers failed. Last log:"
tail -n 20 "$LOG" > /dev/tty1 2>/dev/null || true
tail -n 20 "$LOG"
sleep 12
exit 1
