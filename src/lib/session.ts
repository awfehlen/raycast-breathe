import { LocalStorage } from "@raycast/api";
import type { PatternId, SessionState } from "./types";

const SESSION_KEY = "breathe-last-session";

export async function loadLastSession(): Promise<SessionState | null> {
  const raw = await LocalStorage.getItem<string>(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionState;
  } catch {
    return null;
  }
}

export async function saveLastSession(session: SessionState): Promise<void> {
  await LocalStorage.setItem(SESSION_KEY, JSON.stringify(session));
}
