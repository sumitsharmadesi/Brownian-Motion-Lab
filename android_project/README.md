# Brownian Motion Lab (Android)

An interactive virtual physics laboratory built with Kotlin and Jetpack Compose demonstrating 2D Brownian Motion using realistic kinetic particle collisions, real-time Mean Squared Displacement (MSD) telemetry, and educational physics analysis.

---

## Technical Specifications
- **Language**: Kotlin 2.1.0
- **UI Framework**: Jetpack Compose (Material 3)
- **Minimum SDK**: 26 (Android 8.0 Oreo)
- **Target / Compile SDK**: 35 (Android 15)
- **Architecture**: MVVM with Kotlin Coroutines & StateFlow
- **Graphics**: Hardware-accelerated Compose Canvas
- **Build System**: Gradle Version Catalog (`libs.versions.toml`) with Kotlin DSL

---

## Architecture Overview

```
app/src/main/java/com/example/brownianmotionlab/
├── MainActivity.kt               // Edge-to-edge Activity host & lifecycle handler
├── BrownianMotionApp.kt          // Scaffold, TopAppBar, and navigation dialogs
├── model/
│   ├── SimulationParameters.kt   // Data models for experiment settings & presets
│   ├── SimulationStatistics.kt   // Real-time telemetry (MSD, collision counter, RMS speeds)
│   └── SimulationState.kt        // Immutable snapshot observed by Jetpack Compose
├── physics/
│   ├── Vector2D.kt               // 2D linear algebra and vector math
│   ├── GasParticle.kt            // Microscopic solvent / thermal bath particle
│   ├── BrownianParticle.kt       // Observed colloidal particle with history buffer
│   ├── CollisionDetector.kt      // Elastic momentum transfer and boundary reflections
│   └── PhysicsEngine.kt          // Coroutine-driven sub-stepped numerical integration
├── ui/
│   ├── BrownianMotionScreen.kt   // Responsive layout (adaptive for phone / tablet)
│   ├── components/
│   │   ├── SimulationCanvas.kt   // High-performance Canvas rendering & touch drag
│   │   ├── ExperimentControls.kt // Parameter sliders & visualization toggles
│   │   ├── StatisticsCard.kt     // Real-time telemetry display
│   │   ├── ExperimentGraph.kt    // Live MSD vs Time plotting against Einstein 4Dt
│   │   ├── InfoSection.kt        // Expandable theory & guided experiments
│   │   └── ParameterSlider.kt    // Reusable accessible slider component
│   └── theme/
│       ├── Color.kt              // Dark scientific laboratory palette
│       ├── Type.kt               // Clean typographic hierarchy
│       └── Theme.kt              // Material 3 theme wrapper
└── viewmodel/
    └── BrownianMotionViewModel.kt// StateFlow provider and 60 Hz coroutine loop
```

---

## How to Open and Run in Android Studio

1. Open Android Studio (Ladybug 2024.2+ or Jellyfish/Hedgehog with SDK 35 support).
2. Select **File > Open...** and select the root directory of this project (`BrownianMotionLab`).
3. Allow Gradle to sync dependencies.
4. Select an Android device or emulator running Android 8.0 (API 26) or higher.
5. Click **Run 'app'** (`Shift + F10`).
