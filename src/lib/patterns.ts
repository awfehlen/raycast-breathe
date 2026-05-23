import { getPreferenceValues } from "@raycast/api";
import type { BreathingPattern, PatternId } from "./types";

function parseSeconds(value: string, fallback: number): number {
  const n = parseFloat(value);
  if (!Number.isFinite(n) || n < 1) return fallback;
  return n;
}

export function getCustomPattern(): BreathingPattern {
  const prefs = getPreferenceValues<Preferences>();
  const inhale = parseSeconds(prefs.customInhale, 4);
  const holdIn = parseSeconds(prefs.customHoldIn, 4);
  const exhale = parseSeconds(prefs.customExhale, 4);
  const holdOut = parseSeconds(prefs.customHoldOut, 4);

  const phases: BreathingPattern["phases"] = [{ type: "inhale", duration: inhale }];
  if (holdIn > 0) phases.push({ type: "hold", duration: holdIn });
  phases.push({ type: "exhale", duration: exhale });
  if (holdOut > 0) phases.push({ type: "hold", duration: holdOut });

  return {
    id: "custom",
    name: "Custom",
    phases,
  };
}

export const PREDEFINED_PATTERNS: BreathingPattern[] = [
  {
    id: "box",
    name: "Box breath",
    phases: [
      { type: "inhale", duration: 4 },
      { type: "hold", duration: 4 },
      { type: "exhale", duration: 4 },
      { type: "hold", duration: 4 },
    ],
  },
  {
    id: "fourSevenEight",
    name: "4-7-8 relax",
    phases: [
      { type: "inhale", duration: 4 },
      { type: "hold", duration: 7 },
      { type: "exhale", duration: 8 },
    ],
  },
  {
    id: "coherent",
    name: "Coherent 5-5",
    phases: [
      { type: "inhale", duration: 5 },
      { type: "exhale", duration: 5 },
    ],
  },
  {
    id: "equal",
    name: "Equal 4-4",
    phases: [
      { type: "inhale", duration: 4 },
      { type: "exhale", duration: 4 },
    ],
  },
];

export function getPatternById(id: PatternId): BreathingPattern {
  if (id === "custom") return getCustomPattern();
  const found = PREDEFINED_PATTERNS.find((p) => p.id === id);
  return found ?? PREDEFINED_PATTERNS[0];
}

export function getAllPatterns(): BreathingPattern[] {
  return [...PREDEFINED_PATTERNS, getCustomPattern()];
}

export function formatPatternSubtitle(pattern: BreathingPattern): string {
  return pattern.phases
    .map((p) => {
      const label = p.type === "inhale" ? "in" : p.type === "exhale" ? "out" : "hold";
      return `${p.duration}s ${label}`;
    })
    .join(" · ");
}
