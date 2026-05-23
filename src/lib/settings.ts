import { getPreferenceValues, showToast, Toast } from "@raycast/api";
import type { PatternId } from "./types";
import { listDisplays } from "./helper";

export function getConfiguredPatternId(): PatternId {
  const prefs = getPreferenceValues<Preferences>();
  return prefs.breathingPattern;
}

export function resolveDisplayIds(): string[] {
  const prefs = getPreferenceValues<Preferences>();
  const available = listDisplays();

  const override = prefs.displayIds?.trim();
  if (override) {
    const requested = override.split(",").map((id: string) => id.trim()).filter(Boolean);
    const valid = requested.filter((id: string) => available.some((d) => d.id === id));
    if (valid.length > 0) return valid;
  }

  if (prefs.displays === "all") {
    return available.map((d) => d.id);
  }

  const primary = available.find((d) => d.isPrimary) ?? available[0];
  return primary ? [primary.id] : [];
}

export async function ensureDisplayIds(): Promise<string[]> {
  const displayIds = resolveDisplayIds();
  if (displayIds.length === 0) {
    await showToast({
      style: Toast.Style.Failure,
      title: "No displays configured",
      message: "Set Displays in extension settings (or valid Display IDs)",
    });
    throw new Error("No displays configured");
  }
  return displayIds;
}
