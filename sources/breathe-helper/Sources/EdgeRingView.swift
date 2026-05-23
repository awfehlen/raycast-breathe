import AppKit

final class EdgeRingView: NSView {
    var ringColor: NSColor = NSColor(red: 0.35, green: 0.55, blue: 1.0, alpha: 0.2)
    var ringWidth: CGFloat = 10
    var opacity: CGFloat = 0.2

    override var isOpaque: Bool { false }

    override func draw(_ dirtyRect: NSRect) {
        super.draw(dirtyRect)
        guard let ctx = NSGraphicsContext.current?.cgContext else { return }

        let bounds = self.bounds
        let inset = ringWidth
        let outer = bounds
        let inner = bounds.insetBy(dx: inset, dy: inset)

        ctx.saveGState()
        ctx.setBlendMode(.normal)
        ctx.setFillColor(ringColor.withAlphaComponent(opacity).cgColor)

        let path = CGMutablePath()
        path.addRect(outer)
        path.addRect(inner)
        ctx.addPath(path)
        ctx.fillPath(using: .evenOdd)
        ctx.restoreGState()
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
        needsDisplay = true
    }
}
