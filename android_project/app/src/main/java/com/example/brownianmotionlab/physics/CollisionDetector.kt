package com.example.brownianmotionlab.physics

import kotlin.math.sqrt

/**
 * Handles elastic collision dynamics between particles and chamber boundaries.
 */
object CollisionDetector {

    /**
     * Resolves boundary collisions for any particle against a rectangular chamber [0, width] x [0, height].
     * Returns true if a boundary reflection occurred.
     */
    fun resolveBoundaryCollision(
        particlePos: Vector2D,
        particleVel: Vector2D,
        radius: Float,
        chamberWidth: Float,
        chamberHeight: Float,
        restitution: Float = 0.98f
    ): Pair<Vector2D, Vector2D> {
        var x = particlePos.x
        var y = particlePos.y
        var vx = particleVel.x
        var vy = particleVel.y

        val minX = radius
        val maxX = chamberWidth - radius
        val minY = radius
        val maxY = chamberHeight - radius

        if (x < minX) {
            x = minX
            vx = -vx * restitution
        } else if (x > maxX) {
            x = maxX
            vx = -vx * restitution
        }

        if (y < minY) {
            y = minY
            vy = -vy * restitution
        } else if (y > maxY) {
            y = maxY
            vy = -vy * restitution
        }

        return Pair(Vector2D(x, y), Vector2D(vx, vy))
    }

    /**
     * Resolves an elastic collision between the large Brownian particle and a smaller gas particle.
     * Conserves linear momentum and kinetic energy.
     * Returns true if collision was detected and resolved.
     */
    fun resolveBrownianGasCollision(
        brownian: BrownianParticle,
        gas: GasParticle
    ): Boolean {
        val deltaPos = brownian.position - gas.position
        val distSq = deltaPos.lengthSquared()
        val minDist = brownian.radius + gas.radius

        if (distSq < minDist * minDist && distSq > 0.0001f) {
            val dist = sqrt(distSq)
            val normal = deltaPos / dist

            // Relative velocity
            val relVel = brownian.velocity - gas.velocity
            val velAlongNormal = relVel.dot(normal)

            // Only resolve if particles are moving toward each other
            if (velAlongNormal < 0f) {
                val m1 = brownian.mass
                val m2 = gas.mass
                val impulseScalar = -(2f * velAlongNormal) / (m1 + m2)
                val impulse = normal * impulseScalar

                brownian.velocity = brownian.velocity + (impulse / m1)
                gas.velocity = gas.velocity - (impulse / m2)

                // Positional correction to prevent particle overlap
                val overlap = minDist - dist
                val separationFactor = 0.5f
                val correction = normal * (overlap * separationFactor)
                brownian.position = brownian.position + (correction * (m2 / (m1 + m2)))
                gas.position = gas.position - (correction * (m1 / (m1 + m2)))

                return true
            }
        }
        return false
    }

    /**
     * Resolves elastic collision between two gas particles.
     */
    fun resolveGasGasCollision(p1: GasParticle, p2: GasParticle): Boolean {
        val deltaPos = p1.position - p2.position
        val distSq = deltaPos.lengthSquared()
        val minDist = p1.radius + p2.radius

        if (distSq < minDist * minDist && distSq > 0.0001f) {
            val dist = sqrt(distSq)
            val normal = deltaPos / dist
            val relVel = p1.velocity - p2.velocity
            val velAlongNormal = relVel.dot(normal)

            if (velAlongNormal < 0f) {
                val impulse = normal * (-velAlongNormal)
                p1.velocity = p1.velocity + impulse
                p2.velocity = p2.velocity - impulse

                val overlap = minDist - dist
                val correction = normal * (overlap * 0.5f)
                p1.position = p1.position + correction
                p2.position = p2.position - correction
                return true
            }
        }
        return false
    }
}
