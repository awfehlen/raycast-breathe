import AppKit

final class OverlayWindow: NSWindow {
    init(screen: NSScreen) {
        let frame = screen.frame
        super.init(
            contentRect: frame,
            styleMask: [.borderless],
            backing: .buffered,
            defer: false
        )
        self.setFrame(frame, display: true)
        self.isOpaque = false
        self.backgroundColor = .clear
        self.level = .statusBar
        self.collectionBehavior = [.canJoinAllSpaces, .fullScreenAuxiliary, .stationary, .ignoresCycle]
        self.ignoresMouseEvents = true
        self.hasShadow = false
        self.isReleasedWhenClosed = false

        if #available(macOS 13.0, *) {
            self.sharingType = .none
        }

        let ringView = EdgeRingView(frame: NSRect(origin: .zero, size: frame.size))
        ringView.autoresizingMask = [.width, .height]
        self.contentView = ringView
    }

    var ringView: EdgeRingView? {
        contentView as? EdgeRingView
    }
}

final class OverlayController {
    private var windows: [OverlayWindow] = []
    private let engine: BreathingEngine
    private let config: SessionConfig

    init(config: SessionConfig) {
        self.config = config
        self.engine = BreathingEngine(config: config)
    }

    func start() {
        let screens = DisplayEnumerator.screens(for: config.displayIds)
        windows = screens.map { screen in
            let window = OverlayWindow(screen: screen)
            window.orderFrontRegardless()
            return window
        }

        engine.onFrameUpdate = { [weak self] color, ringWidth in
            guard let self else { return }
            for window in self.windows {
                window.ringView?.update(
                    color: color,
                    opacity: self.config.opacity,
                    ringWidth: ringWidth
                )
            }
        }
        engine.start()
    }

    func stop() {
        engine.stop()
        for window in windows {
            window.orderOut(nil)
            window.close()
        }
        windows.removeAll()
    }
}
