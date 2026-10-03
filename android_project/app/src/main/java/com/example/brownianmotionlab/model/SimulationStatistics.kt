package com.example.brownianmotionlab.model

/**
 * Real-time statistical telemetry computed during the simulation.
 */
data class SimulationStatistics(
    val simulationTime: Float = 0f,              // Elapsed experiment time in seconds
    val averageParticleSpeed: Float = 0f,        // Mean RMS speed of thermal bath particles (m/s scale)
    val brownianParticleSpeed: Float = 0f,       // Current magnitude of Brownian velocity
    val collisionCount: Long = 0L,               // Cumulative count of particle-particle collisions
    val meanSquaredDisplacement: Float = 0f,     // Current MSD: <(r(t) - r(0))^2> in normalized units
    val diffusionCoefficient: Float = 0f,        // Experimental Einstein diffusion coefficient D
    val theoreticalMsd: Float = 0f               // Theoretical 2D MSD: 4 * D * t
)
