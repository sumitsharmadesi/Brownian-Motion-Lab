package com.example.brownianmotionlab.physics

import com.example.brownianmotionlab.model.CollisionEvent
import com.example.brownianmotionlab.model.MsdDataPoint
import com.example.brownianmotionlab.model.SimulationParameters
import com.example.brownianmotionlab.model.SimulationStatistics
import com.example.brownianmotionlab.model.SimulationUiState
import java.util.concurrent.CopyOnWriteArrayList
import kotlin.math.PI
import kotlin.math.cos
import kotlin.math.ln
import kotlin.math.max
import kotlin.math.min
import kotlin.math.sin
import kotlin.math.sqrt
import kotlin.random.Random

/**
 * Educational physics engine for simulating 2D Brownian Motion.
 * Models thermal bath collisions, Stokes damping, and Einstein diffusion dynamics.
 */
class PhysicsEngine {

    var chamberWidth: Float = 600f
        private set
    var chamberHeight: Float = 600f
        private set

    private var parameters = SimulationParameters()
    private val brownianParticle = BrownianParticle(
        position = Vector2D(300f, 300f),
        radius = 24f,
        mass = 2f
    )
    private val gasParticles = ArrayList<GasParticle>()
    private val collisionEvents = CopyOnWriteArrayList<CollisionEvent>()

    private var totalCollisions: Long = 0L
    private var simulationTime: Float = 0f
    private var lastMsdSampleTime: Float = 0f
    private val msdHistory = ArrayList<MsdDataPoint>()

    // Thermal constant calibration for educational scaling
    private val boltzmannK = 1.380649e-3f // Scaled for pixel simulation

    fun setChamberSize(width: Float, height: Float) {
        if (width > 50f && height > 50f) {
            val oldW = chamberWidth
            val oldH = chamberHeight
            chamberWidth = width
            chamberHeight = height

            // Scale Brownian position proportionally if chamber resized
            if (oldW > 0 && oldH > 0) {
                val nx = (brownianParticle.position.x / oldW) * width
                val ny = (brownianParticle.position.y / oldH) * height
                brownianParticle.position = Vector2D(nx.coerceIn(30f, width - 30f), ny.coerceIn(30f, height - 30f))
            }
        }
    }

    fun initSimulation(params: SimulationParameters) {
        parameters = params
        brownianParticle.mass = params.brownianMass
        brownianParticle.radius = 22f + (params.brownianMass - 0.5f) * 1.5f
        brownianParticle.resetTrajectory(Vector2D(chamberWidth / 2f, chamberHeight / 2f))

        totalCollisions = 0L
        simulationTime = 0f
        lastMsdSampleTime = 0f
        msdHistory.clear()
        collisionEvents.clear()

        spawnGasParticles(params.particleCount, params.temperature, params.particleSize)
    }

    fun updateParameters(newParams: SimulationParameters) {
        val oldParams = parameters
        parameters = newParams

        brownianParticle.mass = newParams.brownianMass
        brownianParticle.radius = 22f + (newParams.brownianMass - 0.5f) * 1.5f

        // Adjust particle count if changed
        if (newParams.particleCount != oldParams.particleCount) {
            adjustParticleCount(newParams.particleCount, newParams.temperature, newParams.particleSize)
        }

        // Adjust temperature thermal speeds
        if (newParams.temperature != oldParams.temperature) {
            rescaleThermalVelocities(newParams.temperature)
        }

        // Adjust particle sizes
        if (newParams.particleSize != oldParams.particleSize) {
            for (p in gasParticles) {
                p.radius = newParams.particleSize
            }
        }
    }

    private fun spawnGasParticles(count: Int, tempCelsius: Float, radius: Float) {
        gasParticles.clear()
        val tempKelvin = tempCelsius + 273.15f
        val baseSpeed = sqrt(tempKelvin * 0.75f) * 4.5f

        for (i in 0 until count) {
            var pos: Vector2D
            var attempts = 0
            do {
                val x = Random.nextFloat() * (chamberWidth - 2 * radius) + radius
                val y = Random.nextFloat() * (chamberHeight - 2 * radius) + radius
                pos = Vector2D(x, y)
                attempts++
            } while (attempts < 20 && pos.distanceTo(brownianParticle.position) < brownianParticle.radius + radius + 10f)

            // Maxwell-Boltzmann 2D velocity distribution (Box-Muller transform)
            val u1 = max(0.00001f, Random.nextFloat())
            val u2 = Random.nextFloat()
            val speed = baseSpeed * sqrt(-2f * ln(u1))
            val angle = (u2 * 2f * PI).toFloat()
            val vel = Vector2D.fromAngleAndMagnitude(angle, speed)

            gasParticles.add(
                GasParticle(
                    id = i,
                    position = pos,
                    velocity = vel,
                    radius = radius,
                    mass = 0.12f
                )
            )
        }
    }

