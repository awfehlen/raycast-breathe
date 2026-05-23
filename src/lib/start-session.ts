import { buildConfigFromPatternId } from "./config";
import { startHelper } from "./helper";
import { getConfiguredPatternId, ensureDisplayIds } from "./settings";

export async function startFromPreferences(): Promise<void> {
  const patternId = getConfiguredPatternId();
  const displayIds = await ensureDisplayIds();
  const config = buildConfigFromPatternId(patternId, displayIds);
  await startHelper(config);
}
