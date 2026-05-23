// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "breathe-helper",
    platforms: [.macOS(.v13)],
    targets: [
        .executableTarget(
            name: "breathe-helper",
            path: "Sources"
        ),
    ]
)
