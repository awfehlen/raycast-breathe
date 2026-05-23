import AppKit
import Foundation

enum PhaseType: String, Codable {
    case inhale
    case hold
    case exhale
}

enum StaticRingColor: String, Codable {
    case blue
    case lightBlue
    case purple
}

struct BreathingPhase: Codable {
    let type: PhaseType
    let duration: Double
}

struct PatternConfig: Codable {
    let phases: [BreathingPhase]
}

struct SessionConfig: Codable {
    let pattern: PatternConfig
    let displayIds: [String]
    let opacity: Double
    let ringWidth: Double
    let fadeSmoothness: Double
    let animateRingThickness: Bool
    let animateColors: Bool
    let staticRingColor: StaticRingColor
}

struct RGBColor {
    var r: Double
    var g: Double
    var b: Double

    static let inhale = RGBColor(r: 0.42, g: 0.62, b: 1.0)
    static let exhale = RGBColor(r: 0.78, g: 0.52, b: 1.0)
    static let hold = RGBColor(r: 0.62, g: 0.84, b: 1.0)

    static func target(for type: PhaseType) -> RGBColor {
        switch type {
        case .inhale: return .inhale
        case .exhale: return .exhale
        case .hold: return .hold
        }
    }

    static func fromStatic(_ color: StaticRingColor) -> RGBColor {
        switch color {
        case .blue: return .inhale
        case .lightBlue: return .hold
        case .purple: return .exhale
        }
    }

    func lerp(to target: RGBColor, factor: Double) -> RGBColor {
        let t = min(1, max(0, factor))
        return RGBColor(
            r: r + (target.r - r) * t,
            g: g + (target.g - g) * t,
            b: b + (target.b - b) * t
        )
    }
}

private func breathEase(_ t: Double) -> Double {
    let clamped = min(1, max(0, t))
    return 0.5 - 0.5 * cos(Double.pi * clamped)
}

private enum HoldExtent {
    case expanded
    case contracted
}

final class BreathingEngine {
    private let phases: [BreathingPhase]
    private let config: SessionConfig
    private var phaseIndex = 0
    private var phaseElapsed: Double = 0
    private var currentColor: RGBColor
    private var timer: Timer?

    private let minWidthFactor = 0.4

    var onFrameUpdate: ((RGBColor, Double) -> Void)?

    init(config: SessionConfig) {
        self.config = config
        self.phases = config.pattern.phases.isEmpty
            ? [BreathingPhase(type: .inhale, duration: 4), BreathingPhase(type: .exhale, duration: 4)]
            : config.pattern.phases

        if config.animateColors, let first = phases.first {
            currentColor = RGBColor.target(for: first.type)
        } else {
            currentColor = RGBColor.fromStatic(config.staticRingColor)
        }
    }

    func start() {
        stop()
        let interval = 1.0 / 60.0
        timer = Timer.scheduledTimer(withTimeInterval: interval, repeats: true) { [weak self] _ in
            self?.tick(delta: interval)
        }
        RunLoop.main.add(timer!, forMode: .common)
    }

    func stop() {
        timer?.invalidate()
        timer = nil
    }

    private var maxRingWidth: Double { config.ringWidth }
    private var minRingWidth: Double { config.ringWidth * minWidthFactor }

    private func tick(delta: Double) {
        guard !phases.isEmpty else { return }

        let phase = phases[phaseIndex]
        let targetColor: RGBColor = config.animateColors
            ? RGBColor.target(for: phase.type)
            : RGBColor.fromStatic(config.staticRingColor)

        if config.animateColors {
            currentColor = currentColor.lerp(to: targetColor, factor: config.fadeSmoothness)
        } else {
            currentColor = targetColor
        }

        let currentWidth = ringWidth(for: phase, at: phaseIndex)

        phaseElapsed += delta
        if phaseElapsed >= phase.duration {
            phaseElapsed = 0
            phaseIndex = (phaseIndex + 1) % phases.count
        }

        onFrameUpdate?(currentColor, currentWidth)
    }

    private func ringWidth(for phase: BreathingPhase, at index: Int) -> Double {
        guard config.animateRingThickness else { return maxRingWidth }

        let minW = minRingWidth
        let maxW = maxRingWidth
        let duration = max(phase.duration, 0.001)
        let t = phaseElapsed / duration

        switch phase.type {
        case .inhale:
            return minW + (maxW - minW) * breathEase(t)
        case .exhale:
            return maxW - (maxW - minW) * breathEase(t)
        case .hold:
            switch holdExtent(at: index) {
            case .expanded: return maxW
            case .contracted: return minW
            }
        }
    }

    private func holdExtent(at holdIndex: Int) -> HoldExtent {
        var i = holdIndex
        while i > 0 {
            i -= 1
            switch phases[i].type {
            case .inhale: return .expanded
            case .exhale: return .contracted
            case .hold: continue
            }
        }
        return .expanded
    }
}
