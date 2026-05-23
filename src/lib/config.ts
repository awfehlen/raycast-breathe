import { getPreferenceValues } from "@raycast/api";
import type { BreathingPattern, HelperConfig } from "./types";
import { getPatternById } from "./patterns";
import type { PatternId } from "./types";

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function buildHelperConfig(pattern: BreathingPattern, displayIds: string[]): HelperConfig {
  const prefs = getPreferenceValues<Preferences>();
  const opacity = clamp(parseFloat(prefs.ringOpacity) / 100 || 0.32, 0.08, 0.85);
  const ringWidth = clamp(parseFloat(prefs.ringWidth) || 56, 16, 120);
  const fadeSmoothness = clamp(parseFloat(prefs.fadeSmoothness) || 0.08, 0.01, 1);

  return {
    pattern: { phases: pattern.phases },
    displayIds,
    opacity,
    ringWidth,
    fadeSmoothness,
  };
}

export function buildConfigFromPatternId(patternId: PatternId, displayIds: string[]): HelperConfig {
  return buildHelperConfig(getPatternById(patternId), displayIds);
}
