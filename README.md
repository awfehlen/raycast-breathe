# Breathe — Raycast Extension

Gentle guided breathing while you work. A faint color ring around the screen edge fades between **blue** (inhale), **purple** (hold), and **green** (exhale).

## Setup

1. **Node.js 18+** (Raycast CLI requires this; Node 14 will not work).

   If you use [nvm](https://github.com/nvm-sh/nvm), the project includes an `.nvmrc`:

   ```bash
   cd "/Users/aaron/Documents/Cursor Projects/Raycast breathe"
   nvm install    # installs Node 18 from .nvmrc
   nvm use
   ```

2. Install dependencies and start dev mode:

   ```bash
   npm install && npm run dev
   ```

3. Build the native overlay helper:

   ```bash
   npm run build-swift
   ```

4. Import the extension in Raycast:
   - Open Raycast → Extensions → `+` → Import Extension
   - Select this folder

5. **Development only** (optional — not needed for daily use):

   ```bash
   npm run dev
   ```

   After import, Raycast runs the extension from the imported folder. You do **not** need `npm run dev` open in a terminal unless you are actively editing code.

## Start at login (no `npm run dev`)

One-time setup:

1. Build the native helper once: `npm run build-swift` (the binary in `assets/` is what runs the overlay).
2. Start breathing once from Raycast so your pattern and displays are saved to `login-config.json`.
3. Enable login auto-start — either:
   - Raycast → **Enable Start at Login**, or
   - Terminal: `npm run login-agent:install`

This installs a macOS LaunchAgent that runs `assets/breathe-helper` when you log in. It does not use Node, npm, or Raycast dev mode.

To remove: **Disable Start at Login** or `npm run login-agent:uninstall`.

**Alternative (via Raycast):** Add Raycast to System Settings → General → Login Items, then use a Shortcuts automation or `open -g 'raycast://extensions/aaron/breathe/toggle-breathing'` after a short delay. That requires Raycast to be running first.

## Commands

| Command | Description |
|---------|-------------|
| **Start Breathing** | Pick a pattern, then choose which display(s) show the ring |
| **Toggle Breathing** | Start/stop using last pattern and displays |
| **Stop Breathing** | Stop the overlay |
| **Enable Start at Login** | Install LaunchAgent for login auto-start |
| **Disable Start at Login** | Remove LaunchAgent |

## Patterns

- **Box breath** — 4s in · 4s hold · 4s out · 4s hold
- **4-7-8 relax** — 4s in · 7s hold · 8s out
- **Coherent 5-5** — 5s in · 5s out
- **Equal 4-4** — 4s in · 4s out
- **Custom** — Set inhale / hold / exhale / hold in extension preferences

## Preferences

- Default pattern and display selection behavior
- Custom phase durations (seconds)
- Ring opacity (0–100) and width (pixels)
- Color fade smoothness

## Architecture

- **TypeScript** — Raycast commands, pattern config, helper lifecycle
- **Swift** (`assets/breathe-helper`) — Borderless click-through overlay windows per display

Logs: `~/Library/Application Support/com.raycast.breathe/breathe-helper.log`
