import AppKit
import Foundation

let appSupportDir: URL = {
    let home = FileManager.default.homeDirectoryForCurrentUser
    return home.appendingPathComponent("Library/Application Support/com.raycast.breathe", isDirectory: true)
}()

let pidFileURL = appSupportDir.appendingPathComponent("breathe-helper.pid")

private var overlayController: OverlayController?

func writePID() {
    try? FileManager.default.createDirectory(at: appSupportDir, withIntermediateDirectories: true)
    let pid = String(ProcessInfo.processInfo.processIdentifier)
    try? pid.write(to: pidFileURL, atomically: true, encoding: .utf8)
}

func removePID() {
    try? FileManager.default.removeItem(at: pidFileURL)
}

func shutdownOverlay() {
    overlayController?.stop()
    overlayController = nil
    removePID()
    NSApp.terminate(nil)
}

func listDisplaysJSON() {
    let displays = DisplayEnumerator.listDisplays()
    let encoder = JSONEncoder()
    if let data = try? encoder.encode(displays), let json = String(data: data, encoding: .utf8) {
        print(json)
    } else {
        print("[]")
    }
}

func runOverlay(configPath: String) {
    guard let data = FileManager.default.contents(atPath: configPath) else {
        fputs("error: config not found\n", stderr)
        exit(1)
    }

    let decoder = JSONDecoder()
    guard let config = try? decoder.decode(SessionConfig.self, from: data) else {
        fputs("error: invalid config\n", stderr)
        exit(1)
    }

    let app = NSApplication.shared
    app.setActivationPolicy(.accessory)

    writePID()

    overlayController = OverlayController(config: config)
    overlayController?.start()

    signal(SIGTERM) { _ in
        DispatchQueue.main.async { shutdownOverlay() }
    }
    signal(SIGINT) { _ in
        DispatchQueue.main.async { shutdownOverlay() }
    }

    atexit {
        removePID()
    }

    NSApp.run()
}

let args = CommandLine.arguments

if args.contains("--list-displays") {
    listDisplaysJSON()
    exit(0)
}

if let configIndex = args.firstIndex(of: "--config"), configIndex + 1 < args.count {
    runOverlay(configPath: args[configIndex + 1])
} else {
    fputs("usage: breathe-helper --list-displays\n", stderr)
    fputs("       breathe-helper --config <path.json>\n", stderr)
    exit(1)
}
