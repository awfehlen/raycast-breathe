import { startFromPreferences } from "./lib/start-session";

export default async function StartBreathing() {
  await startFromPreferences();
}
