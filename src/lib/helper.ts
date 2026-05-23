import { environment, showToast, Toast } from "@raycast/api";
import { execFileSync, spawn } from "child_process";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import type { DisplayInfo, HelperConfig } from "./types";

export const APP_SUPPORT_DIR = path.join(os.homedir(), "Library", "Application Support", "com.raycast.breathe");
const PID_FILE = path.join(APP_SUPPORT_DIR, "breathe-helper.pid");
const LOG_FILE = path.join(APP_SUPPORT_DIR, "breathe-helper.log");

function getHelperPath(): string {
  return path.join(environment.assetsPath, "breathe-helper");
}

function ensureAppSupport(): void {
  fs.mkdirSync(APP_SUPPORT_DIR, { recursive: true });
}

export function isHelperRunning(): boolean {
  if (!fs.existsSync(PID_FILE)) return false;
  try {
    const pid = parseInt(fs.readFileSync(PID_FILE, "utf8").trim(), 10);
    if (!Number.isFinite(pid)) return false;
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

export function listDisplays(): DisplayInfo[] {
  const helper = getHelperPath();
  if (!fs.existsSync(helper)) {
    throw new Error("breathe-helper binary not found. Run npm run build-swift.");
  }
  const output = execFileSync(helper, ["--list-displays"], { encoding: "utf8", timeout: 5000 });
  const parsed = JSON.parse(output) as DisplayInfo[];
  return parsed;
}

export async function startHelper(config: HelperConfig): Promise<void> {
  ensureAppSupport();

  if (isHelperRunning()) {
    await showToast({ style: Toast.Style.Animated, title: "Already running", message: "Stop first or use Toggle" });
    return;
  }

  const helper = getHelperPath();
  if (!fs.existsSync(helper)) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Helper missing",
      message: "Run npm run build-swift in the extension folder",
    });
    throw new Error("breathe-helper not found");
  }

  const configPath = path.join(os.tmpdir(), `breathe-config-${Date.now()}.json`);
  fs.writeFileSync(configPath, JSON.stringify(config));

  const logStream = fs.openSync(LOG_FILE, "a");
  const child = spawn(helper, ["--config", configPath], {
    detached: true,
    stdio: ["ignore", logStream, logStream],
  });
  child.unref();

  await new Promise((resolve) => setTimeout(resolve, 400));

  if (!isHelperRunning()) {
    let logTail = "";
    try {
      const log = fs.readFileSync(LOG_FILE, "utf8");
      logTail = log.slice(-500);
    } catch {
      /* ignore */
    }
    await showToast({
      style: Toast.Style.Failure,
      title: "Failed to start overlay",
      message: logTail || "Check breathe-helper.log",
    });
    throw new Error("Helper failed to start");
  }

  await showToast({ style: Toast.Style.Success, title: "Breathing started" });
}

export async function stopHelper(): Promise<boolean> {
  if (!isHelperRunning()) {
    await showToast({ style: Toast.Style.Animated, title: "Not running" });
    return false;
  }

  try {
    const pid = parseInt(fs.readFileSync(PID_FILE, "utf8").trim(), 10);
    process.kill(pid, "SIGTERM");
  } catch {
    /* process may have exited */
  }

  for (let i = 0; i < 20; i++) {
    if (!isHelperRunning()) break;
    await new Promise((r) => setTimeout(r, 100));
  }

  try {
    if (fs.existsSync(PID_FILE)) fs.unlinkSync(PID_FILE);
  } catch {
    /* ignore */
  }

  await showToast({ style: Toast.Style.Success, title: "Breathing stopped" });
  return true;
}
