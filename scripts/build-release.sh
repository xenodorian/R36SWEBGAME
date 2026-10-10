#!/bin/bash
# Builds Portlight-R36S.zip: the Windows installer plus everything the handheld needs.
# Run from the repo root after `npm ci`. Output: dist-release/Portlight-R36S.zip
set -euo pipefail
NODE_VERSION=22.21.0
OUT=dist-release/Portlight-R36S
rm -rf dist-release && mkdir -p "$OUT/payload/node"

PATH="$PWD/node_modules/.bin:$PATH" PORTLIGHT_DEVICE=1 node scripts/with-app-env.mjs vite build
rm -rf arkos/app && mkdir -p arkos/app && cp -r .output/. arkos/app/

cp -r arkos/app "$OUT/payload/app"
cp -r arkos/display "$OUT/payload/display" && find "$OUT/payload/display" -name __pycache__ -prune -exec rm -rf {} +
cp arkos/Portlight.sh "$OUT/payload/Portlight.sh"

tmp=$(mktemp -d)
( cd "$tmp" && npm pack "node-linux-arm64@$NODE_VERSION" >/dev/null && tar -xzf node-linux-arm64-*.tgz )
cp "$tmp/package/bin/node" "$OUT/payload/node/node"
( cd "$OUT/payload/node" && sha256sum node > node.sha256 )
rm -rf "$tmp"

cp install.bat install.ps1 README.md NOTICE.md "$OUT/"
( cd dist-release && zip -qr -9 Portlight-R36S.zip Portlight-R36S )
ls -la dist-release/Portlight-R36S.zip