    private fun adjustParticleCount(targetCount: Int, tempCelsius: Float, radius: Float) {
        if (targetCount > gasParticles.size) {
            val toAdd = targetCount - gasParticles.size
            val tempKelvin = tempCelsius + 273.15f
            val baseSpeed = sqrt(tempKelvin * 0.75f) * 4.5f
            var nextId = gasParticles.size

            repeat(toAdd) {
                val x = Random.nextFloat() * (chamberWidth - 2 * radius) + radius
                val y = Random.nextFloat() * (chamberHeight - 2 * radius) + radius
                val angle = Random.nextFloat() * 2f * PI.toFloat()
                gasParticles.add(
                    GasParticle(
                        id = nextId++,
                        position = Vector2D(x, y),
                        velocity = Vector2D.fromAngleAndMagnitude(angle, baseSpeed),
                        radius = radius,
                        mass = 0.12f
                    )
                )
            }
        } else if (targetCount < gasParticles.size) {
            while (gasParticles.size > targetCount) {
                gasParticles.removeAt(gasParticles.size - 1)
            }
        }
    }

    private fun rescaleThermalVelocities(tempCelsius: Float) {
        val tempKelvin = tempCelsius + 273.15f
        val targetRms = sqrt(tempKelvin * 0.75f) * 4.5f

        for (p in gasParticles) {
            val currentSpeed = p.velocity.length()
            if (currentSpeed > 0.001f) {
                val factor = targetRms / currentSpeed
                p.velocity = p.velocity * (0.8f + 0.2f * factor)
            } else {
                val angle = Random.nextFloat() * 2f * PI.toFloat()
                p.velocity = Vector2D.fromAngleAndMagnitude(angle, targetRms)
            }
        }
    }

    /**
     * Executes one physics step. Divides dt into smaller sub-steps to ensure high fidelity
     * and prevent tunneling of fast-moving thermal particles.
     */
    fun update(rawDt: Float) {
        val dt = (rawDt * parameters.simulationSpeed).coerceIn(0.001f, 0.05f)
        val subSteps = 3
        val subDt = dt / subSteps

        val now = System.currentTimeMillis()
        collisionEvents.removeAll { now - it.timestamp > 350 }

        for (step in 0 until subSteps) {
            // 1. Move gas particles & resolve boundary collisions
            for (p in gasParticles) {
                p.position = p.position + (p.velocity * subDt)
                val (newPos, newVel) = CollisionDetector.resolveBoundaryCollision(
                    p.position,
                    p.velocity,
                    p.radius,
                    chamberWidth,
                    chamberHeight
                )
                p.position = newPos
                p.velocity = newVel
            }

            // 2. Stokes viscous damping on Brownian particle (fluid medium drag)
            val stokesDamping = 0.9985f
            brownianParticle.velocity = brownianParticle.velocity * stokesDamping

            // Move Brownian particle
            brownianParticle.position = brownianParticle.position + (brownianParticle.velocity * subDt)
            val (bpPos, bpVel) = CollisionDetector.resolveBoundaryCollision(
                brownianParticle.position,
                brownianParticle.velocity,
                brownianParticle.radius,
                chamberWidth,
                chamberHeight,
                restitution = 0.85f
            )
            brownianParticle.position = bpPos
            brownianParticle.velocity = bpVel

            // 3. Collision detection: Brownian vs Gas particles
            for (p in gasParticles) {
                if (CollisionDetector.resolveBrownianGasCollision(brownianParticle, p)) {
                    totalCollisions++
                    if (parameters.showCollisions && collisionEvents.size < 12) {
                        val midX = (brownianParticle.position.x + p.position.x) / 2f
                        val midY = (brownianParticle.position.y + p.position.y) / 2f
                        collisionEvents.add(
                            CollisionEvent(
                                x = midX,
                                y = midY,
                                intensity = min(1f, p.velocity.length() / 80f),
                                timestamp = System.currentTimeMillis()
                            )
                        )
                    }
                }
            }

            // 4. Gas-gas collisions using spatial binning for smooth O(N) performance
            resolveGasGasCollisions()
        }

        // Record trajectory for particle trails
        if (parameters.showTrails) {
            brownianParticle.recordTrail(parameters.trailLength)
        }

        simulationTime += dt

        // Sample MSD periodically (~every 0.25 seconds)
        if (simulationTime - lastMsdSampleTime >= 0.25f) {
            lastMsdSampleTime = simulationTime
            sampleMsd()
        }
    }

