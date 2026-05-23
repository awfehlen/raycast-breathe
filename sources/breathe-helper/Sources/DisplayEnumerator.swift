import AppKit
import Foundation

struct DisplayInfo: Codable {
    let id: String
    let name: String
    let width: Int
    let height: Int
    let isPrimary: Bool
}

enum DisplayEnumerator {
    static func listDisplays() -> [DisplayInfo] {
        let screens = NSScreen.screens
        let mainScreen = NSScreen.main

        return screens.map { screen in
            let frame = screen.frame
            let id = screen.displayId
            let name = screen.displayName
            let isPrimary = mainScreen.map { $0 === screen } ?? false
            return DisplayInfo(
                id: id,
                name: name,
                width: Int(frame.width),
                height: Int(frame.height),
                isPrimary: isPrimary
            )
        }
    }

    static func screens(for displayIds: [String]) -> [NSScreen] {
        let idSet = Set(displayIds)
        let matched = NSScreen.screens.filter { idSet.contains($0.displayId) }
        return matched.isEmpty ? (NSScreen.main.map { [$0] } ?? []) : matched
    }
}

extension NSScreen {
    var displayId: String {
        guard let screenNumber = deviceDescription[NSDeviceDescriptionKey("NSScreenNumber")] as? NSNumber else {
            return UUID().uuidString
        }
        return String(screenNumber.uint32Value)
    }

    var displayName: String {
        let size = "\(Int(frame.width))×\(Int(frame.height))"
        let isPrimary = NSScreen.screens.first.map { $0.frame == self.frame } ?? false
        return isPrimary ? "Primary (\(size))" : "Display (\(size))"
    }
}
