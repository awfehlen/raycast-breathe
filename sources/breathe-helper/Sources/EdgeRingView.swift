import AppKit
import QuartzCore

final class EdgeRingView: NSView {
    var ringColor: NSColor = NSColor(red: 0.35, green: 0.55, blue: 1.0, alpha: 1)
    var ringWidth: CGFloat = 60
    var opacity: CGFloat = 0.23

    private let topGradient = CAGradientLayer()
    private let bottomGradient = CAGradientLayer()
    private let leftGradient = CAGradientLayer()
    private let rightGradient = CAGradientLayer()

    override var isOpaque: Bool { false }

    override init(frame frameRect: NSRect) {
        super.init(frame: frameRect)
        setupLayers()
    }

    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupLayers()
    }

    private func setupLayers() {
        wantsLayer = true
        layer?.backgroundColor = .clear

        for gradient in [topGradient, bottomGradient, leftGradient, rightGradient] {
            gradient.type = .axial
            gradient.actions = [
                "colors": NSNull(),
                "locations": NSNull(),
                "bounds": NSNull(),
                "position": NSNull(),
                "frame": NSNull(),
                "bounds.size": NSNull(),
                "bounds.origin": NSNull(),
            ]
            gradient.compositingFilter = "plusL"
            layer?.addSublayer(gradient)
        }

        topGradient.startPoint = CGPoint(x: 0.5, y: 1)
        topGradient.endPoint = CGPoint(x: 0.5, y: 0)

        bottomGradient.startPoint = CGPoint(x: 0.5, y: 0)
        bottomGradient.endPoint = CGPoint(x: 0.5, y: 1)

        leftGradient.startPoint = CGPoint(x: 0, y: 0.5)
        leftGradient.endPoint = CGPoint(x: 1, y: 0.5)

        rightGradient.startPoint = CGPoint(x: 1, y: 0.5)
        rightGradient.endPoint = CGPoint(x: 0, y: 0.5)
    }

    override func layout() {
        super.layout()
        let thickness = max(ringWidth, 8)
        let b = bounds

        topGradient.frame = CGRect(x: 0, y: b.height - thickness, width: b.width, height: thickness)
        bottomGradient.frame = CGRect(x: 0, y: 0, width: b.width, height: thickness)
        leftGradient.frame = CGRect(x: 0, y: 0, width: thickness, height: b.height)
        rightGradient.frame = CGRect(x: b.width - thickness, y: 0, width: thickness, height: b.height)
    }

    private func gradientColors() -> [CGColor] {
        let peak = min(opacity * 1.15, 0.85)
        let mid = opacity * 0.62
        let color = ringColor
        return [
            color.withAlphaComponent(peak).cgColor,
            color.withAlphaComponent(mid).cgColor,
            NSColor.clear.cgColor,
        ]
    }

    private let gradientLocations: [NSNumber] = [0, 0.48, 1]

    private func applyGradientColors() {
        let colors = gradientColors()
        for gradient in [topGradient, bottomGradient, leftGradient, rightGradient] {
            gradient.colors = colors
            gradient.locations = gradientLocations
        }
    }

    override func draw(_ dirtyRect: NSRect) {
        // Rendering is layer-backed; nothing to draw in draw(_:).
    }

    func update(color: RGBColor, opacity: Double, ringWidth: Double) {
        ringColor = NSColor(
            red: CGFloat(color.r),
            green: CGFloat(color.g),
            blue: CGFloat(color.b),
            alpha: 1
        )
        self.opacity = CGFloat(opacity)
        self.ringWidth = CGFloat(ringWidth)
        applyGradientColors()
        needsLayout = true
    }
}
