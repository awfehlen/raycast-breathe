export type PhaseType = "inhale" | "hold" | "exhale";

export type BreathingPhase = {
  type: PhaseType;
  duration: number;
};

export type PatternId = "box" | "fourSevenEight" | "coherent" | "equal" | "custom";

export type BreathingPattern = {
  id: PatternId;
  name: string;
  phases: BreathingPhase[];
};

export type DisplayInfo = {
  id: string;
  name: string;
  width: number;
  height: number;
  isPrimary: boolean;
};

export type HelperConfig = {
  pattern: { phases: BreathingPhase[] };
  displayIds: string[];
  opacity: number;
  ringWidth: number;
  fadeSmoothness: number;
};

export type SessionState = {
  patternId: PatternId;
  displayIds: string[];
};
