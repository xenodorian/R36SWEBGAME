#!/bin/bash
# GitROMs launcher for ArkOS Ports menu

DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR" || exit 1

export SDL_GAMECONTROLLERCONFIG="$(cat /opt/inttools/gamecontrollerdb.txt 2>/dev/null)"

# Prefer python3
PYTHON=python3
command -v python3 >/dev/null || PYTHON=python

exec "$PYTHON" main.py
