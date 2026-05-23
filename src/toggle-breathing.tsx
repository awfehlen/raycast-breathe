import { getPreferenceValues } from "@raycast/api";
import { buildConfigFromPatternId } from "./lib/config";
import { isHelperRunning, startHelper, stopHelper } from "./lib/helper";
import { loadLastSession } from "./lib/session";
import { listDisplays } from "./lib/helper";
import type { PatternId } from "./lib/types";

export default async function ToggleBreathing() {
  if (isHelperRunning()) {
    await stopHelper();
    return;
  }

  const prefs = getPreferenceValues<Preferences>();
  const last = await loadLastSession();
  const patternId: PatternId = last?.patternId ?? prefs.defaultPattern;

  let displayIds = last?.displayIds ?? [];
  const available = listDisplays().map((d) => d.id);
  displayIds = displayIds.filter((id) => available.includes(id));

  if (displayIds.length === 0) {
    if (prefs.defaultDisplays === "all") {
      displayIds = available;
    } else {
      const displays = listDisplays();
      const primary = displays.find((d) => d.isPrimary) ?? displays[0];
      displayIds = primary ? [primary.id] : available;
    }
  }

  const config = buildConfigFromPatternId(patternId, displayIds);
  const { saveLastSession } = await import("./lib/session");
  await saveLastSession({ patternId, displayIds });
  await startHelper(config);
}
