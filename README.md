# Breathe — Raycast Extension

Gentle guided breathing while you work. A faint color ring around the screen edge fades between **blue** (inhale), **purple** (exhale), and **light blue** (hold).

## Setup

1. **Node.js 18+** (Raycast CLI requires this).

   ```bash
   cd "/Users/aaron/Documents/Cursor Projects/Raycast breathe"
   nvm use    # if using nvm (.nvmrc included)
   npm install
   npm run build-swift
   ```

2. Import the extension in Raycast → Extensions → `+` → Import Extension → select this folder.

3. Open **Extension Settings** (gear on the Breathe extension) and set your **breathing pattern**, **displays**, ring opacity, and fade depth.

4. For development only: `npm run dev` (not required for daily use after import).

## Extension icon

Raycast loads the icon from [`assets/icon.png`](assets/icon.png) (512×512 PNG). To use your own:

1. Create or export a **512×512** PNG.
2. Replace `assets/icon.png` (and optionally `extension-icon.png` at the project root).
3. Reload the extension (`npm run dev` or re-import in Raycast).

You can also drop an image into the Cursor chat and ask to use it as the extension icon.

## Commands

| Command | Description |
|---------|-------------|
| **Start Breathing** | Starts immediately using extension settings |
| **Toggle Breathing** | Start or stop using the same settings |
| **Stop Breathing** | Stop the overlay |

## Extension settings

Configure in Raycast → Extensions → Breathe → Settings:

- **Breathing pattern** — Box, 4-7-8, Coherent, Equal, or Custom (with custom phase seconds)
- **Displays** — All displays or primary only
- **Display IDs** — Optional override: comma-separated IDs (e.g. `1,2`) for specific monitors. List IDs with:
  ```bash
  ./assets/breathe-helper --list-displays
  ```
- **Animate ring with breath** — Ring thickens on inhale and thins on exhale (cosine ease); holds stay thick or thin
- **Animate colors with breath** — Blue inhale, purple exhale, light blue hold
- **Static ring color** — Blue, light blue, or purple when color animation is off
- **Ring opacity** and **fade depth** (max thickness when ring animation is on; min is ~40% of max)
- **Color fade smoothness** (when color animation is on)

## Patterns

- **Box breath** — 4s in · 4s hold · 4s out · 4s hold
- **4-7-8 relax** — 4s in · 7s hold · 8s out
- **Coherent 5-5** — 5s in · 5s out
- **Equal 4-4** — 4s in · 4s out
- **Custom** — Set inhale / hold / exhale / hold in settings

Logs: `~/Library/Application Support/com.raycast.breathe/breathe-helper.log`
