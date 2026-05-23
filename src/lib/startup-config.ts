import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import type { HelperConfig } from "./types";

export const APP_SUPPORT_DIR = path.join(os.homedir(), "Library", "Application Support", "com.raycast.breathe");
export const LOGIN_CONFIG_FILE = path.join(APP_SUPPORT_DIR, "login-config.json");

export function writeLoginConfig(config: HelperConfig): void {
  fs.mkdirSync(APP_SUPPORT_DIR, { recursive: true });
  fs.writeFileSync(LOGIN_CONFIG_FILE, JSON.stringify(config, null, 2));
}

export function readLoginConfig(): HelperConfig | null {
  if (!fs.existsSync(LOGIN_CONFIG_FILE)) return null;
  try {
    return JSON.parse(fs.readFileSync(LOGIN_CONFIG_FILE, "utf8")) as HelperConfig;
  } catch {
    return null;
  }
}
