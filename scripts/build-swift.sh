#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/sources/breathe-helper"
ASSETS="$ROOT/assets"
BINARY="$ASSETS/breathe-helper"

mkdir -p "$ASSETS"

cd "$SRC"
swift build -c release

BIN_PATH="$(swift build -c release --show-bin-path)/breathe-helper"
cp "$BIN_PATH" "$BINARY"

# Universal binary when on Apple Silicon with x86_64 SDK available
if [[ "$(uname -m)" == "arm64" ]]; then
  if xcrun --sdk macosx swift -version &>/dev/null; then
    echo "Building x86_64 slice..."
    swift build -c release --arch x86_64 2>/dev/null || true
    X86_BIN="$(swift build -c release --arch x86_64 --show-bin-path 2>/dev/null)/breathe-helper"
    if [[ -f "$X86_BIN" ]]; then
      lipo -create -output "$BINARY" "$BIN_PATH" "$X86_BIN"
      echo "Created universal binary at $BINARY"
    fi
  fi
fi

chmod +x "$BINARY"
echo "Built: $BINARY"
file "$BINARY"
