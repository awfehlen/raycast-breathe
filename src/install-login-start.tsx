import { environment, showToast, Toast } from "@raycast/api";
import { execFileSync } from "child_process";
import * as path from "path";
import { readLoginConfig } from "./lib/startup-config";

export default async function InstallLoginStart() {
  const config = readLoginConfig();
  if (!config) {
    await showToast({
      style: Toast.Style.Failure,
      title: "No saved session",
      message: "Run Start or Toggle Breathing once, then try again",
    });
    return;
  }

  const extensionRoot = path.dirname(environment.assetsPath);
  const script = path.join(extensionRoot, "scripts", "install-login-agent.sh");

  try {
    execFileSync("bash", [script], { encoding: "utf8", timeout: 10000 });
    await showToast({
      style: Toast.Style.Success,
      title: "Login auto-start enabled",
      message: "Breathing will start when you log in to macOS",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await showToast({
      style: Toast.Style.Failure,
      title: "Install failed",
      message,
    });
  }
}
