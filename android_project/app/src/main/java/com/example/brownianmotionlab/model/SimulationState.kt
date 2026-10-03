package com.example.brownianmotionlab.model

import androidx.compose.ui.geometry.Offset

/**
 * Immutable snapshot of the Brownian particle state for UI rendering.
 */
data class BrownianParticleState(
    val x: Float,
    val y: Float,
    val vx: Float,
    val vy: Float,
    val radius: Float,
    val mass: Float,
    val trail: List<Offset> = emptyList()
)

/**
 * Immutable snapshot of an individual gas/solvent particle.
 */
data class GasParticleState(
    val id: Int,
    val x: Float,
    val y: Float,
    val vx: Float,
    val vy: Float,
    val radius: Float
)

/**
 * Transient collision event for visual flash ripples.
 */
data class CollisionEvent(
    val x: Float,
    val y: Float,
    val intensity: Float,
    val timestamp: Long
)

/**
 * Real-time data point recorded for the MSD vs Time graph.
 */
data class MsdDataPoint(
    val time: Float,
    val measuredMsd: Float,
    val theoreticalMsd: Float
)

/**
 * Master UI state observed by Jetpack Compose.
 */
data class SimulationUiState(
    val isRunning: Boolean = false,
    val brownianParticle: BrownianParticleState = BrownianParticleState(
        x = 0f,
        y = 0f,
        vx = 0f,
        vy = 0f,
        radius = 24f,
        mass = 2f
    ),
    val gasParticles: List<GasParticleState> = emptyList(),
    val collisionEvents: List<CollisionEvent> = emptyList(),
    val statistics: SimulationStatistics = SimulationStatistics(),
    val parameters: SimulationParameters = SimulationParameters(),
    val msdHistory: List<MsdDataPoint> = emptyList(),
    val chamberWidth: Float = 600f,
    val chamberHeight: Float = 600f
)