    private fun resolveGasGasCollisions() {
        val cellSize = 30f
        val cols = max(1, (chamberWidth / cellSize).toInt() + 1)
        val rows = max(1, (chamberHeight / cellSize).toInt() + 1)
        val grid = HashMap<Int, ArrayList<GasParticle>>()

        for (p in gasParticles) {
            val c = (p.position.x / cellSize).toInt().coerceIn(0, cols - 1)
            val r = (p.position.y / cellSize).toInt().coerceIn(0, rows - 1)
            val key = r * cols + c
            grid.getOrPut(key) { ArrayList() }.add(p)
        }

        for ((key, list) in grid) {
            val r = key / cols
            val c = key % cols

            // Check within cell
            for (i in 0 until list.size) {
                for (j in i + 1 until list.size) {
                    CollisionDetector.resolveGasGasCollision(list[i], list[j])
                }
            }

            // Check adjacent neighbor cells
            val neighborOffsets = arrayOf(Pair(0, 1), Pair(1, 0), Pair(1, 1), Pair(-1, 1))
            for ((dr, dc) in neighborOffsets) {
                val nr = r + dr
                val nc = c + dc
                if (nr in 0 until rows && nc in 0 until cols) {
                    val nKey = nr * cols + nc
                    grid[nKey]?.let { nList ->
                        for (p1 in list) {
                            for (p2 in nList) {
                                CollisionDetector.resolveGasGasCollision(p1, p2)
                            }
                        }
                    }
                }
            }
        }
    }

    private fun sampleMsd() {
        val currentMsd = brownianParticle.getDisplacementSquared()
        // Theoretical Einstein 2D diffusion coefficient D = (kB * T) / (6 * pi * eta * r)
        val tempK = parameters.temperature + 273.15f
        val theoreticalD = (tempK * 0.08f) / (brownianParticle.radius * parameters.brownianMass)
        val theoreticalMsd = 4f * theoreticalD * simulationTime * 12f

        msdHistory.add(
            MsdDataPoint(
                time = simulationTime,
                measuredMsd = currentMsd,
                theoreticalMsd = theoreticalMsd
            )
        )

        // Keep last 150 points for graph clarity
        if (msdHistory.size > 150) {
            msdHistory.removeAt(0)
        }
    }

    fun resetStatistics() {
        totalCollisions = 0L
        simulationTime = 0f
        lastMsdSampleTime = 0f
        msdHistory.clear()
        collisionEvents.clear()
        brownianParticle.initialPosition = brownianParticle.position
    }

    fun dragBrownianParticle(newPos: Vector2D) {
        val clampedX = newPos.x.coerceIn(brownianParticle.radius, chamberWidth - brownianParticle.radius)
        val clampedY = newPos.y.coerceIn(brownianParticle.radius, chamberHeight - brownianParticle.radius)
        brownianParticle.position = Vector2D(clampedX, clampedY)
        brownianParticle.velocity = Vector2D.ZERO
    }

    fun createUiState(isRunning: Boolean): SimulationUiState {
        var totalSpeed = 0f
        for (p in gasParticles) {
            totalSpeed += p.velocity.length()
        }
        val avgSpeed = if (gasParticles.isNotEmpty()) totalSpeed / gasParticles.size else 0f
        val bpSpeed = brownianParticle.velocity.length()
        val currentMsd = brownianParticle.getDisplacementSquared()
        val tempK = parameters.temperature + 273.15f
        val diffusionD = (tempK * 0.08f) / (brownianParticle.radius * parameters.brownianMass)

        val stats = SimulationStatistics(
            simulationTime = simulationTime,
            averageParticleSpeed = avgSpeed,
            brownianParticleSpeed = bpSpeed,
            collisionCount = totalCollisions,
            meanSquaredDisplacement = currentMsd,
            diffusionCoefficient = diffusionD,
            theoreticalMsd = 4f * diffusionD * simulationTime * 12f
        )

        return SimulationUiState(
            isRunning = isRunning,
            brownianParticle = brownianParticle.toState(),
            gasParticles = gasParticles.map { it.toState() },
            collisionEvents = collisionEvents.toList(),
            statistics = stats,
            parameters = parameters,
            msdHistory = msdHistory.toList(),
            chamberWidth = chamberWidth,
            chamberHeight = chamberHeight
        )
    }
}
