/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Breathing pattern - Guided breathing rhythm used when you start or toggle */
  "breathingPattern": "box" | "fourSevenEight" | "coherent" | "equal" | "custom",
  /** Custom inhale (seconds) - Inhale duration for the Custom pattern (minimum 1 second) */
  "customInhale": string,
  /** Custom hold after inhale (seconds) - Hold after inhale for the Custom pattern; use 0 to skip this phase */
  "customHoldIn": string,
  /** Custom exhale (seconds) - Exhale duration for the Custom pattern (minimum 1 second) */
  "customExhale": string,
  /** Custom hold after exhale (seconds) - Hold after exhale for the Custom pattern; use 0 to skip this phase */
  "customHoldOut": string,
  /** Displays - Which monitors show the ring. Use Display IDs for a custom set. */
  "displays": "all" | "primaryOnly",
  /** Display IDs (optional) - Override Displays: comma-separated IDs (e.g. 1,2). Run breathe-helper --list-displays in assets for IDs. */
  "displayIds": string,
  /** Ring opacity (0-100) - Peak brightness at the screen edge; lower values stay more subtle */
  "ringOpacity": string,
  /** Ring fade depth (pixels) - How far the soft gradient extends inward from each edge */
  "ringWidth": string,
  /** Color fade smoothness (0.01-1) - Higher = slower, gentler color transitions */
  "fadeSmoothness": string,
  /** Animate ring with breath - Ring thickens on inhale and thins on exhale; holds stay at min or max */
  "animateRingThickness": boolean,
  /** Animate colors with breath - Shift ring color by phase (blue in, purple out, light blue hold) */
  "animateColors": boolean,
  /** Static ring color - Used when Animate colors is off */
  "staticRingColor": "blue" | "lightBlue" | "purple"
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
}

declare namespace Arguments {
  /** Arguments passed to the `start-breathing` command */
  export type StartBreathing = {}
  /** Arguments passed to the `toggle-breathing` command */
  export type ToggleBreathing = {}
  /** Arguments passed to the `stop-breathing` command */
  export type StopBreathing = {}
}

