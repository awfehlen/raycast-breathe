/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Default Pattern - Pattern used when toggling without opening Start */
  "defaultPattern": "box" | "fourSevenEight" | "coherent" | "equal" | "custom",
  /** Custom inhale (seconds) - Inhale duration for the Custom pattern (minimum 1 second) */
  "customInhale": string,
  /** Custom hold after inhale (seconds) - Hold after inhale for the Custom pattern; use 0 to skip this phase */
  "customHoldIn": string,
  /** Custom exhale (seconds) - Exhale duration for the Custom pattern (minimum 1 second) */
  "customExhale": string,
  /** Custom hold after exhale (seconds) - Hold after exhale for the Custom pattern; use 0 to skip this phase */
  "customHoldOut": string,
  /** Ring opacity (0-100) - How visible the edge ring is; lower values are more subtle */
  "ringOpacity": string,
  /** Ring width (pixels) - Thickness of the colored edge band in pixels */
  "ringWidth": string,
  /** Default displays - Which displays to pre-select when starting */
  "defaultDisplays": "lastUsed" | "all" | "primaryOnly",
  /** Color fade smoothness (0.01-1) - Higher = slower, gentler color transitions */
  "fadeSmoothness": string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `start-breathing` command */
  export type StartBreathing = ExtensionPreferences & {}
  /** Preferences accessible in the `toggle-breathing` command */
  export type ToggleBreathing = ExtensionPreferences & {}
  /** Preferences accessible in the `stop-breathing` command */
  export type StopBreathing = ExtensionPreferences & {}
  /** Preferences accessible in the `install-login-start` command */
  export type InstallLoginStart = ExtensionPreferences & {}
  /** Preferences accessible in the `uninstall-login-start` command */
  export type UninstallLoginStart = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `start-breathing` command */
  export type StartBreathing = {}
  /** Arguments passed to the `toggle-breathing` command */
  export type ToggleBreathing = {}
  /** Arguments passed to the `stop-breathing` command */
  export type StopBreathing = {}
  /** Arguments passed to the `install-login-start` command */
  export type InstallLoginStart = {}
  /** Arguments passed to the `uninstall-login-start` command */
  export type UninstallLoginStart = {}
}

