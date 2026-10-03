package com.example.brownianmotionlab.model

/**
 * Physical and visualization parameters for the Brownian Motion experiment.
 */
data class SimulationParameters(
    val temperature: Float = 25f,            // Degrees Celsius (0 to 100)
    val particleCount: Int = 150,           // Number of thermal bath particles (10 to 300)
    val particleSize: Float = 4f,           // Radius in dp of gas particles (2 to 10)
    val brownianMass: Float = 2f,           // Relative mass ratio of Brownian particle (0.5 to 10)
    val simulationSpeed: Float = 1f,        // Time scaling factor (0.25x to 3x)
    val trailLength: Int = 10,              // Number of past positions retained (0 to 30)
    val showTrails: Boolean = true,         // Draw path of Brownian particle
    val showVelocityVectors: Boolean = false,// Draw arrows showing particle velocity
    val showCollisions: Boolean = true      // Render visual collision flash pulses
)

/**
 * Educational preset scenarios allowing students to quickly observe specific physical phenomena.
 */
enum class ExperimentPreset(
    val title: String,
    val description: String,
    val parameters: SimulationParameters
) {
    STANDARD(
        title = "Room Temperature",
        description = "Standard equilibrium baseline at 25 °C with 150 particles.",
        parameters = SimulationParameters(
            temperature = 25f,
            particleCount = 150,
            brownianMass = 2f,
            particleSize = 4f,
            trailLength = 15,
            showTrails = true
        )
    ),
    HIGH_TEMPERATURE(
        title = "High Temperature (85 °C)",
        description = "Increased thermal energy yields higher RMS velocity and rapid displacement.",
        parameters = SimulationParameters(
            temperature = 85f,
            particleCount = 150,
            brownianMass = 2f,
            particleSize = 4f,
            trailLength = 20,
            showTrails = true
        )
    ),
    CRYOGENIC(
        title = "Low Temperature (5 °C)",
        description = "Thermal velocities decrease; collisions impart minimal kinetic energy.",
        parameters = SimulationParameters(
            temperature = 5f,
            particleCount = 150,
            brownianMass = 2f,
            particleSize = 4f,
            trailLength = 10,
            showTrails = true
        )
    ),
    HIGH_DENSITY(
        title = "High Density (280 Particles)",
        description = "High collision frequency shortens the mean free path drastically.",
        parameters = SimulationParameters(
            temperature = 30f,
            particleCount = 280,
            brownianMass = 2.5f,
            particleSize = 3.5f,
            trailLength = 25,
            showTrails = true
        )
    ),
    MASSIVE_PARTICLE(
        title = "Massive Particle (Mass = 8.0)",
        description = "High inertia resists momentum transfer from individual molecular impacts.",
        parameters = SimulationParameters(
            temperature = 35f,
            particleCount = 180,
            brownianMass = 8f,
            particleSize = 4f,
            trailLength = 15,
            showTrails = true
        )
    ),
    NANOPARTICLE(
        title = "Light Nanoparticle (Mass = 0.6)",
        description = "Low inertia causes violent erratic trajectories from every collision.",
        parameters = SimulationParameters(
            temperature = 30f,
            particleCount = 130,
            brownianMass = 0.6f,
            particleSize = 4f,
            trailLength = 30,
            showTrails = true
        )
    )
}
