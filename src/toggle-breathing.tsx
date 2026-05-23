import { isHelperRunning, stopHelper } from "./lib/helper";
import { startFromPreferences } from "./lib/start-session";

export default async function ToggleBreathing() {
  if (isHelperRunning()) {
    await stopHelper();
    return;
  }
  await startFromPreferences();
}
