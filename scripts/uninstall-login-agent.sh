#!/usr/bin/env bash
set -euo pipefail

PLIST_LABEL="com.raycast.breathe.login"
PLIST_PATH="$HOME/Library/LaunchAgents/${PLIST_LABEL}.plist"

launchctl bootout "gui/$(id -u)/${PLIST_LABEL}" 2>/dev/null || true
rm -f "$PLIST_PATH"

echo "Removed login auto-start (${PLIST_LABEL})"
