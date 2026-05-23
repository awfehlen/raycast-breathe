import { environment, showToast, Toast } from "@raycast/api";
import { execFileSync } from "child_process";
import * as path from "path";

export default async function UninstallLoginStart() {
  const extensionRoot = path.dirname(environment.assetsPath);
  const script = path.join(extensionRoot, "scripts", "uninstall-login-agent.sh");

  try {
    execFileSync("bash", [script], { encoding: "utf8", timeout: 10000 });
    await showToast({
      style: Toast.Style.Success,
      title: "Login auto-start removed",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await showToast({
      style: Toast.Style.Failure,
      title: "Uninstall failed",
      message,
    });
  }
}
