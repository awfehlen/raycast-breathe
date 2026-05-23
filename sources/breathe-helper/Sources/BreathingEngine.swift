import AppKit
import Foundation

enum PhaseType: String, Codable {
    case inhale
    case hold
    case exhale
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
}

struct RGBColor {
    var r: Double
    var g: Double
    var b: Double

    static let inhale = RGBColor(r: 0.42, g: 0.62, b: 1.0)
    static let exhale = RGBColor(r: 0.38, g: 0.92, b: 0.58)
    static let hold = RGBColor(r: 0.78, g: 0.52, b: 1.0)

    static func target(for type: PhaseType) -> RGBColor {
        switch type {
        case .inhale: return .inhale
        case .exhale: return .exhale
        case .hold: return .hold
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

final class BreathingEngine {
    private let phases: [BreathingPhase]
    private let fadeSmoothness: Double
    private var phaseIndex = 0
    private var phaseElapsed: Double = 0
    private var currentColor = RGBColor.inhale
    private var timer: Timer?

    var onColorUpdate: ((RGBColor, Double) -> Void)?

    init(phases: [BreathingPhase], fadeSmoothness: Double) {
        self.phases = phases.isEmpty
            ? [BreathingPhase(type: .inhale, duration: 4), BreathingPhase(type: .exhale, duration: 4)]
            : phases
        self.fadeSmoothness = min(1, max(0.01, fadeSmoothness))
        if let first = self.phases.first {
            currentColor = RGBColor.target(for: first.type)
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

    private func tick(delta: Double) {
        guard !phases.isEmpty else { return }

        let phase = phases[phaseIndex]
        let target = RGBColor.target(for: phase.type)
        currentColor = currentColor.lerp(to: target, factor: fadeSmoothness)

        phaseElapsed += delta
        if phaseElapsed >= phase.duration {
            phaseElapsed = 0
            phaseIndex = (phaseIndex + 1) % phases.count
        }

        onColorUpdate?(currentColor, phase.duration)
    }
}
